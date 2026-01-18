import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

type Station = {
    name: string;
    eva: number;
    geographicCoordinates: [number, number]
    productLine: string;
}

// parse json file

const filePath = path.join(process.cwd(), 'public', 'test.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const stations: Station[] = data.result
    .filter((item: any) => item.wirelessLan !== undefined && item.productLine.productLine != "Knotenbahnhof")
    .map((item: any) => ({
        name: item.name || '',
        eva: item.evaNumbers?.[0]?.number || 0,
        geographicCoordinates: item.evaNumbers?.[0]?.geographicCoordinates?.coordinates || [0, 0],
        productLine: item.productLine?.[0]?.productLine || '',
    }));

// save stations to postgres database
dotenv.config();
const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});
client.connect();
stations.forEach(async (station) => {
    const query = `INSERT INTO SimplifiedStation (eva_number, name, latitude, longitude, product_line)
                   VALUES ($1, $2, $3, $4, $5)
                   ON CONFLICT (eva_number) DO NOTHING`;
    const values = [
        station.eva,
        station.name,
        station.geographicCoordinates[0],
        station.geographicCoordinates[1],
        station.productLine,
    ];
    await client.query(query, values);
});
client.end();
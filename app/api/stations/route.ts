import {NextRequest} from "next/server";
import {EvaNumber, Station} from "@/types";

export async function GET(request: NextRequest) {
    // query https://apis.deutschebahn.com/db-api-marketplace/apis/station-data/v2/stations
    const API_KEY = process.env.STATIONS_API_KEY;
    const ClIENT_ID = process.env.STATIONS_CLIENT_ID;
    const response = await fetch("https://apis.deutschebahn.com/db-api-marketplace/apis/station-data/v2/stations", {
        headers: {
            "DB-Api-Key": `${API_KEY}`,
            "DB-Client-Id": `${ClIENT_ID}`
        }
    });

    if (!response.ok) {
        return new Response("Failed to fetch station data", {status: response.status});
    }

    const data = await response.json();

    const stations = Array.isArray(data) ? data : (data.stations ?? data.result ?? []);
    const filteredData: Station[] = stations
        .map((station: any) => {
            const evaNumbers: EvaNumber[] = Array.isArray(station.evaNumbers)
                ? station.evaNumbers.map((eva: any) => ({
                    number: eva.number,
                    geographicCoordinates: eva.geographicCoordinates
                }))
                : [];
            return {
                id: station.id,
                name: station.name,
                evaNumbers,
                productLine: station.productLine ?? null
            } as Station;
        })
        .filter((station: Station) =>
            station.evaNumbers.length > 0 &&
            station.productLine?.productLine === "Knotenbahnhof"
        );

    return new Response(JSON.stringify(filteredData), {
        headers: {"Content-Type": "application/json"},
    });
}

export async function HEAD(request: Request) {
}

export async function POST(request: Request) {
}

export async function PUT(request: Request) {
}

export async function DELETE(request: Request) {
}
"use client";
import {title} from "@/components/primitives";
import ConnectionCard from "@/app/connection/components/ConnectionCard";

export default function ConnectionPage() {
    const connectionData = require('./connection-mock-data.json');

    return (
        <section className="flex w-full flex-col items-center justify-center gap-4">
            <h1 className={title()}>Verbindung</h1>
            {connectionData.connections.map((connection: any, index: number) => (
            <ConnectionCard key={index} startStation={connection.startStation} endStation={connection.endStation} />
            ))}

        </section>
    );
}

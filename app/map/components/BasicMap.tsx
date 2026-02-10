import React from 'react';
import Map from '@/components/Map';
import {StationPoint} from "@/components/types";
import {Station} from "@/types";

export const BasicMap = async ({ width = 800, height = 500 }: { width?: number; height?: number }) => {
    if (width === 0) return null;

    const mapData = require('../map-data/de.json');
    const cacheKey = '__stationsCache';
    let stationsData = (globalThis as any)[cacheKey] as any | undefined;

    const ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    if (!stationsData) {
        const resp = await fetch(`${ORIGIN}/api/stations`);
        stationsData = await resp.json();
        (globalThis as any)[cacheKey] = stationsData;
    }

    const stations : StationPoint[]  = stationsData.map((s: Station) => {
        const eva = s.evaNumbers?.[0];
        const coords = eva?.geographicCoordinates
            ? [eva.geographicCoordinates.coordinates[0], eva.geographicCoordinates.coordinates[1]]
            : [0, 0];
        return {
            id: eva?.number ?? s.name,
            name: s.name,
            coordinates: coords
        }
    });

    return <Map data={mapData} stations={stations} width={width} height={height} />;
};

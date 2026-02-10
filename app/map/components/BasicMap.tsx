"use client";
import React from 'react';
import Map from '@/components/Map';

export const BasicMap = ({ width = 800, height = 500 }: { width?: number; height?: number }) => {
    if (width === 0) return null;

    const mapData = require('../map-data/de.json');
    const stationsRaw = require('../map-data/stations.json');

    // Convert your stations JSON into a simple array of points
    const stations = (stationsRaw?.stations || []).map((s: any) => {
        // take the first evaNumber's coordinates (adjust if multiple)
        const eva = Array.isArray(s.evaNumbers) ? s.evaNumbers[0] : null;
        const coords = eva?.geographicCoordinates?.coordinates || [0, 0];
        return {
            id: eva?.number ?? s.name,
            name: s.name,
            coordinates: coords // [lon, lat]
        };
    });

    return <Map data={mapData} stations={stations} width={width} height={height} />;
};

export default BasicMap;

import React from 'react';
import Map from '@/components/Map';
import {StationPoint} from "@/components/types";

type Props = {
    stationData: StationPoint[];
    date?: Date;
    width?: number;
    height?: number;
}

export const BasicMap = async ({ stationData, date, width = 800, height = 500 }: Props) => {
    if (width === 0) return null;
    const mapData = require('../map-data/de.json');

    return <Map data={mapData} stations={stationData} width={width} height={height} />;
};

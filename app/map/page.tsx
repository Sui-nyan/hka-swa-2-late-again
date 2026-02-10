import { title } from "@/components/primitives";
import {BasicMap} from "@/app/map/components/BasicMap";
import MapFilter from "@/app/map/components/MapFilter";
import React from "react";
import {StationPoint} from "@/components/types";
import {Station} from "@/types";

export default async function AboutPage() {
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

  return (
      <section className="flex flex-col items-center justify-center gap-4">
          <h1 className={title()}>Deutschlandkarte</h1>
          <MapFilter/>
          <BasicMap stationData={stations} date={undefined} width={1000} height={700}/>
      </section>
  );
}

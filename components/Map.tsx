"use client";
import React, {useMemo, useState} from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import {StationModal} from "@/components/StationModal";
import {StationPoint} from "@/components/types";
import {Tooltip} from "@heroui/tooltip";


interface MapProps {
    data: any;
    date?: Date;
    stations?: StationPoint[];
    width?: number;
    height?: number;
}

const Map: React.FC<MapProps> = ({date, data, stations = [], width = 800, height = 500 }) => {
    const geo = useMemo(() => {
        if (!data) return null;
        if (data.type === 'Topology' && data.objects) {
            const key = Object.keys(data.objects)[0];
            return feature(data as any, data.objects[key]);
        }
        return data;
    }, [data]);

    // prepare projection that fits the map data into the svg
    const projection = useMemo(() => {
        if (!geo) return geoMercator().scale(1).translate([0, 0]);
        const proj = geoMercator();
        try {
            proj.fitSize([width, height], geo as any);
        } catch {
            proj.scale(1000).center([10.5, 51.2]).translate([width / 2, height / 2]);
        }
        return proj;
    }, [geo, width, height]);

    const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

    const [hovered, setHovered] = useState<string | number | null>(null);
    const [selected, setSelected] = useState<StationPoint | null>(null);

    return (
        <div style={{ position: 'relative', width, height }}>
            <svg width={width} height={height} style={{ display: 'block' }}>
                <g className="map-layer">
                    {geo && (
                        <path
                            d={pathGenerator(geo as any) || undefined}
                            fill="#e6e6e6"
                            stroke="#999"
                            strokeWidth={0.5}
                        />
                    )}
                </g>

                <g className="stations-layer">
                    {stations.map((s) => {
                        const [lon, lat] = s.coordinates;
                        const [x, y] = projection([lon, lat]) || [0, 0];
                        const isHovered = hovered === s.id;
                        return (
                            <g
                                key={s.id}
                                transform={`translate(${x},${y})`}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHovered(s.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => setSelected(s)}
                                aria-label={s.name}
                                role="button"
                            >
                                <Tooltip content={s.name}>
                                    <circle r={isHovered ? 6 : 4} fill="#2596be" stroke="#fff" strokeWidth={1.2} />
                                </Tooltip>
                            </g>
                        );
                    })}
                </g>
            </svg>

            {selected && (
                <StationModal date={undefined} selected={selected} onClickAction={() => setSelected(null)}/>
            )}
        </div>
    );
};

export default Map;

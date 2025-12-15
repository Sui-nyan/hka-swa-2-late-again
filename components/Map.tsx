import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';

type MapProps = {
    width: number;
    height: number;
    data: FeatureCollection;
};

const KA_COORDS: [number, number] = [10.3, 51.9] as const;
export const Map = ({ width, height, data }: MapProps) => {
    const projection = d3
        .geoMercator()
        .center(KA_COORDS)
        .scale(1000);

    const geoPathGenerator = d3.geoPath().projection(projection);

    const allSvgPaths = data.features
        .filter((shape) => shape.id !== 'ATA')
        .map((shape) => {
            return (
                <path
                    key={shape.id}
                    d={geoPathGenerator(shape) ?? undefined}
                    stroke="lightGrey"
                    strokeWidth={0.5}
                    fill="grey"
                    fillOpacity={0.7}
                />
            );
        });

    return (
        <div>
            <svg width={width} height={height}>
                {allSvgPaths}
            </svg>
        </div>
    );
};

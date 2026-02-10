import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Station = {
    id: string;
    name: string;
    evaNumbers: EvaNumber[];
    productLine: {
        productLine: string;
        segment: string;
    }
}

export type EvaNumber = {
    number: number;
    geographicCoordinates: {
        type: string;
        "coordinates": [number, number];
    }
    isMain: boolean;
}
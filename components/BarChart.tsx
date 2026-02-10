import * as d3 from 'd3';
import {useTheme} from "next-themes";
import React from "react";

const MARGIN = {top: 30, right: 30, bottom: 30, left: 30};
const BAR_PADDING = 0.3;

type BarplotProps = {
    width: number;
    height: number;
    data: { name: string; value: number; color: string; }[];
};

export const BarChart = ({width, height, data}: BarplotProps) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const dark = mounted && resolvedTheme === "dark";

    // bounds = area inside the graph axis = calculated by substracting the margins
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    // X axis is for groups since the barplot is vertical
    const groups = data.sort((a, b) => b.value - a.value).map((d) => d.name);
    const xScale = d3
        .scaleBand()
        .domain(groups)
        .range([0, boundsWidth])
        .padding(BAR_PADDING);

    // Y axis
    const max = d3.max(data.map((d) => d.value)) ?? 10;
    const yScale = d3
        .scaleLinear()
        .domain([max * 1.2, 0])
        .range([0, boundsHeight]);

    // Build the shapes
    const allShapes = data.map((d, i) => {
        const x = xScale(d.name);
        if (x === undefined) {
            return null;
        }

        return (
            <g key={i}>
                <rect
                    x={x}
                    y={yScale(d.value)}
                    width={xScale.bandwidth()}
                    height={boundsHeight - yScale(d.value)}
                    opacity={0.9}
                    stroke="#2c0c00"
                    fill= {d.color}
                    fillOpacity={0.6}
                    strokeWidth={1}
                    rx={1}
                />
                <text
                    x={x + xScale.bandwidth() / 2}
                    y={yScale(d.value) - 10}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    fontSize={12}
                    fill={dark ? "#fff" : "#000"}
                >
                    {d.value}
                </text>
                <text
                    x={x + xScale.bandwidth() / 2}
                    y={boundsHeight + 10}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    fontSize={12}
                    fill={dark ? "#fff" : "#000"}
                >
                    {d.name}
                </text>
            </g>
        );
    });

    const grid = yScale.ticks(5).map((value, i) => (
        <g key={i}>
            <line
                x1={0}
                x2={boundsWidth}
                y1={yScale(value)}
                y2={yScale(value)}
                stroke="#808080"
                opacity={0.2}
            />
            <text
                x={-10}
                y={yScale(value)}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={9}
                fill={dark ? "#fff" : "#000"}
                opacity={0.8}
            >
                {value}
            </text>
        </g>
    ));

    return (
        <div>
            <svg width={width} height={height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
                >
                    {grid}
                    {allShapes}
                </g>
            </svg>
        </div>
    );
};

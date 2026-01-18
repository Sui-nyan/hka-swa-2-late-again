"use client";

import React from "react";
import { useTheme } from "next-themes";
import { StationPoint } from "@/components/types";
import {BarChart} from "@/components/BarChart";

interface Props {
    selected: StationPoint;
    onClickAction: () => void;
}

const data = [
    { name: 'Verspätet', value: 10, color: 'red' },
    { name: 'Pünktlich', value: 25, color: 'green' },
    { name: 'Ausgefallen', value: 5, color: 'yellow' },
]

export function StationModal({ selected, onClickAction }: Props) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const dark = mounted && resolvedTheme === "dark";

    const containerStyle: React.CSSProperties = {
        position: "absolute",
        left: 8,
        top: 8,
        background: dark ? "rgba(24,24,27,0.95)" : "rgba(255,255,255,0.95)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#ddd"}`,
        padding: "8px 12px",
        borderRadius: 6,
        boxShadow: dark ? "0 2px 6px rgba(0,0,0,0.6)" : "0 2px 6px rgba(0,0,0,0.08)",
    };

    const titleStyle: React.CSSProperties = { fontWeight: 600 };
    const subtitleStyle: React.CSSProperties = {
        fontSize: 12,
        color: dark ? "#ccc" : "#555",
    };
    const buttonStyle: React.CSSProperties = {
        marginTop: 8,
        background: dark ? "#0a84ff" : "#0078d4",
        border: "none",
        color: "white",
        padding: "6px 10px",
        borderRadius: 4,
        cursor: "pointer",
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>{selected.name}</div>
            <div style={subtitleStyle}>Statistiken</div>
            <BarChart data={data} width={400} height={400} />
            <button onClick={onClickAction} style={buttonStyle}>
                Close
            </button>
        </div>
    );
}

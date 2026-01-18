"use client";

import React from "react";
import { useTheme } from "next-themes";
import { StationPoint } from "@/components/types";
import {BarChart} from "@/components/BarChart";
import {Button} from "@heroui/button";

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

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>{selected.name}</div>
            <div style={subtitleStyle}>Statistiken</div>
            <div className="flex flex-row gap-4 justify-center align-middle items-center">
                <BarChart data={data} width={400} height={400} />
                <div>
                    <p style={{ marginBottom: 4 }}>Durchschnittliche Verstpätung: 5 min</p>
                    <p style={{ marginBottom: 4 }}>Tägliche Verbindungen: 120</p>
                </div>
            </div>
            <Button onPress={onClickAction} variant="solid" className="mt-4">
                Schließen
            </Button>
        </div>
    );
}

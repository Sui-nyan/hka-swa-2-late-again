import React from "react";
import {StationPoint} from "@/components/types";

export class StationModal extends React.Component<{ selected: StationPoint, onClick: () => void }> {
    render() {
        return <div
            style={{
                position: "absolute",
                left: 8,
                top: 8,
                background: "rgba(255,255,255,0.95)",
                border: "1px solid #ddd",
                padding: "8px 12px",
                borderRadius: 6,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
            }}
        >
            <div style={{fontWeight: 600}}>{this.props.selected.name}</div>
            <div style={{fontSize: 12, color: "#555"}}>ID: {this.props.selected.id}</div>
            <button
                onClick={this.props.onClick}
                style={{
                    marginTop: 8,
                    background: "#0078d4",
                    border: "none",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: 4,
                    cursor: "pointer"
                }}
            >
                Close
            </button>
        </div>;
    }
}
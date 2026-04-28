import React from "react";

const markerItems = [
  { color: "#22c55e", label: "Government" },
  { color: "#3b82f6", label: "Private" },
  { color: "#a855f7", label: "Clinic" },
  { color: "#6b7280", label: "Other" },
];

const erItems = [
  { color: "#dc2626", glow: "rgba(220,38,38,0.6)", label: "ER confirmed" },
  { color: "#f97316", glow: "rgba(249,115,22,0.4)", label: "ER likely" },
  { color: "#6b7280", glow: "transparent", label: "ER unverified" },
];

export default function MapLegend() {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] bg-[var(--bg2)]/90 backdrop-blur-md border border-[var(--b)] rounded-xl p-4 space-y-3 shadow-lg">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--t3)]">Infrastructure Key</p>
      <div className="space-y-1.5">
        {markerItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-[11px] font-bold text-[var(--t2)] tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--b)] pt-3 space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--t3)]">Emergency Vector</p>
        {erItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 border-2"
              style={{
                background: item.color,
                borderColor: item.color,
                boxShadow: `0 0 5px ${item.glow}`,
              }}
            />
            <span className="text-[11px] font-bold text-[var(--t2)] tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

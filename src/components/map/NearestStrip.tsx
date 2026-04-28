import React from "react";
import { MapPin, Clock } from "lucide-react";

const emergencyDot = {
  confirmed: "bg-red-500",
  likely: "bg-orange-400",
  unknown: "bg-gray-500",
};

export default function NearestStrip({ hospitals, onSelect }) {
  if (!hospitals || hospitals.length === 0) return null;

  return (
    <div className="absolute top-4 left-4 right-4 z-[999] flex gap-3 overflow-x-auto pb-4 hide-scrollbar pointer-events-none">
      {hospitals.slice(0, 5).map((h, i) => (
        <button
          key={h.osm_id || h.id || i}
          onClick={() => onSelect?.(h)}
          className="pointer-events-auto flex-shrink-0 bg-[var(--bg2)]/90 backdrop-blur-md border border-[var(--b)] rounded-2xl px-4 py-3 text-left hover:bg-[var(--bg3)] transition-all min-w-[200px] shadow-lg shadow-black/20"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${emergencyDot[h.emergency_status] || "bg-gray-500"}`} />
            <span className="text-[12px] font-black text-[var(--t1)] truncate max-w-[150px] uppercase tracking-tight">
              {h.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-[var(--blue)] font-mono">
              <MapPin size={12} />
              {h.distance?.toFixed(1)}km
            </span>
            <span className="flex items-center gap-1 text-[var(--t2)] font-mono">
              <Clock size={12} />
              ~{h.eta}m
            </span>
          </div>
          <div className="text-[10px] font-black text-[var(--t3)] mt-1 uppercase tracking-widest">{h.hospital_type}</div>
        </button>
      ))}
    </div>
  );
}

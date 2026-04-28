import React, { useState } from "react";
import { MapPin, Clock, Phone, ChevronDown, ChevronUp, Activity } from "lucide-react";
import BedAvailability from "../beds/BedAvailability";

const typeColors = {
  government: "text-green-400",
  private: "text-blue-400",
  clinic: "text-purple-400",
  unknown: "text-gray-400",
};

export default function HospitalList({ hospitals, selectedHospital, onSelect }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  if (hospitals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--t3)]">
        <MapPin size={32} className="mb-2 opacity-20" />
        <p className="text-xs font-black uppercase tracking-widest">No sector match</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 py-4 custom-scrollbar overflow-y-auto max-h-[60vh]">
      {hospitals.map((h, idx) => {
        const isSelected = selectedHospital?.id === h.id;
        const isExpanded = expandedId === h.id;

        return (
          <div
            key={h.id || idx}
            onClick={() => onSelect(h)}
            className={`p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
              isSelected 
              ? "bg-white/10 border-blue/40 shadow-blue-glow" 
              : "bg-white/5 border-white/5 hover:border-white/20"
            }`}
          >
            {isSelected && <div className="absolute inset-0 bg-blue-alpha-5 animate-pulse pointer-events-none" />}
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <div className={`text-[12px] font-black tracking-tight uppercase group-hover:text-blue transition-colors ${isSelected ? 'text-blue' : 'text-t1'}`}>
                  {h.name}
                </div>
                <div className={`text-[8px] font-black uppercase tracking-[0.2em] font-mono opacity-60`}>
                  {h.type || "Medical"} Facility · Sector {h.region || 'NCR'}
                </div>
              </div>
              <button 
                onClick={(e) => toggleExpand(e, h.id)}
                className="p-1 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-t3 hover:text-white border border-white/5"
              >
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-4 relative z-10">
              <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                <MapPin size={10} className="text-blue" />
                <span className="text-[10px] font-black font-mono text-t2">{h.distance?.toFixed(1) || '0.0'} KM</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                <Clock size={10} className="text-blue" />
                <span className="text-[10px] font-black font-mono text-t1">~{h.eta || '12'} MIN</span>
              </div>
              {h.status === 'full' && (
                <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blood/20 border border-blood/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-blood shadow-neon-red animate-pulse" />
                  <span className="text-[7px] font-black text-blood uppercase tracking-tighter">CRITICAL</span>
                </div>
              )}
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-4 anim a1 relative z-10">
                {h.address && (
                  <p className="text-[10px] text-t2 leading-relaxed font-bold italic opacity-80">"{h.address}"</p>
                )}
                
                <div className="flex gap-2">
                  <a 
                    href={`tel:${h.phone || '#'}`} 
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-t1 hover:border-blue transition-colors"
                  >
                    <Phone size={10} className="text-blue" /> Comms Hub
                  </a>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-t1 hover:border-blue transition-colors">
                    <Activity size={10} className="text-blue" /> Telemetry
                  </button>
                </div>

                <BedAvailability hospital={h} compact={true} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

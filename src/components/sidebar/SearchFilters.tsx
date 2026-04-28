import React from "react";

const typeFilters = [
  { key: "all", label: "Sector: All" },
  { key: "government", label: "Govt" },
  { key: "private", label: "Private" },
  { key: "clinic", label: "Clinic" },
];

export default function SearchFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  emergencyOnly,
  onEmergencyOnlyChange,
  filteredCount,
}) {
  return (
    <div className="space-y-4 px-4 pt-4">
      <div className="relative group">
        <input
          placeholder="Lookup sector unit..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-t1 placeholder:text-t3 font-bold focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-all backdrop-blur-md"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black font-mono text-blue uppercase tracking-widest bg-blue-alpha-10 px-2 py-1 rounded">
          {filteredCount} Units
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {typeFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => onTypeFilterChange(f.key)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
              typeFilter === f.key
                ? "bg-blue/10 border-blue text-blue shadow-blue-glow"
                : "bg-white/5 border-white/10 text-t3 hover:border-white/20 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => onEmergencyOnlyChange(!emergencyOnly)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${
          emergencyOnly 
          ? "bg-blood/10 border-blood text-blood shadow-neon-red" 
          : "bg-white/5 border-white/10 text-t3 hover:border-white/20"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${emergencyOnly ? "bg-blood shadow-neon-red animate-pulse" : "bg-white/20"}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">Priority ER Only</span>
        </div>
        <div className={`text-[8px] font-black px-1.5 rounded ${emergencyOnly ? "bg-blood text-white" : "bg-white/10 text-t3"}`}>
          {emergencyOnly ? 'ACTIVE' : 'OFF'}
        </div>
      </button>
    </div>
  );
}

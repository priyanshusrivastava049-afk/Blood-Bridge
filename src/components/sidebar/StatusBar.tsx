import React from "react";
import { RefreshCw, MapPin, Activity, ShieldCheck } from "lucide-react";

export default function StatusBar({ userPosition, dataLoading, lastFetched, onRefresh }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg3)] border-t border-[var(--b)] text-[9px] font-black font-mono uppercase tracking-[0.2em] text-[var(--t3)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {userPosition ? (
            <>
              <MapPin size={10} className="text-[var(--green)]" />
              <span className="text-[var(--green)]">Vector: Active</span>
            </>
          ) : (
            <>
              <MapPin size={10} className="text-[var(--blood)] animate-pulse" />
              <span className="text-[var(--blood)]">Vector: Locked</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {dataLoading ? (
            <>
              <Activity size={10} className="text-[var(--blue)] animate-spin" />
              <span className="text-[var(--blue)]">Scanning Infrastructure...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={10} className="text-[var(--green)]" />
              <span className="text-[var(--green)]">OSM-LINK: SECURE</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {lastFetched && (
          <span>Last Sync: {lastFetched.toLocaleTimeString()}</span>
        )}
        <button 
          onClick={onRefresh}
          disabled={dataLoading}
          className="hover:text-[var(--blue)] transition-colors"
        >
          <RefreshCw size={10} className={dataLoading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
}

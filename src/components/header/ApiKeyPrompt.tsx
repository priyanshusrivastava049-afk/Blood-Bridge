import React, { useState } from "react";
import { getStoredApiKey, setApiKey, clearApiKey } from "../../lib/trafficETA";
import { Key, X, Check, Zap, ExternalLink } from "lucide-react";

export default function ApiKeyPrompt({ onKeySet }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(getStoredApiKey());
  const [saved, setSaved] = useState(false);
  const hasKey = !!getStoredApiKey();

  const handleSave = () => {
    if (!value.trim()) return;
    setApiKey(value.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
      onKeySet?.();
    }, 800);
  };

  const handleClear = () => {
    clearApiKey();
    setValue("");
    onKeySet?.();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        title={hasKey ? "Live traffic ETAs active" : "Enable live traffic ETAs"}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
          hasKey
            ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
            : "bg-secondary text-muted-foreground border-border hover:bg-accent"
        }`}
      >
        {hasKey ? <Zap className="w-3 h-3" /> : <Key className="w-3 h-3" />}
        <span className="hidden sm:inline">{hasKey ? "Live ETA" : "Add Maps Key"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-[9999] w-80 bg-[var(--bg2)] border border-[var(--b)] rounded-xl shadow-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Google Maps API Key</h3>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Enables real-time traffic-aware ETAs via Google Distance Matrix API. 
            Your key is stored locally only.
          </p>

          <input
            type="password"
            placeholder="AIza..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-[var(--bg3)] border border-[var(--b)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--blue)]"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!value.trim()}
              className="flex-1 bg-[var(--blue)] text-white text-xs py-2 rounded-md font-bold disabled:opacity-50"
            >
              {saved ? "Saved!" : "Save Key"}
            </button>
            {hasKey && (
              <button onClick={handleClear} className="px-3 border border-[var(--b)] rounded-md text-xs hover:bg-[var(--bg4)]">
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

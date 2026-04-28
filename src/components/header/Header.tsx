import React from "react";
import { Heart, Phone } from "lucide-react";
import ApiKeyPrompt from "./ApiKeyPrompt";

export default function Header({ onApiKeySet }) {
  return (
    <header className="h-14 bg-[var(--bg2)] backdrop-blur-lg border-b border-[var(--b)] flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[var(--blood)] flex items-center justify-center emergency-pulse">
          <Heart className="w-4 h-4 text-white fill-current" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-[var(--t1)] tracking-tight leading-none uppercase">
            BloodBridge
          </h1>
          <p className="text-[9px] text-[var(--t3)] font-black tracking-wider uppercase mt-1">
            Delhi NCR Sector Control
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ApiKeyPrompt onKeySet={onApiKeySet} />
        <a
          href="tel:108"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--blood)] hover:bg-[var(--crimson)] transition-colors text-white text-xs font-black uppercase shadow-red-glow"
        >
          <Phone size={12} />
          <span>108</span>
        </a>
        <a
          href="tel:112"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg4)] hover:bg-[var(--bg5)] transition-colors text-[var(--t1)] text-xs font-bold border border-[var(--b)]"
        >
          <Phone size={12} />
          <span>112</span>
        </a>
      </div>
    </header>
  );
}

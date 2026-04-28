import { Sun, PlusCircle, Droplets, Moon, Activity, Zap, ShieldAlert, Languages, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScreenId } from '../types';
import { useState } from 'react';

interface TopbarProps {
  currentScreen: ScreenId;
  onNavigate: (id: ScreenId) => void;
  toggleTheme: () => void;
  currentLang: string;
  setCurrentLang: (l: string) => void;
  isEmergencyMode: boolean;
  setIsEmergencyMode: (b: boolean) => void;
}

export default function Topbar({ onNavigate, toggleTheme, currentLang, setCurrentLang, isEmergencyMode, setIsEmergencyMode }: TopbarProps) {
  return (
    <header className={`topbar transition-all ${isEmergencyMode ? 'emergency-mode-flash !border-[var(--blood)]' : ''}`}>
      <div className="flex items-center gap-10">
        <div className="logo cursor-pointer group" onClick={() => onNavigate('dash')}>
          <div className="logo-icon group-hover:shadow-blood-glow transition-all">
            <Droplets size={18} fill="currentColor" />
          </div>
          <div className="flex flex-col gap-0">
            <span className="leading-tight">BLOOD<span className="text-[var(--t1)]">BRIDGE</span></span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-[var(--blue)] animate-pulse"></div>
              <span className="text-[8px] font-black font-mono tracking-[0.2em] text-[var(--blue)] opacity-70 uppercase">Cortex Link Active</span>
            </div>
          </div>
        </div>
        
        {/* TRANS-LINK */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-[var(--bg3)] border border-[var(--b)] rounded-lg">
          <Languages size={14} className="text-[var(--t3)]" />
          <button className={`text-[10px] font-black ${currentLang === 'EN' ? 'text-[var(--blue)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`} onClick={() => setCurrentLang('EN')}>EN</button>
          <div className="w-px h-2.5 bg-[var(--b)] mx-1"></div>
          <button className={`text-[10px] font-black ${currentLang === 'HI' ? 'text-[var(--blue)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`} onClick={() => setCurrentLang('HI')}>HI</button>
          <div className="w-px h-2.5 bg-[var(--b)] mx-1"></div>
          <button className={`text-[10px] font-black ${currentLang === 'MR' ? 'text-[var(--blue)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`} onClick={() => setCurrentLang('MR')}>MR</button>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* EMERGENCY MODE OVERRIDE */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEmergencyMode(!isEmergencyMode)}
          className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isEmergencyMode ? 'bg-[var(--blood)] border-[var(--blood)] text-white shadow-shadow-glow' : 'bg-[var(--bg3)] border-[var(--b)] text-[var(--blood)]'}`}
        >
          <ShieldAlert size={16} className={isEmergencyMode ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-black uppercase tracking-widest">{isEmergencyMode ? 'EMERGENCY_ON' : 'TRY_EMERGENCY_MODE'}</span>
        </motion.button>

        <div className="h-6 w-px bg-[var(--b)] hidden sm:block"></div>
        <div className="hidden lg:flex items-center gap-5 mr-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black font-mono text-[var(--t3)] uppercase tracking-widest">Network Load</span>
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={`w-1 h-2 rounded-full ${i <= 3 ? 'bg-[var(--blue)]' : 'bg-[var(--bg4)]'}`}></div>
              ))}
            </div>
          </div>
          <div className="h-4 w-px bg-[var(--b)]"></div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black font-mono text-[var(--t3)] uppercase tracking-widest">Sync Rate</span>
            <span className="text-[11px] font-black text-[var(--t1)]">98.4 MS/S</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--bg3)] border border-[var(--b)] rounded-full hover:border-[var(--blood-alpha-40)] transition-colors cursor-help group">
          <div className="w-2 h-2 rounded-full bg-[var(--blood)] animate-pulse shadow-[0_0_8px_var(--blood)]"></div>
          <span className="text-[9px] font-black font-mono tracking-widest text-[var(--blood)] group-hover:text-[var(--t1)] transition-colors">3 CRITICAL CASES ACTIVE</span>
        </div>
        
        <div className="h-6 w-px bg-[var(--b)]"></div>
        
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl border border-[var(--b)] text-[var(--t2)] hover:text-[var(--blue)] hover:border-[var(--blue-alpha-20)] transition-all bg-[var(--bg2)]" 
            onClick={toggleTheme}
          >
            <Sun size={18} className="dark:hidden" />
            <Moon size={18} className="hidden dark:block" />
          </motion.button>
          
          <button className="btn btn-blood btn-sm h-[42px] px-6 relative overflow-hidden group" onClick={() => onNavigate('req')}>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <PlusCircle size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline font-black uppercase tracking-tight">Rapid Request</span>
            <span className="sm:hidden">Request</span>
          </button>
        </div>
      </div>
    </header>
  );
}

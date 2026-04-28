
import React from 'react';
import { Siren, Globe, Plus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiveTime } from './ui/LiveTime';

export const Header = ({ isEmergency, onToggleEmergency, onRapidRequest }: { 
  isEmergency?: boolean, 
  onToggleEmergency?: () => void,
  onRapidRequest?: () => void
}) => {
  const [lang, setLang] = React.useState('EN');

  return (
    <header className={`h-20 flex items-center justify-between px-8 transition-all duration-500 z-[1000] border-b border-white/5 backdrop-blur-xl bg-bg/80 sticky top-0 ${isEmergency ? 'emergency-mode-flash !border-blood shadow-red-glow' : ''}`}>
      <div className="flex items-center gap-10">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md shadow-inner-glow">
          <Globe size={14} className="text-blue animate-pulse" />
          <div className="flex items-center gap-4">
            {['EN', 'HI', 'MR'].map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`text-[10px] font-black tracking-widest transition-all ${lang === l ? 'text-blue shadow-neon-blue scale-110' : 'text-t3 hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl group cursor-help transition-all hover:bg-white/10">
           <div className="w-2 h-2 rounded-full bg-green animate-pulse shadow-neon-green" />
           <span className="text-[9px] font-black font-mono tracking-widest text-green uppercase">System Monitoring Active</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 mr-4">
          <LiveTime />
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleEmergency}
          className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
            isEmergency ? 'bg-blood border-blood text-white shadow-neon-red' : 'bg-white/5 border-white/10 text-blood hover:bg-white/10'
          }`}
        >
          <Zap size={14} className={isEmergency ? 'animate-pulse' : ''} />
          {isEmergency ? 'EMERGENCY_ACTIVE' : 'PULSE_PROTOCOL'}
        </motion.button>

        <button 
          onClick={onRapidRequest}
          className="flex items-center gap-3 px-6 py-2.5 bg-blood hover:bg-blood/90 text-white rounded-xl font-black uppercase tracking-[0.15em] shadow-neon-red transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Plus size={18} className="relative z-10" />
          <span className="relative z-10 text-[11px]">Rapid Request</span>
        </button>
      </div>
    </header>
  );
};

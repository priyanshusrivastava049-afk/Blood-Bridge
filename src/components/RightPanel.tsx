
import React from 'react';
import { Hospital } from '../lib/constants';
import { NumberAnimate } from './ui/NumberAnimate';
import { Skeleton } from './ui/Skeleton';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Activity, 
  Droplets, 
  Navigation, 
  ArrowUpRight, 
  ShieldAlert,
  Phone,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RightPanelProps {
  hospital: Hospital | null;
  onRequestBlood: () => void;
  onGetDirections: () => void;
  isLoading?: boolean;
}

export const RightPanel = ({ hospital, onRequestBlood, onGetDirections, isLoading }: RightPanelProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col p-8 space-y-8 bg-bg2">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-scan-pattern opacity-5 pointer-events-none" />
        <div className="w-20 h-20 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner-glow group-hover:scale-110 transition-transform">
          <Info size={32} className="text-t3 opacity-30" />
        </div>
        <h3 className="text-xl font-black text-t2 uppercase tracking-tighter mb-3">Tactical Asset Locked</h3>
        <p className="text-[10px] text-t3 font-bold max-w-[200px] uppercase tracking-[0.2em] leading-relaxed opacity-70">
          Sync with any facility on the tactical grid to initiate deep telemetry.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={hospital.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex-1 flex flex-col bg-bg2 h-full overflow-y-auto custom-scrollbar"
      >
        <div className="p-8 border-b border-white/5 relative bg-white/5">
          <div className="absolute inset-0 bg-scan-pattern opacity-5" />
          <div className="flex items-center justify-between mb-5 relative z-10">
            <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] border ${
              hospital.status === 'available' ? 'bg-green/10 text-green border-green/30 shadow-[0_0_10px_rgba(0,214,143,0.1)]' : hospital.status === 'limited' ? 'bg-gold/10 text-gold border-gold/30' : 'bg-blood/10 text-blood border-blood/30 shadow-neon-red'
            }`}>
              {hospital.status} Protocol
            </span>
            <span className="text-[10px] font-mono font-black text-t3 uppercase tracking-widest border border-white/10 px-2 rounded">{hospital.type || 'HOSPITAL'}</span>
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tighter leading-tight mb-4 uppercase drop-shadow-sm">{hospital.name}</h2>
          <div className="flex items-start gap-2.5 text-t2 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            <MapPin size={14} className="text-blue shrink-0" />
            <span className="opacity-70 italic">"{hospital.address || 'Address encryption active'}"</span>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-8 relative">
          {/* Main Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-inner-glow relative overflow-hidden group hover:border-blue/30 transition-all">
              <div className="absolute inset-0 bg-blue-alpha-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 text-[9px] font-black text-t3 uppercase tracking-[0.2em] mb-4">
                <Bed size={14} className="text-blue" /> Beds Available
              </div>
              <div className="text-3xl font-black text-white flex items-baseline gap-2">
                <NumberAnimate value={hospital.availableBeds} /> 
                <span className="text-[10px] text-t3 font-mono opacity-50">/ {hospital.totalBeds}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${hospital.totalBeds > 0 ? (hospital.availableBeds / hospital.totalBeds) * 100 : 0}%` }}
                  className="h-full bg-blue shadow-blue-glow transition-all duration-1000"
                />
              </div>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl shadow-inner-glow group hover:border-blood/30 transition-all">
               <div className="absolute inset-0 bg-blood-alpha-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 text-[9px] font-black text-t3 uppercase tracking-[0.2em] mb-4">
                <Activity size={14} className="text-blood" /> ICU Priority
              </div>
              <div className="text-3xl font-black text-white flex items-baseline gap-2">
                {hospital.icuBeds || '0'} <span className="text-[10px] text-t3 font-mono opacity-50">UNITS</span>
              </div>
              <div className="text-[9px] font-black text-green mt-3 flex items-center gap-1 uppercase tracking-widest">
                <ArrowUpRight size={10} /> 12% Variance
              </div>
            </div>
          </div>

          {/* Blood Inventory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <Droplets size={14} className="text-blood" /> Neural Inventory
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                <span className="text-[8px] font-black text-t3 uppercase tracking-tighter">Verified 2m ago</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(type => {
                const level = hospital.bloodAvailability[type as keyof typeof hospital.bloodAvailability] || 'None';
                return (
                  <div key={type} className="flex flex-col items-center gap-1.5 py-3 bg-white/5 border border-white/10 rounded-xl group hover:border-blue transition-all backdrop-blur-md">
                    <span className="text-[11px] font-black text-white">{type}</span>
                    <div className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                      level === 'High' ? 'bg-green/10 text-green' : level === 'Medium' ? 'bg-gold/10 text-gold' : 'bg-blood/10 text-blood'
                    }`}>
                      {level.substring(0,3)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Response Actions */}
          <div className="space-y-4 pt-4 relative z-10">
            <button 
              onClick={onRequestBlood}
              className="w-full h-14 bg-blood hover:bg-blood/90 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-neon-red border border-blood/20 transition-all flex items-center justify-center gap-3 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
              <Droplets size={18} className="animate-pulse" /> Request Priority Supply
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onGetDirections}
                className="h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-t1 flex items-center justify-center gap-2 transition-all"
              >
                <Navigation size={14} className="text-blue" /> Tactical Map
              </button>
              <button className="h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-t1 flex items-center justify-center gap-2 transition-all">
                <Phone size={14} className="text-blue" /> Comms Linked
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-blue/5 border border-blue/10 border-dashed relative overflow-hidden group">
            <div className="absolute inset-0 bg-scan-pattern opacity-5" />
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <ShieldAlert size={18} className="text-blue shadow-blue-glow" />
              <div className="text-[11px] font-black text-white uppercase tracking-widest">Neural Advisor Summary</div>
            </div>
            <p className="text-[10px] text-t2 font-bold leading-relaxed italic opacity-80 relative z-10">
              "Facility reporting tactical load sync. Triage throughput steady at 88%. O- stock redistribution advised via Vector 9."
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

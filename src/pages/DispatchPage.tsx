
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Timer, Activity, Droplets, User, Crosshair, Loader2, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';

export const DispatchPage = () => {
  const { bloodRequests } = useFirebase();
  const [activeUnits, setActiveUnits] = useState([
    { id: 'u1', name: 'UNIT_DELTA_01', type: 'Rapid Response', lat: 28.6139, lng: 77.2090, status: 'en-route', eta: '5m', patient: 'A. Verma' },
    { id: 'u2', name: 'UNIT_SIGMA_05', type: 'Airborne Triage', lat: 28.5355, lng: 77.3910, status: 'on-site', eta: '--', patient: 'R. Khanna' },
    { id: 'u3', name: 'UNIT_OMEGA_02', type: 'Civil Donor Vector', lat: 28.5823, lng: 77.0500, status: 'calculating', eta: '12m', patient: 'P. Nair' },
  ]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter flex items-center gap-3">
            LIVE DISPATCH
            <span className="text-[10px] not-italic font-black border border-blood/40 text-blood px-2 py-0.5 rounded shadow-neon-red">REALTIME_VECTORS</span>
          </h1>
          <p className="text-[10px] text-t3 font-black uppercase tracking-[0.4em] mt-2">Active Emergency Unit Tracking · Delhi NCR Command</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-blue uppercase tracking-widest">System Load</span>
            <span className="text-xl font-black text-white italic">42% Capacity</span>
          </div>
          <div className="h-10 w-px bg-white/10 mx-2" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-green uppercase tracking-widest">Mean Response</span>
            <span className="text-xl font-black text-white italic">4.2 Minutes</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Active Dispatch Feed */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl relative">
            <div className="absolute inset-0 bg-scan-pattern opacity-5" />
            <div className="p-8 border-b border-white/10 flex items-center justify-between relative z-10">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                <Navigation className="text-blue shadow-neon-blue" size={24} />
                Tactical Deployments
              </h2>
              <span className="text-[8px] font-mono text-t3 uppercase tracking-tighter">Lat-Long Streaming...</span>
            </div>
            
            <div className="p-8 space-y-4 relative z-10">
              <AnimatePresence mode="popLayout">
                {activeUnits.map((unit, i) => (
                  <motion.div
                    key={unit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-blue/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Activity size={48} className="text-blue" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black border ${
                           unit.status === 'on-site' ? 'bg-green/10 border-green/20 text-green shadow-neon-green' : 'bg-blue/10 border-blue/20 text-blue shadow-neon-blue'
                         }`}>
                           <Navigation size={24} className={unit.status === 'en-route' ? 'animate-pulse' : ''} />
                         </div>
                         <div>
                           <h3 className="text-lg font-black text-white italic tracking-tight">{unit.name}</h3>
                           <div className="flex items-center gap-3 mt-1">
                             <span className="text-[9px] font-black text-t3 uppercase tracking-widest">{unit.type}</span>
                             <span className="w-1 h-1 rounded-full bg-white/20" />
                             <div className="flex items-center gap-1">
                               <MapPin size={10} className="text-blue" />
                               <span className="text-[9px] font-black text-blue uppercase tracking-widest">{unit.lat}, {unit.lng}</span>
                             </div>
                           </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <span className="text-[9px] text-t3 font-black uppercase tracking-widest block mb-1">Status</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                            unit.status === 'on-site' ? 'bg-green text-white border-green/30' : 'bg-blue text-white border-blue/30'
                          }`}>
                            {unit.status}
                          </span>
                        </div>
                        <div className="text-right w-20">
                          <span className="text-[9px] text-t3 font-black uppercase tracking-widest block mb-1">ETA</span>
                          <span className="text-xl font-black text-white font-mono">{unit.eta}</span>
                        </div>
                        <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-t3 hover:text-white transition-all">
                           <Loader2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <User size={14} className="text-t3" />
                         <span className="text-[10px] font-black text-t2 uppercase tracking-widest">Assigned Patient: {unit.patient}</span>
                       </div>
                       <div className="flex items-center gap-4">
                         <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: "65%" }}
                             className="h-full bg-blue shadow-neon-blue"
                           />
                         </div>
                         <span className="text-[9px] font-black text-blue uppercase">Progressing Vector</span>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[40px] bg-blood/10 border border-blood/20 relative overflow-hidden group hover:border-blood transition-all">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertTriangle size={64} className="text-blood" />
               </div>
               <h3 className="text-lg font-black text-white italic tracking-tight mb-2 uppercase">Unassigned Requests</h3>
               <p className="text-[10px] text-t3 font-black uppercase tracking-widest mb-6">Critical vectors awaiting node synchronization</p>
               <span className="text-4xl font-black text-blood italic shadow-neon-red">{bloodRequests.filter(r => r.status === 'waiting').length}</span>
               <button className="w-full mt-8 py-3 bg-blood text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-neon-red hover:scale-105 active:scale-95 transition-all">
                 Manual Override
               </button>
            </div>
            
            <div className="p-8 rounded-[40px] bg-green/10 border border-green/20 relative overflow-hidden group hover:border-green transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={64} className="text-green" />
               </div>
               <h3 className="text-lg font-black text-white italic tracking-tight mb-2 uppercase">Verified Assets</h3>
               <p className="text-[10px] text-t3 font-black uppercase tracking-widest mb-6">Mobile medical units ready for transition</p>
               <span className="text-4xl font-black text-green italic shadow-neon-green">14</span>
               <button className="w-full mt-8 py-3 bg-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-neon-green hover:scale-105 active:scale-95 transition-all">
                 Request Deployment
               </button>
            </div>
          </div>
        </div>

        {/* Tactical Overview Sidebar */}
        <div className="space-y-8">
           <div className="hud-card p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-xl group">
             <div className="w-16 h-16 rounded-[24px] bg-blue/10 border border-blue/20 flex items-center justify-center mb-6 shadow-neon-blue group-hover:scale-110 transition-transform">
               <Crosshair size={32} className="text-blue" />
             </div>
             <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Auto-Dispatch</h3>
             <p className="text-[11px] text-t2 font-bold mb-8 italic leading-relaxed opacity-80">Cortex-level intelligence is currently managing all standard priority vectors.</p>
             
             <div className="space-y-3">
               {[
                 { label: 'Neural Matching', status: 'Optimal' },
                 { label: 'Traffic Integration', status: 'Active' },
                 { label: 'Weather Impact', status: 'Nominal' }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                   <span className="text-[9px] font-black text-t3 uppercase tracking-widest">{item.label}</span>
                   <span className="text-[9px] font-black text-blue uppercase tracking-widest">{item.status}</span>
                 </div>
               ))}
             </div>

             <button className="w-full mt-8 py-4 bg-white/5 hover:bg-blue/10 border border-white/10 hover:border-blue/30 rounded-2xl text-[10px] font-black text-t3 hover:text-blue uppercase tracking-widest transition-all flex items-center justify-center gap-2">
               <Sparkles size={16} /> Force Neural Re-route
             </button>
           </div>

           <div className="p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
             <h4 className="text-[11px] font-black text-t1 uppercase tracking-[0.3em] mb-6">Mission Continuity</h4>
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center">
                    <Droplets size={16} className="text-blue shadow-neon-blue" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter">O- Negative Priority</p>
                    <p className="text-[8px] font-black text-t3 uppercase tracking-widest mt-0.5">3 active requests in Noida</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Timer size={16} className="text-gold shadow-neon-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter">Night Ops Buffer</p>
                    <p className="text-[8px] font-black text-t3 uppercase tracking-widest mt-0.5">Battery systems at 92%</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

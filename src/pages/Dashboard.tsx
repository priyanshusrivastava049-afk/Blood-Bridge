
import React from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Monitor,
  Database,
  Crosshair,
  Timer,
  MapPin,
  Bell,
  Cpu,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui/Skeleton';
import { NumberAnimate } from '../components/ui/NumberAnimate';
import AIRecommendation from '../components/sidebar/AIRecommendation';
import { Hospital, Alert } from '../lib/constants';
import { getAIStatus } from '../services/geminiService';

const StatsCard = ({ icon, label, val, sub, trend }: { icon: React.ReactNode, label: string, val: string | number, sub: string, trend?: 'up' | 'down' }) => (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="mc group hover:border-blue/50 transition-all cursor-default relative overflow-hidden backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-blue opacity-0 group-hover:opacity-5 transition-opacity" />
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
        {icon}
      </div>
      <div className={`mc-icon ${trend === 'up' ? 'mi-r' : 'mi-b'}`}>{icon}</div>
      <div className="mc-val text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        <NumberAnimate value={val} />
      </div>
      <div className="mc-lbl">{label}</div>
      <div className={trend === 'up' ? 'mc-delta d-dn' : 'mc-delta d-up'}>{sub}</div>
    </motion.div>
);

interface DashboardProps {
  isLoading: boolean;
  allHospitals: Hospital[];
  currentHospitals: Hospital[];
  filteredHospitals: Hospital[];
  selectedHospital: Hospital | null;
  setSelectedHospital: (h: Hospital) => void;
  setAiRecommendedHospital: (h: Hospital) => void;
  aiPrediction: string;
  handleOptimizeRoute: () => void;
  isProcessingSmart: boolean;
  smartInput: string;
  setSmartInput: (v: string) => void;
  handleSmartDispatch: (e: React.FormEvent) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
  filterRegion: string;
  setFilterRegion: (v: string) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (v: boolean) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (p: number) => void;
  alerts: Alert[];
  userLocation: [number, number] | null;
  openRequestModal: () => void;
  onSyncHistory: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isLoading,
  allHospitals,
  currentHospitals,
  filteredHospitals,
  selectedHospital,
  setSelectedHospital,
  setAiRecommendedHospital,
  aiPrediction,
  handleOptimizeRoute,
  isProcessingSmart,
  smartInput,
  setSmartInput,
  handleSmartDispatch,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterRegion,
  setFilterRegion,
  showAvailableOnly,
  setShowAvailableOnly,
  currentPage,
  totalPages,
  handlePageChange,
  alerts,
  userLocation,
  openRequestModal,
  onSyncHistory
}) => {
  return (
    <div className="space-y-8 relative pb-20">
      {/* Global Scan Line Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-10">
        <div className="absolute inset-0 bg-scan-pattern animate-scan-slow opacity-10" />
      </div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="relative">
          <h1 className="text-4xl font-black text-white italic tracking-tighter flex items-center gap-3">
            SITUATION ROOM
            <span className="text-[10px] not-italic font-black border border-blue/40 text-blue px-2 py-0.5 rounded shadow-neon-blue animate-pulse">NODE_02_ACTIVE</span>
          </h1>
          <p className="text-[10px] text-t3 font-black uppercase tracking-[0.4em] mt-2">Neural Dispatch Deck · Delhi-NCR Strategic Vector</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative group">
            <form onSubmit={handleSmartDispatch} className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={smartInput}
                  onChange={(e) => setSmartInput(e.target.value)}
                  placeholder="Describe emergency (e.g. AB+ needed in Noida...)"
                  className="w-80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-t3 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/50 transition-all backdrop-blur-md shadow-inner-glow"
                  disabled={isProcessingSmart}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Cpu size={12} className="text-blue animate-spin-slow" />
                </div>
              </div>
              <button 
                disabled={isProcessingSmart || !smartInput}
                className="flex items-center justify-center p-3 bg-blue rounded-xl text-white disabled:opacity-50 shadow-neon-blue active:scale-95 transition-all"
              >
                {isProcessingSmart ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              </button>
            </form>
          </div>
          <div className="h-10 w-px bg-white/10 mx-2" />
          <button 
            onClick={openRequestModal}
            className="flex items-center gap-3 px-6 py-3 bg-blood text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-neon-red hover:scale-105 active:scale-95 transition-all border border-blood/20"
          >
            <Plus size={20} /> Rapid Request
          </button>
        </div>
      </motion.div>

      {/* AI Advisor Box */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden group bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-inner-glow"
      >
        <div className="absolute inset-0 bg-scan-pattern opacity-5" />
        <div className="flex items-center justify-between w-full relative z-10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue/10 border border-blue/20 rounded-xl flex items-center justify-center shadow-neon-blue">
               <Cpu size={20} className="animate-spin-slow text-blue" /> 
            </div>
            <div>
              <span className="text-[10px] font-black text-blue uppercase tracking-[0.2em]">Cortex Intelligence</span>
              <h3 className="text-lg font-black text-white italic tracking-tight">Active Advisor</h3>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest backdrop-blur-md border ${
            getAIStatus() === 'online' ? 'bg-green/10 text-green border-green/30 shadow-neon-green' : 'bg-gold/10 text-gold border-gold/30 shadow-neon-gold'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getAIStatus() === 'online' ? 'bg-green animate-pulse' : 'bg-gold'}`} />
            {getAIStatus() === 'online' ? 'AI_LIVE' : 'HEURISTIC_OVERRIDE'}
          </div>
        </div>
        <p className="text-sm md:text-md text-t2 relative z-10 italic font-medium tracking-tight mb-6 max-w-4xl leading-relaxed border-l-2 border-blue/30 pl-4 py-1">
          "{aiPrediction}"
        </p>
        <div className="flex flex-wrap gap-2 relative z-10">
          {[
            { label: 'Optimize Supply Route', action: handleOptimizeRoute },
            { label: 'Redeploy Responders', action: () => {} },
            { label: 'Export Logistics Log', action: () => {} }
          ].map((chip, i) => (
            <button 
              key={i}
              onClick={chip.action}
              className="px-4 py-2 bg-white/5 hover:bg-blue/10 border border-white/10 hover:border-blue/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-t1 hover:text-blue transition-all flex items-center gap-2"
            >
              <div className="w-1 h-1 rounded-full bg-blue" />
              {chip.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {isLoading ? (
          [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)
        ) : (
          <>
            <StatsCard 
              icon={<Monitor size={20} />} 
              label="SYNC NODES" 
              val={allHospitals.length} 
              sub="GRID STATUS: 100%"
              trend="down"
            />
            <StatsCard 
              icon={<Plus size={20} />} 
              label="TOTAL CAPACITY" 
              val={allHospitals.reduce((acc, h) => acc + h.availableBeds, 0).toLocaleString()} 
              sub={`${allHospitals.length > 0 ? Math.round((allHospitals.reduce((acc, h) => acc + h.availableBeds, 0) / allHospitals.reduce((acc, h) => acc + h.totalBeds, 0)) * 100) : 0}% LOAD`}
              trend="up"
            />
            <StatsCard 
              icon={<Crosshair size={20} />} 
              label="TACTICAL VESTS" 
              val="248" 
              sub="34% EN-ROUTE"
              trend="up"
            />
            <StatsCard 
              icon={<Timer size={20} />} 
              label="DISPATCH SPEED" 
              val="4.2m" 
              sub="TARGET: 5.0m"
              trend="down"
            />
          </>
        )}
      </motion.div>

      {/* Table and Alerts Box */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:items-start">
        <div id="facility-index" className="xl:col-span-2 relative overflow-hidden bg-white/5 border border-white/10 rounded-3xl shadow-inner-glow">
          <div className="absolute inset-0 bg-scan-pattern opacity-5" />
          <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-blue animate-pulse shadow-neon-blue" />
                 Tactical Asset Registry
              </h2>
              <p className="text-[10px] text-t3 font-black uppercase tracking-widest mt-1">Cross-referencing {filteredHospitals.length} medical stations</p>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-xl group cursor-pointer transition-all hover:border-blue/30" onClick={() => setShowAvailableOnly(!showAvailableOnly)}>
                <div className={`w-8 h-4 rounded-full transition-colors relative ${showAvailableOnly ? 'bg-green shadow-neon-green' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${showAvailableOnly ? 'left-4.5' : 'left-0.5'}`} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-t2 group-hover:text-white transition-colors">Available Only</span>
              </div>
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-t3 group-focus-within:text-blue transition-colors" />
                <input 
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-t3 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/30 transition-all w-48" 
                  placeholder="SCAN SECTOR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto relative z-10 custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9px] font-black text-t3 uppercase tracking-[0.2em] bg-white/5">
                  <th className="px-8 py-4">Station ID</th>
                  <th className="px-6 py-4">Tactical Coordinates</th>
                  <th className="px-6 py-4 text-center">Protocol</th>
                  <th className="px-6 py-4 text-center">Capacity</th>
                  <th className="px-8 py-4 text-right">Vector Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  [1, 2, 3, 4, 5, 8].map(i => (
                    <tr key={i}>
                      <td className="px-8 py-6"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-6 py-6"><Skeleton className="h-3 w-48" /></td>
                      <td className="px-6 py-6"><Skeleton className="h-4 w-16 mx-auto" /></td>
                      <td className="px-6 py-6"><Skeleton className="h-4 w-20 mx-auto" /></td>
                      <td className="px-8 py-6"><Skeleton className="h-4 w-12 ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  currentHospitals.map((hospital, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      key={hospital.id}
                      onClick={() => setSelectedHospital(hospital)}
                      className={`group cursor-pointer transition-all border-l-2 ${
                        selectedHospital?.id === hospital.id ? 'bg-blue/10 border-blue' : 'hover:bg-white/5 border-transparent'
                      }`}
                    >
                      <td className="px-8 py-5">
                        <div className={`text-[13px] font-black tracking-tight uppercase group-hover:text-blue transition-colors ${selectedHospital?.id === hospital.id ? 'text-blue' : 'text-white'}`}>
                          {hospital.name}
                        </div>
                        <div className="text-[8px] font-black text-t3 uppercase tracking-widest mt-0.5">{hospital.type} FACILITY</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[10px] text-t2 font-medium italic opacity-70 truncate max-w-[200px] leading-relaxed">
                          "{hospital.address}"
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter border ${
                          hospital.status === 'available' ? 'bg-green/10 text-green border-green/30' : hospital.status === 'limited' ? 'bg-gold/10 text-gold border-gold/30' : 'bg-blood/10 text-blood border-blood/30'
                        }`}>
                          {hospital.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="text-[11px] font-black font-mono text-white">
                          <span className={hospital.availableBeds < 10 ? 'text-blood' : 'text-blue'}>{hospital.availableBeds}</span>
                          <span className="text-t3 opacity-30 mx-1">/</span>
                          <span>{hospital.totalBeds}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <MapPin size={10} className="text-blue" />
                           <span className="text-blue font-black font-mono text-[11px] uppercase tracking-tighter">{hospital.distance} KM</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-5 border-t border-white/10 flex items-center justify-between relative z-10 bg-white/5">
            <div className="text-[10px] font-black uppercase text-t3 tracking-widest">
              Grid showing {filteredHospitals.length} Tactical Nodes
            </div>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-t3 hover:text-white transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue/30'}`}
              >
                <ChevronDown className="rotate-90" size={14} />
              </button>
              <div className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg text-xs font-black font-mono">
                 {currentPage} <span className="mx-2 opacity-30">/</span> {totalPages}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-t3 hover:text-white transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue/30'}`}
              >
                <ChevronDown className="-rotate-90" size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          <AIRecommendation 
             hospitals={allHospitals} 
             userLocation={userLocation} 
             onSelectHospital={(h) => setSelectedHospital(h)} 
             onRecommendation={(h) => setAiRecommendedHospital(h)}
           />

          <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-inner-glow group">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-blood uppercase tracking-[0.3em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blood animate-pulse shadow-neon-red" />
                  Live Incident Feed
                </h3>
                <span className="text-[8px] font-mono text-t3 uppercase tracking-tighter">Secure Link: Encrypted</span>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)
              ) : (
                alerts.map((alert, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    key={alert.id} 
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group/alert relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover/alert:opacity-10 transition-opacity">
                      <Bell size={32} className="text-white" />
                    </div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                         alert.severity === 'critical' ? 'bg-blood/20 text-blood border border-blood/30 shadow-neon-red' : alert.severity === 'warning' ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-blue/20 text-blue border border-blue/30'
                      }`}>{alert.type} INTERCEPT</span>
                      <span className="text-[9px] font-mono font-black text-t3 opacity-50">{alert.time}</span>
                    </div>
                    <p className="text-[11px] text-white font-bold leading-relaxed uppercase tracking-tight pr-4">
                      {alert.message}
                    </p>
                  </motion.div>
                ))
              )}
              <button 
                onClick={onSyncHistory}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[9px] font-black text-t3 hover:text-white uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
              >
                <Database size={14} /> Synchronize Mission Log
              </button>
            </div>
          </div>

          <div className="bg-blue/10 border border-blue/20 rounded-[40px] px-8 py-10 text-center relative overflow-hidden group cursor-pointer shadow-neon-blue">
            <div className="absolute inset-0 bg-scan-pattern opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
               <div className="w-20 h-20 rounded-[32px] bg-blue-alpha-10 border border-blue-alpha-20 flex items-center justify-center mx-auto mb-8 shadow-neon-blue group-hover:scale-110 transition-transform">
                <Cpu size={32} className="text-blue shadow-blue-glow" />
               </div>
               <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-4">Neural Grid Online</h3>
               <p className="text-[11px] text-t2 font-bold leading-relaxed italic opacity-80 max-w-[240px] mx-auto">
                Vector analysis is currently optimizing 156 emergency paths across Node Beta.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

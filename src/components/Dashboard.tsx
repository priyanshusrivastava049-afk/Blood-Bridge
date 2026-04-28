import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Users, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Droplets
} from 'lucide-react';
import { INITIAL_REQS, INITIAL_FEED, BG_AVAIL_DATA } from '../constants';
import { TRANSLATIONS } from '../i18n';

interface DashboardProps {
  donors: any[];
  onNavigate: (id: any) => void;
  openAssign: (reqId: string) => void;
  addToast: (type: any, title: string, desc: string) => void;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
}

export default function Dashboard({ donors, onNavigate, openAssign, currentLang, setCurrentLang, addToast }: DashboardProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* HUD Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HudCard 
          icon={<AlertTriangle size={18} />} 
          label="Active Alerts" 
          val={INITIAL_REQS.length} 
          sub="3 Critical" 
          col="var(--blood)" 
        />
        <HudCard 
          icon={<Users size={18} />} 
          label="Donor Fleet" 
          val={donors.length} 
          sub="12 Available" 
          col="var(--green)" 
        />
        <HudCard 
          icon={<Zap size={18} />} 
          label="AI Efficiency" 
          val="98.4%" 
          sub="-0.2ms Latency" 
          col="var(--blue)" 
        />
        <HudCard 
          icon={<TrendingUp size={18} />} 
          label="Throughput" 
          val="242" 
          sub="Units/Day" 
          col="var(--gold)" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: ACTIVE REQUESTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-outer bento-glow">
            <div className="card-hd">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[var(--blue)]" />
                <div className="text-sm font-black uppercase tracking-widest text-[var(--t1)]">Neural Dispatch Queue</div>
              </div>
              <button 
                onClick={() => onNavigate('req')}
                className="text-[10px] font-black uppercase tracking-widest text-[var(--blue)] flex items-center gap-1 hover:brightness-125 transition-all"
              >
                Full Queue <ChevronRight size={12} />
              </button>
            </div>
            
            <div className="divide-y divide-[var(--b)]">
              {INITIAL_REQS.slice(0, 4).map((req) => (
                <div key={req.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg3)] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${req.urg === 'critical' ? 'bg-[var(--blood-alpha-20)] text-[var(--blood)] shadow-[0_0_15px_var(--blood-alpha-10)]' : 'bg-[var(--bg4)] text-[var(--t2)]'}`}>
                      {req.bg}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--t1)]">{req.id} · {req.pat}</div>
                      <div className="text-[10px] font-mono text-[var(--t3)] uppercase tracking-wider">{req.hosp} · {req.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block">
                      <div className="text-[10px] font-black uppercase text-[var(--t3)] tracking-widest mb-0.5">Tactical Fit</div>
                      <div className="text-xs font-mono font-black text-[var(--blue)]">{req.score}%</div>
                    </div>
                    <button 
                      onClick={() => openAssign(req.id)}
                      className="px-4 py-2 bg-[var(--bg4)] border border-[var(--b)] rounded-lg text-[10px] font-black uppercase tracking-widest text-[var(--t1)] hover:border-[var(--blue)] hover:text-[var(--blue)] transition-all flex items-center gap-2 group-hover:bg-[var(--bg2)]"
                    >
                      Assign <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-outer p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--t3)]">
                <Activity size={14} className="text-[var(--blue)]" /> Telemetry Feed
              </div>
              <div className="space-y-4">
                {INITIAL_FEED.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.col }}></div>
                      <div className="w-0.5 flex-1 bg-[var(--b)]"></div>
                    </div>
                    <div className="space-y-0.5 pb-1">
                      <div className="text-[11px] font-black text-[var(--t1)]">{item.t} <span className="text-[var(--t3)] font-mono font-normal ml-2">{item.time}</span></div>
                      <div className="text-[10px] text-[var(--t2)] leading-relaxed font-medium">{item.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

              <div className="card-outer p-5 bg-[var(--blue-alpha-5)] border-[var(--blue-alpha-20)] relative overflow-hidden">
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-[var(--blue)] opacity-[0.03] blur-3xl rounded-full"></div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--blue)]">
                      <Zap size={14} /> Synthetic Ops
                    </div>
                    {/* EMERGENCY BUTTON REQUESTED BY USER */}
                    <button 
                      onClick={() => {
                        addToast('error', '🚨 EMERGENCY ACTIVATED', 'Sector alert broadcasted to all O- donors.');
                        onNavigate('req');
                      }}
                      className="px-3 py-1 bg-[var(--blood-alpha-20)] border border-[var(--blood-alpha-30)] text-[var(--blood)] text-[8px] font-black uppercase rounded-lg hover:bg-[var(--blood)] hover:text-white transition-all animate-pulse"
                    >
                      Instant Alert
                    </button>
                  </div>
                  <div className="text-[28px] font-black tracking-tight leading-tight text-[var(--t1)]">Optimization Engine is <span className="text-[var(--blue)]">Active</span></div>
                  <p className="text-xs text-[var(--t2)] leading-relaxed font-medium">Cross-referencing 28 donors against 5 urgent requests. Expected fulfillment: <span className="font-bold text-[var(--t1)] underline decoration-[var(--blue)] decoration-2 underline-offset-4">88%</span> within 25 minutes.</p>
                  <button 
                    onClick={() => {
                      addToast('success', '⚡ Sector Recalibrated', 'Optimization vectors re-aligned for maximum efficiency.');
                    }}
                    className="w-full py-3 bg-[var(--blue)] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_5px_15px_var(--blue-alpha-20)] hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    Recalibrate Sector
                  </button>
                </div>
              </div>
          </div>
        </div>

        {/* Right Column: SUPPLY HUD */}
        <div className="space-y-6">
          <div className="card-outer p-5 space-y-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--t3)]">
              <Droplets size={14} className="text-[var(--blood)]" /> Strategic Supply
            </div>
            
            <div className="space-y-3">
              {Object.entries(BG_AVAIL_DATA).map(([bg, data]) => {
                const count = (data as any).count;
                const isLow = count <= 2;
                return (
                  <div key={bg} className="space-y-1.5">
                    <div className="flex justify-between items-end">
                      <div className="text-[11px] font-black text-[var(--t1)] flex items-center gap-2">
                        {bg} 
                        {isLow && <span className="text-[8px] px-1.5 py-0.5 bg-[var(--blood-alpha-10)] text-[var(--blood)] rounded border border-[var(--blood-alpha-20)]">LOW SUPPLY</span>}
                      </div>
                      <div className="text-[10px] font-mono text-[var(--t3)] font-black uppercase">{count} Unit{count > 1 ? 's' : ''}</div>
                    </div>
                    <div className="h-1.5 bg-[var(--bg4)] rounded-full overflow-hidden border border-[var(--b)]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / 10) * 100}%` }}
                        className={`h-full rounded-full ${isLow ? 'bg-[var(--blood)] shadow-[0_0_10px_var(--blood-alpha-40)]' : 'bg-[var(--blue)] opacity-60'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[var(--b)]">
               <div className="flex items-center justify-between p-3 bg-[var(--bg4)] rounded-xl border border-[var(--b)] group cursor-pointer hover:border-[var(--blue)] transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-[var(--gold-alpha-10)] text-[var(--gold)] flex items-center justify-center">
                        <TrendingUp size={16} />
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-[var(--t1)] uppercase tracking-wide">Historical Insights</div>
                        <div className="text-[9px] text-[var(--t3)] font-bold">Grid efficiency up 12% MoM</div>
                     </div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--t3)] group-hover:text-[var(--blue)] transition-all" />
               </div>
            </div>
          </div>

          <div className="card-outer overflow-hidden">
             <div className="p-5 border-b border-[var(--b)] flex items-center justify-between">
                <div className="text-xs font-black uppercase tracking-widest text-[var(--t3)]">Top Responders</div>
                <Users size={14} className="text-[var(--green)]" />
             </div>
             <div className="divide-y divide-[var(--b)]">
                {donors.slice(0, 3).map((d) => (
                  <div key={d.id} className="p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg4)] border border-[var(--b)] text-[10px] font-black flex items-center justify-center text-[var(--t1)]">
                           {d.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                           <div className="text-[11px] font-black text-[var(--t1)]">{d.name}</div>
                           <div className="text-[9px] text-[var(--t3)] font-bold">{d.loc}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] font-mono font-black text-[var(--blue)]">{d.score}%</div>
                        <div className="text-[8px] text-[var(--t3)] font-black uppercase">Tactical Match</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HudCard({ icon, label, val, sub, col }: any) {
  return (
    <div className="card-outer p-4 flex items-center gap-4 hover:translate-y-[-2px] transition-all cursor-default">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${col}15`, color: col }}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-black text-[var(--t3)] uppercase tracking-widest mb-0.5">{label}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-xl font-black text-[var(--t1)] leading-none">{val}</div>
          <div className="text-[9px] font-bold text-[var(--t2)] uppercase tracking-tight">{sub}</div>
        </div>
      </div>
    </div>
  );
}

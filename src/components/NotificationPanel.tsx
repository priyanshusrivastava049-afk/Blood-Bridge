import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Smartphone, Bell, Clock, CheckCircle, AlertCircle, MapPin, Zap, ChevronRight, Navigation } from 'lucide-react';
import { ScreenId } from '../types';

interface NotificationPanelProps {
  onRespond: (resp: 'yes' | 'no') => void;
  notifStatus: any[];
}

export default function NotificationPanel({ onRespond, notifStatus }: NotificationPanelProps) {
  const [escTime, setEscTime] = useState(8 * 60);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setEscTime(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setClock(n.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    const t = setInterval(tick, 1000);
    tick();
    return () => clearInterval(t);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="screen on grid-dots">
      <div className="ph anim">
        <div className="flex-1">
          <div className="ph-title uppercase tracking-tighter">Mission Lifecycle</div>
          <div className="ph-sub flex items-center gap-2 mt-1 uppercase tracking-widest text-[10px] font-black">
            Transmission Status
            <span className="w-1 h-1 rounded-full bg-[var(--t3)]"></span>
            Auto-Escalation Engine Active
          </div>
        </div>
      </div>

      <div className="g2e anim a1">
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card overflow-hidden"
          >
            <div className="ch">
              <div className="ch-title flex items-center gap-2">
                <span className="text-xs font-black font-mono text-[var(--blood)]">REQ-001</span>
                <span className="text-[var(--t3)]">/</span>
                <span className="text-xs font-black uppercase tracking-widest">Active Incident</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[var(--blood-alpha-10)] text-[var(--blood)] border border-[var(--blood-alpha-20)] uppercase tracking-widest animate-pulse">Critical Priority</span>
            </div>
            <div className="cb p-6 flex flex-col gap-6">
              <div className="p-4 rounded-xl bg-[var(--bg3)] border border-[var(--b)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Droplets size={48} className="text-[var(--blood)]" />
                </div>
                <div className="text-[10px] text-[var(--t3)] mb-2 font-black font-mono uppercase tracking-widest">Target Facility</div>
                <div className="text-xl font-black text-[var(--t1)] tracking-tight">AIIMS Delhi</div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--blood-alpha-10)] text-[var(--blood)] grid place-items-center font-black text-xs border border-[var(--blood-alpha-20)]">O−</div>
                    <span className="text-xs font-bold text-[var(--t2)] tracking-tight">Requirement: 2 Units</span>
                  </div>
                  <div className="w-px h-4 bg-[var(--b)]"></div>
                  <div className="flex items-center gap-2 text-[var(--t3)] font-black text-[10px] uppercase tracking-widest">
                    <Clock size={12} />
                    ETA Goal: &lt;15m
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 relative">
                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[var(--b)] border-dashed border-l border-[var(--b2)]"></div>
                <StatusStep label="Transmission Authorized" sub="AI Cluster Dispatch Initiated" time="14:22" isDone />
                <StatusStep label="Neural Matching Verified" sub="Top 3 compatible donors alerted" time="14:22" isDone />
                <StatusStep 
                  label="Direct Notification (L1)" 
                  sub={notifStatus[0]?.status === 'notified' ? `Escalation window: ${formatTime(escTime)}` : "Donor confirmed"} 
                  time="LIVE" 
                  isActive={notifStatus[0]?.status === 'notified'} 
                  isDone={notifStatus[0]?.status === 'confirmed' || notifStatus[0]?.status === 'declined'} 
                />
                <StatusStep 
                  label="Deployment Logistics" 
                  sub={notifStatus[0]?.status === 'confirmed' ? "Courier/Donor en route" : "Awaiting response"} 
                  time={notifStatus[0]?.status === 'confirmed' ? "14:35" : "—"} 
                  isActive={notifStatus[0]?.status === 'confirmed'} 
                />
              </div>

              {/* BLOCKCHAIN AUDIT TRAIL */}
              <div className="mt-4 pt-4 border-t border-[var(--b)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-[var(--t3)] uppercase tracking-widest">Immutable Audit Trail</span>
                  <div className="blockchain-badge">
                    <Shield size={8} />
                    Verified on Polygon
                  </div>
                </div>
                <div className="bg-[var(--bg4)] rounded-lg p-3 font-mono text-[9px] text-[var(--t3)] overflow-hidden transition-all hover:text-[var(--t2)] cursor-help">
                  <div className="flex justify-between border-b border-[var(--b)] pb-1 mb-1">
                    <span>HASH_ROOT:</span>
                    <span className="text-[var(--blue)]">0x7a2...4f1e</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--b)] pb-1 mb-1">
                    <span>CUSTODY_TEMP:</span>
                    <span className="text-[var(--green)]">4.2°C (STABLE)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UNIT_SERIAL:</span>
                    <span>BB-992-TX</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="ch">
              <div className="ch-title uppercase text-[10px] font-black tracking-[0.2em] text-[var(--t2)]">Donor Pipeline</div>
              <div className="text-[10px] font-mono text-[var(--t3)] font-bold uppercase tracking-tighter">Transmission Registry</div>
            </div>
            <div className="cb flex flex-col gap-3">
              {notifStatus.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg3)] border border-[var(--b)] hover:border-[var(--b2)] transition-all">
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg2)] border border-[var(--b)] grid place-items-center font-black text-xs text-[var(--t1)]">{d.bg}</div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-[var(--t1)] tracking-tight">{d.name}</div>
                    <div className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                      <Navigation size={10} className="text-[var(--blue)]" />
                      {d.dist} vector distance
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                    d.status === 'confirmed' ? 'bg-[var(--green-alpha-10)] text-[var(--green)] border border-[var(--green-alpha-20)]' : 
                    d.status === 'declined' ? 'bg-[var(--blood-alpha-10)] text-[var(--blood)] border border-[var(--blood-alpha-20)]' : 
                    'bg-[var(--bg4)] text-[var(--t3)] border border-[var(--b)]'
                  }`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* MOCK HARDWARE INTERFACE */}
        <div className="flex flex-col gap-6">
          <div className="text-[10px] text-[var(--t3)] font-black uppercase tracking-[0.2em] mb-2 px-2 flex items-center gap-2">
            <Smartphone size={12} className="text-[var(--blue)]" />
            Field Ops Emulator
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-[var(--blue-alpha-5)] rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="mobile-frame shadow-blue-glow border-[12px] border-[var(--bg2)] rounded-[42px] overflow-hidden">
              <div className="mf-statusbar px-6 py-4 flex items-center justify-between text-[10px] font-bold text-[var(--t2)] font-mono border-b border-[var(--b)]">
                <span className="text-[var(--blue)] flex items-center gap-1"><Zap size={10} fill="currentColor" /> CORE OS</span>
                <span>{clock} IST</span>
              </div>
              <div className="mf-body p-5 bg-[var(--bg3)] min-h-[460px]">
                <AnimatePresence mode="wait">
                  {notifStatus[0]?.status === 'notified' ? (
                    <motion.div 
                      key="alert"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="notif-card glass shadow-lg border border-[var(--blood-alpha-20)]"
                    >
                      <div className="notif-app text-[9px] font-black text-[var(--blood)] p-2 border-b border-[var(--blood-alpha-10)] flex items-center gap-2">
                        <AlertCircle size={10} /> PRIORITY OVERRIDE
                      </div>
                      <div className="p-5">
                        <div className="notif-title text-xl font-black text-[var(--t1)] tracking-tighter mb-2">O− EMERGENCY</div>
                        <div className="notif-body text-xs text-[var(--t2)] leading-relaxed mb-6">
                          AIIMS Delhi req: 2 units O−. You are the <strong className="text-[var(--t1)]">primary tactical match</strong> at d=1.8km. Critical trauma response required.
                        </div>
                        <div className="notif-btns flex flex-col gap-2">
                          <button className="btn btn-blood w-full py-4 uppercase font-black tracking-tight" onClick={() => onRespond('yes')}>
                            ✓ Accept Mission
                          </button>
                          <button className="text-[10px] font-black text-[var(--t3)] uppercase tracking-widest hover:text-[var(--t1)] transition-colors py-2" onClick={() => onRespond('no')}>
                            Decline Deployment
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : notifStatus[0]?.status === 'confirmed' ? (
                    <motion.div 
                      key="confirmed"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="notif-card glass shadow-blue-glow border border-[var(--green-alpha-20)]"
                    >
                      <div className="notif-app text-[9px] font-black text-[var(--green)] p-2 border-b border-[var(--green-alpha-10)] flex items-center gap-2">
                        <CheckCircle size={10} /> TRANSMISSION SECURE
                      </div>
                      <div className="p-5">
                        <div className="notif-title text-[var(--t1)] text-xl font-black tracking-tighter mb-4">You're Active.</div>
                        <div className="notif-body text-xs text-[var(--t2)] leading-relaxed mb-6">
                          Guidance locked. Dr. Sharma (AIIMS) expects arrival in <strong className="text-[var(--green)]">12 minutes</strong>. Emergency channel: +91 91234 56789.
                        </div>
                        <div className="p-4 bg-[var(--green-alpha-10)] rounded-xl border border-[var(--green-alpha-20)] flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-[var(--green)] uppercase">ETA EST</span>
                            <span className="text-lg font-black text-[var(--t1)]">12m</span>
                          </div>
                          <Navigation size={20} className="text-[var(--green)]" />
                        </div>
                        
                        <div className="mt-8">
                          <div className="text-[9px] font-black text-[var(--t3)] uppercase tracking-widest mb-4">The Journey</div>
                          <div className="flex flex-col gap-0 relative">
                            <JourneyStep label="Donation Confirmed" sub="Digital handshake complete" done />
                            <JourneyStep label="En Route to Facility" sub="Vector locked: Delhi Central" active />
                            <JourneyStep label="Lab Verification" sub="Biometric safety sweep" />
                            <JourneyStep label="Recipient Infusion" sub="Mission Success" />
                          </div>
                        </div>

                        <div className="mt-4 p-4 border border-dashed border-[var(--b)] rounded-xl flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-lg grid place-items-center p-1">
                            <div className="w-full h-full border-2 border-black grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5">
                              {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className={`bg-black ${i % 3 === 0 ? 'opacity-30' : ''}`}></div>)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] font-black text-[var(--t1)] uppercase">Digital Certificate</div>
                            <div className="text-[8px] font-bold text-[var(--t3)] uppercase tracking-widest">Scan to verify unit BB-992</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      className="text-center py-20"
                    >
                      <Bell size={32} className="mx-auto mb-4 text-[var(--t3)] opacity-40" />
                      <div className="text-[10px] font-black text-[var(--t3)] uppercase tracking-widest">No Active Missions</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="mt-auto pt-10 text-center">
                  <div className="w-12 h-1 bg-[var(--bg4)] rounded-full mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusStep({ label, sub, time, isDone, isActive }: any) {
  return (
    <div className={`flex items-start gap-4 py-3 relative group transition-all ${isDone ? 'opacity-100' : isActive ? 'opacity-100' : 'opacity-40'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all border-2 ${
        isDone ? 'bg-[var(--green)] border-[var(--green)] text-white' : 
        isActive ? 'bg-[var(--bg2)] border-[var(--blood)] text-[var(--blood)]' : 
        'bg-[var(--bg3)] border-[var(--b)] text-[var(--t3)]'
      }`}>
        {isDone ? <CheckCircle size={14} /> : isActive ? <Zap size={14} fill="currentColor" /> : <div className="w-1.5 h-1.5 rounded-full bg-[var(--t3)]" />}
      </div>
      <div className="flex-1">
        <div className={`text-xs font-black tracking-tight ${isActive ? 'text-[var(--t1)]' : 'text-[var(--t2)]'}`}>{label}</div>
        <div className="text-[10px] font-medium text-[var(--t3)] leading-tight mt-0.5">{sub}</div>
      </div>
      <div className="text-[10px] font-mono font-bold text-[var(--t3)] mt-0.5">{time}</div>
    </div>
  );
}

function JourneyStep({ label, sub, done, active }: any) {
  return (
    <div className={`journey-step ${done ? 'done' : active ? 'active' : ''}`}>
      <div className={`text-[11px] font-black tracking-tight ${active ? 'text-[var(--t1)]' : done ? 'text-[var(--t2)]' : 'text-[var(--t3)]'}`}>{label}</div>
      <div className="text-[9px] font-bold text-[var(--t3)] uppercase tracking-wider">{sub}</div>
    </div>
  );
}

function Droplets(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4.5-8-4.5-8s-4.5 4.7-4.5 8c0 2.2 1.8 4 4 4Z"/>
      <path d="M17 14.3c1.6 0 3-1.4 3-3 0-2.5-3.5-6-3.5-6s-3.5 3.5-3.5 6c0 1.6 1.4 3 3 3Z"/>
    </svg>
  );
}

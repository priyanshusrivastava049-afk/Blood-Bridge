import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, PlusCircle, User, Phone, Droplets, Navigation, Clock, ShieldCheck, ShieldAlert, ChevronDown, X, Activity, Smartphone } from 'lucide-react';
import { BloodGroup } from '../types';
import { INITIAL_DONORS } from '../constants';
import { TRANSLATIONS } from '../i18n';

interface DonorPortalProps {
  onRegister: (data: any) => void;
  currentLang: string;
}

export default function DonorPortal({ onRegister, currentLang }: DonorPortalProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;
  const [formData, setFormData] = useState({
    name: '',
    ph: '',
    bg: 'O+' as BloodGroup,
    city: '',
    last: ''
  });
  const [isAvailable, setIsAvailable] = useState(true);
  const [unavailableReason, setUnavailableReason] = useState('Personal conflict');
  const [showReasonPicker, setShowReasonPicker] = useState(false);

  const REASONS = [
    'Out of town',
    'Medical reasons',
    'Personal conflict',
    'Recent donation',
    'Travel restrictions'
  ];

  return (
    <div className="screen on grid-dots">
      <div className="ph anim">
        <div className="flex-1">
          <div className="ph-title">{t.donor_title}</div>
          <div className="ph-sub flex items-center gap-2 mt-1">
            Global Respository Management
            <span className="w-1 h-1 rounded-full bg-[var(--t3)]"></span>
            Blockchain Verified Stats
          </div>
        </div>
        <div className="ph-acts">
          <button className="btn btn-blood btn-sm"><PlusCircle size={14} /> {t.enrollment}</button>
        </div>
      </div>

      <div className="dr-layout anim a1">
        <div className="flex flex-col gap-6">
          {/* LIVE STATUS CARD */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card glass ${isAvailable ? 'shadow-blue-glow border-[var(--blue-alpha-40)]' : 'opacity-80'}`}
          >
            <div className="cb p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isAvailable ? 'bg-[var(--blue-alpha-10)] text-[var(--blue)]' : 'bg-[var(--bg4)] text-[var(--t3)]'}`}>
                  {isAvailable ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[var(--t1)] uppercase tracking-tight">{t.avail_status}</span>
                    {isAvailable && (
                      <span className="px-1.5 py-0.5 rounded bg-[var(--green-alpha-10)] text-[8px] font-black text-[var(--green)] uppercase tracking-widest border border-[var(--green-alpha-20)]">Active</span>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-[var(--t2)] uppercase tracking-widest mt-0.5">
                    {isAvailable ? 'Visible to emergency coordinators' : 'Hidden from tactical search'}
                  </div>
                  {!isAvailable && (
                    <div 
                      className="mt-2 flex items-center gap-1.5 cursor-pointer group"
                      onClick={() => setShowReasonPicker(true)}
                    >
                      <div className="text-[9px] font-black font-mono text-[var(--t3)] uppercase tracking-widest px-1.5 py-0.5 bg-[var(--bg4)] rounded border border-[var(--b)] group-hover:border-[var(--t3)] transition-colors">
                        Reason: {unavailableReason}
                      </div>
                      <ChevronDown size={10} className="text-[var(--t3)]" />
                    </div>
                  )}
                </div>
              </div>
              
              <div 
                className={`w-16 h-8 rounded-full relative cursor-pointer transition-all p-1 ${isAvailable ? 'bg-[var(--blue)]' : 'bg-[var(--bg5)]'}`}
                onClick={() => {
                  setIsAvailable(!isAvailable);
                  if (isAvailable) setShowReasonPicker(true);
                }}
              >
                <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                  <span className={`text-[7px] font-black text-white transition-opacity ${isAvailable ? 'opacity-100' : 'opacity-0'}`}>ON</span>
                  <span className={`text-[7px] font-black text-white transition-opacity ${!isAvailable ? 'opacity-100' : 'opacity-0'}`}>OFF</span>
                </div>
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg relative z-10"
                  animate={{ x: isAvailable ? 32 : 0 }}
                />
              </div>
            </div>
            {isAvailable && (
              <div className="scan-line h-0.5 bg-[var(--blue-alpha-20)] w-full block"></div>
            )}
          </motion.div>

          {/* REASON PICKER MODAL */}
          <AnimatePresence>
            {showReasonPicker && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mo-overlay z-[100]"
                onClick={() => setShowReasonPicker(false)}
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="card glass w-[320px] p-0 overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="ch border-[var(--b)] p-4 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-[var(--t1)]">Specify Inactivity Reason</span>
                    <button onClick={() => setShowReasonPicker(false)} className="text-[var(--t3)] hover:text-[var(--t1)]">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="cb p-2 flex flex-col gap-1">
                    {REASONS.map(r => (
                      <button 
                        key={r}
                        onClick={() => {
                          setUnavailableReason(r);
                          setShowReasonPicker(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg text-[11px] font-bold transition-all ${unavailableReason === r ? 'bg-[var(--blue-alpha-10)] text-[var(--blue)] border border-[var(--blue-alpha-20)]' : 'text-[var(--t2)] hover:bg-[var(--bg3)] text-[var(--t3)]'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
          <div className="ch">
            <div className="ch-title flex flex-col items-start gap-1">
              <span className="text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em] font-mono">Registry Form</span>
              <span className="text-lg font-black tracking-tight">Identity & Biometrics</span>
            </div>
          </div>
          <div className="cb flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-6">
              <FormGroup label="Full Legal Name" icon={<User size={14} />}>
                <input className="finp" placeholder="Individual's name" type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </FormGroup>
              <FormGroup label="Secure Comms Unit" icon={<Phone size={14} />}>
                <input className="finp" placeholder="+91 XXXXX XXXXX" type="tel" value={formData.ph} onChange={e => setFormData({ ...formData, ph: e.target.value })} />
              </FormGroup>
            </div>

            <FormGroup label="Antigen Specification (Blood Group)" icon={<Droplets size={14} />}>
              <div className="bg-picker">
                {(['O−', 'O+', 'A−', 'A+', 'B−', 'B+', 'AB−', 'AB+'] as BloodGroup[]).map(bg => (
                  <motion.div 
                    key={bg} 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-opt py-3 ${formData.bg === bg ? 'sel-bg' : ''}`} 
                    onClick={() => setFormData({ ...formData, bg })}
                  >
                    {bg}
                  </motion.div>
                ))}
              </div>
            </FormGroup>

            <div className="grid grid-cols-2 gap-6">
              <FormGroup label="Operational Sector (City)" icon={<Navigation size={14} />}>
                <input className="finp" placeholder="Connaught Place, Delhi" type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
              </FormGroup>
              <FormGroup label="Last Contribution Cycle" icon={<Clock size={14} />}>
                <input className="finp" type="date" value={formData.last} onChange={e => setFormData({ ...formData, last: e.target.value })} />
              </FormGroup>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg3)] border border-[var(--b)] group hover:border-[var(--blue-alpha-40)] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs font-black tracking-tight text-[var(--t1)]">Availability Signal</div>
                  <div className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest">Toggle real-time discovery</div>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${isAvailable ? 'bg-[var(--blue)]' : 'bg-[var(--bg5)]'}`}
                  onClick={() => setIsAvailable(!isAvailable)}
                >
                  <motion.div 
                    animate={{ x: isAvailable ? 26 : 2 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md"
                  />
                </div>
              </div>
              <div className={`p-4 rounded-xl text-xs font-bold leading-relaxed ${isAvailable ? 'bg-[var(--blue-alpha-10)] text-[var(--blue)]' : 'bg-[var(--bg4)] text-[var(--t3)]'}`}>
                {isAvailable ? "PROTOCOL AKTIV: You will be visible to emergency responders within your operational sector." : "PROTOCOL SILENT: Your profile is hidden from the tactical network."}
              </div>
            </div>

            <button className="btn btn-blood w-full py-4 text-base font-black tracking-tight mt-2" onClick={() => onRegister({ ...formData, isAvailable })}>
              <Heart size={18} fill="white" />
              AUTHENTICATE ENROLLMENT
            </button>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card glass shadow-blue-glow"
          >
            <div className="ch border-none">
              <div className="ch-title uppercase text-[10px] font-black tracking-[0.2em] text-[var(--blue)]">Network Vitality</div>
            </div>
            <div className="cb flex flex-col gap-4">
              <div className="flex items-end gap-1">
                <div className="text-4xl font-black text-[var(--t1)] tracking-tighter">2,842</div>
                <div className="text-xs font-black text-[var(--green)] mb-1.5 uppercase tracking-widest">Online</div>
              </div>
              <div className="text-[11px] font-bold text-[var(--t2)] leading-relaxed">
                Our global neural network has verified <span className="text-[var(--t1)]">42 new donors</span> in Delhi in the last 24 cycles.
              </div>
              <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-[var(--bg5)] mt-2">
                <div className="w-[60%] h-full bg-[var(--blue)]"></div>
                <div className="w-[15%] h-full bg-[var(--blood)]"></div>
                <div className="w-[25%] h-full bg-[var(--gold)]"></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="ch">
              <div className="ch-title uppercase text-[10px] font-black tracking-[0.2em] text-[var(--gold)]">Elite Achievement Tiers</div>
            </div>
            <div className="cb p-4">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <Badge icon="🛡️" label="Guardian" desc="5+ Saves" active />
                <Badge icon="🩸" label="Lifesaver" desc="10+ Units" active />
                <Badge icon="⚡" label="Tactical" desc="&lt;10m Ready" active />
                <Badge icon="💎" label="Legend" desc="O− Rare" />
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--b)]">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--t3)] mb-2">
                  <span>Impact Progress</span>
                  <span>780 XP</span>
                </div>
                <div className="h-1.5 bg-[var(--bg5)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--gold)] w-[75%] rounded-full shadow-[0_0_8px_var(--gold-alpha-10)]"></div>
                </div>
                <div className="text-[11px] font-bold text-[var(--t2)] mt-3">
                  "Your last donation at AIIMS Delhi saved 3 lives. <span className="text-[var(--gold)]">90 XP to Legend Tier</span>"
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="card glass-blue overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={60} />
            </div>
            <div className="ch">
              <div className="ch-title uppercase text-[10px] font-black tracking-[0.2em] text-[var(--blue)]">Biometric Synchronization</div>
            </div>
            <div className="cb">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg3)] border border-[var(--b)] grid place-items-center text-[var(--blue)]">
                  <Smartphone size={24} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black text-[var(--t1)]">Apple Health / Google Fit</div>
                  <div className="text-[10px] font-bold text-[var(--green)] uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]"></span>
                    ACTIVE_SYNC
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[var(--bg3)] border border-[var(--b)]">
                  <div className="text-[9px] font-bold text-[var(--t3)] uppercase mb-1">Resting HR</div>
                  <div className="text-lg font-black text-[var(--t1)]">72 BPM</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg3)] border border-[var(--b)]">
                  <div className="text-[9px] font-bold text-[var(--t3)] uppercase mb-1">Fitness Level</div>
                  <div className="text-[10px] font-black text-[var(--green)]">OPTIMAL</div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[var(--blue-alpha-10)] border border-[var(--blue-alpha-20)] text-[10px] font-bold text-[var(--blue)] leading-tight text-center">
                System verifies physical fitness for donation cycles.
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="ch"><div className="ch-title uppercase text-[10px] font-black tracking-[0.2em]">Live Registry</div></div>
            <div className="cb flex flex-col gap-3">
              {INITIAL_DONORS.slice(0, 4).map(d => (
                <div key={d.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg3)] transition-colors">
                  <div className="w-10 h-10 rounded-full border border-[var(--b)] grid place-items-center font-black text-xs bg-[var(--bg2)]">{d.bg}</div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-[var(--t1)]">{d.name}</div>
                    <div className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest">{d.loc}</div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shadow-[0_0_5px_var(--green)]"></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label, desc, active }: any) {
  return (
    <div className={`shrink-0 flex flex-col items-center p-3 rounded-2xl border transition-all ${active ? 'bg-[var(--bg3)] border-[var(--gold-alpha-40)]' : 'bg-[var(--bg2)] border-[var(--b)] opacity-40'}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-[10px] font-black text-[var(--t1)] uppercase tracking-tight">{label}</div>
      <div className="text-[8px] font-bold text-[var(--t3)] uppercase tracking-widest">{desc}</div>
    </div>
  );
}

function FormGroup({ label, icon, children }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-[var(--t2)] uppercase tracking-widest flex items-center gap-2">
        <span className="text-[var(--blue)]">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

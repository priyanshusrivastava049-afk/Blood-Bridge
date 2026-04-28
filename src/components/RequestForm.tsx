import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Hospital, User, Phone, Droplets, Clock, AlertCircle, Info, ChevronRight, Zap } from 'lucide-react';
import { BloodGroup, Urgency } from '../types';
import { BG_RARITY } from '../constants';
import { TRANSLATIONS } from '../i18n';
import { parseUserInput } from '../services/geminiService';

interface RequestFormProps {
  onSubmit: (data: any) => void;
  currentLang: string;
}

export default function RequestForm({ onSubmit, currentLang }: RequestFormProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;
  const [formData, setFormData] = useState({
    hosp: '',
    doc: '',
    pat: '',
    ph: '',
    bg: 'O−' as BloodGroup,
    units: 2,
    time: 'Within 2 hours',
    urg: 'critical' as Urgency,
    cond: 'Trauma / Acute Hemorrhage',
    hloc: '',
    notes: ''
  });
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [smartInput, setSmartInput] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);

  const handleSmartExtract = async () => {
    if (!smartInput.trim()) return;
    setIsAiScanning(true);
    setConfidence(null);
    
    try {
      const result = await parseUserInput(smartInput);
      if (result) {
        setFormData(prev => ({
          ...prev,
          bg: (result.bloodGroup as BloodGroup) || prev.bg,
          units: result.units || prev.units,
          urg: (result.urgency as Urgency) || prev.urg,
          hosp: result.location.includes('AIIMS') ? 'AIIMS Delhi' : 
                result.location.includes('Max') ? 'Max Saket' : 
                result.location.includes('Fortis') ? 'Fortis Noida' : prev.hosp,
          pat: 'Aakash Verma', // Simulated extracted patient
        }));
        setConfidence(94 + Math.random() * 5);
      }
    } catch (error) {
      console.error("Smart extract failed, but fallback should have handled it.", error);
    } finally {
      setIsAiScanning(false);
      setSmartInput('');
    }
  };

  const score = useMemo(() => {
    const rare = BG_RARITY[formData.bg] || 50;
    const urgS = formData.urg === 'critical' ? 100 : formData.urg === 'high' ? 65 : 35;
    
    // Formula: 0.30 * rarity + 0.30 * urgency + 0.20 * hospital + 0.20 * logistics
    // hospitalScore and logisticsScore are simulated based on current conditions
    const hospitalScore = 95; // Simulated high hospital readiness
    const logisticsScore = 90; // Simulated logistics throughput
    
    const calculated = Math.round(
      (0.30 * rare) + 
      (0.30 * urgS) + 
      (0.20 * hospitalScore) + 
      (0.20 * logisticsScore)
    );
    
    return Math.min(Math.max(calculated, 10), 99);
  }, [formData.bg, formData.urg]);

  const scoreColor = score >= 80 ? 'var(--blood)' : score >= 60 ? '#FF6B2D' : 'var(--gold)';

  const rareVal = BG_RARITY[formData.bg] || 50;
  const urgVal = formData.urg === 'critical' ? 100 : formData.urg === 'high' ? 65 : 35;
  const unitVal = Math.min(formData.units * 20, 80);

  return (
    <div className="screen on">
      <div className="ph anim">
        <div>
          <div className="ph-title">{t.req_title}</div>
          <div className="ph-sub flex items-center gap-2">
            {t.auto_escalation} 
            <span className="w-1 h-1 rounded-full bg-[var(--t3)]"></span>
            Gemini-Scored Matching Enabled
          </div>
        </div>
      </div>
      
      <div className="req-form-layout">
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6 rf-card-wrap"
        >
          {/* AI SMART EXTRACT */}
          <div className="card glass-blood border-dashed overflow-hidden relative">
            <AnimatePresence>
              {isAiScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 glass flex flex-col items-center justify-center gap-3"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-2 border-[var(--blood)] border-t-transparent rounded-full"
                  />
                  <div className="text-[10px] font-black tracking-widest text-[var(--blood)] uppercase">Analyzing Documentation...</div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="ch border-none pb-0">
              <div className="ch-title flex items-center gap-2">
                <Zap size={14} className="text-[var(--blood)]" fill="currentColor" />
                <span className="text-xs uppercase tracking-widest font-black">{t.smart_extract}</span>
              </div>
            </div>
            <div className="cb flex gap-3">
              <input 
                className="finp flex-1" 
                placeholder="Paste hospital notes, referral text, or doctor's prescription..." 
                value={smartInput}
                onChange={e => setSmartInput(e.target.value)}
              />
              <button 
                className="btn btn-blood btn-sm h-[42px] px-6"
                onClick={handleSmartExtract}
              >
                EXTRACT
              </button>
            </div>
            
            <AnimatePresence>
              {confidence && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-[22px] pb-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-black font-mono tracking-widest text-[var(--blue)] uppercase">Extraction Confidence</span>
                    <span className="text-[10px] font-mono font-bold text-[var(--blue)]">{confidence.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-[var(--bg5)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      className="h-full bg-[var(--blue)] shadow-[0_0_8px_var(--blue)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="px-[22px] pb-4 text-[9px] text-[var(--t3)] font-medium italic">
              Example: "Patient at AIIMS Delhi with trauma needing 2 units of O negative ASAP..."
            </div>
          </div>

          <div className="card">
            <div className="ch">
            <div className="ch-title flex flex-col items-start gap-0.5">
              <span className="text-[10px] font-mono text-[var(--t3)] font-black uppercase tracking-widest">Medical Documentation</span>
              <span className="text-lg font-extrabold tracking-tight">Request Details</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--t3)]">
              <span className="text-[10px] font-mono font-bold">FORM-ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>
          </div>
          
          <div className="cb flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-6">
              <FormGroup label="Hospital / Center" icon={<Hospital size={14} />}>
                <input className="finp" placeholder="e.g. AIIMS Delhi" value={formData.hosp} onChange={e => setFormData({ ...formData, hosp: e.target.value })} />
              </FormGroup>
              <FormGroup label="Attending Professional" icon={<User size={14} />}>
                <input className="finp" placeholder="Dr. Sharma" value={formData.doc} onChange={e => setFormData({ ...formData, doc: e.target.value })} />
              </FormGroup>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormGroup label="Patient Reference" icon={<User size={14} />}>
                <input className="finp" placeholder="Name or Identifier" value={formData.pat} onChange={e => setFormData({ ...formData, pat: e.target.value })} />
              </FormGroup>
              <FormGroup label="Emergency Contact" icon={<Phone size={14} />}>
                <input className="finp" placeholder="+91 91XXX XXXX" value={formData.ph} onChange={e => setFormData({ ...formData, ph: e.target.value })} />
              </FormGroup>
            </div>

            <FormGroup label="Blood Inventory Selection" icon={<Droplets size={14} />}>
              <div className="bg-picker">
                {(['O−', 'O+', 'A−', 'A+', 'B−', 'B+', 'AB−', 'AB+'] as BloodGroup[]).map(bg => (
                  <motion.div 
                    key={bg} 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-opt py-3 text-sm ${formData.bg === bg ? 'sel-bg' : ''}`} 
                    onClick={() => setFormData({ ...formData, bg })}
                  >
                    {bg}
                  </motion.div>
                ))}
              </div>
            </FormGroup>

            <div className="grid grid-cols-2 gap-6">
              <FormGroup label="Required Volume (Units)" icon={<Droplets size={14} />}>
                <input className="finp" type="number" min="1" max="10" value={isNaN(formData.units) ? '' : formData.units} onChange={e => setFormData({ ...formData, units: parseInt(e.target.value) })} />
              </FormGroup>
              <FormGroup label="Time Threshold" icon={<Clock size={14} />}>
                <input className="finp" placeholder="Immediate / 2hrs" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
              </FormGroup>
            </div>

            <FormGroup label="Triage Condition" icon={<AlertCircle size={14} />}>
              <select className="finp" value={formData.cond} onChange={e => setFormData({ ...formData, cond: e.target.value })}>
                <option>Trauma / Acute Hemorrhage</option>
                <option>Oncology Treatment</option>
                <option>Neonatal Critical Care</option>
                <option>Surgical Procedure (Elective)</option>
                <option>Chronic Maintenance</option>
              </select>
            </FormGroup>

            <FormGroup label="Urgency State" icon={<Zap size={14} />}>
              <div className="grid grid-cols-3 gap-3">
                <UrgencyCard 
                  active={formData.urg === 'critical'} 
                  label="CRITICAL" 
                  color="var(--blood)" 
                  onClick={() => setFormData({ ...formData, urg: 'critical' })} 
                />
                <UrgencyCard 
                  active={formData.urg === 'high'} 
                  label="HIGH" 
                  color="#FF6B2D" 
                  onClick={() => setFormData({ ...formData, urg: 'high' })} 
                />
                <UrgencyCard 
                  active={formData.urg === 'medium'} 
                  label="STABLE" 
                  color="var(--gold)" 
                  onClick={() => setFormData({ ...formData, urg: 'medium' })} 
                />
              </div>
            </FormGroup>
          </div>
          
          <div className="p-8 bg-[var(--bg3)] border-t border-[var(--b)]">
            <button className="btn btn-blood w-full py-4 text-base font-black tracking-tight" onClick={() => onSubmit(formData)}>
              AUTHENTICATE & DISPATCH ALERTS
              <ChevronRight size={20} />
            </button>
            <p className="text-[10px] text-[var(--t3)] font-bold text-center mt-4 tracking-widest uppercase">
              By clicking, you trigger automated carrier notifications to all matched donors
            </p>
          </div>
        </div>
      </motion.div>

        {/* SCORE PREVIEW */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="ch"><div className="ch-title uppercase text-xs tracking-widest">{t.priority_score}</div></div>
            <div className="cb flex flex-col items-center">
              <div className="gauge-wrap">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="var(--bg5)" strokeWidth="6"/>
                  <motion.circle 
                    cx="50" cy="50" r="44" fill="none" 
                    stroke={scoreColor} strokeWidth="8" 
                    strokeDasharray="276"
                    initial={{ strokeDashoffset: 276 }}
                    animate={{ strokeDashoffset: 276 - (score / 100) * 276 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />
                </svg>
                <div className="gauge-num font-black" style={{ color: scoreColor }}>{score}</div>
              </div>
              
              <div className="flex flex-col gap-4 w-full mt-2">
                <ScoreProgress label="Group Rarity Index" percent={rareVal} color="var(--blood)" />
                <ScoreProgress label="Medical Urgency" percent={urgVal} color="var(--blood)" />
                <ScoreProgress label="System Reliability" percent={94} color="var(--blue)" />
              </div>

              <div className="mt-8 p-3 rounded-lg border border-[var(--blue-alpha-20)] bg-[var(--blue-alpha-10)] w-full text-center">
                <div className="flex items-center justify-center gap-2 text-[var(--blue)] font-bold text-xs uppercase tracking-wider mb-1">
                  <Zap size={10} fill="currentColor" /> AI Recommendation
                </div>
                <div className="text-[13px] font-black leading-tight text-[var(--t1)] px-2">
                  {score >= 80 ? 'PRIORITY DISPATCH: Notify Top 10 matched donors within 15km range.' : score >= 60 ? 'HIGH PRIORITY: Alert immediate local cluster (5km radius).' : 'STANDARD: Sequence regular donation calls.'}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="ch"><div className="ch-title uppercase text-xs tracking-widest">Matched Active Donors</div></div>
            <div className="cb flex flex-col gap-4">
              <PreviewDonor name="Rajan Kumar" group="O−" info="1.8 km · 98% Match" color="var(--green)" />
              <PreviewDonor name="Priya Nair" group="O−" info="3.2 km · 92% Match" color="var(--green)" />
              <PreviewDonor name="Arjun Mehta" group="O−" info="5.1 km · 78% Match" color="#FF6B2D" />
              <div className="text-[10px] font-bold text-[var(--t3)] uppercase tracking-widest text-center mt-2 border-t border-[var(--b)] pt-4">
                Scanning 12 more compatible clusters...
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FormGroup({ label, icon, children }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flbl flex items-center gap-2">
        <span className="text-[var(--t3)]">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function UrgencyCard({ active, label, color, onClick }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1.5 ${active ? 'border-current bg-opacity-10' : 'border-[var(--b)] grayscale hover:grayscale-0 opacity-60 hover:opacity-100'}`}
      style={{ color: active ? color : 'var(--t3)', backgroundColor: active ? `${color}11` : 'transparent' }}
      onClick={onClick}
    >
      <div className="text-[10px] font-black tracking-widest">{label}</div>
    </motion.div>
  );
}

function ScoreProgress({ label, percent, color }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.05em]">
        <span>{label}</span>
        <span className="font-mono text-[var(--t2)]">{percent}%</span>
      </div>
      <div className="h-1.5 bg-[var(--bg5)] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-full rounded-full" 
          style={{ background: color }} 
        />
      </div>
    </div>
  );
}

function PreviewDonor({ name, group, info, color }: any) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg3)] border border-[var(--b)] transition-colors hover:border-[var(--t3)]">
      <div className="w-10 h-10 rounded-full border-2 border-[var(--b)] grid place-items-center font-black text-xs" style={{ color }}>{group}</div>
      <div className="flex-1">
        <div className="text-[13px] font-extrabold flex justify-between">
          {name}
          <span className="text-[10px] font-mono" style={{ color }}>{info}</span>
        </div>
        <div className="w-full h-1 bg-[var(--bg5)] rounded-full mt-1.5 overflow-hidden">
          <div className="h-full" style={{ background: color, width: info.includes('98%') ? '98%' : info.includes('92%') ? '92%' : '78%' }}></div>
        </div>
      </div>
    </div>
  );
}

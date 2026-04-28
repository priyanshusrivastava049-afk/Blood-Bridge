import React, { useState } from "react";
import { Loader2, Sparkles, MapPin, Clock, ArrowRight, Droplets, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Hospital } from "../../lib/constants";
import { analyzeSituation, getAIStatus, TriageResult } from "../../services/geminiService";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const urgencyStyle = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  moderate: "bg-yellow-500 text-black",
  low: "bg-green-600 text-white",
};

interface AIRecommendationProps {
  hospitals: Hospital[];
  userLocation: [number, number] | null;
  onSelectHospital: (h: Hospital) => void;
  onRecommendation?: (h: Hospital | null) => void;
}

export default function AIRecommendation({ hospitals, userLocation, onSelectHospital, onRecommendation }: AIRecommendationProps) {
  const [situation, setSituation] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!hospitals?.length || !situation.trim()) return;
    setLoading(true);
    setResult(null);
    if (onRecommendation) onRecommendation(null);

    try {
      const res = await analyzeSituation(situation, bloodGroup, hospitals, userLocation);
      setResult(res);
      const topHospital = hospitals.find(h => h.id === res.recommended_id);
      if (onRecommendation && topHospital) onRecommendation(topHospital);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const status = getAIStatus();

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl shadow-inner-glow relative overflow-hidden group">
        <div className="absolute inset-0 bg-scan-pattern opacity-5" />
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue/10 border border-blue/20 rounded-lg flex items-center justify-center shadow-neon-blue">
               <Cpu size={16} className="text-blue" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue">Cortex Triage</span>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[8px] font-black tracking-[0.1em] border ${
            status === 'online' ? 'bg-green/10 text-green border-green/30' : 'bg-gold/10 text-gold border-gold/30'
          }`}>
            <span className={`w-1 h-1 rounded-full ${status === 'online' ? 'bg-green animate-pulse' : 'bg-gold'}`} />
            {status === 'online' ? 'ACTIVE' : 'STANDBY'}
          </div>
        </div>
        
        <div className="space-y-4 relative z-10">
          <textarea
            placeholder="Describe the medical situation..."
             value={situation}
             onChange={(e) => setSituation(e.target.value)}
             className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[13px] text-white placeholder:text-t3 focus:outline-none focus:border-blue transition-all resize-none shadow-inner bg-clip-padding"
             disabled={loading}
          />
          
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <select 
                value={bloodGroup} 
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black text-white focus:outline-none focus:border-blue transition-all cursor-pointer uppercase tracking-widest"
                disabled={loading}
              >
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg} className="bg-bg">{bg}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-t3">
                <ArrowRight size={14} className="rotate-90" />
              </div>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !hospitals.length || !situation.trim()}
              className="px-8 py-3 bg-blue hover:bg-blue/90 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-neon-blue transition-all disabled:opacity-50 flex items-center gap-2 relative overflow-hidden"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="animate-pulse">Neural Solve...</span>
                </>
              ) : (
                <>Analyze Situation</>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 px-6 py-2 bg-blood/10 border border-blood/20 rounded-2xl">
              <Droplets size={14} className="text-blood animate-pulse" />
              <div className="text-[10px] font-black text-blood uppercase tracking-widest">
                {result.urgency_level} VECTOR DETECTED · {result.blood_advice}
              </div>
            </div>

            <div className="space-y-3">
              {result.ranked.map((rec, idx) => {
                const hospital = hospitals.find(h => h.id === rec.hospital_id);
                if (!hospital) return null;

                return (
                  <motion.div
                    key={rec.hospital_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-white/5 border border-white/10 rounded-[24px] overflow-hidden backdrop-blur-xl transition-all hover:border-blue/40 relative group ${idx === 0 ? 'ring-1 ring-blue/30 shadow-neon-blue' : ''}`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-blue uppercase tracking-[0.2em] mb-1">Rank {idx + 1} Optimus</span>
                          <h4 className="text-sm font-black text-white uppercase italic tracking-tight">{hospital.name}</h4>
                        </div>
                        <div className="text-2xl font-black font-mono text-blue drop-shadow-blue-glow">{rec.tactical_score}%</div>
                      </div>

                      <p className="text-[12px] text-t2 leading-relaxed italic mb-4 opacity-80 border-l border-white/10 pl-3">
                        "{rec.ai_reasoning}"
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-t3">
                            <MapPin size={12} className="text-blue" />
                            {hospital.distance.toFixed(1)}km
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-t3">
                            <Clock size={12} className="text-blue" />
                            {Math.round(hospital.distance * 2.5)}m
                          </div>
                        </div>
                        <button 
                          onClick={() => onSelectHospital(hospital)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue/10 hover:bg-blue hover:text-white border border-blue/20 rounded-xl transition-all"
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest">Deploy</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

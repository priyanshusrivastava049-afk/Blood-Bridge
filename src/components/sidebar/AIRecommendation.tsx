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
  const [result, setResult] = useState<(TriageResult & { hospital?: Hospital }) | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!hospitals?.length) return;
    setLoading(true);
    setResult(null);
    if (onRecommendation) onRecommendation(null);

    try {
      const res = await analyzeSituation(situation, bloodGroup, hospitals, userLocation);
      const hospital = hospitals.find(h => h.id === res.recommended_id);
      
      setResult({ ...res, hospital });
      if (onRecommendation && hospital) onRecommendation(hospital);
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
              disabled={loading || !hospitals.length}
              className="px-8 py-3 bg-blue hover:bg-blue/90 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-neon-blue transition-all disabled:opacity-50 flex items-center gap-2 relative overflow-hidden"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="animate-pulse">Slowing Neural...</span>
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
            className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-neon-blue relative"
          >
            <div className="absolute inset-0 bg-blue/5 animate-pulse-fast pointer-events-none" />
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${urgencyStyle[result.urgency_level]}`}>
                  {result.urgency_level} Vector
                </div>
                <div className="text-[28px] font-black font-mono text-blue drop-shadow-blue-glow italic">{result.tactical_score}% Match</div>
              </div>

              <div className="mb-6">
                <h4 className="text-[9px] font-black text-t3 uppercase tracking-[0.3em] mb-2 opacity-60">Neural Vector Lock</h4>
                <div className="text-xl font-black text-white uppercase tracking-tight italic drop-shadow-sm">{result.hospital?.name}</div>
                <div className="flex items-center gap-3 text-[10px] font-black text-t2 mt-2 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue/10 rounded border border-blue/20">
                    <MapPin size={12} className="text-blue" />
                    {result.hospital?.distance.toFixed(1)}km
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue/10 rounded border border-blue/20">
                    <Clock size={12} className="text-blue" />
                    {Math.round(result.hospital?.distance * 2.5)} min Sync
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-5 border-t border-white/10">
                <p className="text-[14px] text-white font-medium leading-relaxed italic opacity-90 border-l-2 border-blue/40 pl-4">
                  "{result.ai_reasoning}"
                </p>
                
                <div className="flex items-start gap-3 bg-blood/5 p-4 rounded-2xl border border-blood/10 border-dashed">
                  <Droplets size={16} className="text-blood mt-0.5 flex-shrink-0 animate-pulse" />
                  <p className="text-[11px] font-bold text-t2 leading-normal">
                    <span className="text-blood uppercase font-black">Tactical Advice:</span> {result.blood_advice}
                  </p>
                </div>

                <button 
                  onClick={() => onSelectHospital(result.hospital)}
                  className="w-full flex items-center justify-between h-14 px-6 bg-blue/10 hover:bg-blue/20 border border-blue/20 rounded-2xl transition-all group shadow-inner-glow"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Initiate Deployment Path</span>
                  <ArrowRight size={18} className="text-blue group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

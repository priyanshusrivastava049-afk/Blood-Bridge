import React, { useState } from "react";
import { base44 } from "../../api/base44Client";
import { Loader2, RefreshCw, Bed, Activity, Droplets, Wind, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AvailBar({ label, available, total }) {
  const pct = total > 0 ? Math.round((available / total) * 100) : 0;
  const barColor =
    pct > 50 ? "bg-green shadow-neon-green" : pct > 20 ? "bg-gold shadow-neon-gold" : "bg-blood shadow-neon-red";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
        <span className="text-t3">{label}</span>
        <span className={`tabular-nums ${pct > 50 ? "text-green" : pct > 20 ? "text-gold" : "text-blood"}`}>
          {available} / {total}
        </span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </div>
  );
}

function StatusPill({ label, status, icon: IconComp }) {
  const Icon = IconComp;
  const styles = {
    available: "bg-green/10 text-green border-green/30 shadow-[0_0_8px_rgba(0,214,143,0.1)]",
    limited:   "bg-gold/10 text-gold border-gold/30 shadow-[0_0_8px_rgba(255,184,48,0.1)]",
    unavailable: "bg-blood/10 text-blood border-blood/30 shadow-[0_0_8px_rgba(232,0,26,0.1)]",
    unknown:   "bg-white/5 text-t3 border-white/10",
  };
  const labels = { available: "Available", limited: "Limited", unavailable: "Full", unknown: "N/A" };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${styles[status] || styles.unknown} backdrop-blur-md`}>
      {Icon && <Icon size={10} />}
      <span>{label}: {labels[status] || "N/A"}</span>
    </div>
  );
}

export default function BedAvailability({ hospital, compact = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(null);

  const fetchAvailability = async () => {
    setLoading(true);
    const hour = new Date().getHours();
    const timeContext = hour >= 8 && hour < 20 ? "daytime (peak hours)" : "nighttime (off-peak)";

    const prompt = `You are a hospital bed availability estimator for Delhi NCR, India.

Estimate CURRENT bed availability for this hospital based on its known profile.
Do NOT invent precise facts. Use reasonable statistical inference based on hospital type and size.

HOSPITAL PROFILE:
- Name: ${hospital.name}
- Type: ${hospital.hospital_type} (government/private/clinic/unknown)
- Total beds (OSM data): ${hospital.beds ?? "not specified"}
- Emergency status: ${hospital.emergency_status ?? "unknown"}
- Operator: ${hospital.operator || "not specified"}
- Region: ${hospital.region || "Delhi NCR"}
- Current time context: ${timeContext}

ESTIMATION RULES:
1. Government hospitals in Delhi (AIIMS, Safdarjung, RML, Lok Nayak, GTB) are typically 70-90% occupied during day
2. Private hospitals (Max, Fortis, Apollo, Medanta, Artemis) typically 50-75% occupied
3. Clinics have no ICU — set icu_available and icu_total to 0
4. Blood banks exist in most government hospitals and large private hospitals (>200 beds)
5. Ventilators: major hospitals (>300 beds) typically have 15-40; smaller have 5-15
6. All numbers must be plausible — do not output unrealistically high or low numbers
7. If hospital.beds is specified, use it to derive ward breakdown (ICU ~10%, HDU ~15%, general ~75%)
8. Add a realistic "surge_note" if the hospital is known to be frequently overwhelmed

Return ONLY valid JSON, no markdown:
{
  "icu": { "available": <int>, "total": <int> },
  "hdu": { "available": <int>, "total": <int> },
  "general": { "available": <int>, "total": <int> },
  "ventilators": { "available": <int>, "total": <int> },
  "blood_bank": "available|limited|unavailable|unknown",
  "oxygen": "available|limited|unavailable|unknown",
  "overall_status": "available|limited|critical",
  "surge_note": "<one short sentence or null>",
  "confidence": "high|medium|low",
  "disclaimer": "AI estimate only. Call the hospital to confirm."
}`;

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            icu:        { type: "object", properties: { available: { type: "number" }, total: { type: "number" } } },
            hdu:        { type: "object", properties: { available: { type: "number" }, total: { type: "number" } } },
            general:    { type: "object", properties: { available: { type: "number" }, total: { type: "number" } } },
            ventilators:{ type: "object", properties: { available: { type: "number" }, total: { type: "number" } } },
            blood_bank: { type: "string" },
            oxygen:     { type: "string" },
            overall_status: { type: "string" },
            surge_note: { type: "string" },
            confidence: { type: "string" },
            disclaimer: { type: "string" },
          },
        },
      });

      setData(res);
      setFetchedAt(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const overallStyle = {
    available: "text-green-400",
    limited:   "text-yellow-400",
    critical:  "text-red-400",
  };

  if (compact) {
    return (
      <div className="mt-2 border-t border-white/10 pt-3 space-y-3">
        {!data && !loading && (
          <button
            onClick={fetchAvailability}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] text-t2 font-black uppercase tracking-widest shadow-sm"
          >
            <Bed size={12} className="text-blue" />
            Check Availability (AI)
          </button>
        )}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-2 text-[10px] text-t3 uppercase font-black tracking-widest animate-pulse italic">
            <Loader2 size={12} className="animate-spin text-blue" />
            Estimating Neural Vectors...
          </div>
        )}
        {data && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${overallStyle[data.overall_status] || "text-t3"}`}>
                {data.overall_status} <span className="opacity-40">· {data.confidence} CONF</span>
              </span>
              <button onClick={fetchAvailability} className="text-t3 hover:text-white transition-colors">
                <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="space-y-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
              {data.icu?.total > 0 && <AvailBar label="ICU" available={data.icu.available} total={data.icu.total} />}
              {data.hdu?.total > 0 && <AvailBar label="HDU" available={data.hdu.available} total={data.hdu.total} />}
              <AvailBar label="General" available={data.general?.available ?? 0} total={data.general?.total ?? 0} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <StatusPill label="Blood" status={data.blood_bank} icon={Droplets} />
              <StatusPill label="O₂" status={data.oxygen} icon={Wind} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!data && !loading && (
        <button
          onClick={fetchAvailability}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-blue/10 border border-blue/30 hover:bg-blue/20 transition-all text-[11px] text-white font-black uppercase tracking-[0.15em] shadow-blue-glow"
        >
          <Activity size={16} className="text-blue" />
          Neural Capacity Estimation
        </button>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-6 bg-white/5 border border-white/5 rounded-2xl border-dashed">
          <Loader2 size={24} className="animate-spin text-blue" />
          <p className="text-[10px] text-t3 font-black uppercase tracking-[0.2em] animate-pulse">Running Simulation...</p>
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1">
              <div>
                <span className={`text-[12px] font-black uppercase tracking-tighter ${overallStyle[data.overall_status] || "text-t3"}`}>
                  {data.overall_status} SITUATION
                </span>
                <span className="block text-[8px] text-t3 uppercase font-black tracking-widest mt-0.5">
                  Confidence: {data.confidence} · Sync: {fetchedAt ? fetchedAt.toLocaleTimeString() : ""}
                </span>
              </div>
              <button
                onClick={fetchAvailability}
                disabled={loading}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-blue transition-all group"
              >
                <RefreshCw size={14} className={`text-t3 group-hover:text-blue ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="space-y-4 p-5 bg-white/5 rounded-[24px] border border-white/10 backdrop-blur-xl shadow-inner-glow relative overflow-hidden">
               <div className="absolute inset-0 bg-scan-pattern opacity-5 pointer-events-none" />
              {data.icu?.total > 0 && <AvailBar label="Medical ICU" available={data.icu.available} total={data.icu.total} />}
              {data.hdu?.total > 0 && <AvailBar label="Step-down HDU" available={data.hdu.available} total={data.hdu.total} />}
              {data.general?.total > 0 && <AvailBar label="General Ward" available={data.general.available} total={data.general.total} />}
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusPill label="Blood Resource" status={data.blood_bank} icon={Droplets} />
              <StatusPill label="Oxygen Supply" status={data.oxygen} icon={Wind} />
              {data.surge_note && (
                 <div className="w-full mt-2 p-3 bg-blood/5 border border-blood/10 border-dashed rounded-xl flex items-start gap-3">
                    <AlertCircle size={14} className="text-blood shrink-0 mt-0.5" />
                    <p className="text-[10px] text-t2 font-bold italic leading-relaxed">"{data.surge_note}"</p>
                 </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

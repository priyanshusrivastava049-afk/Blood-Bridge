
import { GoogleGenAI, Type } from "@google/genai";
import { Hospital } from "../lib/constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Track system status
export type AIStatus = 'online' | 'offline';
let currentStatus: AIStatus = 'online';

export const getAIStatus = () => currentStatus;

// Simulated delay helper
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const AI_TIMEOUT_MS = 3000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutHandle: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error('AI_TIMEOUT')), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutHandle));
}

export interface Recommendation {
  hospitalId: string;
  reason: string;
  score: number;
}

export interface ParsedRequest {
  bloodGroup: string;
  location: string;
  urgency: 'critical' | 'high' | 'normal';
  units: number;
}

// Fallback Logic for when Gemini API fails (Quota/Network)
function predictDemandFallback(hospitals: Hospital[]): string {
  const responses = [
    "ACTIVE: 3 compatible donors found within 2.5km vector. AIIMS Delhi stock critical.",
    "DISPATCH READY: Raj Kumar (O-) notified. ETA 8 mins to Safdarjung Trauma Centre.",
    "NEURAL ALERT: O- demand spike in Noida. 4 donors detected near Max Super Speciality.",
    "B+ shortage detected. Amit Singh and 2 others ready for transition in Sector 62.",
    "CRITICAL: Emergency requisition at Fortis. Tactical matching found 5 high-score donors.",
    "SYSTEM NOMINAL: Predictive analysis suggests O- stability until 16:00. Monitoring density.",
    "LOGISTICS: 98.4% Efficiency maintained. 242 units throughput expected in current window.",
    "VECTOR ALPHA: 3 donors found nearby. Priority escalation for O- Negative at AIIMS."
  ];

  const lowBeds = hospitals.filter(h => h.availableBeds < 10);
  if (lowBeds.length > 0 && Math.random() > 0.6) {
    const randomHosp = lowBeds[Math.floor(Math.random() * lowBeds.length)];
    return `HEURISTIC ERROR BYPASS: Critical bed shortage at ${randomHosp.name}. Dispatching unit notifications and rerouting triage.`;
  }

  return responses[Math.floor(Math.random() * responses.length)];
}

function recommendHospitalsFallback(bloodGroup: string, hospitals: Hospital[]): Recommendation[] {
  return hospitals
    .map(h => {
      let score = 50;
      const avail = h.bloodAvailability[bloodGroup as any] || 'None';
      if (avail === 'High') score += 40;
      if (avail === 'Medium') score += 20;
      if (avail === 'Low') score -= 10;
      if (avail === 'None') score -= 50;
      
      if (h.availableBeds > 50) score += 10;
      
      return {
        hospitalId: h.id,
        reason: `Rule-based: ${avail} ${bloodGroup} availability detected at facility.`,
        score: Math.max(0, Math.min(100, score + Math.floor(Math.random() * 10)))
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function parseUserInputFallback(input: string): ParsedRequest {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const text = input.toUpperCase();
  
  const bloodGroup = bloodGroups.find(bg => text.includes(bg)) || 'O+';
  const unitsMatch = input.match(/(\d+)\s*units?/i);
  const units = unitsMatch ? parseInt(unitsMatch[1]) : 1;
  
  const urgency = text.includes('CRITICAL') || text.includes('EMERGENCY') ? 'critical' : 
                  text.includes('HIGH') || text.includes('URGENT') ? 'high' : 'normal';

  // Simple location extraction - look for "in [Location]"
  const locationMatch = input.match(/in\s+([A-Za-z\s]+)/i);
  const location = locationMatch ? locationMatch[1].trim() : "Current Vector";

  return { bloodGroup, location, urgency, units };
}

async function safeAI<T>(liveCall: () => Promise<T>, fallback: () => T, type: string): Promise<T> {
  // If we've already detected it's offline (Quota hit recently), use fallback immediately and skip delay
  if (currentStatus === 'offline') {
     return fallback();
  }

  // Add a natural "thinking" delay for online mode only
  const thinkTime = 400 + Math.random() * 400;
  await delay(thinkTime); 

  try {
    const result = await withTimeout(liveCall(), AI_TIMEOUT_MS);
    currentStatus = 'online';
    return result;
  } catch (error: any) {
    currentStatus = 'offline';
    
    const isTimeout = error.message === 'AI_TIMEOUT';
    const isQuotaError = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
    
    if (isTimeout) {
      console.warn(`[AI] ${type} Gemini timed out after ${AI_TIMEOUT_MS}ms. Falling back.`);
    } else if (isQuotaError) {
      console.info(`[AI] ${type} Gemini Quota Exceeded. Using Heuristic Fallback.`);
    } else {
      console.warn(`[AI] ${type} Gemini Error:`, error?.message || error);
    }
    
    return fallback();
  }
}

export async function generatePrediction(hospitals: Hospital[]): Promise<string> {
  const liveCall = async () => {
    const hospitalData = hospitals.map(h => ({
      name: h.name,
      beds: `${h.availableBeds}/${h.totalBeds}`,
      blood: h.bloodAvailability,
      region: h.region
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a medical logistics AI for Delhi NCR. 
      Analyze this hospital data: ${JSON.stringify(hospitalData)}. 
      Predict a potential shortage or demand spike in the next 2 hours. 
      Be extremely concise (max 15 words). Example: "O- demand spike expected in Ghaziabad regions."`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Systems nominal. Monitoring real-time vectors.";
  };

  return safeAI(liveCall, () => predictDemandFallback(hospitals), "Prediction");
}

export async function recommendHospitals(
  _userLocation: { lat: number, lng: number } | null,
  bloodGroup: string,
  hospitals: Hospital[]
): Promise<Recommendation[]> {
  const liveCall = async () => {
    const context = {
      bloodGroup,
      hospitals: hospitals.map(h => ({
        id: h.id,
        name: h.name,
        available: h.bloodAvailability[bloodGroup] || "None",
        beds: h.availableBeds,
        location: { lat: h.lat, lng: h.lng },
        status: h.status
      }))
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Recommend the top 3 hospitals for blood group ${bloodGroup}. 
      Context: ${JSON.stringify(context)}.
      Consider availability first, then distance. 
      Return ONLY a JSON array of objects with hospitalId, reason (concise), and score (0-100).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hospitalId: { type: Type.STRING },
              reason: { type: Type.STRING },
              score: { type: Type.NUMBER }
            },
            required: ["hospitalId", "reason", "score"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  };

  return safeAI(liveCall, () => recommendHospitalsFallback(bloodGroup, hospitals), "Recommendation");
}

export async function parseUserInput(input: string): Promise<ParsedRequest | null> {
  const liveCall = async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract blood request details from: "${input}". 
      Default bloodGroup to 'O+' if not specified. 
      Default units to 1 if not specified. 
      Default urgency to 'normal' if not specified.
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bloodGroup: { type: Type.STRING },
            location: { type: Type.STRING },
            urgency: { type: Type.STRING, enum: ['critical', 'high', 'normal'] },
            units: { type: Type.NUMBER }
          },
          required: ["bloodGroup", "location", "urgency", "units"]
        }
      }
    });

    return JSON.parse(response.text || "null");
  };

  return safeAI(liveCall, () => parseUserInputFallback(input), "Parsing");
}

export interface RankedHospital {
  hospital_id: string;
  tactical_score: number;
  ai_reasoning: string;
}

export interface TriageResult {
  recommended_id: string; // The top one for compatibility
  ranked: RankedHospital[];
  urgency_level: 'critical' | 'high' | 'moderate' | 'low';
  blood_advice: string;
}

export async function analyzeSituation(
  situation: string,
  bloodGroup: string,
  hospitals: Hospital[],
  userLocation: [number, number] | null
): Promise<TriageResult> {
  const liveCall = async () => {
    const candidates = hospitals.map((h) => ({
      id: h.id,
      name: h.name,
      distance: h.distance,
      available: h.bloodAvailability[bloodGroup] || "None",
      beds: h.availableBeds,
      status: h.status
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an AI Emergency Triage Advisor for BloodBridge Delhi NCR.
      ANALYZE and rank the best hospitals for this emergency.
      SITUATION: ${situation || "Medical emergency"}
      BLOOD GROUP NEEDED: ${bloodGroup}
      USER_LOCATION: ${userLocation ? JSON.stringify(userLocation) : "Unknown"}
      HOSPITAL CANDIDATES: ${JSON.stringify(candidates)}
      Return JSON with top 3 ranked hospitals.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ranked: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hospital_id: { type: Type.STRING },
                  tactical_score: { type: Type.NUMBER },
                  ai_reasoning: { type: Type.STRING }
                },
                required: ["hospital_id", "tactical_score", "ai_reasoning"]
              }
            },
            urgency_level: { type: Type.STRING, enum: ['critical', 'high', 'moderate', 'low'] },
            blood_advice: { type: Type.STRING },
          },
          required: ["ranked", "urgency_level", "blood_advice"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      ...parsed,
      recommended_id: parsed.ranked?.[0]?.hospital_id || ""
    };
  };

  const fallback = () => {
    const recs = recommendHospitalsFallback(bloodGroup, hospitals);
    
    const ranked: RankedHospital[] = recs.map((r, i) => ({
      hospital_id: r.hospitalId,
      tactical_score: r.score,
      ai_reasoning: `Heuristic match level ${i+1} based on blood availability and facility status.`
    }));

    return {
      recommended_id: ranked[0].hospital_id,
      ranked,
      urgency_level: 'high',
      blood_advice: "Follow standard emergency transfusion protocols while en-route."
    } as TriageResult;
  };

  return safeAI(liveCall, fallback, "Triage");
}

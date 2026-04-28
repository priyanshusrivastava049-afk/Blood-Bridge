import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
// @ts-ignore
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useUserLocation } from '../hooks/useUserLocation';
import { getNearestHospitals, HospitalWithDistance } from '../utils/nearestHospitals';
import { haversineKm } from '../utils/geo';
import HospitalFilters from './HospitalFilters';
import { Shield, Navigation, Activity, Phone, Hospital as HospIcon, Info, ChevronRight, Activity as PulseIcon, Siren, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Donor } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface OpenMapProps {
  donors: Donor[];
  currentLang: string;
}

// Fix Leaflet default icon in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FALLBACK_HOSPITALS = [
  { id: 101, name: "AIIMS Delhi", lat: 28.5672, lng: 77.2100, type: 'Government', emergency: 'confirmed', phone: '011-26588500', address: 'Ansari Nagar, New Delhi' },
  { id: 102, name: "Fortis Noida", lat: 28.6186, lng: 77.3713, type: 'Private', emergency: 'likely', phone: '0120-4300222', address: 'Sector 62, Noida' },
  { id: 103, name: "Max Saket", lat: 28.5273, lng: 77.2117, type: 'Private', emergency: 'confirmed', phone: '011-26515050', address: 'Saket, New Delhi' },
  { id: 104, name: "Safdarjung Hospital", lat: 28.5676, lng: 77.2065, type: 'Government', emergency: 'confirmed', phone: '011-26730000', address: 'Safdarjung, New Delhi' },
  { id: 105, name: "Medanta Gurugram", lat: 28.4395, lng: 77.0405, type: 'Private', emergency: 'confirmed', phone: '0124-4141414', address: 'Sector 38, Gurugram' },
];

const govIcon = L.divIcon({ 
  className: 'tactical-marker gov-marker', 
  html: `
    <div class="marker-container">
      <div class="marker-glow"></div>
      <div class="marker-base hospital-base">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M7 9h10M7 12h10" />
        </svg>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const privIcon = L.divIcon({ 
  className: 'tactical-marker priv-marker', 
  html: `
    <div class="marker-container">
      <div class="marker-glow shadow-blue-glow"></div>
      <div class="marker-base hospital-base priv">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
        </svg>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const recommendedIcon = L.divIcon({ 
  className: 'tactical-marker rec-marker', 
  html: `
    <div class="marker-container recommended scale-110">
      <div class="marker-pulse-ring"></div>
      <div class="marker-base hospital-base urgent">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const userIcon = L.divIcon({ 
  className: 'tactical-marker user-marker', 
  html: `
    <div class="marker-container user">
      <div class="user-pulse"></div>
      <div class="marker-base user-base">
        <div class="user-inner"></div>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

const donorMarkerIcon = (color: string, isCritical: boolean) => L.divIcon({
  className: 'tactical-marker donor-marker',
  html: `
    <div class="marker-container donor" style="--donor-color: ${color}">
      ${isCritical ? '<div class="critical-ping"></div>' : ''}
      <div class="marker-base donor-base" style="background-color: ${color}">
        <div class="donor-blood-drop"></div>
      </div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let sizeClass = 'small';
  if (count >= 10) sizeClass = 'medium';
  if (count >= 50) sizeClass = 'large';

  return L.divIcon({
    html: `
      <div class="tactical-cluster cluster-${sizeClass}">
        <div class="cluster-ring"></div>
        <div class="cluster-content">
          <span class="cluster-count">${count}</span>
          <span class="cluster-label">UNITS</span>
        </div>
      </div>
    `,
    className: 'cluster-marker',
    iconSize: L.point(44, 44)
  });
};

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { 
    if (lat && lng) map.flyTo([lat, lng], map.getZoom(), { duration: 1.5 }); 
  }, [lat, lng, map]);
  return null;
}

export default function OpenEmergencyMap({ donors }: OpenMapProps) {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterQ, setFilterQ] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterEmerg, setFilterEmerg] = useState('All');
  const [aiRanking, setAiRanking] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const { location, error: geoError } = useUserLocation();

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" }), []);

  useEffect(() => {
    fetch('/api/hospitals')
      .then(r => r.json())
      .then(data => { 
        if (data && data.length > 0) {
          setHospitals(data); 
        } else {
          setHospitals(FALLBACK_HOSPITALS);
        }
        setLoading(false); 
      })
      .catch((err) => { 
        console.error("Fetch Error:", err);
        setHospitals(FALLBACK_HOSPITALS);
        setLoading(false); 
      });
  }, []);

  const nearest = useMemo(() => {
    if (!location || hospitals.length === 0) return [];
    return getNearestHospitals(hospitals, location.lat, location.lng, 15);
  }, [location, hospitals]);

  const filtered = useMemo(() => {
    return hospitals.filter(h => {
      const matchQ = h.name.toLowerCase().includes(filterQ.toLowerCase());
      const matchT = filterType === 'All' || h.type === filterType;
      const matchE = filterEmerg === 'All' ||
        (filterEmerg === 'Emergency' && h.emergency !== 'unknown') ||
        (filterEmerg === 'Unknown' && h.emergency === 'unknown');
      return matchQ && matchT && matchE;
    });
  }, [hospitals, filterQ, filterType, filterEmerg]);

  const handleTriage = async () => {
    if (!location || nearest.length === 0) return;
    setIsAiLoading(true);
    setEmergencyMode(true);
    
    try {
      const targetHospitals = nearest.slice(0, 10);
      
      const prompt = `You are an emergency healthcare advisor for Delhi NCR.
      A patient needs critical blood transfusion of type O-.
      User Location: ${location.lat}, ${location.lng}

      AVAILABLE HOSPITALS:
      ${targetHospitals.map((h, i) => `
      ${i+1}. ${h.name} (ID: ${h.id})
         - Distance: ${h.distKm} km
         - Type: ${h.type}
         - Emergency: ${h.emergency}
      `).join('\n')}

      TASK:
      Rank the top 3 hospitals for this emergency. Consider:
      - Distance (primary factor)
      - Government hospitals (priority for trauma/emergency)
      - Large chains (AIIMS, Max, Fortis, Apollo, Medanta)
      - Verified Emergency status

      Output JSON with ranked hospitals and reasons.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hospitalId: { type: Type.NUMBER },
                    rank: { type: Type.NUMBER },
                    reason: { type: Type.STRING },
                    estimatedETA: { type: Type.STRING }
                  }
                }
              },
              summary: { type: Type.STRING }
            },
            required: ["recommendations", "summary"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      
      const standardized = {
        summary: data.summary || "AI has ranked the top facilities based on proximity and trauma capacity.",
        ranked: data.recommendations.map((r: any) => {
          const h = nearest.find(hosp => hosp.id === r.hospitalId);
          return {
            id: r.hospitalId,
            name: h?.name || 'Hospital',
            rank: r.rank,
            score: 100 - (r.rank - 1) * 10,
            reason: r.reason,
            recommended: r.rank === 1
          };
        })
      };
      
      setAiRanking(standardized);
    } catch (e) {
      console.error("AI Ranking Error:", e);
      setAiRanking({
        summary: 'AI Engine offline. Showing proximity-based results.',
        ranked: nearest.slice(0, 3).map((h, i) => ({
          id: h.id, name: h.name, rank: i + 1,
          score: 95 - i * 5,
          reason: `${h.distKm}km away. Tactical proximity lock.`,
          recommended: i === 0,
        })),
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const defaultCenter: [number, number] = [28.6139, 77.2090];

  return (
    <div className={`flex flex-col h-[calc(100vh-140px)] bg-[#07090F] overflow-hidden rounded-2xl border transition-all duration-500 ${emergencyMode ? 'border-[var(--blood)] ring-4 ring-[var(--blood-alpha-10)]' : 'border-[var(--b)]'}`}>
      <div className={`flex items-center justify-between px-6 py-4 border-b z-20 transition-colors ${emergencyMode ? 'bg-[var(--blood-alpha-10)] border-[var(--blood-alpha-20)]' : 'bg-[var(--bg2)] border-[var(--b)]'}`}>
         <div className="flex flex-col">
            <div className="flex items-center gap-2">
               {emergencyMode ? <Siren size={14} className="text-[var(--blood)] animate-bounce" /> : <PulseIcon size={14} className="text-[var(--blood)] animate-pulse" />}
               <h1 className={`text-sm font-black uppercase tracking-tighter ${emergencyMode ? 'text-[var(--blood)]' : 'text-white'}`}>
                 {emergencyMode ? 'EMERGENCY_RESPONSE_PROTOCOL_ACTIVE' : 'Mission Tactical Grid'}
               </h1>
            </div>
            <span className="text-[9px] font-bold text-[var(--t3)] uppercase tracking-widest leading-none mt-1">Live Delhi-Noida Vector Assets</span>
         </div>
         <div className="flex items-center gap-4">
            {emergencyMode && (
              <button onClick={() => { setEmergencyMode(false); setAiRanking(null); }} className="text-[9px] font-black uppercase tracking-widest text-[var(--t3)] hover:text-white underline underline-offset-4">Exit Response Mode</button>
            )}
            <button 
              className={`btn ${emergencyMode ? 'btn-blood' : 'btn-blood'} btn-sm h-9 !px-6 !text-[10px] uppercase font-black tracking-widest ${isAiLoading ? 'animate-pulse' : ''} shadow-lg ${emergencyMode ? 'animate-pulse ring-2 ring-[var(--blood)]' : ''}`}
              onClick={handleTriage}
              disabled={isAiLoading || nearest.length === 0}
            >
               {isAiLoading ? 'AI_TRIAGING...' : 'INITIATE_AI_DISPATCH'}
            </button>
         </div>
      </div>

      {!emergencyMode && <HospitalFilters onFilter={(q, t, e) => { setFilterQ(q); setFilterType(t); setFilterEmerg(e); }} />}
      
      <div className="flex-1 flex min-h-0 relative">
        <div className="flex-1 min-h-0 relative z-10">
          <MapContainer
            center={location ? [location.lat, location.lng] : defaultCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
            />

            {location && (
              <>
                <RecenterMap lat={location.lat} lng={location.lng} />
                <Marker position={[location.lat, location.lng]} icon={userIcon}>
                  <Popup className="tactical-popup">📍 Operative Position Lock</Popup>
                </Marker>
                <Circle
                  center={[location.lat, location.lng]}
                  radius={location.accuracy}
                  pathOptions={{ color: '#00D68F', fillOpacity: 0.05, weight: 1 }}
                />
              </>
            )}

            {/* @ts-ignore */}
            <MarkerClusterGroup 
              chunkedLoading 
              maxClusterRadius={80} 
              spiderfyOnMaxZoom={true} 
              showCoverageOnHover={false}
              iconCreateFunction={createClusterIcon}
            >
              {filtered.map(h => {
                const isRecommended = aiRanking?.ranked?.some((r: any) => r.id === h.id && r.recommended);
                return (
                  <Marker
                    key={h.id}
                    position={[h.lat, h.lng]}
                    icon={isRecommended ? recommendedIcon : (h.type === 'Government' ? govIcon : privIcon)}
                  >
                    <Popup className="tactical-popup">
                      <div className="p-3 min-w-[220px]">
                        <div className="text-[13px] font-black text-white uppercase tracking-tight mb-1">{h.name}</div>
                        {isRecommended && (
                          <div className="bg-[var(--blood-alpha-10)] border border-[var(--blood-alpha-20)] text-[var(--blood)] text-[9px] font-black uppercase px-2 py-1 rounded mb-2 flex items-center gap-2">
                             <Shield size={10} /> AI RECOMMENDED TARGET
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${h.type === 'Government' ? 'bx-ok' : 'bx-stable'}`}>
                              {h.type}
                           </span>
                           <span className="text-[9px] text-[var(--t3)] font-mono font-bold">EMRG: {h.emergency.toUpperCase()}</span>
                        </div>
                        <div className="text-[10px] text-[var(--t2)] mb-3 border-t border-[var(--b)] pt-3 leading-snug">{h.address}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="flex items-center justify-center gap-1.5 bg-[var(--bg4)] border border-[var(--b)] p-1.5 rounded-lg text-[9px] font-black uppercase text-[var(--t2)] hover:text-white transition-all"><Phone size={10}/> Call</button>
                          <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`, '_blank')} className="flex items-center justify-center gap-1.5 bg-[var(--blue-alpha-10)] text-[var(--blue)] border border-[var(--blue-alpha-20)] p-1.5 rounded-lg text-[9px] font-black uppercase hover:bg-[var(--blue)] hover:text-white transition-all"><Navigation size={10}/> Route</button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {donors.map(d => {
                const isAvailable = d.status === 'available';
                const isCritical = d.bg === 'O−' && isAvailable;
                const color = isAvailable ? '#00D68F' : d.status === 'busy' ? '#FFD42D' : '#E8001A';
                
                return (
                  <Marker 
                    key={d.id} 
                    position={[d.lat, d.lng]} 
                    icon={donorMarkerIcon(color, isCritical)}
                  >
                    <Popup className="tactical-popup">
                      <div className="p-3 min-w-[200px]">
                        <div className="text-[13px] font-black text-white uppercase tracking-tight mb-1">{d.name}</div>
                        <div className="flex items-center gap-2 mb-3">
                           <span className="blood-tag text-[10px] py-1 px-2">{d.bg}</span>
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${d.status === 'available' ? 'bx-ok' : 'bx-stable'}`}>
                              {d.status}
                           </span>
                        </div>
                        <div className="text-[10px] text-[var(--t2)] mb-3 border-t border-[var(--b)] pt-3 leading-snug">{d.loc || 'Active Volunteer'}</div>
                        <button className="w-full flex items-center justify-center gap-1.5 bg-[var(--blue-alpha-10)] text-[var(--blue)] border border-[var(--blue-alpha-20)] p-2 rounded-lg text-[9px] font-black uppercase hover:bg-[var(--blue)] hover:text-white transition-all"><Navigation size={10}/> Vector Lock</button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>

          {loading && (
            <div className="absolute inset-0 z-50 bg-[#07090F]/80 backdrop-blur-sm flex flex-col items-center justify-center">
               <Activity size={40} className="text-[var(--blood)] animate-pulse mb-4" />
               <div className="text-[10px] font-black tracking-[0.3em] uppercase text-white">Fetching Infrastructure Assets...</div>
            </div>
          )}
        </div>

        {/* Tactical Info Panel (Side) */}
        <div className="w-[420px] bg-[var(--bg2)] border-l border-[var(--b)] flex flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
           <div className={`p-8 border-b border-[var(--b)] shrink-0 ${emergencyMode ? 'bg-[var(--blood-alpha-5)]' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em] font-mono">Mission_Advisory_Hub</h2>
                 <div className={`w-2 h-2 rounded-full animate-pulse ${emergencyMode ? 'bg-[var(--blood)]' : 'bg-[var(--green)]'}`}></div>
              </div>
              <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none">{emergencyMode ? 'Tactical Recs' : 'Incident Response'}</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-5">
              {aiRanking ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                   <div className="p-4 rounded-2xl bg-[var(--blue-alpha-5)] border border-[var(--blue-alpha-20)] mb-6">
                      <div className="flex items-center gap-3 mb-3 text-[var(--blue)]">
                         <Shield size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest font-mono">AI_INSIGHTS</span>
                      </div>
                      <p className="text-xs text-[var(--t1)] font-medium leading-relaxed italic">{aiRanking.summary}</p>
                   </div>
                   <div className="flex flex-col gap-4">
                      {aiRanking.ranked.map((r: any) => {
                        const h = nearest.find(h => h.id === r.id);
                        return (
                          <div key={r.id} className={`p-5 rounded-2xl border ${r.recommended ? 'border-[var(--blood)] bg-[var(--blood-alpha-20)] shadow-[0_0_30px_var(--blood-alpha-20)]' : 'border-[var(--b)] bg-[var(--bg3)]'}`}>
                             <div className="flex justify-between items-start mb-3">
                                <div>
                                   <div className={`text-[13px] font-black uppercase tracking-tight ${r.recommended ? 'text-white' : 'text-[var(--t1)]'}`}>{r.name}</div>
                                   <div className={`text-[10px] font-black uppercase mt-1 tracking-widest ${r.recommended ? 'text-[var(--blood)]' : 'text-[var(--t3)]'}`}>Rank #{r.rank} · ETA: {h?.etaMin}m</div>
                                </div>
                                <div className="text-right">
                                   <div className="text-[14px] font-mono font-black text-[var(--blue)] leading-none">{h?.distKm}</div>
                                   <div className="text-[9px] font-black text-[var(--t3)]">KM</div>
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-[var(--t2)] uppercase leading-snug">{r.reason}</p>
                             {r.recommended && (
                               <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${h?.lat},${h?.lng}`, '_blank')} className="w-full mt-4 py-3 bg-[var(--blood)] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2">
                                 <Navigation size={12} /> Start Route Navigation
                               </button>
                             )}
                          </div>
                        )
                      })}
                   </div>
                </motion.div>
              ) : (
                <>
                  {!location && (
                    <div className="p-5 rounded-2xl bg-[var(--gold-alpha-10)] border border-[var(--gold-alpha-20)] text-center">
                       <AlertCircle size={24} className="mx-auto text-[var(--gold)] mb-3" />
                       <div className="text-[10px] font-black uppercase text-[var(--gold)]">Location Lock Missing</div>
                       <p className="text-[9px] text-[var(--t3)] mt-2 font-bold leading-relaxed">System requires physical coordinates for tactical calculations. Please allow browser location access.</p>
                    </div>
                  )}
                  {location && <div className="text-[10px] font-black text-[var(--t2)] uppercase tracking-widest px-1">Nearby Support Nodes</div>}
                  <div className="flex flex-col gap-3">
                     {nearest.length > 0 ? nearest.map((h, i) => (
                        <motion.div 
                          key={h.id} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-4 bg-[var(--bg3)] border border-[var(--b)] rounded-2xl hover:border-[var(--blood)] group cursor-pointer"
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`, '_blank')}
                        >
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="text-[12px] font-black text-white uppercase tracking-tight group-hover:text-[var(--blood)] transition-colors">{h.name}</div>
                                <div className="text-[9px] font-bold text-[var(--t3)] uppercase mt-0.5">{h.type} · {h.emergency}</div>
                              </div>
                              <div className="text-right">
                                <span className="text-[13px] font-mono font-black text-[var(--blue)] leading-none">{h.distKm}</span>
                                <span className="text-[8px] font-black text-[var(--t3)] ml-1">KM</span>
                              </div>
                           </div>
                           <div className="flex items-center justify-between pt-3 border-t border-[var(--b)] mt-2">
                              <div className="flex gap-2">
                                 <span className="flex items-center gap-1 text-[9px] font-black text-[var(--t2)] uppercase"><Activity size={8} /> ~{h.etaMin}m</span>
                              </div>
                              <button className="text-[10px] font-black text-[var(--blue)] flex items-center gap-1 hover:gap-2 transition-all uppercase">Navigate <ChevronRight size={10} /></button>
                           </div>
                        </motion.div>
                     )) : null}
                  </div>
                </>
              )}
           </div>
           
           <div className="p-8 border-t border-[var(--b)] bg-[var(--bg3)]">
              <div className="text-[9px] font-black text-[var(--t3)] uppercase tracking-[0.2em] mb-4">Command_Center_Action_Relay</div>
              <div className="grid grid-cols-2 gap-3">
                 <button className="btn btn-ghost !py-3 !rounded-xl !text-[10px] uppercase font-black tracking-widest hover:!bg-[var(--blue-alpha-10)]" onClick={() => { setAiRanking(null); setEmergencyMode(false); }}>
                    RESET_GRID
                 </button>
                 <button className="btn btn-ghost !py-3 !rounded-xl !text-[10px] uppercase font-black tracking-widest hover:!bg-[var(--blood-alpha-10)]" onClick={() => alert('Broadcasting global alert to sector donors...')}>
                    BROADCAST_O-
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

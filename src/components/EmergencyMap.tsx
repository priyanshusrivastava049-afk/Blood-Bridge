import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Donor } from '../types';
import { INITIAL_DONORS, INITIAL_REQS } from '../constants';
import { Shield, Navigation, Users, Zap, LayoutGrid, Layers, Locate, Clock, Activity, MapPin, AlertTriangle, Phone, Send } from 'lucide-react';
import { TRANSLATIONS } from '../i18n';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  useMap,
  Circle,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

interface EmergencyMapProps {
  donors: Donor[];
  onNavigate: (id: any) => void;
  openAssign: (reqId: string, donorId: string) => void;
  currentLang: string;
  onContextUpdate?: (ctx: string) => void;
}

const MAP_ID = 'bf507c394d216524'; // Advanced marker style ID
const CENTER_DELHI = { lat: 28.6139, lng: 77.2090 }; // Delhi center

function MapHandler({ selectedDonor, searchResult }: { selectedDonor: Donor | null, searchResult: google.maps.LatLngLiteral | null }) {
  const map = useMap();
  useEffect(() => {
    if (map && selectedDonor) {
      map.panTo({ lat: selectedDonor.lat, lng: selectedDonor.lng });
      map.setZoom(14);
    }
  }, [map, selectedDonor]);

  useEffect(() => {
    if (map && searchResult) {
      map.panTo(searchResult);
      map.setZoom(14);
    }
  }, [map, searchResult]);

  return null;
}

function Directions({ origin, destination }: { origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ 
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#E8001A',
        strokeOpacity: 0.8,
        strokeWeight: 4
      }
    }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
      directionsRenderer.setDirections(response);
      setRoutes(response.routes);
    });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer, origin, destination]);

  if (routes.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 z-20 glass p-3 border border-[var(--b)] rounded-xl pointer-events-none anim a2">
      <div className="text-[10px] font-black font-mono text-[var(--blood)] mb-1 uppercase tracking-widest flex items-center gap-2">
        <Navigation size={12} className="animate-pulse" />
        Optimal Response Vector
      </div>
      <div className="text-[13px] font-black text-[var(--t1)]">
        {routes[0].legs[0].distance?.text} · {routes[0].legs[0].duration?.text}
      </div>
      <div className="text-[9px] text-[var(--t2)] font-bold mt-1 uppercase">
        Via {routes[0].summary}
      </div>
    </div>
  );
}

function SearchBox({ onPlaceSelect }: { onPlaceSelect: (p: google.maps.places.PlaceResult) => void }) {
  const [inputVal, setInputVal] = useState('');
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };

    const autocomplete = new places.Autocomplete(inputRef.current, options);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        onPlaceSelect(place);
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [places, onPlaceSelect]);

  return (
    <div className="flex-1 relative">
      <input 
        ref={inputRef}
        type="text" 
        className="w-full bg-[var(--bg3)] border border-[var(--b)] rounded-lg px-4 py-2 text-xs font-medium focus:border-[var(--blue)] outline-none"
        placeholder="Enter Sector or Landmark..."
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
    </div>
  );
}

export default function EmergencyMap({ donors, onNavigate, openAssign, currentLang, onContextUpdate }: EmergencyMapProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;
  const MAP_KEY = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null);
  const [infoDonor, setInfoDonor] = useState<Donor | null>(null);
  const [escTime, setEscTime] = useState(7 * 60 + 24);
  const [viewMode, setViewMode] = useState<'tactical' | 'strategic'>('tactical');
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [searchResult, setSearchResult] = useState<google.maps.LatLngLiteral | null>(null);
  const [customMarkers, setCustomMarkers] = useState<{lat: number, lng: number, title: string}[]>([]);

  const onMapClick = useCallback((e: any) => {
    if (!e.detail.latLng) return;
    const newPoint = e.detail.latLng;
    setCustomMarkers(prev => [...prev, { ...newPoint, title: 'Tactical Pin' }]);
    if (onContextUpdate) onContextUpdate(`User dropped a tactical pin at ${newPoint.lat.toFixed(4)}, ${newPoint.lng.toFixed(4)}.`);
  }, [onContextUpdate]);

  const [voiceActive, setVoiceActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setEscTime(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const voiceHint = setTimeout(() => {
      setVoiceActive(true);
      setTimeout(() => setVoiceActive(false), 5000);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearTimeout(voiceHint);
    };
  }, []);

  const goToUserLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setSearchResult(latLng);
      }
    );
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleDonorSelect = (donor: Donor) => {
    setSelectedDonorId(donor.id);
    setInfoDonor(donor);
    const el = document.getElementById(`dc-${donor.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="screen on grid-dots">
      <div className="ph anim">
        <div className="flex-1">
          <div className="ph-title flex items-center gap-2">
            {t.map}
            <div className="px-2 py-0.5 rounded border border-[var(--blood-alpha-20)] bg-[var(--blood-alpha-10)] text-[9px] font-black text-[var(--blood)] uppercase tracking-widest font-mono anim-pulse">Live Feed</div>
          </div>
          <div className="ph-sub flex items-center gap-2 mt-1">
            Real-time Telemetry 
            <span className="w-1 h-1 rounded-full bg-[var(--t3)]"></span>
            Precision: ±5m 
            <span className="w-1 h-1 rounded-full bg-[var(--t3)]"></span>
            Google Maps Data Core
          </div>
        </div>
        <div className="ph-acts">
          <div className="flex bg-[var(--bg3)] border border-[var(--b)] p-1 rounded-xl">
            <button className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${viewMode === 'tactical' ? 'bg-[var(--bg2)] text-[var(--t1)] shadow-sm' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`} onClick={() => setViewMode('tactical')}>TACTICAL</button>
            <button className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${viewMode === 'strategic' ? 'bg-[var(--bg2)] text-[var(--t1)] shadow-sm' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`} onClick={() => setViewMode('strategic')}>STRATEGIC</button>
          </div>
          <button className="btn btn-blood btn-sm" onClick={() => onNavigate('req')}>
            <Shield size={14} /> {t.new_emergency}
          </button>
        </div>
      </div>

      <div className="map-layout anim a1 relative h-[calc(100vh-180px)]">
        <div className="map-wrap glass shadow-blue-glow overflow-hidden relative border border-[var(--b)] h-full w-full">
          {/* FLOATING TOP CONTROL HUD */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-[var(--bg2)]/90 backdrop-blur-md p-2 rounded-2xl border border-[var(--b)] shadow-2xl">
            <div className="px-4 py-2 flex items-center gap-2 border-r border-[var(--b)]">
               <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse"></div>
               <span className="text-[10px] font-black font-mono tracking-widest text-[var(--t1)]">SYSTEM_COMMAND</span>
            </div>
            <div className="flex gap-2">
               <button 
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'tactical' ? 'bg-[var(--blue-alpha-20)] text-[var(--blue)] border border-[var(--blue-alpha-30)] shadow-[0_0_15px_var(--blue-alpha-10)]' : 'text-[var(--t3)]'}`} 
                  onClick={() => setViewMode('tactical')}
               >
                  TACTICAL
               </button>
                <button 
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'strategic' ? 'bg-[var(--blue-alpha-20)] text-[var(--blue)] border border-[var(--blue-alpha-30)] shadow-[0_0_15px_var(--blue-alpha-10)]' : 'text-[var(--t3)]'}`} 
                  onClick={() => setViewMode('strategic')}
               >
                  STRATEGIC
               </button>
               <button 
                  className="px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all bg-[var(--blood-alpha-10)] text-[var(--blood)] border border-[var(--blood-alpha-30)] hover:bg-[var(--blood)] hover:text-white"
                  onClick={() => {
                    const avail = donors.filter(d => d.status === 'available').length;
                    alert(`BROADCAST DISPATCHED: ${avail} matching O- donors notified in this sector.`);
                  }}
               >
                  BROADCAST_ALERT
               </button>
            </div>
            <div className="h-4 w-px bg-[var(--b)]"></div>
            <div className="flex items-center gap-2 px-3">
               <SearchBox onPlaceSelect={(p) => {
                 if (p.geometry?.location) {
                   const loc = p.geometry.location.toJSON();
                   setSearchResult(loc);
                 }
               }} />
            </div>
          </div>

          {/* FLOATING ACTION HUD - LEFT */}
          <div className="absolute top-20 left-6 z-20 flex flex-col gap-4">
             <motion.div 
               initial={{ x: -50, opacity: 0 }} 
               animate={{ x: 0, opacity: 1 }}
               className="glass-blood !border-solid p-4 rounded-2xl w-64 shadow-2xl"
             >
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[var(--blood)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest font-mono text-white">Escalation Threat</span>
                   </div>
                   <div className="text-xl font-black font-mono text-[var(--blood)] tabular-nums">{formatTime(escTime)}</div>
                </div>
                <div className="h-1.5 bg-[var(--bg5)] rounded-full overflow-hidden mb-3">
                   <motion.div 
                     initial={{ width: '100%' }}
                     animate={{ width: `${(escTime / (8*60)) * 100}%` }}
                     className="h-full bg-[var(--blood)]"
                   />
                </div>
                <div className="text-[10px] font-bold text-[var(--t2)] leading-tight uppercase">
                   Deployment required within current vector to prevent outcome degradation.
                </div>
             </motion.div>

             <motion.div 
               initial={{ x: -50, opacity: 0 }} 
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.1 }}
               className="glass !border-solid p-4 rounded-2xl w-64 shadow-2xl"
             >
                <div className="text-[9px] font-black text-[var(--t3)] uppercase tracking-widest mb-3">Priority Responders</div>
                <div className="flex flex-col gap-2">
                   {donors.slice(0, 3).map(d => (
                      <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg3)] border border-[var(--b)] cursor-pointer hover:border-[var(--blue-alpha-50)] transition-all" onClick={() => handleDonorSelect(d)}>
                         <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-md bg-[var(--green-alpha-10)] border border-[var(--green-alpha-30)] flex items-center justify-center text-[var(--green)] font-black text-[9px]">{d.bg}</div>
                            <span className="text-[11px] font-bold text-white">{d.name}</span>
                         </div>
                         <span className="text-[9px] font-mono font-black text-[var(--blue)]">{d.dist}km</span>
                      </div>
                   ))}
                </div>
             </motion.div>
          </div>

          <div className="map-canvas relative grow overflow-hidden bg-[#0A0E14]" id="map-canvas">
            <APIProvider apiKey={MAP_KEY}>
              <Map
                defaultCenter={CENTER_DELHI}
                defaultZoom={12}
                mapId={MAP_ID}
                mapTypeId={viewMode === 'strategic' ? 'satellite' : 'roadmap'}
                disableDefaultUI={true}
                gestureHandling={'greedy'}
                styles={DARK_MAP_STYLE}
                onClick={onMapClick}
              >
                <MapHandler selectedDonor={donors.find(d => d.id === selectedDonorId) || null} searchResult={searchResult} />
                
                {infoDonor && (
                  <Directions 
                    origin={{ lat: infoDonor.lat, lng: infoDonor.lng }} 
                    destination={{ 
                      lat: INITIAL_REQS.find(r => r.bg === infoDonor.bg)?.lat || INITIAL_REQS[0].lat || CENTER_DELHI.lat, 
                      lng: INITIAL_REQS.find(r => r.bg === infoDonor.bg)?.lng || INITIAL_REQS[0].lng || CENTER_DELHI.lng 
                    }} 
                  />
                )}

                {/* Demand Heatmap */}
                {heatmapEnabled && INITIAL_REQS.map(r => (
                  <Circle
                    key={r.id}
                    radius={1200}
                    center={{ lat: r.lat || CENTER_DELHI.lat, lng: r.lng || CENTER_DELHI.lng }}
                    strokeColor={'rgba(232, 0, 26, 0.4)'}
                    strokeOpacity={0.8}
                    strokeWeight={1}
                    fillColor={'rgba(232, 0, 26, 0.25)'}
                    fillOpacity={1}
                  />
                ))}
                
                {/* Custom Tactical Pins */}
                {customMarkers.map((m, i) => (
                  <AdvancedMarker key={i} position={m}>
                    <div className="w-4 h-4 bg-[var(--blue)] rounded-full border-2 border-white shadow-[0_0_10px_var(--blue)] flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </AdvancedMarker>
                ))}
                {/* Hospital Target */}
                <AdvancedMarker position={CENTER_DELHI}>
                  <div className="hospital-marker shadow-blood-glow">
                    <HospitalMarker />
                  </div>
                </AdvancedMarker>

                {/* Donor Markers */}
                {donors.map((d) => {
                  const isAvailable = d.status === 'available';
                  const isCritical = d.bg === 'O−' && isAvailable;
                  const color = isAvailable ? 'var(--green)' : d.status === 'busy' ? 'var(--gold)' : 'var(--blood)';

                  return (
                    <AdvancedMarker 
                      key={d.id} 
                      position={{ lat: d.lat, lng: d.lng }}
                      onClick={() => handleDonorSelect(d)}
                    >
                      <div className="relative group">
                        {isCritical && (
                          <div className="absolute inset-0 -m-3 border-2 border-[var(--blood)] rounded-full animate-ping opacity-20 pointer-events-none"></div>
                        )}
                        <div className={`w-8 h-8 rounded-full border-2 border-[var(--bg1)] shadow-lg flex flex-col items-center justify-center transition-transform hover:scale-110 cursor-pointer ${selectedDonorId === d.id ? 'z-50 scale-125' : 'z-10'}`} style={{ backgroundColor: color }}>
                          <span className="text-[9px] font-black text-white leading-none">{d.bg}</span>
                        </div>
                        
                        {/* TACTICAL ETA POPUP (ON MAP) */}
                        {isAvailable && (
                           <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 pointer-events-none bg-[var(--bg2)]/80 backdrop-blur-sm border border-[var(--b)] px-1.5 py-0.5 rounded text-[8px] font-black font-mono text-[var(--t2)] whitespace-nowrap shadow-xl">
                              {Math.round(d.dist * 3.5)}m ETA
                           </div>
                        )}
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {infoDonor && (
                  <InfoWindow 
                    position={{ lat: infoDonor.lat, lng: infoDonor.lng }}
                    onCloseClick={() => setInfoDonor(null)}
                  >
                    <div className="p-2 min-w-[120px] text-[var(--t1)] font-sans">
                      <div className="text-xs font-black mb-1">{infoDonor.name}</div>
                      <div className="text-[10px] text-[var(--t2)] uppercase font-bold">{infoDonor.id}</div>
                      <div className="mt-2 flex items-center justify-between border-t border-[var(--b)] pt-1">
                        <span className="text-[9px] font-black text-[var(--blue)]">{infoDonor.score}% MATCH</span>
                        <span className="text-[9px] text-[var(--t3)]">{infoDonor.dist} km</span>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>

            {/* AI HUD OVERLAYS */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 p-3 glass-blood border-dashed rounded-lg pointer-events-none z-[5]">
              <div className="flex items-center gap-2 text-[var(--blood)]">
                <Zap size={12} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategy Engine Active</span>
              </div>
              <div className="text-[9px] font-bold text-[var(--t2)] leading-tight">
                Recommended: Prioritize RK-004<br/>Vector: Delhi Central Core
              </div>
            </div>

            {/* RADAR SWEEP EFFECT OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-[2] opacity-5 overflow-hidden">
               <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -ml-[1000px] -mt-[1000px] w-[2000px] h-[2000px] pointer-events-none"
                style={{ background: 'conic-gradient(from 0deg, transparent 70%, var(--blue) 100%)' }}
              />
            </div>
          </div>
        </div>

        <div className="map-right bg-[var(--bg2)] border-l border-[var(--b)] overflow-y-auto custom-scrollbar">
          <div className="sticky top-0 z-20 bg-[var(--bg2)] pt-6 px-4">
            <div className="esc-timer glass-blood !border-solid mb-4">
              <div className="esc-icon text-[var(--blood)]"><Clock size={20} /></div>
              <div className="flex-1">
                <div className="esc-label text-[10px] font-black uppercase tracking-widest text-[var(--blood)]">ESCALATION_WINDOW</div>
                <div className="esc-time tabular-nums">{formatTime(escTime)}</div>
              </div>
              <button className="btn btn-ghost btn-xs text-[var(--blood)] font-black" onClick={() => setEscTime(8 * 60)}>RE-INIT</button>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-[var(--b)]">
              <span className="text-[10px] font-black text-[var(--t2)] uppercase tracking-widest">Active Assets ({donors.length})</span>
              <span className="text-[9px] font-mono font-bold text-[var(--t3)]">GPS: ON</span>
            </div>
          </div>

          <div id="map-donor-list" className="p-4 flex flex-col gap-4 pb-20">
            {donors.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <DonorCard 
                  donor={d} 
                  isSelected={selectedDonorId === d.id} 
                  onClick={() => handleDonorSelect(d)} 
                  openAssign={openAssign} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HospitalMarker() {
  return (
    <div className="w-10 h-10 bg-[var(--blue-alpha-20)] border-2 border-[var(--blue)] rounded-xl flex items-center justify-center relative">
       <motion.div 
          className="absolute inset-0 border-2 border-[var(--blue)] rounded-xl"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <div className="w-6 h-6 bg-[var(--blue)] rounded shadow-inner flex items-center justify-center">
          <MapPin size={14} className="text-white" fill="white" />
        </div>
    </div>
  );
}

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0A0E14" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0A0E14" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#3A4F6A" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#4E6582" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#4E6582" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0C151D" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#3A4F6A" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1A2433" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#131C28" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#3A4F6A" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#223044" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1A2433" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#05080C" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3A4F6A" }] }
];

function DonorCard({ donor, isSelected, onClick, openAssign }: any) {
  const stcol: any = { available: 'dc-avail', busy: 'dc-busy', 'en-route': 'dc-coming' };
  const stlbl: any = { available: 'Available', busy: 'Busy', 'en-route': 'En Route' };
  const badgeClass: any = { available: 'bx-ok', 'en-route': 'bx-crit', busy: 'bx-med' };

  const handleCallDonor = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Calling donor ${donor.name}...`);
    // Placeholder for actual call logic
  };

  const handleSendDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Sending directions to ${donor.name}...`);
    // Placeholder for actual send logic
  };

  return (
    <div 
      className={`donor-card ${stcol[donor.status] || 'dc-avail'} ${isSelected ? 'sel' : ''}`} 
      id={`dc-${donor.id}`} 
      onClick={onClick}
    >
      <div className="dc-top">
        <div><div className="dc-name">{donor.name}</div><div className="dc-loc">{donor.id} · {donor.loc}</div></div>
        <div className="flex flex-col items-end gap-1">
          <span className="blood-tag text-[11px] py-[3px] px-[7px]">{donor.bg}</span>
          <span className={`badge ${badgeClass[donor.status] || 'bx-wait'}`}>{stlbl[donor.status].toUpperCase()}</span>
        </div>
      </div>
      <div className="dc-meta">
        <span className="flex items-center gap-1">📍 {donor.dist} km</span>
        <span className="flex items-center gap-1"><Clock size={10} className="text-[var(--blue)]" /> {Math.round(donor.dist * 3.5)}m ETA</span>
      </div>
      <div className="mt-2 p-2 bg-[var(--bg3)] rounded-lg border border-[var(--b)] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-[var(--t3)] uppercase">Propensity Score</span>
          <span className="text-[10px] font-black text-[var(--green)]">94% LIKELY TO RETURN</span>
        </div>
        <Zap size={12} className="text-[var(--gold)] fill-current" />
      </div>
      <div className="flex items-center gap-1.5 my-3">
        <span className="text-[10px] text-[var(--t3)] font-mono">MATCH</span>
        <div className="flex-1 h-1 bg-[var(--bg5)] rounded-sm overflow-hidden">
          <div style={{ width: `${donor.score}%`, height: '100%', background: 'var(--blood)', borderRadius: '2px' }}></div>
        </div>
        <span className="font-mono text-xs font-black text-[var(--blood)]">{donor.score}</span>
      </div>
      <div className="dc-btns grid grid-cols-2 gap-2">
        {donor.status === 'available' && (
          <button 
            className="btn btn-blood btn-xs col-span-2 justify-center" 
            onClick={(e) => { e.stopPropagation(); openAssign('REQ-001', donor.id); }}
          >
            Notify Donor
          </button>
        )}
        <button className="btn btn-ghost btn-xs flex justify-center items-center gap-1.5 bg-[var(--blue-alpha-10)] text-[var(--blue)] border-[var(--blue-alpha-20)] hover:bg-[var(--blue)] hover:text-white" onClick={handleCallDonor}>
          <Phone size={11} /> Call
        </button>
        <button className="btn btn-ghost btn-xs flex justify-center items-center gap-1.5 bg-[var(--teal-alpha-10)] text-[var(--teal)] border-[var(--teal-alpha-20)] hover:bg-[var(--teal)] hover:text-white" onClick={handleSendDirections}>
          <Send size={11} /> Send
        </button>
        <button className="btn btn-ghost btn-xs col-span-2 justify-center">Profile</button>
      </div>
    </div>
  );
}

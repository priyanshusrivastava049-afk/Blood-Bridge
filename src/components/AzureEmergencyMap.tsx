import { useState, useMemo } from 'react';
import { 
  AzureMap, 
  AzureMapsProvider, 
  IAzureMapOptions, 
  AuthenticationType,
  AzureMapHtmlMarker
} from 'react-azure-maps';
import { AuthenticationOptions } from 'azure-maps-control';
import { AZURE_KEY, INITIAL_DONORS } from '../constants';
import { motion } from 'framer-motion';
import { Shield, Navigation, Users, Zap, Clock, Activity, MapPin } from 'lucide-react';
import { TRANSLATIONS } from '../i18n';

interface AzureEmergencyMapProps {
  donors: any[];
  onNavigate: (id: any) => void;
  openAssign: (reqId: string, donorId: string) => void;
  currentLang: string;
}

const CENTER_MUMBAI = [72.8697, 19.1136]; // [lng, lat] for Azure Maps

const option: IAzureMapOptions = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: AZURE_KEY
  } as AuthenticationOptions,
  center: CENTER_MUMBAI,
  zoom: 12,
  view: 'Auto',
  style: 'night'
};

export default function AzureEmergencyMap({ donors, onNavigate, openAssign, currentLang }: AzureEmergencyMapProps) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null);

  const memoizedOptions: IAzureMapOptions = useMemo(() => option, []);

  return (
    <div className="screen on grid-dots">
      <div className="ph anim">
        <div className="flex-1">
          <div className="ph-title flex items-center gap-2">
            {t.map} (Azure Core)
            <div className="px-2 py-0.5 rounded border border-[var(--blue-alpha-20)] bg-[var(--blue-alpha-10)] text-[9px] font-black text-[var(--blue)] uppercase tracking-widest font-mono anim-pulse">Azure Hybrid Feed</div>
          </div>
          <div className="ph-sub flex items-center gap-2 mt-1">
            Azure Maps Telemetry 
            <span className="w-1 h-1 rounded-full bg-[var(--t3)]"></span>
            Real-time Assets
          </div>
        </div>
        <div className="ph-acts">
           <button className="btn btn-blood btn-sm" onClick={() => onNavigate('req')}>
            <Shield size={14} /> {t.new_emergency}
          </button>
        </div>
      </div>

      <div className="map-layout anim a1">
        <div className="map-wrap glass shadow-blue-glow overflow-hidden relative border border-[var(--b)]" style={{ height: '600px' }}>
          <AzureMapsProvider>
            <div style={{ height: '100%', width: '100%' }}>
              <AzureMap options={memoizedOptions}>
                {donors.map(d => (
                  <AzureMapHtmlMarker
                    key={d.id}
                    options={{
                      position: [d.lng, d.lat],
                      anchor: 'center'
                    }}
                    markerContent={(
                      <div 
                        className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${selectedDonorId === d.id ? 'scale-125 z-50' : 'z-10'}`}
                        style={{ backgroundColor: d.status === 'available' ? 'var(--green)' : 'var(--blood)' }}
                        onClick={() => setSelectedDonorId(d.id)}
                      >
                        <span className="text-[9px] font-black text-white">{d.bg}</span>
                      </div>
                    )}
                  />
                ))}
              </AzureMap>
            </div>
          </AzureMapsProvider>
          
          <div className="absolute top-4 left-4 p-3 glass border-dashed rounded-lg pointer-events-none z-[5]">
             <div className="flex items-center gap-2 text-[var(--blue)]">
                <Activity size={12} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Azure Infrastructure Link</span>
              </div>
          </div>
        </div>

        <div className="map-right bg-[var(--bg2)] border-l border-[var(--b)] overflow-y-auto custom-scrollbar">
          <div className="p-4 flex flex-col gap-4">
             <div className="text-[10px] font-black text-[var(--t2)] uppercase tracking-widest mb-2">Tracked Assets ({donors.length})</div>
             {donors.map(d => (
               <div key={d.id} className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedDonorId === d.id ? 'bg-[var(--bg3)] border-[var(--blue)]' : 'bg-[var(--bg2)] border-[var(--b)] hover:border-[var(--b2)]'}`} onClick={() => setSelectedDonorId(d.id)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs font-black">{d.name}</div>
                      <div className="text-[10px] text-[var(--t3)] font-mono">{d.id}</div>
                    </div>
                    <span className="blood-tag">{d.bg}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-[var(--t2)]">
                    <span>📍 {d.dist} km</span>
                    <span className="capitalize">{d.status}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

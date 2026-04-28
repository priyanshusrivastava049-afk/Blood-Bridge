
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, Polyline, useMapEvents, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Hospital } from '../lib/constants';
import { HeatmapLayer } from './HeatmapLayer';
import { Layers, Map as MapIcon } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HospitalMapProps {
  hospitals: Hospital[];
  selectedHospitalId?: string;
  recommendedHospitalId?: string;
  onSelectHospital: (h: Hospital) => void;
  userLocation: [number, number] | null;
  routeCoords: [number, number][] | null;
  onBoundsChange?: (bounds: L.LatLngBounds) => void;
  isLoading?: boolean;
}

const MapEventsHandler = ({ onBoundsChange }: { onBoundsChange?: (bounds: L.LatLngBounds) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange?.(map.getBounds());
    },
  });
  
  useEffect(() => {
    // Trigger initial load
    onBoundsChange?.(map.getBounds());
  }, []);

  return null;
};

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [lat, lng, map]);
  return null;
};

export const HospitalMap = ({ 
  hospitals, 
  selectedHospitalId, 
  recommendedHospitalId, 
  onSelectHospital, 
  userLocation, 
  routeCoords,
  onBoundsChange,
  isLoading 
}: HospitalMapProps) => {
  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers');
  const defaultCenter: [number, number] = [28.6139, 77.2090]; // Delhi NCR Center

  const getMarkerIcon = (status: Hospital['status'], isSelected: boolean, isRecommended: boolean) => {
    const color = status === 'available' ? '#00d68f' : status === 'limited' ? '#ffb830' : '#e8001a';
    const isEmergency = status === 'full';
    const size = isSelected || isRecommended ? 22 : 14;
    const finalColor = isSelected ? '#2d8bff' : isRecommended ? '#ffb830' : color;
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center">
          ${isSelected ? `<div class="absolute w-10 h-10 rounded-full bg-blue animate-pulse opacity-20"></div>` : ''}
          ${isRecommended && !isSelected ? `<div class="absolute w-12 h-12 rounded-full border-2 border-gold-alpha-20 animate-pulse opacity-40"></div>` : ''}
          ${isEmergency ? `<div class="absolute w-6 h-6 rounded-full bg-blood animate-ping opacity-30"></div>` : ''}
          <div style="background-color: ${finalColor}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.4); box-shadow: 0 0 ${isSelected || isRecommended ? '20px' : '15px'} ${finalColor};" class="relative z-10 transition-all duration-300"></div>
          ${isRecommended ? `<div class="absolute -top-4 text-[8px] font-black bg-gold text-bg px-1 rounded">AI</div>` : ''}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const userIcon = L.divIcon({
    className: 'user-icon',
    html: `<div class="w-4 h-4 bg-white rounded-full border-4 border-blue shadow-[0_0_10px_var(--blue)]"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className="w-full h-full relative map-canvas overflow-hidden">
      <div className="map-scan-overlay" />
      
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-bg2/90 border border-b px-4 py-2 rounded-full flex items-center gap-2 shadow-shadow-glow anim a1">
          <div className="w-2 h-2 rounded-full bg-blue animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Scanning Nationwide Vectors...</span>
        </div>
      )}

      <MapContainer 
        center={defaultCenter} 
        zoom={11} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#0a0e14' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomControl position="topright" />
        
        <MapEventsHandler onBoundsChange={onBoundsChange} />

        <HeatmapLayer hospitals={hospitals} visible={viewMode === 'heatmap'} />

        {viewMode === 'markers' && (
          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            maxClusterRadius={40}
          >
            {hospitals.map((hospital) => (
              <Marker 
                key={hospital.id} 
                position={[hospital.lat, hospital.lng]}
                icon={getMarkerIcon(hospital.status, selectedHospitalId === hospital.id, recommendedHospitalId === hospital.id)}
                eventHandlers={{
                  click: () => onSelectHospital(hospital),
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} className="tactical-tooltip">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black text-[10px] uppercase tracking-tighter">{hospital.name}</span>
                    <span className={`text-[8px] font-bold uppercase ${
                      hospital.status === 'available' ? 'text-green' : hospital.status === 'limited' ? 'text-gold' : 'text-blood'
                    }`}>
                      Status: {hospital.status}
                    </span>
                  </div>
                </Tooltip>
                <Popup className="tactical-popup">
                  <div className="p-1">
                    <div className="font-bold text-bg-darker mb-1">{hospital.name}</div>
                    <div className="text-[10px] text-gray-600 mb-2">Beds: {hospital.availableBeds}/{hospital.totalBeds}</div>
                    <button 
                      onClick={() => onSelectHospital(hospital)}
                      className="w-full py-1.5 bg-blood text-white text-[9px] font-black uppercase rounded"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {routeCoords && (
          <Polyline 
            positions={routeCoords} 
            color="#2d8bff" 
            weight={4} 
            opacity={0.6}
            dashArray="10, 10"
          />
        )}

        {selectedHospitalId && hospitals.find(h => h.id === selectedHospitalId) && (
          <RecenterMap 
            lat={hospitals.find(h => h.id === selectedHospitalId)!.lat} 
            lng={hospitals.find(h => h.id === selectedHospitalId)!.lng} 
          />
        )}
      </MapContainer>

      {/* Map UI Overlays */}
      <div className="absolute top-6 left-6 z-[400] flex flex-col gap-3">
        {/* Toggle Mode */}
        <div className="flex bg-bg2/90 border border-b p-1 rounded-xl shadow-shadow-glow">
          <button 
            onClick={() => setViewMode('markers')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'markers' ? 'bg-blue text-white shadow-blue-glow' : 'text-t3 hover:text-white'
            }`}
          >
            <MapIcon size={12} /> Markers
          </button>
          <button 
            onClick={() => setViewMode('heatmap')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewMode === 'heatmap' ? 'bg-blood text-white shadow-red-glow' : 'text-t3 hover:text-white'
            }`}
          >
            <Layers size={12} /> Heatmap
          </button>
        </div>

        {/* Map Legend */}
        {viewMode === 'markers' ? (
          <div className="map-leg">
            <div className="text-[9px] font-black text-t3 uppercase tracking-[0.2em] mb-1">Tactical Legend</div>
            <div className="leg-item">
              <div className="leg-dot bg-neon-green shadow-neon-green" />
              <span>Available</span>
            </div>
            <div className="leg-item">
              <div className="leg-dot bg-neon-gold" />
              <span>Limited</span>
            </div>
            <div className="leg-item">
              <div className="leg-dot bg-blood shadow-neon-red ring-2 ring-blood ring-opacity-30 animate-pulse" />
              <span>Full / Emergency</span>
            </div>
          </div>
        ) : (
          <div className="map-leg bg-bg2/90 p-3 rounded-xl border border-b anim a2">
            <div className="text-[9px] font-black text-t3 uppercase tracking-[0.2em] mb-2">Demand Density</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-2 rounded-full bg-gradient-to-r from-[#00d68f] via-[#ffb830] to-[#e8001a]" />
                <span className="text-[8px] font-bold text-t2 uppercase tracking-tighter">Low to Critical</span>
              </div>
              <p className="text-[7px] text-t3 leading-tight opacity-70">
                Heat reflects combined load of beds, blood supply, and active requests.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


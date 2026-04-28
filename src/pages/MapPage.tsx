
import React from 'react';
import { motion } from 'framer-motion';
import { HospitalMap } from '../components/HospitalMap';
import { RightPanel } from '../components/RightPanel';
import { Hospital } from '../lib/constants';

interface MapPageProps {
  isLoading: boolean;
  filteredHospitals: Hospital[];
  selectedHospital: Hospital | null;
  setSelectedHospital: (h: Hospital | null) => void;
  aiRecommendedHospital: Hospital | null;
  userLocation: [number, number] | null;
  routeCoords: [number, number][] | null;
  handleBoundsChange: (bounds: any) => void;
  isMapLoading: boolean;
  handleGetDirections: () => void;
  setIsRequestModalOpen: (v: boolean) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  isLoading,
  filteredHospitals,
  selectedHospital,
  setSelectedHospital,
  aiRecommendedHospital,
  userLocation,
  routeCoords,
  handleBoundsChange,
  isMapLoading,
  handleGetDirections,
  setIsRequestModalOpen
}) => {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center justify-between relative"
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
            Tactical Vector Grid
            <span className="text-[10px] not-italic font-black border border-blue/40 text-blue px-2 rounded-md animate-pulse">LIVE_VIEW</span>
          </h1>
          <p className="text-[10px] text-t3 uppercase font-black tracking-widest mt-1">Strategic Overpass Environment · Frequency locked</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="px-3 py-1 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green shadow-neon-green animate-pulse" />
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Encryption: Secure</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 hud-card overflow-hidden border border-white/5 flex shadow-2xl relative"
      >
        <div className="absolute inset-0 bg-scan-pattern animate-scan-slow opacity-10 pointer-events-none z-10" />
        <div className="flex-1 relative border-r border-white/5">
           <HospitalMap 
            hospitals={filteredHospitals} 
            selectedHospitalId={selectedHospital?.id}
            recommendedHospitalId={aiRecommendedHospital?.id}
            onSelectHospital={setSelectedHospital}
            userLocation={userLocation}
            routeCoords={routeCoords}
            onBoundsChange={handleBoundsChange}
            isLoading={isMapLoading}
          />
        </div>
        <div className="w-85 bg-bg/80 backdrop-blur-xl flex flex-col">
          <RightPanel 
            hospital={selectedHospital} 
            onRequestBlood={() => setIsRequestModalOpen(true)}
            onGetDirections={handleGetDirections}
            isLoading={isLoading}
          />
        </div>
      </motion.div>
    </div>
  );
};

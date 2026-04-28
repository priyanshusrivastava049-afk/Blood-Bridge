
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RequestBloodModal } from './components/RequestBloodModal';
import toast, { Toaster } from 'react-hot-toast';
import { generatePrediction, parseUserInput } from './services/geminiService';
import { fetchHospitalsFromOSM } from './services/osmService';
import { MOCK_HOSPITALS as INITIAL_HOSPITALS, MOCK_ALERTS, Hospital, Alert, HospitalStatus } from './lib/constants';
import L from 'leaflet';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MapPage } from './pages/MapPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  const [osmHospitals, setOsmHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterRegion, setFilterRegion] = useState('All Regions');
  const [aiRecommendedHospital, setAiRecommendedHospital] = useState<Hospital | null>(null);

  const [lastBounds, setLastBounds] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [aiPrediction, setAiPrediction] = useState<string>("Tactical analysis suggests shifting O- supply from AIIMS to Safdarjung within the next 45 minutes.");
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [smartInput, setSmartInput] = useState("");
  const [isProcessingSmart, setIsProcessingSmart] = useState(false);

  // Combine initial mock hospitals with OSM fetched ones
  const allHospitals = useMemo(() => {
    const combined = [...osmHospitals];
    INITIAL_HOSPITALS.forEach(h => {
      if (!combined.find(ch => ch.id === h.id)) {
        combined.push(h);
      }
    });
    return combined;
  }, [osmHospitals]);

  // Simulation and Loading
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      toast.success('NEURAL GRID SYNCHRONIZED', {
        style: {
          background: '#0D1117',
          color: '#3498db',
          border: '1px solid rgba(52, 152, 219, 0.2)',
          fontSize: '10px',
          fontWeight: '900',
          letterSpacing: '0.1em'
        }
      });
    }, 2000);

    generatePrediction(allHospitals).then(setAiPrediction);

    const interval = setInterval(() => {
      setOsmHospitals(prev => {
        const updated = prev.map(h => {
          const change = Math.floor(Math.random() * 3) - 1;
          const newAvailable = Math.max(0, Math.min(h.totalBeds, h.availableBeds + change));
          const newStatus = (newAvailable === 0 ? 'full' : newAvailable < 20 ? 'limited' : 'available') as HospitalStatus;
          return { ...h, availableBeds: newAvailable, status: newStatus };
        });
        return updated;
      });
      setLastUpdate(new Date());
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(loadTimer);
    };
  }, [allHospitals]);

  const handleBoundsChange = useCallback((bounds: L.LatLngBounds) => {
    const south = bounds.getSouth();
    const west = bounds.getWest();
    const north = bounds.getNorth();
    const east = bounds.getEast();
    
    const boundsKey = `${south.toFixed(2)},${west.toFixed(2)},${north.toFixed(2)},${east.toFixed(2)}`;
    if (boundsKey === lastBounds) return;
    
    setLastBounds(boundsKey);
    setIsMapLoading(true);

    const timer = setTimeout(async () => {
      try {
        const newHospitals = await fetchHospitalsFromOSM(south, west, north, east);
        setOsmHospitals(prev => {
          const existingIds = new Set(prev.map(h => h.id));
          const uniqueNew = newHospitals.filter(h => !existingIds.has(h.id));
          return [...prev, ...uniqueNew].slice(-1000);
        });
      } catch (e) {
        console.error('Map Fetch Failed:', e);
      } finally {
        setIsMapLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [lastBounds]);

  const filteredHospitals = useMemo(() => {
    return allHospitals.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesType = filterType === 'All Types' || h.type === filterType;
      const matchesRegion = filterRegion === 'All Regions' || h.region === filterRegion;
      const matchesAvailable = !showAvailableOnly || h.status === 'available';
      return matchesSearch && matchesType && matchesRegion && matchesAvailable;
    });
  }, [allHospitals, debouncedSearch, filterType, filterRegion, showAvailableOnly]);

  const handleGetDirections = () => {
    if (!selectedHospital) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation([userLat, userLng]);
        setRouteCoords([
          [userLat, userLng],
          [selectedHospital.lat, selectedHospital.lng]
        ]);
        toast.success(`Vector mapped to ${selectedHospital.name}`);
      }, () => {
        toast.error("GEO-LOCATION ACCESS DENIED");
      });
    }
  };

  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const hospitalsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterType, filterRegion, showAvailableOnly]);

  const { currentHospitals, totalPages } = useMemo(() => {
    const indexOfLast = currentPage * hospitalsPerPage;
    const indexOfFirst = indexOfLast - hospitalsPerPage;
    return {
      currentHospitals: filteredHospitals.slice(indexOfFirst, indexOfLast),
      totalPages: Math.ceil(filteredHospitals.length / hospitalsPerPage)
    };
  }, [filteredHospitals, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const tableElement = document.getElementById('facility-index');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
    if (!isEmergencyMode) {
      toast.error('CRITICAL: EMERGENCY PROTOCOL ACTIVATED', {
        duration: 5000,
        style: { background: '#e8001a', color: '#fff', fontWeight: 'bold' }
      });
    } else {
      toast.success('SYSTEMS RESTORED: Standard Operating Mode');
    }
  };

  const handleOptimizeRoute = async () => {
    setIsProcessingSmart(true);
    const toastId = toast.loading('Calculated Tactical Vectors...');
    try {
      const pred = await generatePrediction(allHospitals);
      setAiPrediction(prev => `[OPTIMIZED] ${pred}`);
      toast.success('Reroute Logistics Complete', { id: toastId });
    } catch (e) {
      toast.error('Optimization Failed', { id: toastId });
    } finally {
      setIsProcessingSmart(false);
    }
  };

  const handleRequestSubmit = (data: any) => {
    const target = selectedHospital?.name || "Global Network";
    toast.success(`Protocol Initiated: ${data.units} units of ${data.bloodGroup} requested for ${target}`, {
      duration: 5000,
      icon: '🩸'
    });
    setIsRequestModalOpen(false);
  };

  const openRequestModal = () => {
    if (!selectedHospital && allHospitals.length > 0) {
      setSelectedHospital(allHospitals[0]);
    }
    setIsRequestModalOpen(true);
  };

  const handleSmartDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartInput.trim()) return;
    setIsProcessingSmart(true);
    try {
      const parsed = await parseUserInput(smartInput);
      if (parsed) {
        toast.success(`EXTRACTED: ${parsed.bloodGroup} in ${parsed.location || 'Current Area'}`, {
          style: { background: '#0D1117', color: '#3498db', border: '1px solid rgba(52, 152, 219, 0.2)' }
        });
        setSearchQuery(parsed.location || "");
      }
    } catch (error) {
      console.error(error);
      toast.error("COULD NOT PARSE VECTOR INPUT");
    } finally {
      setIsProcessingSmart(false);
      setSmartInput("");
    }
  };

  return (
    <div className={`bg-bg min-h-screen text-t1 font-sans selection:bg-blood selection:text-white ${isEmergencyMode ? 'emergency-glow' : ''}`}>
      <Toaster position="bottom-center" />
      
      {!isLandingPage && (
        <Header 
          isEmergency={isEmergencyMode} 
          onToggleEmergency={toggleEmergencyMode}
          onRapidRequest={openRequestModal}
        />
      )}
      
      <div className={!isLandingPage ? "layout" : ""}>
        {!isLandingPage && <Sidebar currentPath={location.pathname} />}
        
        <main className={!isLandingPage ? "main" : ""}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={
              <Dashboard 
                isLoading={isLoading}
                allHospitals={allHospitals}
                currentHospitals={currentHospitals}
                filteredHospitals={filteredHospitals}
                selectedHospital={selectedHospital}
                setSelectedHospital={setSelectedHospital}
                setAiRecommendedHospital={setAiRecommendedHospital}
                aiPrediction={aiPrediction}
                handleOptimizeRoute={handleOptimizeRoute}
                isProcessingSmart={isProcessingSmart}
                smartInput={smartInput}
                setSmartInput={setSmartInput}
                handleSmartDispatch={handleSmartDispatch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                filterRegion={filterRegion}
                setFilterRegion={setFilterRegion}
                showAvailableOnly={showAvailableOnly}
                setShowAvailableOnly={setShowAvailableOnly}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                alerts={alerts}
                userLocation={userLocation}
                openRequestModal={openRequestModal}
                onSyncHistory={() => toast.success('Historical feed synchronized.')}
              />
            } />
            <Route path="/map" element={
              <MapPage 
                isLoading={isLoading}
                filteredHospitals={filteredHospitals}
                selectedHospital={selectedHospital}
                setSelectedHospital={setSelectedHospital}
                aiRecommendedHospital={aiRecommendedHospital}
                userLocation={userLocation}
                routeCoords={routeCoords}
                handleBoundsChange={handleBoundsChange}
                isMapLoading={isMapLoading}
                handleGetDirections={handleGetDirections}
                setIsRequestModalOpen={setIsRequestModalOpen}
              />
            } />
            <Route path="/dispatch" element={<PlaceholderPage title="Live Dispatch" subtitle="Real-time emergency unit tracking" />} />
            <Route path="/donors" element={<PlaceholderPage title="Donor Network" subtitle="Global blood source registry" />} />
            <Route path="/inventory" element={<PlaceholderPage title="Inventory" subtitle="Asset and supply chain monitoring" />} />
            <Route path="/analytics" element={<PlaceholderPage title="Analytics" subtitle="Deep-well data visualization" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" subtitle="Mission debriefing logs" />} />
            <Route path="/alerts" element={<PlaceholderPage title="Alerts Hub" subtitle="Central vulnerability monitoring" />} />
            <Route path="/audit" element={<PlaceholderPage title="Audit Trail" subtitle="Immutable blockchain transaction log" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" subtitle="Neural core configuration" />} />
          </Routes>
        </main>
      </div>

      {!isLandingPage && (
        <RequestBloodModal 
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          hospital={selectedHospital}
          onSubmit={handleRequestSubmit}
        />
      )}
    </div>
  );
}

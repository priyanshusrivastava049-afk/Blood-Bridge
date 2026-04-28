
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Hospital } from '../lib/constants';

interface HeatmapLayerProps {
  hospitals: Hospital[];
  visible: boolean;
}

export const HeatmapLayer = ({ hospitals, visible }: HeatmapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    // Calculate heat points
    const points: [number, number, number][] = hospitals.map(h => {
      // Calculate demand intensity (0.0 to 1.0)
      let intensity = 0.2; // base
      
      if (h.status === 'full') intensity += 0.5;
      if (h.status === 'limited') intensity += 0.3;
      
      // Low blood availability (None/Low)
      const criticalCount = Object.values(h.bloodAvailability).filter(v => v === 'None').length;
      const lowCount = Object.values(h.bloodAvailability).filter(v => v === 'Low').length;
      
      intensity += (criticalCount * 0.1) + (lowCount * 0.05);
      
      // Cap at 1.0
      return [h.lat, h.lng, Math.min(intensity, 1.0)];
    });

    // @ts-ignore - heatLayer is added by leaflet.heat
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.2: '#00d68f', // Green - Low demand
        0.5: '#ffb830', // Yellow - Medium
        0.8: '#e8001a'  // Red - Critical
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, hospitals, visible]);

  return null;
};

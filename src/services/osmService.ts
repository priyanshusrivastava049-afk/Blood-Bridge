
import { Hospital } from '../lib/constants';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter'
];

export async function fetchHospitalsFromOSM(south: number, west: number, north: number, east: number): Promise<Hospital[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](${south},${west},${north},${east});
      way["amenity"="hospital"](${south},${west},${north},${east});
      relation["amenity"="hospital"](${south},${west},${north},${east});
    );
    out center;
  `;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        console.warn(`OSM Mirror failed (${endpoint}): ${response.status}`);
        continue; // Try next mirror
      }

      const data = await response.json();
      
      if (!data.elements || data.elements.length === 0) {
        console.info(`OSM endpoint ${endpoint} returned no elements in this sector.`);
        return [];
      }
      
      return data.elements.map((el: any) => {
        const lat = el.lat || (el.center && el.center.lat);
        const lng = el.lon || (el.center && el.center.lon);
        
        // Mocking missing data for consistency
        const totalBeds = Math.floor(Math.random() * 400) + 50;
        const availableBeds = Math.floor(Math.random() * (totalBeds * 0.4)); // 0-40% available
        
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const bloodAvailability: Record<string, string> = {};
        bloodGroups.forEach(bg => {
          const levels = ['High', 'Medium', 'Low', 'None'];
          bloodAvailability[bg] = levels[Math.floor(Math.random() * levels.length)];
        });

        return {
          id: `osm-${el.id}`,
          name: el.tags.name || 'Emergency Medical Center',
          lat,
          lng,
          type: el.tags['hospital:type'] || (totalBeds > 300 ? 'Multi-Specialty' : 'General'),
          status: availableBeds === 0 ? 'full' : availableBeds < 20 ? 'limited' : 'available',
          availableBeds,
          totalBeds,
          bloodAvailability,
          address: el.tags['addr:full'] || el.tags['addr:street'] || 'Location via OSM Vector',
          phone: el.tags['contact:phone'] || el.tags.phone || '+91 (Network Protected)',
          region: el.tags['addr:state'] || 'Active Sector',
          distance: 0, // Calculated later
        };
      }).filter((h: any) => h.lat && h.lng);
    } catch (error) {
      console.warn(`OSM Fetch Error for ${endpoint}:`, error instanceof Error ? error.message : error);
      // Continue to next mirror if available
    }
  }

  console.error('All OSM mirrors failed or timed out.');
  return [];
}

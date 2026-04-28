export const DELHI_NCR_CENTER: [number, number] = [28.6139, 77.2090];

export async function fetchAllHospitals() {
  const response = await fetch('/api/hospitals'); // Existing proxied route to OSM
  if (!response.ok) throw new Error('Failed to fetch hospitals');
  const data = await response.json();
  
  // Transform OSM data to new schema
  return data.map(h => ({
    ...h,
    osm_id: h.id.toString(),
    latitude: h.lat,
    longitude: h.lng,
    hospital_type: h.type?.toLowerCase() || 'unknown',
    emergency_status: h.emergency || 'unknown',
  }));
}

export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getETAMinutes(distance) {
  return Math.max(2, Math.round(distance * 3)); // Rough estimate 20km/h average city speed
}

export function getNearestHospitals(userPos, hospitals) {
  if (!userPos) return hospitals;
  return [...hospitals]
    .map(h => ({
      ...h,
      distance: getDistanceKm(userPos.lat, userPos.lng, h.latitude, h.longitude),
      eta: getETAMinutes(getDistanceKm(userPos.lat, userPos.lng, h.latitude, h.longitude))
    }))
    .sort((a, b) => a.distance - b.distance);
}

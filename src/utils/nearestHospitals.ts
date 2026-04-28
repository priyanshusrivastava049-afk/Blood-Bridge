import { haversineKm, etaMinutes } from './geo';

export interface HospitalWithDistance {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  emergency: string;
  distKm: number;
  etaMin: number;
}

export function getNearestHospitals(
  hospitals: any[],
  userLat: number,
  userLng: number,
  limit = 10
): HospitalWithDistance[] {
  return hospitals
    .map(h => {
      const d = haversineKm(userLat, userLng, h.lat, h.lng);
      return {
        ...h,
        distKm: parseFloat(d.toFixed(2)),
        etaMin: etaMinutes(d),
      };
    })
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, limit);
}

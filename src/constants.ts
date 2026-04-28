import { Donor, BloodRequest, FeedItem, BloodGroup } from './types.ts';

export const INITIAL_DONORS: Donor[] = [
  { id: 'RK-004', name: 'Rajan Kumar', bg: 'O−', loc: 'Dwarka, Delhi', dist: 1.8, status: 'available', score: 96, lastDon: '4 months ago', col: '#E8001A', lat: 28.5823, lng: 77.0500 },
  { id: 'PN-011', name: 'Priya Nair', bg: 'O−', loc: 'Sector 18, Noida', dist: 3.2, status: 'available', score: 88, lastDon: '6 months ago', col: '#C0001A', lat: 28.5672, lng: 77.3210 },
  { id: 'AM-007', name: 'Arjun Mehta', bg: 'O−', loc: 'Indirapuram, Ghaziabad', dist: 5.1, status: 'available', score: 74, lastDon: '3 months ago', col: '#FF4D6A', lat: 28.6346, lng: 77.3725 },
  { id: 'SK-018', name: 'Sunita Khanna', bg: 'A+', loc: 'Vasant Kunj, Delhi', dist: 2.4, status: 'available', score: 91, lastDon: '5 months ago', col: '#FFB830', lat: 28.5293, lng: 77.1517 },
  { id: 'VD-022', name: 'Vijay Desai', bg: 'B+', loc: 'DLF Phase 3, Gurugram', dist: 3.8, status: 'en-route', score: 82, lastDon: '7 months ago', col: '#00D68F', lat: 28.4907, lng: 77.0898 },
  { id: 'MP-009', name: 'Meera Pillai', bg: 'AB+', loc: 'Sector 62, Noida', dist: 6.2, status: 'busy', score: 65, lastDon: '2 months ago', col: '#2D8BFF', lat: 28.6186, lng: 77.3713 },
  { id: 'RG-015', name: 'Rohit Gupta', bg: 'B−', loc: 'Rohini, Delhi', dist: 7.1, status: 'available', score: 71, lastDon: '8 months ago', col: '#00C8CB', lat: 28.7041, lng: 77.1025 },
  { id: 'AS-003', name: 'Aisha Sheikh', bg: 'A−', loc: 'Greater Kailash, Delhi', dist: 9.4, status: 'available', score: 68, lastDon: '5 months ago', col: '#FF6B2D', lat: 28.5482, lng: 77.2326 },
];

export const MAP_POS = [
  { x: 120, y: 90 }, { x: 330, y: 85 }, { x: 540, y: 100 },
  { x: 100, y: 260 }, { x: 330, y: 250 }, { x: 520, y: 270 },
  { x: 540, y: 140 }, { x: 95, y: 390 },
];

export const INITIAL_REQS: BloodRequest[] = [
  { id: 'REQ-001', pat: 'Anil Sharma', hosp: 'AIIMS Delhi', bg: 'O−', units: 2, urg: 'critical', score: 97, status: 'waiting', time: '14:22', lat: 28.5672, lng: 77.2100 },
  { id: 'REQ-002', pat: 'Baby Girl (Neonate)', hosp: 'Max Super Speciality Saket', bg: 'O+', units: 1, urg: 'critical', score: 90, status: 'confirmed', time: '14:10', lat: 28.5273, lng: 77.2117 },
  { id: 'REQ-003', pat: 'Sunita Devi', hosp: 'Kailash Hospital Sector 27', bg: 'AB+', units: 3, urg: 'high', score: 75, status: 'matched', time: '13:55', lat: 28.5772, lng: 77.3392 },
  { id: 'REQ-004', pat: 'Ramesh Patel', hosp: 'Yashoda Super Speciality Ghaziabad', bg: 'B+', units: 2, urg: 'medium', score: 58, status: 'waiting', time: '13:30', lat: 28.6705, lng: 77.4475 },
  { id: 'REQ-005', pat: 'Kavita Iyer', hosp: 'Fortis Hospital Sector 62 Noida', bg: 'A−', units: 1, urg: 'high', score: 72, status: 'matched', time: '13:15', lat: 28.6186, lng: 77.3713 },
];

export const INITIAL_FEED: FeedItem[] = [
  { id: '1', col: '#E8001A', time: '14:34', t: 'REQ-001: O− urgency upgraded', s: 'Gemini raised score 82→97 · Notifying 3 donors now' },
  { id: '2', col: '#00D68F', time: '14:32', t: 'Vijay Desai confirmed REQ-002', s: 'En route to AIIMS Delhi · ETA 12 min' },
  { id: '3', col: '#FFB830', time: '14:28', t: 'Auto-escalation triggered', s: 'No response in 8 min · Next 2 donors notified' },
  { id: '4', col: '#E8001A', time: '14:22', t: 'New critical request: REQ-001', s: 'Apollo Hospital Delhi · O− · Trauma surgery · Matching now' },
  { id: '5', col: '#00D68F', time: '14:18', t: 'REQ-005 fulfilled', s: 'Aisha Sheikh donated · Patient stable' },
  { id: '6', col: '#2D8BFF', time: '14:10', t: '28 donors active today', s: '6 newly toggled available in last 2 hours' },
  { id: '7', col: '#00C8CB', time: '14:02', t: '12 duplicate requests removed', s: 'AI dedup detected same patient submitted × 3' },
  { id: '8', col: '#E8001A', time: '13:58', t: 'New request: REQ-002', s: 'Safdarjung Hospital · O+ · Neonatal emergency' },
];

export const BG_AVAIL_DATA = {
  'O−': { count: 2, label: 'CRITICAL LOW' },
  'O+': { count: 8, label: 'Available' },
  'A−': { count: 3, label: 'Low' },
  'A+': { count: 6, label: 'Available' },
  'B−': { count: 2, label: 'Low' },
  'B+': { count: 5, label: 'Available' },
  'AB−': { count: 1, label: 'Very Low' },
  'AB+': { count: 4, label: 'Available' }
};

export const BG_RARITY: Record<BloodGroup, number> = {
  'O−': 100, 'B−': 85, 'AB−': 80, 'A−': 75, 'O+': 50, 'B+': 40, 'A+': 35, 'AB+': 20
};

export const AZURE_KEY = (import.meta as any).env.VITE_AZURE_MAPS_KEY || 'YOUR_AZURE_MAPS_KEY';


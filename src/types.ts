export type BloodGroup = 'O−' | 'O+' | 'A−' | 'A+' | 'B−' | 'B+' | 'AB−' | 'AB+';
export type Urgency = 'critical' | 'high' | 'medium';
export type RequestStatus = 'waiting' | 'confirmed' | 'matched' | 'fulfilled';
export type DonorStatus = 'available' | 'en-route' | 'busy';

export interface Donor {
  id: string;
  name: string;
  bg: BloodGroup;
  loc: string;
  dist: number;
  status: DonorStatus;
  score: number;
  lastDon: string;
  col: string;
  pos?: { x: number; y: number };
  lat: number;
  lng: number;
}

export interface BloodRequest {
  id: string;
  pat: string;
  hosp: string;
  bg: BloodGroup;
  units: number;
  urg: Urgency;
  score?: number;
  status: RequestStatus;
  time: string;
  lat?: number;
  lng?: number;
  userId?: string;
}

export interface Alert {
  id: string;
  type: 'shortage' | 'demand' | 'new';
  message: string;
  time: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface FeedItem {
  id: string;
  col: string;
  time: string;
  t: string;
  s: string;
}

export type ScreenId = 'landing' | 'dash' | 'map' | 'azure-map' | 'open-map' | 'req' | 'donor' | 'notify';

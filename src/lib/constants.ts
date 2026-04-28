
export type HospitalStatus = 'available' | 'limited' | 'full';
export type HospitalType = 'Government' | 'Private' | 'Charity';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  availableBeds: number;
  totalBeds: number;
  icuBeds: number;
  bloodAvailability: {
    [key: string]: 'High' | 'Medium' | 'Low' | 'None';
  };
  status: HospitalStatus;
  distance: number; // mock distance from user
  type: HospitalType;
  emergencyStatus: 'Active' | 'Standby';
  region: string;
}

export interface Alert {
  id: string;
  type: 'shortage' | 'demand' | 'new';
  message: string;
  time: string;
  severity: 'critical' | 'warning' | 'info';
}

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'AIIMS Delhi',
    address: 'Ansari Nagar, New Delhi',
    lat: 28.5672,
    lng: 77.2100,
    availableBeds: 12,
    totalBeds: 2500,
    icuBeds: 45,
    bloodAvailability: { 'O-': 'Low', 'O+': 'High', 'A+': 'Medium', 'B+': 'High' },
    status: 'limited',
    distance: 1.2,
    type: 'Government',
    emergencyStatus: 'Active',
    region: 'Central Delhi'
  },
  {
    id: 'h2',
    name: 'Safdarjung Hospital',
    address: 'Ring Road, New Delhi',
    lat: 28.5658,
    lng: 77.2081,
    availableBeds: 42,
    totalBeds: 3000,
    icuBeds: 80,
    bloodAvailability: { 'O-': 'None', 'O+': 'Medium', 'A+': 'High', 'B+': 'Medium' },
    status: 'available',
    distance: 1.5,
    type: 'Government',
    emergencyStatus: 'Active',
    region: 'Central Delhi'
  },
  {
    id: 'h3',
    name: 'Max Super Speciality Saket',
    address: 'Saket, New Delhi',
    lat: 28.5273,
    lng: 77.2117,
    availableBeds: 5,
    totalBeds: 1000,
    icuBeds: 120,
    bloodAvailability: { 'O-': 'Medium', 'O+': 'High', 'A+': 'Low', 'B+': 'High' },
    status: 'full',
    distance: 4.8,
    type: 'Private',
    emergencyStatus: 'Active',
    region: 'South Delhi'
  },
  {
    id: 'h4',
    name: 'Fortis Escorts Heart Institute',
    address: 'Okhla Road, New Delhi',
    lat: 28.5621,
    lng: 77.2842,
    availableBeds: 22,
    totalBeds: 310,
    icuBeds: 90,
    bloodAvailability: { 'O-': 'High', 'O+': 'High', 'A+': 'High', 'B+': 'High' },
    status: 'available',
    distance: 6.1,
    type: 'Private',
    emergencyStatus: 'Standby',
    region: 'South Delhi'
  },
  {
    id: 'h5',
    name: 'Kailash Hospital Noida',
    address: 'Sector 27, Noida',
    lat: 28.5772,
    lng: 77.3392,
    availableBeds: 18,
    totalBeds: 500,
    icuBeds: 60,
    bloodAvailability: { 'O-': 'Low', 'O+': 'Medium', 'A+': 'Medium', 'B+': 'Low' },
    status: 'available',
    distance: 8.2,
    type: 'Private',
    emergencyStatus: 'Active',
    region: 'Noida'
  },
  {
    id: 'h6',
    name: 'Yashoda Super Speciality',
    address: 'Kaushambi, Ghaziabad',
    lat: 28.6439,
    lng: 77.3278,
    availableBeds: 0,
    totalBeds: 400,
    icuBeds: 40,
    bloodAvailability: { 'O-': 'None', 'O+': 'Low', 'A+': 'Low', 'B+': 'None' },
    status: 'full',
    distance: 12.4,
    type: 'Private',
    emergencyStatus: 'Active',
    region: 'Ghaziabad'
  },
  {
    id: 'h7',
    name: 'Apollo Hospital Delhi',
    address: 'Sarita Vihar, Delhi',
    lat: 28.5375,
    lng: 77.2870,
    availableBeds: 15,
    totalBeds: 900,
    icuBeds: 110,
    bloodAvailability: { 'O-': 'High', 'O+': 'High', 'A+': 'High', 'B+': 'High' },
    status: 'limited',
    distance: 5.5,
    type: 'Private',
    emergencyStatus: 'Active',
    region: 'South Delhi'
  },
  {
    id: 'h8',
    name: 'Medanta - The Medicity',
    address: 'Sector 38, Gurugram',
    lat: 28.4358,
    lng: 77.0425,
    availableBeds: 30,
    totalBeds: 1250,
    icuBeds: 250,
    bloodAvailability: { 'O-': 'Medium', 'O+': 'High', 'A+': 'High', 'B+': 'High' },
    status: 'available',
    distance: 15.2,
    type: 'Private',
    emergencyStatus: 'Active',
    region: 'Gurugram'
  },
  {
    id: 'h9',
    name: 'Jaypee Hospital',
    address: 'Sector 128, Noida',
    lat: 28.5135,
    lng: 77.3685,
    availableBeds: 25,
    totalBeds: 600,
    icuBeds: 80,
    bloodAvailability: { 'O-': 'High', 'O+': 'High', 'A+': 'Medium', 'B+': 'High' },
    status: 'available',
    distance: 14.1,
    type: 'Private',
    emergencyStatus: 'Standby',
    region: 'Noida'
  },
  {
    id: 'h10',
    name: 'Sir Ganga Ram Hospital',
    address: 'Rajinder Nagar, Delhi',
    lat: 28.6385,
    lng: 77.1895,
    availableBeds: 8,
    totalBeds: 675,
    icuBeds: 95,
    bloodAvailability: { 'O-': 'Low', 'O+': 'Medium', 'A+': 'High', 'B+': 'Medium' },
    status: 'limited',
    distance: 4.2,
    type: 'Charity',
    emergencyStatus: 'Active',
    region: 'West Delhi'
  }
];

export const MOCK_ALERTS: Alert[] = [
  { id: '1', type: 'shortage', severity: 'critical', message: 'O- Negative Blood Shortage at AIIMS Delhi.', time: '2 mins ago' },
  { id: '2', type: 'demand', severity: 'warning', message: 'High Demand for ICU Beds in Noida Sector 27.', time: '15 mins ago' },
  { id: '3', type: 'new', severity: 'info', message: 'Jaypee Hospital synchronized to Live Grid.', time: '45 mins ago' }
];

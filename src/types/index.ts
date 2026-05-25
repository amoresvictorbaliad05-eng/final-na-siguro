export type UserRole = 'citizen' | 'admin' | 'superadmin';

export type IncidentCategory =
  | 'theft'
  | 'assault'
  | 'vandalism'
  | 'noise_complaint'
  | 'traffic_accident'
  | 'fire'
  | 'domestic_violence'
  | 'drug_related'
  | 'missing_person'
  | 'other';

export type IncidentStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'resolved';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  barangay: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
}

export interface IncidentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentStatus extends 'pending' ? IncidentSeverity : IncidentSeverity;
  status: IncidentStatus;
  location: string;
  barangay: string;
  coordinates?: { lat: number; lng: number };
  images?: string[];
  evidenceDescription?: string;
  witnessName?: string;
  witnessContact?: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  resolutionNotes?: string;
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  reportId?: string;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  approvedReports: number;
  rejectedReports: number;
  resolvedReports: number;
  todayReports: number;
  weekReports: number;
  monthReports: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  count: number;
  category?: string;
}

export const CATEGORY_LABELS: Record<IncidentCategory, string> = {
  theft: 'Theft / Robbery',
  assault: 'Assault',
  vandalism: 'Vandalism',
  noise_complaint: 'Noise Complaint',
  traffic_accident: 'Traffic Accident',
  fire: 'Fire Incident',
  domestic_violence: 'Domestic Violence',
  drug_related: 'Drug Related',
  missing_person: 'Missing Person',
  other: 'Other',
};

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  pending: 'Pending Review',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  resolved: 'Resolved',
};

export const SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const CATEGORY_COLORS: Record<IncidentCategory, string> = {
  theft: '#f59e0b',
  assault: '#ef4444',
  vandalism: '#8b5cf6',
  noise_complaint: '#6366f1',
  traffic_accident: '#f97316',
  fire: '#dc2626',
  domestic_violence: '#e11d48',
  drug_related: '#7c3aed',
  missing_person: '#0ea5e9',
  other: '#64748b',
};
export const BARANGAYS = [
  'Brgy. San Antonio',
  'Brgy. San Jose',
  'Brgy. San Isidro',
  'Brgy. Santo Niño',
  'Brgy. San Pedro',
  'Brgy. Del Pilar',
  'Brgy. Rizal',
  'Brgy. Mabini',
] as const;

export type Barangay = (typeof BARANGAYS)[number];
export const STATUS_COLORS: Record<IncidentStatus, string> = {
  pending: '#f59e0b',
  under_review: '#3b82f6',
  approved: '#22c55e',
  rejected: '#ef4444',
  resolved: '#10b981',
};

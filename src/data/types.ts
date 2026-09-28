export interface Camera {
  id: string;
  name: string;
  zone: string;
  lat: number;
  lng: number;
  status: 'online' | 'offline' | 'alerting';
  lastPing: Date;
  ocrAccuracy: number;
  installedDate: string;
  ipAddress: string;
  make: string;
  resolution: string;
}

export interface Plate {
  plate: string;
  vehicleType: 'Car' | 'Bike' | 'Truck' | 'Bus' | 'Auto';
  color: string;
  make: string;
  ownerName: string;
  isBlacklisted: boolean;
}

export interface TrajectoryPoint {
  cameraId: string;
  cameraName: string;
  timestamp: Date;
  confidence: number;
  lat: number;
  lng: number;
  thumbnailId: string;
  speed: number;
}

export interface Alert {
  id: string;
  timestamp: Date;
  plate: string;
  cameraId: string;
  cameraName: string;
  location: string;
  type: 'blacklist_hit' | 'route_anomaly' | 'system_alert' | 'speed_violation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'acknowledged' | 'resolved' | 'escalated';
  description: string;
  assignedTo?: string;
}

export interface BlacklistEntry {
  id: string;
  plate: string;
  reason: 'Stolen Vehicle' | 'Wanted by Police' | 'Insurance Expired' | 'Registration Expired' | 'Court Order' | 'Suspicious Activity';
  addedBy: string;
  addedDate: Date;
  expiryDate: Date | null;
  status: 'active' | 'inactive';
  sightingCount: number;
  lastSeen?: Date;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  officerId: string;
  role: 'Admin' | 'Traffic Analyst' | 'Enforcement Officer' | 'Auditor';
  email: string;
  phone: string;
  lastLogin: Date;
  status: 'active' | 'inactive';
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  ipAddress: string;
  module: string;
}

export interface ReviewQueueItem {
  id: string;
  cameraId: string;
  cameraName: string;
  plate: string;
  confidence: number;
  timestamp: Date;
  vehicleType: string;
  status: 'pending' | 'confirmed' | 'corrected' | 'rejected';
  correctedPlate?: string;
}

export interface DensityPoint {
  time: string;
  density: number;
  zone?: string;
}

export interface SpeedSegment {
  segment: string;
  avgSpeed: number;
  maxSpeed: number;
}

export interface VehicleClassData {
  name: string;
  value: number;
  color: string;
}

export interface CongestionBottleneck {
  cameraId: string;
  cameraName: string;
  zone: string;
  densityScore: number;
  avgSpeed: number;
  status: 'free' | 'moderate' | 'congested' | 'gridlock';
}

export interface Report {
  id: string;
  type: string;
  dateRange: string;
  generatedAt: Date;
  generatedBy: string;
  status: 'completed' | 'generating';
  fileSize: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type DevicePlatform = 'ios' | 'android' | 'fullscreen';
export type NetworkState = 'online' | 'degraded' | 'offline';
export type UserRole = 'citizen' | 'responder';
export type ActiveTab = 'home' | 'map' | 'sos' | 'incidents' | 'shelters' | 'profile';

export type RiskSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ExplainableFactor {
  id: string;
  name: string;
  value: string;
  impact: 'low' | 'moderate' | 'high' | 'critical';
  trend: 'increasing' | 'stable' | 'decreasing';
  description: string;
  contributionPercent: number;
}

export interface RiskZone {
  id: string;
  name: string;
  district: string;
  state: string;
  riskScore: number; // 0 - 100
  severity: RiskSeverity;
  rainfall24h: number; // in mm
  rainfallTrend: string;
  riverLevel: number; // in meters (danger level e.g. 205.3m)
  dangerLevel: number;
  elevation: number; // in meters
  soilMoistureSaturation: number; // in %
  populationAtRisk: number;
  criticalInfrastructure: {
    hospitals: number;
    schools: number;
    bridgesBlocked: number;
    sheltersActive: number;
  };
  coordinates: [number, number]; // [lat, lng]
  factors: ExplainableFactor[];
  lastUpdated: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  category: 'flooding' | 'structural_collapse' | 'blocked_road' | 'medical_emergency' | 'trapped_citizens' | 'supplies_needed';
  severity: RiskSeverity;
  description: string;
  locationName: string;
  coordinates: [number, number];
  reportedBy: string;
  userRole: UserRole;
  timestamp: string;
  status: 'pending' | 'verified' | 'in_progress' | 'resolved';
  imageUri?: string;
  aiDamageAssessment?: {
    damageDetected: boolean;
    confidence: number;
    severityEstimate: RiskSeverity;
    tags: string[];
    suggestedAction: string;
  };
  synced: boolean;
  offlineCreated?: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  type: 'community_hall' | 'government_school' | 'stadium' | 'relief_camp';
  capacity: number;
  currentOccupancy: number;
  distanceKm: number;
  travelTimeMinutes: number;
  address: string;
  coordinates: [number, number];
  isAccessible: boolean;
  supplies: {
    foodPacks: number;
    waterLiters: number;
    medicalKits: number;
    dryBeds: number;
  };
  contactPhone: string;
  reliefTokenEligible: boolean;
  claimedToken?: boolean;
}

export interface EvacuationRoute {
  id: string;
  origin: string;
  destinationShelterId: string;
  destinationName: string;
  distanceKm: number;
  estTimeMinutes: number;
  safetyScore: number; // 0 - 100
  hazardWarnings: string[];
  steps: {
    instruction: string;
    distance: string;
    isSafe: boolean;
    hazardNote?: string;
  }[];
}

export interface ReliefVoucher {
  id: string;
  title: string;
  code: string;
  category: 'ration' | 'medical' | 'shelter_bed' | 'water_supply';
  value: string;
  expiresIn: string;
  provider: string;
  isRedeemed: boolean;
  iconName: string;
}

export interface OfflineQueueItem {
  id: string;
  actionType: string;
  payload: any;
  createdAt: string;
  retryCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  address: string;
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
  }[];
  role: UserRole;
  reliefWalletBalance: number; // ShopBack style relief points
  totalIncidentsReported: number;
  safetyScore: number;
}

export interface ResponderMission {
  id: string;
  title: string;
  incidentId: string;
  priority: 'high' | 'critical' | 'moderate';
  status: 'assigned' | 'en_route' | 'arrived' | 'rescuing' | 'completed';
  assignedTeam: string;
  location: string;
  coordinates: [number, number];
  affectedCount: number;
  targetHospitalOrShelter: string;
  etaMinutes: number;
  notes: string[];
}

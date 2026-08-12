export type UserRole = 'citizen' | 'moderator' | 'admin';

export interface NewsItem {
  id: string;
  title: string;
  category: 'local' | 'emergency' | 'development' | 'sports' | 'health' | 'education';
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  isFeatured?: boolean;
  status: 'published' | 'pending' | 'rejected';
  views: number;
  publisherRole?: UserRole;
  pendingAction?: 'edit' | 'deletion';
  pendingEditData?: {
    title: string;
    category: 'local' | 'emergency' | 'development' | 'sports' | 'health' | 'education';
    summary: string;
    content: string;
    author: string;
    imageUrl?: string;
    isFeatured?: boolean;
  };
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type MorrelganjUnion = 
  | 'মোড়েলগঞ্জ সদর'
  | 'পঞ্চকরণ'
  | 'দৈবজ্ঞহাটি'
  | 'বারইখালী'
  | 'রামচন্দ্রপুর'
  | 'চিঙ্গড়াখালী'
  | 'হোগলাপাশা'
  | 'পুটিখালী'
  | 'বনগ্রাম'
  | 'নিশানবাড়িয়া'
  | 'জিউধরা'
  | 'খাউলিয়া'
  | 'তেলিগাতী'
  | 'বহুরবুনিয়া'
  | 'অন্যান্য';

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  phone: string;
  union: MorrelganjUnion;
  village: string;
  lastDonationDate: string; // YYYY-MM-DD or 'নতুুুন / পূর্বে দেয়নি'
  isAvailable: boolean;
  status: 'approved' | 'pending' | 'rejected';
  registeredAt: string;
  totalDonations?: number;
  notes?: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'সরকারি হাসপাতাল' | 'বেসরকারি ক্লিনিক' | 'ডায়াগনস্টিক সেন্টার' | 'ইউনিয়ন স্বাস্থ্য কেন্দ্র';
  address: string;
  phone: string;
  emergencyPhone: string;
  bedsCount: number;
  hasEmergency: boolean;
  hasAmbulance: boolean;
  hasICU: boolean;
  services: string[];
  imageUrl?: string;
}

export interface Doctor {
  id: string;
  name: string;
  degree: string;
  speciality: string;
  hospitalAffiliation: string;
  chamberAddress: string;
  visitingDays: string;
  visitingTime: string;
  serialPhone: string;
  fee: string;
  imageUrl?: string;
}

export interface TouristSpot {
  id: string;
  name: string;
  location: string;
  description: string;
  howToGo: string;
  bestTimeToVisit: string;
  imageUrl: string;
  featured: boolean;
}

export interface TourGuide {
  id: string;
  name: string;
  organization: string;
  phone: string;
  services: string[];
  areaOfSpecialty: string;
  rating: number;
}

export interface GovtOffice {
  id: string;
  name: string;
  headOfficer: string;
  address: string;
  phone: string;
  email?: string;
  officeHours: string;
  services: string[];
}

export interface Ambulance {
  id: string;
  title: string;
  provider: 'সরকারি' | 'রেড ক্রিসেন্ট' | 'বেসরকারি' | 'স্বেচ্ছাসেবী';
  driverName: string;
  phone: string;
  isAC: boolean;
  isOxygenAvailable: boolean;
  baseLocation: string;
  isAvailable: boolean;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userRole: UserRole;
  action: string;
  details: string;
}

export interface ModeratorPermissions {
  canManageMap3d: boolean;
  canManageNews: boolean;
  canManageDonors: boolean;
  canManageHospitals: boolean;
  canManageAmbulances: boolean;
  canManageOffices: boolean;
  canManageBuses: boolean;
}

export interface ModeratorApplication {
  id: string;
  applicantName: string;
  phone: string;
  password?: string;
  email?: string;
  union: MorrelganjUnion;
  village: string;
  profession: string;
  reason: string;
  requestedPermissions?: ModeratorPermissions;
  approvedPermissions?: ModeratorPermissions;
  nidOrId?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface EmergencyHelpline {
  id: string;
  title: string;
  subtitle: string;
  number: string;
  formattedNumber?: string;
  category: 'police' | 'fire' | 'health' | 'admin' | 'power' | 'ambulance' | 'helpline' | 'other';
  color?: string;
}

export interface BusSchedule {
  id: string;
  busName: string;
  busType: 'এসি (AC)' | 'নন-এসি (Non-AC)' | 'ডিল্যাক্স (Deluxe)' | 'লোকাল (Local)';
  startingPoint: string;
  destination: string;
  departureTime: string;
  arrivalTime?: string;
  fare: string;
  routeVia?: string;
  counterLocation: string;
  counterPhone: string;
  supervisorPhone?: string;
  notes?: string;
  addedBy?: string;
  status?: 'approved' | 'pending' | 'rejected';
  pendingAction?: 'add' | 'edit' | 'deletion';
  pendingEditData?: Partial<BusSchedule>;
  submittedBy?: string;
  submittedAt?: string;
}

export interface TicketCounter {
  id: string;
  counterName: string;
  location: string;
  phoneNumbers: string[];
  busCompanies: string[];
  operatingHours: string;
  addressDetails?: string;
}

export interface UpazilaRegion {
  id: string;
  name: string;
  englishName: string;
  type: 'পৌরসভা' | 'ইউনিয়ন';
  areaSqKm: number; // e.g. 25.4
  population: number; // e.g. 24500
  literacyRate: string; // e.g. "64.2%"
  voterCount?: number; // e.g. 18200
  chairmanOrMayorName: string;
  chairmanPhone: string;
  chairmanImage?: string;
  officeLocation: string;
  totalVillagesOrWards: string;
  famousPlaces: string[];
  description: string;
  // Map positioning & 3D mesh coordinates
  gridPos: { x: number; y: number; zHeight: number }; // 3D relative positioning on canvas/SVG map
  colorTheme: string;
  iconName?: string;
  pathData?: string; // Authentic geographic boundary SVG path
  centerPoint?: { x: number; y: number }; // SVG center coordinate (0-1000, 0-1100)
  status?: 'approved' | 'pending' | 'rejected';
  pendingAction?: 'add' | 'edit' | 'deletion';
  pendingEditData?: Partial<UpazilaRegion>;
  submittedBy?: string;
  submittedAt?: string;
}

export interface FacebookSettings {
  pageId: string;
  pageAccessToken: string;
  autoPostEnabled: boolean;
  pageName?: string;
  pageFollowers?: number;
  lastVerifiedAt?: string;
}


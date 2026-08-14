import {
  NewsItem,
  BloodDonor,
  Hospital,
  Doctor,
  TouristSpot,
  TourGuide,
  GovtOffice,
  Ambulance,
  SystemLog,
  EmergencyHelpline,
  BusSchedule,
  TicketCounter,
  ModeratorApplication,
  AdminAccount
} from '../types';

export const INITIAL_NEWS: NewsItem[] = [];
export const INITIAL_DONORS: BloodDonor[] = [];
export const INITIAL_HOSPITALS: Hospital[] = [];
export const INITIAL_DOCTORS: Doctor[] = [];
export const INITIAL_SPOTS: TouristSpot[] = [];
export const INITIAL_GUIDES: TourGuide[] = [];
export const INITIAL_OFFICES: GovtOffice[] = [];
export const INITIAL_AMBULANCES: Ambulance[] = [];
export const INITIAL_HELPLINES: EmergencyHelpline[] = [];
export const INITIAL_BUS_SCHEDULES: BusSchedule[] = [];
export const INITIAL_BUS_COUNTERS: TicketCounter[] = [];
export const INITIAL_LOGS: SystemLog[] = [];

export const INITIAL_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'admin-1',
    name: 'প্রধান সুপার এডমিন (অফিসিয়াল)',
    phone: '393773669796',
    password: '1234',
    createdAt: '2026-08-12'
  }
];

export const INITIAL_MODERATOR_APPLICATIONS: ModeratorApplication[] = [
  {
    id: 'mod-app-1',
    applicantName: 'তানভীর আহমেদ',
    phone: '01711223344',
    password: '1234',
    email: 'tanvir@morrelgonj.gov.bd',
    union: 'মোড়েলগঞ্জ সদর',
    village: 'মোড়েলগঞ্জ বাজার',
    profession: 'সামাজিক কর্মী ও শিক্ষক',
    reason: 'মোড়েলগঞ্জ সদরের স্থানীয় সংবাদ, অ্যাম্বুলেন্স এবং ইউনিয়ন পরিচিতি প্রতিনিয়ত আপডেট রাখার জন্য দায়িত্ব নিতে আগ্রহী।',
    nidOrId: '199501192837465',
    status: 'pending',
    submittedAt: '2026-08-13',
    requestedPermissions: {
      canManageMap3d: true,
      canManageNews: true,
      canManageDonors: true,
      canManageHospitals: true,
      canManageAmbulances: true,
      canManageOffices: true,
      canManageBuses: true
    }
  },
  {
    id: 'mod-app-2',
    applicantName: 'মো. সাইফুল ইসলাম',
    phone: '01988776655',
    password: '1234',
    email: 'saiful@gmail.com',
    union: 'জিউধরা',
    village: 'পূর্ব জিউধরা',
    profession: 'ডিজিটাল উদ্যোক্তা',
    reason: 'জিউধরা ইউনিয়নের রক্তদাতা এবং বাস সময়সূচি তথ্য পোর্টালে যুক্ত ও যাচাই বাছাই করতে চাই।',
    nidOrId: '199201987654321',
    status: 'pending',
    submittedAt: '2026-08-14',
    requestedPermissions: {
      canManageMap3d: true,
      canManageNews: true,
      canManageDonors: true,
      canManageHospitals: false,
      canManageAmbulances: false,
      canManageOffices: true,
      canManageBuses: true
    }
  }
];

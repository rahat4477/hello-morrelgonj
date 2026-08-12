import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Newspaper,
  HeartHandshake,
  Cross,
  Stethoscope,
  Compass,
  Building2,
  Ambulance as AmbulanceIcon,
  Activity,
  AlertCircle,
  Eye,
  Check,
  X,
  Search,
  Filter,
  UserCheck,
  ShieldCheck,
  Key,
  Menu,
  ChevronDown,
  ChevronUp,
  Image,
  Upload,
  RefreshCw,
  Globe,
  Sparkles,
  Save,
  PhoneCall,
  Flame,
  ShieldAlert,
  Zap,
  Bus
} from 'lucide-react';
import {
  NewsItem,
  BloodDonor,
  Hospital,
  Doctor,
  TouristSpot,
  GovtOffice,
  Ambulance,
  SystemLog,
  BloodGroup,
  MorrelganjUnion,
  ModeratorPermissions,
  ModeratorApplication,
  EmergencyHelpline,
  BusSchedule,
  TicketCounter,
  UpazilaRegion
} from '../types';
import { saveToFirestore, deleteFromFirestore } from '../lib/useFirestoreSync';
import { compressImage } from '../utils/imageUtils';
import { BusScheduleView } from './BusScheduleView';
import { Morrelganj3DMap } from './Morrelganj3DMap';

interface AdminDashboardProps {
  newsList: NewsItem[];
  setNewsList: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  donorsList: BloodDonor[];
  setDonorsList: React.Dispatch<React.SetStateAction<BloodDonor[]>>;
  hospitalsList: Hospital[];
  setHospitalsList: React.Dispatch<React.SetStateAction<Hospital[]>>;
  doctorsList: Doctor[];
  setDoctorsList: React.Dispatch<React.SetStateAction<Doctor[]>>;
  spotsList: TouristSpot[];
  setSpotsList: React.Dispatch<React.SetStateAction<TouristSpot[]>>;
  officesList: GovtOffice[];
  setOfficesList: React.Dispatch<React.SetStateAction<GovtOffice[]>>;
  ambulancesList: Ambulance[];
  setAmbulancesList: React.Dispatch<React.SetStateAction<Ambulance[]>>;
  helplinesList?: EmergencyHelpline[];
  setHelplinesList?: React.Dispatch<React.SetStateAction<EmergencyHelpline[]>>;
  busSchedules?: BusSchedule[];
  setBusSchedules?: React.Dispatch<React.SetStateAction<BusSchedule[]>>;
  ticketCounters?: TicketCounter[];
  setTicketCounters?: React.Dispatch<React.SetStateAction<TicketCounter[]>>;
  regionsList?: UpazilaRegion[];
  setRegionsList?: React.Dispatch<React.SetStateAction<UpazilaRegion[]>>;
  systemLogs: SystemLog[];
  addLog: (action: string, details: string) => void;
  moderatorPermissions: ModeratorPermissions;
  setModeratorPermissions: React.Dispatch<React.SetStateAction<ModeratorPermissions>>;
  moderatorApplications?: ModeratorApplication[];
  setModeratorApplications?: React.Dispatch<React.SetStateAction<ModeratorApplication[]>>;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  siteLogo?: string;
  setSiteLogo?: (logo: string) => void;
  siteFavicon?: string;
  setSiteFavicon?: (favicon: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  newsList,
  setNewsList,
  donorsList,
  setDonorsList,
  hospitalsList,
  setHospitalsList,
  doctorsList,
  setDoctorsList,
  spotsList,
  setSpotsList,
  officesList,
  setOfficesList,
  ambulancesList,
  setAmbulancesList,
  helplinesList = [],
  setHelplinesList,
  busSchedules = [],
  setBusSchedules,
  ticketCounters = [],
  setTicketCounters,
  regionsList = [],
  setRegionsList,
  systemLogs,
  addLog,
  moderatorPermissions,
  setModeratorPermissions,
  moderatorApplications = [],
  setModeratorApplications,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  siteLogo = '/logo.jpg',
  setSiteLogo,
  siteFavicon = '/logo.jpg',
  setSiteFavicon
}) => {
  type AdminTabType = 'map3d' | 'pending' | 'moderators' | 'branding' | 'helplines' | 'donors' | 'news' | 'hospitals' | 'doctors' | 'offices' | 'ambulances' | 'buses' | 'logs';
  const [internalAdminTab, setInternalAdminTab] = useState<AdminTabType>('pending');
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  // Local state for branding setup
  const [stagedLogo, setStagedLogo] = useState<string | null>(null);
  const [stagedFavicon, setStagedFavicon] = useState<string | null>(null);
  const [logoInputUrl, setLogoInputUrl] = useState('');
  const [faviconInputUrl, setFaviconInputUrl] = useState('');
  const [brandingNotice, setBrandingNotice] = useState<string | null>(null);

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('ফাইলের সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।');
        return;
      }
      try {
        const compressed = await compressImage(file, 350, 0.85);
        setStagedLogo(compressed);
        setBrandingNotice('নতুন লোগো প্রসেস ও কমপ্রেস করা হয়েছে। নিচে "লোগো সেভ করুন" চাপুন!');
      } catch (err) {
        alert('লোগো ইমেজ প্রসেস করতে সমস্যা হয়েছে।');
      }
    }
  };

  const handleFaviconFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('ফাইলের সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।');
        return;
      }
      try {
        const compressed = await compressImage(file, 128, 0.85);
        setStagedFavicon(compressed);
        setBrandingNotice('নতুন ফ্যাবআইকন প্রসেস করা হয়েছে। নিচে "ফ্যাবআইকন সেভ করুন" চাপুন!');
      } catch (err) {
        alert('ফ্যাবআইকন প্রসেস করতে সমস্যা হয়েছে।');
      }
    }
  };

  const handleSaveLogo = async (logoValueToSave?: string) => {
    let targetLogo = logoValueToSave || stagedLogo || (logoInputUrl.trim() ? logoInputUrl.trim() : null);
    if (!targetLogo) {
      alert('অনুগ্রহ করে প্রথমে একটি লোগো ফাইল আপলোড করুন অথবা ইউআরএল দিন।');
      return;
    }
    if (targetLogo.startsWith('data:image')) {
      targetLogo = await compressImage(targetLogo, 350, 0.85);
    }
    if (setSiteLogo) {
      setSiteLogo(targetLogo);
      addLog('লোগো সংরক্ষণ', 'পোর্টের প্রধান লোগো ডেটাবেজে সেভ করা হয়েছে');
      setBrandingNotice('✅ সাইট লোগো সফলভাবে স্থায়ীভাবে ডেটাবেজে সেভ করা হয়েছে!');
      setStagedLogo(null);
      setLogoInputUrl('');
      setTimeout(() => setBrandingNotice(null), 5000);
    }
  };

  const handleSaveFavicon = async (faviconValueToSave?: string) => {
    let targetFavicon = faviconValueToSave || stagedFavicon || (faviconInputUrl.trim() ? faviconInputUrl.trim() : null);
    if (!targetFavicon) {
      alert('অনুগ্রহ করে প্রথমে একটি ফ্যাবআইকন ফাইল আপলোড করুন অথবা ইউআরএল দিন।');
      return;
    }
    if (targetFavicon.startsWith('data:image')) {
      targetFavicon = await compressImage(targetFavicon, 128, 0.85);
    }
    if (setSiteFavicon) {
      setSiteFavicon(targetFavicon);
      addLog('ফ্যাবআইকন সংরক্ষণ', 'ব্রাউজার ট্যাব ফ্যাবআইকন ডেটাবেজে সেভ করা হয়েছে');
      setBrandingNotice('✅ ব্রাউজার ফ্যাবআইকন সফলভাবে স্থায়ীভাবে সেভ ও সংরক্ষণ করা হয়েছে!');
      setStagedFavicon(null);
      setFaviconInputUrl('');
      setTimeout(() => setBrandingNotice(null), 5000);
    }
  };

  const handleSaveAllBranding = () => {
    let savedCount = 0;
    if (stagedLogo || logoInputUrl.trim()) {
      handleSaveLogo();
      savedCount++;
    }
    if (stagedFavicon || faviconInputUrl.trim()) {
      handleSaveFavicon();
      savedCount++;
    }
    if (savedCount === 0) {
      alert('কোনো নতুন লোগো বা ফ্যাবআইকন ফাইল আপলোড বা সিলেক্ট করা হয়নি।');
    }
  };

  const handleResetLogo = () => {
    if (setSiteLogo) {
      setSiteLogo('/logo.jpg');
      setStagedLogo(null);
      setLogoInputUrl('');
      addLog('লোগো রিসেট', 'ডিফল্ট লোগোতে পুনঃস্থাপন করা হয়েছে');
      setBrandingNotice('লোগো ডিফল্ট ইমেজে রিসেট করা হয়েছে!');
      setTimeout(() => setBrandingNotice(null), 4000);
    }
  };

  const handleResetFavicon = () => {
    if (setSiteFavicon) {
      setSiteFavicon('/logo.jpg');
      setStagedFavicon(null);
      setFaviconInputUrl('');
      addLog('ফ্যাবআইকন রিসেট', 'ডিফল্ট ফ্যাবআইকনে পুনঃস্থাপন করা হয়েছে');
      setBrandingNotice('ফ্যাবআইকন ডিফল্ট ইমেজে রিসেট করা হয়েছে!');
      setTimeout(() => setBrandingNotice(null), 4000);
    }
  };

  // Local state for Helpline Control
  const [helpTitle, setHelpTitle] = useState('');
  const [helpSubtitle, setHelpSubtitle] = useState('');
  const [helpNumber, setHelpNumber] = useState('');
  const [helpFormattedNumber, setHelpFormattedNumber] = useState('');
  const [helpCategory, setHelpCategory] = useState<'police' | 'fire' | 'health' | 'admin' | 'power' | 'ambulance' | 'helpline' | 'other'>('health');
  const [editingHelplineId, setEditingHelplineId] = useState<string | null>(null);
  const [helplineSearch, setHelplineSearch] = useState('');

  const handleSaveHelpline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpTitle.trim() || !helpNumber.trim()) {
      alert('হেল্পলাইনের নাম ও নম্বর পূরণ করা বাধ্যতামূলক।');
      return;
    }
    if (!setHelplinesList) return;

    if (editingHelplineId) {
      const updatedItem: EmergencyHelpline = {
        id: editingHelplineId,
        title: helpTitle.trim(),
        subtitle: helpSubtitle.trim(),
        number: helpNumber.trim(),
        formattedNumber: helpFormattedNumber.trim() || helpNumber.trim(),
        category: helpCategory
      };
      setHelplinesList((prev) =>
        prev.map((item) => (item.id === editingHelplineId ? updatedItem : item))
      );
      saveToFirestore('helplines', updatedItem);
      addLog('জরুরি হেল্পলাইন আপডেট', `নম্বর আপডেট করা হয়েছে: ${helpTitle.trim()}`);
      setEditingHelplineId(null);
    } else {
      const newHelpline: EmergencyHelpline = {
        id: 'help-' + Date.now(),
        title: helpTitle.trim(),
        subtitle: helpSubtitle.trim(),
        number: helpNumber.trim(),
        formattedNumber: helpFormattedNumber.trim() || helpNumber.trim(),
        category: helpCategory
      };
      setHelplinesList((prev) => [newHelpline, ...prev]);
      saveToFirestore('helplines', newHelpline);
      addLog('জরুরি হেল্পলাইন যোগ', `নতুন জরুরি নম্বর যোগ করা হয়েছে: ${helpTitle.trim()}`);
    }

    setHelpTitle('');
    setHelpSubtitle('');
    setHelpNumber('');
    setHelpFormattedNumber('');
    setHelpCategory('health');
  };

  const handleEditHelplineClick = (item: EmergencyHelpline) => {
    setEditingHelplineId(item.id);
    setHelpTitle(item.title);
    setHelpSubtitle(item.subtitle);
    setHelpNumber(item.number);
    setHelpFormattedNumber(item.formattedNumber || item.number);
    setHelpCategory(item.category || 'health');
  };

  const handleCancelHelplineEdit = () => {
    setEditingHelplineId(null);
    setHelpTitle('');
    setHelpSubtitle('');
    setHelpNumber('');
    setHelpFormattedNumber('');
    setHelpCategory('health');
  };

  const handleDeleteHelpline = (id: string, title: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${title}" নম্বরটি ডিলিট করতে চান?`)) {
      if (setHelplinesList) {
        setHelplinesList((prev) => prev.filter((item) => item.id !== id));
        deleteFromFirestore('helplines', id);
        addLog('জরুরি হেল্পলাইন ডিলিট', `ডিলিট করা নম্বর: ${title}`);
      }
    }
  };

  const validAdminTabs = ['map3d', 'pending', 'moderators', 'branding', 'helplines', 'donors', 'news', 'hospitals', 'doctors', 'offices', 'ambulances', 'buses', 'logs'];
  const adminTab: AdminTabType = (externalActiveTab && validAdminTabs.includes(externalActiveTab))
    ? (externalActiveTab as AdminTabType)
    : internalAdminTab;

  const setAdminTab = (tab: AdminTabType | string) => {
    if (validAdminTabs.includes(tab)) {
      setInternalAdminTab(tab as AdminTabType);
    }
    if (externalSetActiveTab) {
      externalSetActiveTab(tab);
    }
  };

  // Pending lists
  const pendingDonors = donorsList.filter((d) => d.status === 'pending');
  const pendingNews = newsList.filter((n) => n.status === 'pending');
  const pendingModifications = newsList.filter((n) => n.pendingAction !== undefined);
  const pendingModeratorApps = moderatorApplications.filter((a) => a.status === 'pending');
  const pendingRegions = (regionsList || []).filter((r) => r.status === 'pending' || r.pendingAction === 'edit');
  const pendingBuses = (busSchedules || []).filter((b) => b.status === 'pending' || b.pendingAction === 'edit');

  const pendingTotalCount = pendingDonors.length + pendingModifications.length + pendingModeratorApps.length + pendingRegions.length + pendingBuses.length;

  const adminTabs = [
    {
      id: 'map3d',
      title: 'মোড়েলগঞ্জ পরিচিতি ও ৩ডি ম্যাপ',
      shortLabel: '৩ডি ম্যাপ',
      subtitle: '১৬ ইউনিয়ন ও ১ পৌরসভার বিস্তারিত ও ৩ডি ভিউ',
      icon: Globe
    },
    {
      id: 'pending',
      title: pendingTotalCount > 0 ? `পেন্ডিং আবেদন (${pendingTotalCount}) ও পরিবর্তন` : 'পেন্ডিং আবেদন ও পরিবর্তন',
      shortLabel: pendingTotalCount > 0 ? `পেন্ডিং আবেদন (${pendingTotalCount})` : 'পেন্ডিং আবেদন',
      subtitle: 'রক্তদাতা, তথ্য পরিবর্তন ও মডারেটর এপ্রুভাল',
      icon: AlertCircle,
      badge: pendingTotalCount
    },
    {
      id: 'moderators',
      title: pendingModeratorApps.length > 0 ? `মডারেটর পারমিশন (${pendingModeratorApps.length})` : 'মডারেটর পারমিশন',
      shortLabel: 'মডারেটর পারমিশন',
      subtitle: 'ফিচার এক্সেস কন্ট্রোল ও আবেদন রিভিউ',
      icon: UserCheck,
      badge: pendingModeratorApps.length
    },
    {
      id: 'branding',
      title: 'লোগো ও ফ্যাবআইকন সেটিংস',
      shortLabel: 'লোগো ও আইকন',
      subtitle: 'পোর্টালে ব্র্যান্ড লোগো ও ফ্যাবআইকন আপলোড',
      icon: Image
    },
    {
      id: 'helplines',
      title: 'জরুরি হেল্পলাইন নম্বর',
      shortLabel: 'জরুরি নম্বর',
      subtitle: 'থানা, ফায়ার সার্ভিস, হাসপাতাল ও ইমার্জেন্সি হটলাইন',
      icon: PhoneCall,
      badge: helplinesList.length
    },
    {
      id: 'donors',
      title: 'রক্তদাতা ব্যবস্থাপনা',
      shortLabel: 'রক্তদাতা',
      subtitle: 'রক্তদাতাদের বিস্তারিত তালিকা ও নিয়ন্ত্রণ',
      icon: HeartHandshake,
      badge: pendingDonors.length
    },
    {
      id: 'news',
      title: 'সংবাদ ও বুলেটিন প্রকাশ',
      shortLabel: 'সংবাদ',
      subtitle: 'জরুরী বিজ্ঞপ্তি ও মোড়েলগঞ্জের খবর',
      icon: Newspaper,
      badge: pendingNews.length
    },
    {
      id: 'hospitals',
      title: 'হাসপাতাল ও ক্লিনিক',
      shortLabel: 'হাসপাতাল',
      subtitle: 'স্বাস্থ্য সেবা ও ডায়াগনস্টিক তথ্য',
      icon: Cross
    },
    {
      id: 'doctors',
      title: 'বিশেষজ্ঞ ডাক্তার',
      shortLabel: 'ডাক্তার',
      subtitle: 'চেম্বার ও ভিজিটিং ডাক্তারের সময়সূচি',
      icon: Stethoscope
    },
    {
      id: 'offices',
      title: 'সরকারি দপ্তর ও অফিস',
      shortLabel: 'সরকারি অফিস',
      subtitle: 'উপজেলা প্রশাসন ও পাবলিক সার্ভিস অফিস',
      icon: Building2
    },
    {
      id: 'ambulances',
      title: 'অ্যাম্বুলেন্স সেবা',
      shortLabel: 'অ্যাম্বুলেন্স',
      subtitle: 'জরুরী ২৪/৭ অ্যাম্বুলেন্স ডিরেক্টরি',
      icon: AmbulanceIcon
    },
    {
      id: 'buses',
      title: 'বাস সময়সূচী ও কাউন্টার',
      shortLabel: 'বাস সময়সূচী',
      subtitle: 'বাসের সময়, ভাড়া ও কাউন্টার ফোন নম্বর',
      icon: Bus
    },
    {
      id: 'logs',
      title: 'সিস্টেম একটিভিটি লগ',
      shortLabel: 'সিস্টেম লগ',
      subtitle: 'এডমিন ও মডারেটরের পদক্ষেপের ইতিহাস',
      icon: Activity
    }
  ];

  const handleApproveModeratorApp = (appId: string) => {
    if (!setModeratorApplications) return;
    const target = moderatorApplications.find((a) => a.id === appId);
    if (!target) return;

    const finalPermissions = target.approvedPermissions || target.requestedPermissions || {
      canManageMap3d: true,
      canManageNews: true,
      canManageDonors: true,
      canManageHospitals: true,
      canManageAmbulances: true,
      canManageOffices: true,
      canManageBuses: true
    };

    const updatedApp: ModeratorApplication = {
      ...target,
      status: 'approved',
      approvedPermissions: finalPermissions
    };

    setModeratorApplications((prev) =>
      prev.map((app) => (app.id === appId ? updatedApp : app))
    );
    saveToFirestore('moderatorApplications', updatedApp);

    addLog(
      'মডারেটর আবেদন অনুমোদন',
      `আবেদনকারী ${target.applicantName} (${target.phone}, ${target.union}) কে অনুমোদিত মডারেটর হিসেবে গ্রহণ করা হয়েছে।`
    );
  };

  const handleRejectModeratorApp = (appId: string) => {
    if (!setModeratorApplications) return;
    const target = moderatorApplications.find((a) => a.id === appId);
    if (!target) return;

    const updatedApp: ModeratorApplication = {
      ...target,
      status: 'rejected'
    };

    setModeratorApplications((prev) =>
      prev.map((app) => (app.id === appId ? updatedApp : app))
    );
    saveToFirestore('moderatorApplications', updatedApp);

    addLog(
      'মডারেটর আবেদন বাতিল',
      `আবেদনকারী ${target.applicantName} এর মডারেটর আবেদন বাতিল করা হয়েছে।`
    );
  };

  const handleToggleAppPermission = (appId: string, permKey: keyof ModeratorPermissions) => {
    if (!setModeratorApplications) return;
    setModeratorApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const currentPerms = app.approvedPermissions || app.requestedPermissions || {
          canManageMap3d: true,
          canManageNews: true,
          canManageDonors: true,
          canManageHospitals: true,
          canManageAmbulances: true,
          canManageOffices: true,
          canManageBuses: true
        };
        const updatedPerms = {
          ...currentPerms,
          [permKey]: !currentPerms[permKey]
        };
        const updatedApp: ModeratorApplication = {
          ...app,
          approvedPermissions: updatedPerms
        };
        saveToFirestore('moderatorApplications', updatedApp);
        return updatedApp;
      })
    );
    addLog('মডারেটর পারমিশন পরিমার্জন', `আবেদন আইডি ${appId} এর জন্য "${permKey}" পারমিশন আপডেট করা হয়েছে।`);
  };

  // Handlers for News Pending Actions (Edit / Deletion requests approval)
  const handleApproveNewsAction = (news: NewsItem) => {
    if (news.pendingAction === 'deletion') {
      setNewsList((prev) => prev.filter((n) => n.id !== news.id));
      addLog('এডমিন সংবাদ ডিলিট অনুমোদন', `সংবাদটি স্থায়ীভাবে মুছে ফেলা হয়েছে: "${news.title}"`);
    } else if (news.pendingAction === 'edit' && news.pendingEditData) {
      setNewsList((prev) =>
        prev.map((n) => {
          if (n.id === news.id) {
            return {
              ...n,
              title: news.pendingEditData!.title,
              category: news.pendingEditData!.category,
              summary: news.pendingEditData!.summary,
              content: news.pendingEditData!.content,
              author: news.pendingEditData!.author,
              imageUrl: news.pendingEditData!.imageUrl,
              isFeatured: news.pendingEditData!.isFeatured,
              pendingAction: undefined,
              pendingEditData: undefined
            };
          }
          return n;
        })
      );
      addLog('এডমিন সংবাদ এডিট অনুমোদন', `সংবাদের সংশোধিত সংস্করণ গ্রহণ করা হয়েছে: "${news.pendingEditData.title}"`);
    }
  };

  const handleRejectNewsAction = (news: NewsItem) => {
    setNewsList((prev) =>
      prev.map((n) =>
        n.id === news.id
          ? { ...n, pendingAction: undefined, pendingEditData: undefined }
          : n
      )
    );
    addLog('এডমিন সংশোধন/ডিলিট প্রত্যাখ্যান', `সংবাদ "${news.title}" এর অনুরোধ প্রত্যাখ্যাত হয়েছে।`);
  };

  // New Item States for Admin Entry Forms
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorGroup, setNewDonorGroup] = useState<BloodGroup>('O+');
  const [newDonorPhone, setNewDonorPhone] = useState('');
  const [newDonorUnion, setNewDonorUnion] = useState<MorrelganjUnion>('মোড়েলগঞ্জ সদর');
  const [newDonorVillage, setNewDonorVillage] = useState('');

  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsItem['category']>('local');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('এডমিন ডেস্ক');

  // Handlers for Donor Approval / Rejection
  const handleApproveDonor = (id: string) => {
    setDonorsList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'approved' } : d))
    );
    const donor = donorsList.find((d) => d.id === id);
    addLog('ডোনার অনুমোদন', `${donor?.name || id} রক্তদাতার তথ্য অনুমোদন করা হয়েছে।`);
  };

  const handleRejectDonor = (id: string) => {
    setDonorsList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'rejected' } : d))
    );
    addLog('ডোনার প্রত্যাখ্যান', `আইডি ${id} রক্তদাতা প্রাক-বাছাইয়ে বাতিল করা হয়েছে।`);
  };

  const handleDeleteDonor = (id: string) => {
    setDonorsList((prev) => prev.filter((d) => d.id !== id));
    addLog('ডোনার মুছে ফেলা', `আইডি ${id} রক্তদাতা রিমুভ করা হয়েছে।`);
  };

  // Handlers for News Approval / Rejection
  const handleApproveNews = (id: string) => {
    setNewsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'published' } : n))
    );
    addLog('সংবাদ অনুমোদন', `সংবাদ আইডি ${id} প্রকাশিত করা হয়েছে।`);
  };

  const handleDeleteNews = (id: string) => {
    setNewsList((prev) => prev.filter((n) => n.id !== id));
    addLog('সংবাদ মুছে ফেলা', `সংবাদ আইডি ${id} ডিলিট করা হয়েছে।`);
  };

  // Create Donor as Admin
  const handleAdminAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonorName || !newDonorPhone || !newDonorVillage) return;

    const newEntry: BloodDonor = {
      id: 'bd-' + Date.now(),
      name: newDonorName,
      bloodGroup: newDonorGroup,
      phone: newDonorPhone,
      union: newDonorUnion,
      village: newDonorVillage,
      lastDonationDate: 'নতুন / এডমিন এন্ট্রি',
      isAvailable: true,
      status: 'approved',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    setDonorsList((prev) => [newEntry, ...prev]);
    addLog('নতুন ডোনার যোগ', `এডমিন সরাসরি ${newDonorName} (গ্রুপ ${newDonorGroup}) কে যোগ করেছেন।`);

    setNewDonorName('');
    setNewDonorPhone('');
    setNewDonorVillage('');
  };

  // Create News as Admin
  const handleAdminAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSummary || !newsContent) return;

    const newArticle: NewsItem = {
      id: 'news-' + Date.now(),
      title: newsTitle,
      category: newsCategory,
      summary: newsSummary,
      content: newsContent,
      author: newsAuthor,
      date: new Date().toISOString().split('T')[0],
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
      status: 'published',
      views: 1
    };

    setNewsList((prev) => [newArticle, ...prev]);
    addLog('নতুন সংবাদ প্রকাশ', `এডমিন শিরোনামে নিবন্ধ প্রকাশ করেছেন: "${newsTitle}"`);

    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Title Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-2xl shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-2xl text-white">এডমিন কন্ট্রোল ড্যাশবোর্ড</h2>
              <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                FULL ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              hellomorrelgonj পোর্টালে নিবন্ধিত তথ্য অনুমোদন, সংশোধন, নতুন সংযোজন ও মুছে ফেলার প্যানেল
            </p>
          </div>
        </div>

        {/* Pending counter badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">অনুমোদনের অপেক্ষায়</span>
              <span className="text-sm font-black text-amber-300">
                {pendingTotalCount}টি পেন্ডিং বিষয়
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-rose-600">
            <HeartHandshake className="w-5 h-5" />
            <span className="text-xs font-bold bg-rose-50 px-2 py-0.5 rounded">সক্রিয়</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {donorsList.filter((d) => d.status === 'approved').length}
          </p>
          <p className="text-xs text-slate-500 font-medium">রক্তদাতা তালিকা</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600">
            <Newspaper className="w-5 h-5" />
            <span className="text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">প্রকাশিত</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {newsList.filter((n) => n.status === 'published').length}
          </p>
          <p className="text-xs text-slate-500 font-medium">সংবাদ ও নোটিশ</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-sky-600">
            <Stethoscope className="w-5 h-5" />
            <span className="text-xs font-bold bg-sky-50 px-2 py-0.5 rounded">ডিরেক্টরি</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{doctorsList.length}</p>
          <p className="text-xs text-slate-500 font-medium">বিশেষজ্ঞ ডাক্তার</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600">
            <Building2 className="w-5 h-5" />
            <span className="text-xs font-bold bg-amber-50 px-2 py-0.5 rounded">অফিস</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{officesList.length}</p>
          <p className="text-xs text-slate-500 font-medium">সরকারি অফিসসমূহ</p>
        </div>
      </div>

      {/* ----------------- ADMIN TAB: MODERATOR PERMISSIONS CONTROL ----------------- */}
      {adminTab === 'moderators' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-sky-600" />
                  <h3 className="font-extrabold text-lg text-slate-900">
                    মডারেটর এক্সেস ও ফিচার পারমিশন কন্ট্রোল
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  এডমিন হিসেবে নির্ধারণ করুন মডারেটর ড্যাশবোর্ডে কোন কোন মডারেশন ফিচার এক্সেসযোগ্য থাকবে।
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setModeratorPermissions({
                      canManageNews: true,
                      canManageDonors: true,
                      canManageHospitals: true,
                      canManageAmbulances: true,
                      canManageOffices: true
                    });
                    addLog('মডারেটর পারমিশন পরিবর্তন', 'সকল ফিচার আনলক (Full Access) মোড সেট করা হয়েছে।');
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  সবগুলো আনলক (Full Access)
                </button>

                <button
                  onClick={() => {
                    setModeratorPermissions({
                      canManageNews: true,
                      canManageDonors: true,
                      canManageHospitals: false,
                      canManageAmbulances: false,
                      canManageOffices: false
                    });
                    addLog('মডারেটর পারমিশন পরিবর্তন', 'শুধু সংবাদ ও রক্তদাতা অনুমোদন মোড সেট করা হয়েছে।');
                  }}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  শুধু সংবাদ ও রক্তদাতা
                </button>

                <button
                  onClick={() => {
                    setModeratorPermissions({
                      canManageNews: false,
                      canManageDonors: false,
                      canManageHospitals: false,
                      canManageAmbulances: false,
                      canManageOffices: false
                    });
                    addLog('মডারেটর পারমিশন পরিবর্তন', 'সকল মডারেশন ফিচার লক/স্থগিত করা হয়েছে।');
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  সবগুলো লক (Restricted)
                </button>
              </div>
            </div>

            {/* Moderator Account Badge */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">মডারেটর প্রোফাইল: moderator@morrelganj.gov.bd</h4>
                  <p className="text-xs text-slate-400">বর্তমান স্ট্যাটাস: {
                    Object.values(moderatorPermissions).filter(Boolean).length
                  } / 5 ফিচার এক্টিভ</p>
                </div>
              </div>

              <div className="text-xs font-mono bg-slate-800 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700">
                ভূমিকা: অনুমোদিত ডিস্ট্রিক্ট মডারেটর
              </div>
            </div>

            {/* Permissions Toggles List */}
            <div className="space-y-3 pt-2">
              {[
                {
                  key: 'canManageNews' as const,
                  title: 'সংবাদ ও নোটিশ প্রকাশ এবং ব্যবস্থাপনা',
                  description: 'মডারেটররা পোর্টালে সরাসরি নতুন সংবাদ প্রকাশ, নোটিশ আপডেট ও ডিলিট করার অনুমতি পাবে।',
                  icon: Newspaper
                },
                {
                  key: 'canManageDonors' as const,
                  title: 'রক্তদাতা অনুমোদন ও মোবাইল তথ্য যাচাই',
                  description: 'নাগরিকদের জমা দেওয়া নতুন রক্তদাতার আবেদন যাচাই ও এপ্রুভ করার অনুমতি।',
                  icon: HeartHandshake
                },
                {
                  key: 'canManageHospitals' as const,
                  title: 'হাসপাতাল ও ক্লিনিক তথ্য ডিরেক্টরি',
                  description: 'নতুন হাসপাতাল, ক্লিনিক বা ডায়াগনস্টিক সেন্টারের তথ্য যোগ করা ও রিমুভ করার সুবিধা।',
                  icon: Cross
                },
                {
                  key: 'canManageAmbulances' as const,
                  title: 'জরুরি অ্যাম্বুলেন্স সেবা ডাটাবেস',
                  description: 'অ্যাম্বুলেন্সের চালক, প্রতিষ্ঠান ও যোগাযোগের ফোন নম্বর ডাটাবেস আপডেট করার অনুমতি।',
                  icon: AmbulanceIcon
                },
                {
                  key: 'canManageOffices' as const,
                  title: 'সরকারি দপ্তর ও কর্মকর্তা নির্দেশিকা',
                  description: 'উপজেলা পরিষদ, থানা ও অন্যান্য সরকারি দপ্তরের তথ্য নির্দেশিকা আপডেট করার ক্ষমতা।',
                  icon: Building2
                }
              ].map((perm) => {
                const Icon = perm.icon;
                const isEnabled = moderatorPermissions[perm.key];

                const togglePermission = () => {
                  const updated = {
                    ...moderatorPermissions,
                    [perm.key]: !isEnabled
                  };
                  setModeratorPermissions(updated);
                  addLog(
                    'মডারেটর পারমিশন আপডেট',
                    `"${perm.title}" ফিচারটি ${!isEnabled ? 'চালু' : 'বন্ধ'} করা হয়েছে।`
                  );
                };

                return (
                  <div
                    key={perm.key}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isEnabled
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-200/80 opacity-75'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isEnabled
                            ? 'bg-slate-900 text-amber-300'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900">{perm.title}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isEnabled
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isEnabled ? 'অনুমোদিত (Enabled)' : 'বন্ধ (Disabled)'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{perm.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={togglePermission}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end sm:self-center ${
                        isEnabled
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-300 hover:bg-slate-400 text-slate-800'
                      }`}
                    >
                      {isEnabled ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>চালু আছে</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>বন্ধ করা আছে</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Moderator Applications Overview & Status Management */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sky-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  নাগরিক মডারেটর আবেদনকারী তালিকা ({moderatorApplications.length})
                </h3>
              </div>
            </div>

            {moderatorApplications.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                এখনো কোনো মডারেটর পদে আবেদন জমা পড়েনি।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moderatorApplications.map((app) => {
                  const perms = app.approvedPermissions || app.requestedPermissions || {
                    canManageMap3d: true,
                    canManageNews: true,
                    canManageDonors: true,
                    canManageHospitals: true,
                    canManageAmbulances: true,
                    canManageOffices: true,
                    canManageBuses: true
                  };

                  const permOptions = [
                    { key: 'canManageMap3d' as const, label: '৩ডি ম্যাপ ও ইউনিয়ন', icon: Globe },
                    { key: 'canManageNews' as const, label: 'সংবাদ ও বুলেটিন', icon: Newspaper },
                    { key: 'canManageDonors' as const, label: 'রক্তদাতা প্যানেল', icon: HeartHandshake },
                    { key: 'canManageHospitals' as const, label: 'হাসপাতাল ও ডাক্তার', icon: Cross },
                    { key: 'canManageAmbulances' as const, label: 'অ্যাম্বুলেন্স ডাটাবেস', icon: AmbulanceIcon },
                    { key: 'canManageOffices' as const, label: 'সরকারি দপ্তর', icon: Building2 },
                    { key: 'canManageBuses' as const, label: 'বাস সময়সূচি', icon: Bus },
                  ];

                  return (
                    <div
                      key={app.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                        app.status === 'approved'
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : app.status === 'rejected'
                          ? 'border-rose-200 bg-rose-50/30'
                          : 'border-sky-200 bg-sky-50/30'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                              app.status === 'approved'
                                ? 'bg-emerald-200 text-emerald-900'
                                : app.status === 'rejected'
                                ? 'bg-rose-200 text-rose-900'
                                : 'bg-amber-200 text-amber-900'
                            }`}
                          >
                            {app.status === 'approved'
                              ? 'অনুমোদিত মডারেটর'
                              : app.status === 'rejected'
                              ? 'আবেদন বাতিল'
                              : 'পেন্ডিং মূল্যায়ন'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {app.submittedAt}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{app.applicantName}</h4>
                          <p className="text-xs text-slate-500">{app.profession} — {app.union}, {app.village}</p>
                        </div>

                        <div className="text-xs space-y-1 text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                          <p className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900">লগইন ফোন:</span>
                            <span className="font-mono text-emerald-700 font-bold">{app.phone}</span>
                            {app.email && <span className="text-slate-500">({app.email})</span>}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">পাসওয়ার্ড:</span>
                            <span className="font-mono text-xs text-slate-600">
                              {app.password ? '🔒 সেট করা আছে (********)' : '⚠️ পাসওয়ার্ড দেওয়া হয়নি'}
                            </span>
                          </p>
                          {app.nidOrId && (
                            <p>
                              <span className="font-bold text-slate-900">NID / আইডি:</span> <span className="font-mono">{app.nidOrId}</span>
                            </p>
                          )}
                          <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1">
                            "{app.reason}"
                          </p>
                        </div>

                        {/* Interactive Feature Access Toggle Matrix */}
                        <div className="space-y-1.5 pt-1">
                          <label className="text-[11px] font-extrabold text-slate-800 block">
                            মডারেটর হ্যামবার্গার অপশন এক্সেস কন্ট্রোল (অনুমোদন/পরিবর্তন):
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {permOptions.map((opt) => {
                              const isGranted = perms[opt.key];
                              const IconComp = opt.icon;
                              return (
                                <button
                                  key={opt.key}
                                  type="button"
                                  onClick={() => handleToggleAppPermission(app.id, opt.key)}
                                  className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold flex items-center justify-between gap-1 transition-all cursor-pointer ${
                                    isGranted
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                                      : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                                  }`}
                                >
                                  <div className="flex items-center gap-1 min-w-0 truncate">
                                    <IconComp className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{opt.label}</span>
                                  </div>
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-extrabold shrink-0 ${
                                    isGranted ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {isGranted ? 'অন' : 'অফ'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        {app.status !== 'approved' ? (
                          <button
                            onClick={() => handleApproveModeratorApp(app.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>অনুমোদন করুন</span>
                          </button>
                        ) : (
                          <div className="flex-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1.5 rounded-xl text-center flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>অনুমোদিত (পারমিশন এক্টিভ)</span>
                          </div>
                        )}
                        {app.status !== 'rejected' && (
                          <button
                            onClick={() => handleRejectModeratorApp(app.id)}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>বাতিল</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- ADMIN TAB: BRANDING, LOGO & FAVICON ----------------- */}
      {adminTab === 'branding' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Image className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    পোর্টালে লোগো ও ফ্যাবআইকন আপলোড সেটিংস
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  এখান থেকে আপনার মোবাইল বা কম্পিউটার থেকে ছবি আপলোড করে বা ইমেজের লিংক বসিয়ে পোর্টের লোগো ও ব্রাউজার ট্যাব ফ্যাবআইকন সাথে সাথে পরিবর্তন করতে পারবেন।
                </p>
              </div>
            </div>

            {brandingNotice && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{brandingNotice}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LOGO SECTION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-extrabold text-sm text-slate-900">প্রধান লোগো (Website Logo)</h4>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    হেডার ও ফুটার লোগো
                  </span>
                </div>

                {/* Logo Preview Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">বর্তমান সক্রিয় লোগো প্রিভিউ:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Header style preview */}
                    <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">হেডার প্যানেলে</span>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-12 rounded-full bg-white p-0 border border-emerald-300 shadow-xs shrink-0 overflow-hidden">
                          <img src={siteFavicon || siteLogo || '/logo.jpg'} alt="Favicon Preview" className="w-full h-full object-cover rounded-full" />
                        </div>
                        {siteLogo ? (
                          <img src={siteLogo} alt="Logo Preview" className="h-16 w-auto object-contain max-w-[280px] rounded-md" />
                        ) : (
                          <span className="font-black text-slate-900 text-sm">hellomorrelgonj</span>
                        )}
                      </div>
                    </div>

                    {/* Dark style preview */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 text-white">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ফুটার/ড্রয়ার প্যানেলে</span>
                      <div className="flex items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-white p-0 shrink-0 overflow-hidden">
                          <img src={siteFavicon || siteLogo || '/logo.jpg'} alt="Favicon Preview" className="w-full h-full object-cover rounded-full" />
                        </div>
                        {siteLogo ? (
                          <img src={siteLogo} alt="Logo Preview" className="h-12 w-auto object-contain max-w-[200px] rounded-md" />
                        ) : (
                          <span className="font-bold text-white text-xs">হ্যালো মোড়েলগঞ্জ</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload via File Input */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">
                    ডিভাইস (মোবাইল/কম্পিউটার) থেকে লোগো ছবি বেছে নিন:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      id="logo-file-upload-input"
                      className="hidden"
                      onChange={handleLogoFileUpload}
                    />
                    <label
                      htmlFor="logo-file-upload-input"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>গ্যালারি/ফাইল থেকে লোগো সিলেক্ট করুন</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    সমর্থিত ফাইল: PNG, JPG, JPEG, WEBP, SVG (সর্বোচ্চ ৫ মেগাবাইট)
                  </p>
                </div>

                {/* Staged Logo Preview & Save Action */}
                {stagedLogo && (
                  <div className="bg-emerald-50/80 border-2 border-emerald-500/80 p-3.5 rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>নতুন লোগো সিলেক্ট করা হয়েছে (এখন সেভ করতে হবে):</span>
                      </span>
                      <button
                        onClick={() => setStagedLogo(null)}
                        className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-emerald-200">
                      <img src={stagedLogo} alt="Staged Logo" className="w-12 h-12 object-contain rounded-md border border-slate-200 bg-slate-50" />
                      <div className="flex-1 text-xs text-slate-700 font-medium">
                        লোগোটি পোর্টে চালু করতে নিচের সবুজ <strong className="text-emerald-700">"লোগো সেভ করুন"</strong> বোতামে চাপ দিন।
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveLogo(stagedLogo)}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <Save className="w-4 h-4" />
                      <span>💾 এই লোগোটি সেভ ও পাবলিশ করুন</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Reset Option */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-xs text-slate-500 font-medium">মূল লোগোতে ফিরে যেতে চান?</span>
                <button
                  onClick={handleResetLogo}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>ডিফল্ট লোগো রিসেট</span>
                </button>
              </div>
            </div>

            {/* FAVICON SECTION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-600" />
                    <h4 className="font-extrabold text-sm text-slate-900">ফ্যাবআইকন (Browser Tab Favicon)</h4>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                    ব্রাউজার ট্যাব আইকন
                  </span>
                </div>

                {/* Favicon Browser Tab Simulation */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">ব্রাউজার ট্যাবে দেখতে কেমন লাগবে:</span>
                  <div className="bg-slate-200 p-2.5 rounded-xl border border-slate-300 space-y-1">
                    <div className="bg-white max-w-xs px-3 py-1.5 rounded-t-lg border border-slate-300 flex items-center gap-2 shadow-2xs">
                      <img src={siteFavicon || '/logo.jpg'} alt="Favicon Preview" className="w-4 h-4 object-contain shrink-0" />
                      <span className="text-[11px] font-bold text-slate-800 truncate">
                        hellomorrelgonj — হ্যালো মোড়েলগঞ্জ পোর্টাল
                      </span>
                    </div>
                    <div className="bg-slate-100 h-6 rounded-b-md border border-slate-300"></div>
                  </div>
                </div>

                {/* Upload via File Input */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">
                    ১. ডিভাইস (মোবাইল/কম্পিউটার) থেকে ফ্যাবআইকন বেছে নিন:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*,.ico"
                      id="favicon-file-upload-input"
                      className="hidden"
                      onChange={handleFaviconFileUpload}
                    />
                    <label
                      htmlFor="favicon-file-upload-input"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>গ্যালারি/ফাইল থেকে ফ্যাবআইকন সিলেক্ট করুন</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    সমর্থিত ফরম্যাট: ICO, PNG, JPG, WEBP, SVG (স্কয়ার/বর্গাকার ছবি রেকমেন্ডেড)
                  </p>
                </div>

                {/* Staged Favicon Preview & Save Action */}
                {stagedFavicon && (
                  <div className="bg-amber-50/80 border-2 border-amber-500/80 p-3.5 rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>নতুন ফ্যাবআইকন সিলেক্ট করা হয়েছে (এখন সেভ করতে হবে):</span>
                      </span>
                      <button
                        onClick={() => setStagedFavicon(null)}
                        className="text-[11px] text-rose-600 font-bold hover:underline"
                      >
                        বাতিল
                      </button>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-amber-200">
                      <img src={stagedFavicon} alt="Staged Favicon" className="w-10 h-10 object-contain rounded-md border border-slate-200 bg-slate-50" />
                      <div className="flex-1 text-xs text-slate-700 font-medium">
                        ব্রাউজার ট্যাব আইকন পরিবর্তন করার জন্য নিচের <strong className="text-amber-800">"ফ্যাবআইকন সেভ করুন"</strong> বোতামে চাপ দিন।
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveFavicon(stagedFavicon)}
                      className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99]"
                    >
                      <Save className="w-4 h-4" />
                      <span>💾 এই ফ্যাবআইকনটি সেভ ও পাবলিশ করুন</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Reset Option */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-xs text-slate-500 font-medium">মূল ফ্যাবআইকনে ফিরে যেতে চান?</span>
                <button
                  onClick={handleResetFavicon}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>ডিফল্ট ফ্যাবআইকন রিসেট</span>
                </button>
              </div>
            </div>
          </div>

          {/* Master Save Bar */}
          {(stagedLogo || stagedFavicon || logoInputUrl.trim() || faviconInputUrl.trim()) && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Save className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">নতুন ব্র্যান্ডিং পরিবর্তন সেভ করার জন্য তৈরি!</h4>
                  <p className="text-xs text-slate-300">
                    লোগো বা ফ্যাবআইকন স্থায়ীভাবে ওয়েবসাইটে পরিবর্তন করতে সেভ বোতামে ক্লিক করুন।
                  </p>
                </div>
              </div>
              <button
                onClick={handleSaveAllBranding}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>💾 সমস্ত ব্র্যান্ডিং পরিবর্তনসমূহ সেভ করুন</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ----------------- ADMIN TAB: EMERGENCY HELPLINES MANAGEMENT ----------------- */}
      {adminTab === 'helplines' && (
        <div className="space-y-6">
          {/* Add / Edit Helpline Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-rose-600" />
                <span>{editingHelplineId ? 'জরুরি হেল্পলাইন নম্বর এডিট করুন' : '+ নতুন জরুরি হেল্পলাইন ও হটলাইন যুক্ত করুন'}</span>
              </h3>
              {editingHelplineId && (
                <button
                  onClick={handleCancelHelplineEdit}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  এডিট বাতিল
                </button>
              )}
            </div>

            <form onSubmit={handleSaveHelpline} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সেবা / অফিসের নাম *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মোড়েলগঞ্জ ফায়ার সার্ভিস স্টেশন"
                    value={helpTitle}
                    onChange={(e) => setHelpTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিভাগ / ক্যাটাগরি *
                  </label>
                  <select
                    value={helpCategory}
                    onChange={(e) => setHelpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="police">পুলিশ ও নিরাপত্তা (Police)</option>
                    <option value="fire">ফায়ার সার্ভিস ও উদ্ধার (Fire)</option>
                    <option value="health">হাসপাতাল ও স্বাস্থ্য কেন্দ্র (Health)</option>
                    <option value="admin">উপজেলা প্রশাসন ও ইউএনও (Admin)</option>
                    <option value="power">পল্লী বিদ্যুৎ ও সার্ভিস (Power)</option>
                    <option value="ambulance">জরুরি অ্যাম্বুলেন্স (Ambulance)</option>
                    <option value="helpline">জাতীয় হেল্পলাইন (Helpline)</option>
                    <option value="other">অন্যান্য জরুরি সেবা (Other)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সরাসরি ডায়াল নম্বর (Call Number) *
                  </label>
                  <input
                    type="tel"
                    placeholder="যেমন: 01713991100 অথবা 999"
                    value={helpNumber}
                    onChange={(e) => setHelpNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    প্রদর্শিত ফরম্যাট করা নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: 01713-991100"
                    value={helpFormattedNumber}
                    onChange={(e) => setHelpFormattedNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সংক্ষিপ্ত বিবরণ / উপসেবা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: অগ্নি দুর্ঘটনা ও জরুরি উদ্ধার অভিযান"
                  value={helpSubtitle}
                  onChange={(e) => setHelpSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingHelplineId ? 'আপডেট সেভ করুন' : '+ নতুন হেল্পলাইন যোগ করুন'}</span>
                </button>

                {editingHelplineId && (
                  <button
                    type="button"
                    onClick={handleCancelHelplineEdit}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Emergency Helplines List Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-600" />
                  <span>মোড়েলগঞ্জ জরুরি হটলাইন তালিকা ({helplinesList.length} টি সক্রিয় নম্বর)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  এখানে সকল থানা, ফায়ার সার্ভিস, স্বাস্থ্য সেবা ও প্রশাসনিক জরুরি নম্বর দেখা যাচ্ছে। ১-ক্লিকে যেকোনো নম্বর এডিট বা ডিলিট করতে পারবেন।
                </p>
              </div>

              {/* Search Filter */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="জরুরি নম্বর খুঁজুন..."
                  value={helplineSearch}
                  onChange={(e) => setHelplineSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">সেবার শিরোনাম</th>
                    <th className="p-3">বিবরণ / সাবটাইটেল</th>
                    <th className="p-3">জরুরি নম্বর</th>
                    <th className="p-3">ক্যাটাগরি</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {helplinesList
                    .filter(
                      (item) =>
                        item.title.toLowerCase().includes(helplineSearch.toLowerCase()) ||
                        item.number.includes(helplineSearch) ||
                        item.subtitle.toLowerCase().includes(helplineSearch.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                            <PhoneCall className="w-3.5 h-3.5" />
                          </div>
                          <span>{item.title}</span>
                        </td>
                        <td className="p-3 text-slate-600">{item.subtitle || '-'}</td>
                        <td className="p-3">
                          <a
                            href={`tel:${item.number}`}
                            className="font-mono font-bold text-rose-700 hover:underline inline-flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200"
                          >
                            <PhoneCall className="w-3 h-3 text-rose-600" />
                            <span>{item.formattedNumber || item.number}</span>
                          </a>
                        </td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                            {item.category || 'general'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditHelplineClick(item)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="এডিট করুন"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteHelpline(item.id, item.title)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="ডিলিট করুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ADMIN TAB: PENDING APPROVALS ----------------- */}
      {adminTab === 'pending' && (
        <div className="space-y-6">
          {/* Pending Moderator Applications Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-600" />
                <span>মডারেটর পদের জন্য পেন্ডিং আবেদন ({pendingModeratorApps.length})</span>
              </h3>
            </div>

            {pendingModeratorApps.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                কোনো পেন্ডিং মডারেটর আবেদন মূল্যায়নের অপেক্ষায় নেই।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingModeratorApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 flex flex-col justify-between space-y-3 shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-sky-200 text-sky-900 px-2 py-0.5 rounded">
                          আবেদনকারী
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {app.submittedAt}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900">{app.applicantName}</h4>

                      <div className="text-xs space-y-1 text-slate-700">
                        <p className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">মোবাইল:</span>
                          <span className="font-mono text-slate-900 font-bold">{app.phone}</span>
                          {app.email && <span className="text-slate-500">({app.email})</span>}
                        </p>
                        <p>
                          <span className="font-bold text-slate-900">ইউনিয়ন ও গ্রাম:</span> {app.union}, {app.village}
                        </p>
                        <p>
                          <span className="font-bold text-slate-900">পেশা:</span> {app.profession}
                        </p>
                        {app.nidOrId && (
                          <p>
                            <span className="font-bold text-slate-900">NID / আইডি:</span> <span className="font-mono">{app.nidOrId}</span>
                          </p>
                        )}
                        <div className="bg-white p-2.5 rounded-lg border border-sky-100 mt-1 text-[11px] text-slate-800 leading-relaxed italic">
                          "{app.reason}"
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-sky-200/60">
                      <button
                        onClick={() => handleApproveModeratorApp(app.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>মডারেটর হিসেবে অনুমোদন</span>
                      </button>
                      <button
                        onClick={() => handleRejectModeratorApp(app.id)}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>বাতিল</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Union / Municipality Approvals Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                <span>মডারেটর প্রেরিত পেন্ডিং ইউনিয়ন ও পৌরসভা তথ্য ({pendingRegions.length})</span>
              </h3>
            </div>

            {pendingRegions.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                কোনো ইউনিয়ন বা পৌরসভার পেন্ডিং সংযোজন/সংশোধন নেই।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRegions.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          {reg.type}
                        </span>
                        <span className="text-[10px] font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                          {reg.status === 'pending' ? 'নতুন ইউনিয়ন সংযোজন' : 'তথ্য সংশোধন'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900">{reg.name}</h4>

                      {reg.pendingAction === 'edit' && reg.pendingEditData ? (
                        <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs space-y-1">
                          <p className="font-bold text-amber-900">প্রস্তাবিত সংশোধিত তথ্য:</p>
                          <p className="text-slate-800">দায়িত্বপ্রাপ্ত: {reg.pendingEditData.chairmanOrMayorName || reg.chairmanOrMayorName}</p>
                          <p className="text-slate-800">ফোন: {reg.pendingEditData.chairmanPhone || reg.chairmanPhone}</p>
                          {reg.pendingEditData.description && (
                            <p className="text-slate-600 line-clamp-2">{reg.pendingEditData.description}</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-700 space-y-1">
                          <p><strong>দায়িত্বপ্রাপ্ত:</strong> {reg.chairmanOrMayorName}</p>
                          <p><strong>ফোন:</strong> {reg.chairmanPhone}</p>
                          <p><strong>আবেদনকারী:</strong> {reg.submittedBy || 'মডারেটর'}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                      <button
                        onClick={() => {
                          if (reg.pendingAction === 'edit' && reg.pendingEditData) {
                            const merged: UpazilaRegion = {
                              ...reg,
                              ...reg.pendingEditData,
                              status: 'approved',
                              pendingAction: undefined,
                              pendingEditData: undefined
                            };
                            if (setRegionsList) setRegionsList((prev) => prev.map((r) => (r.id === reg.id ? merged : r)));
                            saveToFirestore('regions', merged);
                            addLog('এডমিন ইউনিয়ন সংশোধন অনুমোদন', `ইউনিয়ন "${merged.name}" অনুমোদন করা হয়েছে।`);
                          } else {
                            const approvedReg: UpazilaRegion = { ...reg, status: 'approved', pendingAction: undefined };
                            if (setRegionsList) setRegionsList((prev) => prev.map((r) => (r.id === reg.id ? approvedReg : r)));
                            saveToFirestore('regions', approvedReg);
                            addLog('এডমিন নতুন ইউনিয়ন অনুমোদন', `ইউনিয়ন "${approvedReg.name}" প্রকাশ করা হয়েছে।`);
                          }
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>অনুমোদন করুন</span>
                      </button>

                      <button
                        onClick={() => {
                          if (reg.pendingAction === 'edit') {
                            const cleared: UpazilaRegion = { ...reg, pendingAction: undefined, pendingEditData: undefined };
                            if (setRegionsList) setRegionsList((prev) => prev.map((r) => (r.id === reg.id ? cleared : r)));
                            saveToFirestore('regions', cleared);
                            addLog('এডমিন ইউনিয়ন সংশোধন বাতিল', `ইউনিয়ন "${reg.name}" এর সংশোধনের আবেদন বাতিল করা হয়েছে।`);
                          } else {
                            if (setRegionsList) setRegionsList((prev) => prev.filter((r) => r.id !== reg.id));
                            deleteFromFirestore('regions', reg.id);
                            addLog('এডমিন নতুন ইউনিয়ন আবেদন বাতিল', `ইউনিয়ন "${reg.name}" আবেদন বাতিল করা হয়েছে।`);
                          }
                        }}
                        className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>বাতিল</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Bus Schedules Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Bus className="w-5 h-5 text-emerald-600" />
                <span>মডারেটর প্রেরিত পেন্ডিং বাস সময়সূচী তথ্য ({pendingBuses.length})</span>
              </h3>
            </div>

            {pendingBuses.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                কোনো বাসের সময়সূচী পেন্ডিং অনুমোদনের অপেক্ষায় নেই।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingBuses.map((bus) => (
                  <div
                    key={bus.id}
                    className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          {bus.busName}
                        </span>
                        <span className="text-[10px] font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                          {bus.pendingAction === 'edit' ? 'তথ্য সংশোধন আবেদন' : 'নতুন বাস সংযোজন'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-800 space-y-1">
                        <p><strong>রুট:</strong> {bus.startingPoint} ➔ {bus.destination}</p>
                        <p><strong>আবেদনকারী মডারেটর:</strong> {bus.submittedBy || bus.addedBy || 'মডারেটর'}</p>
                        <p><strong>কাউন্টার ফোন:</strong> {bus.counterPhone}</p>
                      </div>

                      {bus.pendingAction === 'edit' && bus.pendingEditData && (
                        <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs space-y-1 mt-2">
                          <p className="font-bold text-amber-900 border-b border-amber-100 pb-1 mb-1">
                            প্রস্তাবিত নতুন পরিবর্তনসমূহ:
                          </p>
                          <p><strong>বাসের নাম:</strong> {bus.pendingEditData.busName || bus.busName}</p>
                          <p><strong>ক্যাটাগরি:</strong> {bus.pendingEditData.busType || bus.busType}</p>
                          <p><strong>ভাড়া:</strong> {bus.pendingEditData.fare || bus.fare}</p>
                          <p><strong>ছাড়ার সময়:</strong> {bus.pendingEditData.departureTime || bus.departureTime}</p>
                          <p><strong>পৌঁছানোর সময়:</strong> {bus.pendingEditData.arrivalTime || bus.arrivalTime || 'N/A'}</p>
                          <p><strong>কাউন্টার ফোন:</strong> {bus.pendingEditData.counterPhone || bus.counterPhone}</p>
                          {bus.pendingEditData.routeVia && (
                            <p><strong>রুট বর্ণনা:</strong> {bus.pendingEditData.routeVia}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                      <button
                        onClick={() => {
                          if (bus.pendingAction === 'edit' && bus.pendingEditData) {
                            const approved: BusSchedule = {
                              ...bus,
                              ...bus.pendingEditData,
                              status: 'approved',
                              pendingAction: undefined,
                              pendingEditData: undefined
                            };
                            if (setBusSchedules) setBusSchedules((prev) => prev.map((b) => (b.id === bus.id ? approved : b)));
                            saveToFirestore('buses', approved);
                            addLog('এডমিন বাস সংশোধন অনুমোদন', `বাস "${approved.busName}" এর সংশোধিত তথ্য অনুমোদন করা হয়েছে।`);
                          } else {
                            const approved: BusSchedule = { ...bus, status: 'approved', pendingAction: undefined };
                            if (setBusSchedules) setBusSchedules((prev) => prev.map((b) => (b.id === bus.id ? approved : b)));
                            saveToFirestore('buses', approved);
                            addLog('এডমিন বাস সময়সূচী অনুমোদন', `নতুন বাস "${approved.busName}" প্রকাশ করা হয়েছে।`);
                          }
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>অনুমোদন করুন</span>
                      </button>

                      <button
                        onClick={() => {
                          if (bus.pendingAction === 'edit') {
                            const cleared: BusSchedule = { ...bus, pendingAction: undefined, pendingEditData: undefined };
                            if (setBusSchedules) setBusSchedules((prev) => prev.map((b) => (b.id === bus.id ? cleared : b)));
                            saveToFirestore('buses', cleared);
                            addLog('এডমিন বাস সংশোধন বাতিল', `বাস "${bus.busName}" সংশোধনের আবেদন বাতিল করা হয়েছে।`);
                          } else {
                            if (setBusSchedules) setBusSchedules((prev) => prev.filter((b) => b.id !== bus.id));
                            deleteFromFirestore('buses', bus.id);
                            addLog('এডমিন নতুন বাস আবেদন বাতিল', `বাস "${bus.busName}" আবেদন বাতিল করা হয়েছে।`);
                          }
                        }}
                        className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>বাতিল</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Donors Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-600" />
                <span>নাগরিক আবেদনকৃত পেন্ডিং রক্তদাতা ({pendingDonors.length})</span>
              </h3>
            </div>

            {pendingDonors.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                কোনো পেন্ডিং রক্তদাতা অনুমোদনের অপেক্ষায় নেই।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-lg text-rose-600 bg-white px-3 py-0.5 rounded-lg border border-rose-200">
                          {donor.bloodGroup}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                          পেন্ডিং
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-2">{donor.name}</h4>
                      <p className="text-xs text-slate-600">
                        মোবাইল: <span className="font-bold">{donor.phone}</span>
                      </p>
                      <p className="text-xs text-slate-600">
                        ঠিকানা: {donor.union}, {donor.village}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                      <button
                        onClick={() => handleApproveDonor(donor.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>অনুমোদন করুন</span>
                      </button>

                      <button
                        onClick={() => handleRejectDonor(donor.id)}
                        className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>বাতিল</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Modifications Section (Edit / Deletion requests from Citizens or Moderators) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>প্রকাশিত সংবাদের সংশোধন/ডিলিট অনুমোদনের অনুরোধ ({pendingModifications.length})</span>
              </h3>
            </div>

            {pendingModifications.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                প্রকাশিত সংবাদের কোনো পরিবর্তন বা মুছে ফেলার অনুরোধ নেই।
              </div>
            ) : (
              <div className="space-y-3">
                {pendingModifications.map((news) => (
                  <div
                    key={news.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      news.pendingAction === 'deletion'
                        ? 'border-rose-200 bg-rose-50/50'
                        : 'border-amber-200 bg-amber-50/50'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1 w-full">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            news.pendingAction === 'deletion'
                              ? 'bg-rose-200 text-rose-900'
                              : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          {news.pendingAction === 'deletion'
                            ? 'ডিলিটের অনুরোধ'
                            : 'সম্পাদনা / পরিবর্তন অনুরোধ'}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                          বর্তমান লেখক: {news.author}
                        </span>
                      </div>

                      {news.pendingAction === 'edit' && news.pendingEditData ? (
                        <div className="space-y-1 bg-white p-3 rounded-xl border border-amber-200 mt-1">
                          <p className="text-xs text-amber-900 font-bold break-words">
                            প্রস্তাবিত নতুন শিরোনাম: <span className="text-slate-900">{news.pendingEditData.title}</span>
                          </p>
                          <p className="text-xs text-slate-600 line-clamp-2 break-words">
                            প্রস্তাবিত সংক্ষেপ: {news.pendingEditData.summary}
                          </p>
                          <p className="text-[11px] text-emerald-800 font-semibold truncate">
                            প্রস্তাবিত নতুন নাম: {news.pendingEditData.author}
                          </p>
                        </div>
                      ) : (
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-2 break-words">{news.title}</h4>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleApproveNewsAction(news)}
                        className={`py-2 px-4 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer text-white ${
                          news.pendingAction === 'deletion'
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>
                          {news.pendingAction === 'deletion'
                            ? 'ডিলিট অনুমোদন'
                            : 'পরিবর্তন অনুমোদন'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleRejectNewsAction(news)}
                        className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>প্রত্যাখ্যান</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- ADMIN TAB: DONORS MANAGEMENT ----------------- */}
      {adminTab === 'donors' && (
        <div className="space-y-6">
          {/* Add New Donor Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>এডমিন দ্বারা সরাসরি রক্তদাতা যোগ করুন</span>
            </h3>

            <form onSubmit={handleAdminAddDonor} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="ডোনার নাম"
                value={newDonorName}
                onChange={(e) => setNewDonorName(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none"
                required
              />

              <select
                value={newDonorGroup}
                onChange={(e) => setNewDonorGroup(e.target.value as BloodGroup)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-bold"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                placeholder="মোবাইল নম্বর"
                value={newDonorPhone}
                onChange={(e) => setNewDonorPhone(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none"
                required
              />

              <input
                type="text"
                placeholder="গ্রাম / এলাকা"
                value={newDonorVillage}
                onChange={(e) => setNewDonorVillage(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none"
                required
              />

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer"
              >
                + ডোনার সেভ করুন
              </button>
            </form>
          </div>

          {/* Donors List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-800">
              সমস্ত রক্তদাতা ডাটাবেস ({donorsList.length} জন)
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">গ্রুপ</th>
                    <th className="p-3">নাম</th>
                    <th className="p-3">মোবাইল</th>
                    <th className="p-3">ইউনিয়ন ও গ্রাম</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donorsList.map((donor) => (
                    <tr key={donor.id} className="hover:bg-slate-50">
                      <td className="p-3 font-black text-rose-600">{donor.bloodGroup}</td>
                      <td className="p-3 font-bold text-slate-900">{donor.name}</td>
                      <td className="p-3 font-mono text-slate-700">{donor.phone}</td>
                      <td className="p-3 text-slate-600">
                        {donor.union}, {donor.village}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            donor.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {donor.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteDonor(donor.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ADMIN TAB: NEWS MANAGEMENT ----------------- */}
      {adminTab === 'news' && (
        <div className="space-y-6">
          {/* Add Article Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>নতুন পোস্ট বা সংবাদ প্রকাশ করুন</span>
            </h3>

            <form onSubmit={handleAdminAddNews} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="সংবাদের শিরোনাম"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none"
                  required
                />

                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value as any)}
                  className="px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                >
                  <option value="local">স্থানীয় সংবাদ</option>
                  <option value="emergency">জরুরি নোটিশ</option>
                  <option value="development">উন্নয়ন</option>
                  <option value="health">স্বাস্থ্য</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="এক বাক্যে সংক্ষেপ"
                value={newsSummary}
                onChange={(e) => setNewsSummary(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none"
                required
              />

              <textarea
                rows={3}
                placeholder="বিস্তারিত সংবাদ লিখুন..."
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:outline-none"
                required
              />

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-colors cursor-pointer"
              >
                সরাসরি প্রকাশ করুন
              </button>
            </form>
          </div>

          {/* News Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-800">
              প্রকাশিত সংবাদ তালিকা ({newsList.length} টি)
            </div>

            <div className="divide-y divide-slate-100">
              {newsList.map((news) => (
                <div key={news.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {news.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{news.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{news.summary}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteNews(news.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ADMIN TAB: MAP 3D ----------------- */}
      {adminTab === 'map3d' && (
        <Morrelganj3DMap
          regionsList={regionsList}
          setRegionsList={setRegionsList}
          isEditable={true}
          userRole="admin"
          addLog={addLog}
        />
      )}

      {/* ----------------- ADMIN TAB: BUSES ----------------- */}
      {adminTab === 'buses' && (
        <BusScheduleView
          busSchedules={busSchedules}
          setBusSchedules={setBusSchedules}
          ticketCounters={ticketCounters}
          setTicketCounters={setTicketCounters}
          isEditable={true}
          userRole="admin"
          addLog={addLog}
        />
      )}

      {/* ----------------- ADMIN TAB: LOGS ----------------- */}
      {adminTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>সিস্টেম অ্যাক্টিভিটি লগ</span>
          </h3>

          <div className="space-y-2 font-mono text-xs">
            {systemLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
              >
                <div>
                  <span className="text-emerald-700 font-bold">[{log.timestamp}]</span>{' '}
                  <span className="font-bold text-slate-800">({log.userRole.toUpperCase()})</span>{' '}
                  <span className="text-slate-900 font-semibold">{log.action}:</span>{' '}
                  <span className="text-slate-600">{log.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Newspaper,
  HeartHandshake,
  Building2,
  Truck,
  Building,
  User,
  UserCheck,
  LogOut,
  PlusCircle,
  Trash2,
  Edit,
  Check,
  AlertCircle,
  Clock,
  RotateCcw,
  Send,
  Calendar,
  Eye,
  CheckCircle2,
  Phone,
  MapPin,
  ShieldCheck,
  Plus,
  Activity,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Bus,
  Globe,
  Upload
} from 'lucide-react';

import {
  BloodDonor,
  NewsItem,
  Hospital,
  Ambulance,
  GovtOffice,
  ModeratorPermissions,
  BusSchedule,
  TicketCounter,
  UpazilaRegion
} from '../types';
import { MORRELGANJ_UPAZILA_INFO } from '../data/morrelgonjRegionData';
import { BusScheduleView } from './BusScheduleView';
import { Morrelganj3DMap } from './Morrelganj3DMap';

interface ModeratorDashboardProps {
  donorsList: BloodDonor[];
  setDonorsList: React.Dispatch<React.SetStateAction<BloodDonor[]>>;
  newsList: NewsItem[];
  setNewsList: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  hospitalsList: Hospital[];
  setHospitalsList: React.Dispatch<React.SetStateAction<Hospital[]>>;
  ambulancesList: Ambulance[];
  setAmbulancesList: React.Dispatch<React.SetStateAction<Ambulance[]>>;
  officesList: GovtOffice[];
  setOfficesList: React.Dispatch<React.SetStateAction<GovtOffice[]>>;
  busSchedules?: BusSchedule[];
  setBusSchedules?: React.Dispatch<React.SetStateAction<BusSchedule[]>>;
  ticketCounters?: TicketCounter[];
  setTicketCounters?: React.Dispatch<React.SetStateAction<TicketCounter[]>>;
  regionsList?: UpazilaRegion[];
  setRegionsList?: React.Dispatch<React.SetStateAction<UpazilaRegion[]>>;
  upazilaInfo?: typeof MORRELGANJ_UPAZILA_INFO;
  setUpazilaInfo?: React.Dispatch<React.SetStateAction<typeof MORRELGANJ_UPAZILA_INFO>>;
  onLogout: () => void;
  addLog: (action: string, details: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  moderatorPermissions?: ModeratorPermissions;
}

export const ModeratorDashboard: React.FC<ModeratorDashboardProps> = ({
  donorsList,
  setDonorsList,
  newsList,
  setNewsList,
  hospitalsList,
  setHospitalsList,
  ambulancesList,
  setAmbulancesList,
  officesList,
  setOfficesList,
  busSchedules = [],
  setBusSchedules,
  ticketCounters = [],
  setTicketCounters,
  regionsList = [],
  setRegionsList,
  upazilaInfo,
  setUpazilaInfo,
  onLogout,
  addLog,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  moderatorPermissions = {
    canManageNews: true,
    canManageDonors: true,
    canManageHospitals: true,
    canManageAmbulances: true,
    canManageOffices: true
  }
}) => {
  // Navigation active tab: 'map3d' | 'news' | 'donors' | 'hospitals' | 'ambulances' | 'offices' | 'buses'
  type ModTabType = 'map3d' | 'news' | 'donors' | 'hospitals' | 'ambulances' | 'offices' | 'buses';
  const [internalActiveTab, setInternalActiveTab] = useState<ModTabType>('news');
  const [isModHamburgerOpen, setIsModHamburgerOpen] = useState(false);

  const activeTab = (externalActiveTab && ['map3d', 'news', 'donors', 'hospitals', 'ambulances', 'offices', 'buses'].includes(externalActiveTab))
    ? (externalActiveTab as ModTabType)
    : internalActiveTab;

  const setActiveTab = (tab: ModTabType) => {
    setInternalActiveTab(tab);
    if (externalSetActiveTab) {
      externalSetActiveTab(tab);
    }
  };

  // Moderator Profile details
  const MOD_PROFILE_NAME = 'মডারেটর, হ্যালো মোড়েলগঞ্জ';
  const MOD_EMAIL = 'moderator@morrelganj.gov.bd';

  // Counts
  const pendingDonors = donorsList.filter((d) => d.status === 'pending');
  const pendingNews = newsList.filter((n) => n.status === 'pending');
  const publishedNews = newsList.filter((n) => n.status === 'published');

  const moderatorTabs = [
    {
      id: 'map3d',
      title: 'মোড়েলগঞ্জ পরিচিতি ও ৩ডি ম্যাপ',
      shortLabel: '৩ডি ম্যাপ',
      subtitle: '১৬ ইউনিয়ন ও ১ পৌরসভার বিস্তারিত ও ৩ডি ভিউ',
      icon: Globe,
      allowed: true
    },
    {
      id: 'news',
      title: 'সংবাদ ও নোটিশ প্রকাশ',
      shortLabel: 'সংবাদ ও নোটিশ',
      subtitle: 'জরুরী ঘোষণা ও বুলেটিন পোস্ট',
      icon: Newspaper,
      allowed: moderatorPermissions.canManageNews,
      badge: moderatorPermissions.canManageNews && pendingNews.length > 0 ? pendingNews.length : undefined
    },
    {
      id: 'donors',
      title: 'রক্তদাতা অনুমোদন ও আপডেট',
      shortLabel: 'রক্তদাতা অনুমোদন',
      subtitle: 'রক্তদাতাদের আবেদন যাচাই ও ফোন ভেরিফিকেশন',
      icon: HeartHandshake,
      allowed: moderatorPermissions.canManageDonors,
      badge: moderatorPermissions.canManageDonors && pendingDonors.length > 0 ? pendingDonors.length : undefined
    },
    {
      id: 'hospitals',
      title: `হাসপাতাল ও ডায়াগনস্টিক (${hospitalsList.length})`,
      shortLabel: 'হাসপাতাল',
      subtitle: 'স্বাস্থ্য প্রতিষ্ঠান ও আইসিইউ তথ্য',
      icon: Building2,
      allowed: moderatorPermissions.canManageHospitals
    },
    {
      id: 'ambulances',
      title: `অ্যাম্বুলেন্স সেবা (${ambulancesList.length})`,
      shortLabel: 'অ্যাম্বুলেন্স',
      subtitle: 'উপজেলার জরুরি ড্রাইভার ও গাড়ি',
      icon: Truck,
      allowed: moderatorPermissions.canManageAmbulances
    },
    {
      id: 'offices',
      title: `সরকারি দপ্তর ও পরিষদ (${officesList.length})`,
      shortLabel: 'সরকারি অফিস',
      subtitle: 'ইউনিয়ন ও উপজেলা অফিসের নম্বর',
      icon: Building,
      allowed: moderatorPermissions.canManageOffices
    },
    {
      id: 'buses',
      title: `বাস সময়সূচী ও কাউন্টার (${busSchedules.length})`,
      shortLabel: 'বাস সময়সূচী',
      subtitle: 'বাসের সময়, ভাড়া ও কাউন্টার ফোন নম্বর',
      icon: Bus,
      allowed: true
    }
  ];

  // News Publish Modal / Form State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<NewsItem['category']>('local');
  const [showAuthorName, setShowAuthorName] = useState<boolean>(true);
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Edit News Modal State (Requires Admin Approval)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<NewsItem['category']>('local');
  const [editShowAuthorName, setEditShowAuthorName] = useState<boolean>(true);
  const [editSummary, setEditSummary] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);

  // Hospital Add Modal State
  const [isAddHospitalModalOpen, setIsAddHospitalModalOpen] = useState(false);
  const [hospName, setHospName] = useState('');
  const [hospType, setHospType] = useState<Hospital['type']>('বেসরকারি ক্লিনিক');
  const [hospAddress, setHospAddress] = useState('');
  const [hospPhone, setHospPhone] = useState('');
  const [hospEmergencyPhone, setHospEmergencyPhone] = useState('');
  const [hospBeds, setHospBeds] = useState(10);
  const [hospHasEmergency, setHospHasEmergency] = useState(true);
  const [hospHasAmbulance, setHospHasAmbulance] = useState(false);
  const [hospHasICU, setHospHasICU] = useState(false);
  const [hospServicesText, setHospServicesText] = useState('আউটডোর, রক্ত পরীক্ষা, অতি-জরুরি চিকিৎসা');

  // Ambulance Add Modal State
  const [isAddAmbulanceModalOpen, setIsAddAmbulanceModalOpen] = useState(false);
  const [ambTitle, setAmbTitle] = useState('');
  const [ambProvider, setAmbProvider] = useState<Ambulance['provider']>('বেসরকারি');
  const [ambDriver, setAmbDriver] = useState('');
  const [ambPhone, setAmbPhone] = useState('');
  const [ambLocation, setAmbLocation] = useState('মোড়েলগঞ্জ সদর');
  const [ambIsAC, setAmbIsAC] = useState(true);
  const [ambIsOxygen, setAmbIsOxygen] = useState(true);

  // Govt Office Add Modal State
  const [isAddOfficeModalOpen, setIsAddOfficeModalOpen] = useState(false);
  const [offName, setOffName] = useState('');
  const [offOfficer, setOffOfficer] = useState('');
  const [offAddress, setOffAddress] = useState('');
  const [offPhone, setOffPhone] = useState('');
  const [offEmail, setOffEmail] = useState('');
  const [offHours, setOffHours] = useState('রবি-বৃহস্পতি (সকাল ৯টা - বিকাল ৪টা)');
  const [offServicesText, setOffServicesText] = useState('নাগরিক সেবা, সনদপত্র প্রদান, অভিযোগ গ্রহণ');

  // Lock scroll when modals are open
  useEffect(() => {
    if (
      isPublishModalOpen ||
      editingNews ||
      isAddHospitalModalOpen ||
      isAddAmbulanceModalOpen ||
      isAddOfficeModalOpen
    ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [
    isPublishModalOpen,
    editingNews,
    isAddHospitalModalOpen,
    isAddAmbulanceModalOpen,
    isAddOfficeModalOpen
  ]);

  // Image Presets for Quick Selection
  const imagePresets = [
    {
      label: 'পানগুছি নদী / স্থানীয় প্রকৃতি',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'জরুরি নোটিশ / ফায়ার সার্ভিস',
      url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'স্বাস্থ্য সেবা / হাসপাতাল',
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'উন্নয়ন কাজ / রাস্তাঘাট',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'শিক্ষা / বই উৎসব',
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // News Image File Upload Handlers
  const handleNewNewsImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('ছবিটি সাইজে বড়। অনুগ্রহ করে ৫MB এর চেয়ে কম আকারের ছবি আপলোড করুন।');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setNewImageUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditNewsImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('ছবিটি সাইজে বড়। অনুগ্রহ করে ৫MB এর চেয়ে কম আকারের ছবি আপলোড করুন।');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setEditImageUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // News Actions
  const handleApproveNews = (id: string) => {
    setNewsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'published' } : n))
    );
    const item = newsList.find((n) => n.id === id);
    addLog('মডারেটর প্রকাশ', `সংবাদ আইডি ${id} ("${item?.title || ''}") প্রকাশ করা হয়েছে।`);
  };

  const handleRejectNews = (id: string) => {
    setNewsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'rejected' } : n))
    );
    addLog('মডারেটর বাাতিল', `সংবাদ আইডি ${id} বাতিল করা হয়েছে।`);
  };

  const handleRequestDeleteNews = (id: string, title: string) => {
    if (
      window.confirm(
        `আপনি কি "${title}" সংবাদটি মুছে ফেলতে চান?\n\nএটি মুছে ফেলতে এডমিনের (Admin) অনুমোদনের প্রয়োজন হবে।`
      )
    ) {
      setNewsList((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, pendingAction: 'deletion' } : n
        )
      );
      addLog('মডারেটর ডিলিট অনুরোধ', `সংবাদটি মুছে ফেলার অনুমতি চেয়ে এডমিনে পাঠানো হয়েছে: ${title}`);
    }
  };

  const handleCancelPendingAction = (id: string, title: string) => {
    setNewsList((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, pendingAction: undefined, pendingEditData: undefined }
          : n
      )
    );
    addLog('মডারেটর অনুরোধ প্রত্যাহার', `সংবাদ "${title}" এর এডমিন অনুমোদনের অনুরোধ প্রত্যাহার করা হয়েছে।`);
  };

  const handleOpenEditModal = (news: NewsItem) => {
    setEditingNews(news);
    setEditTitle(news.title);
    setEditCategory(news.category);
    setEditSummary(news.summary);
    setEditContent(news.content);
    setEditImageUrl(news.imageUrl || '');
    setEditIsFeatured(!!news.isFeatured);
    setEditShowAuthorName(!news.author.includes('বার্তা'));
  };

  const handleEditNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editTitle.trim() || !editSummary.trim() || !editContent.trim()) return;

    const proposedAuthor = editShowAuthorName ? MOD_PROFILE_NAME : 'হ্যালো মোড়েলগঞ্জ বার্তা';

    setNewsList((prev) =>
      prev.map((n) => {
        if (n.id === editingNews.id) {
          return {
            ...n,
            pendingAction: 'edit',
            pendingEditData: {
              title: editTitle.trim(),
              category: editCategory,
              summary: editSummary.trim(),
              content: editContent.trim(),
              author: proposedAuthor,
              imageUrl: editImageUrl.trim() || editingNews.imageUrl,
              isFeatured: editIsFeatured
            }
          };
        }
        return n;
      })
    );

    addLog('মডারেটর সংবাদ পরিবর্তন অনুরোধ', `সংবাদটি ("${editTitle.trim()}") সংশোধনের জন্য এডমিন অনুমোদনে পাঠানো হয়েছে।`);
    setEditingNews(null);
    alert('সংবাদ সংশোধনের অনুরোধটি এডমিন (Admin) অনুমোদনের জন্য সফলভাবে পাঠানো হয়েছে!');
  };

  const handlePublishNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newSummary.trim() || !newContent.trim()) {
      setErrorMsg('অনুগ্রহ করে প্রয়োজনীয় ঘরগুলো সঠিকভাবে পূরণ করুন।');
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const finalImage =
      newImageUrl.trim() ||
      imagePresets[0].url;

    const finalAuthor = showAuthorName ? MOD_PROFILE_NAME : 'হ্যালো মোড়েলগঞ্জ বার্তা';

    const publishedItem: NewsItem = {
      id: 'news-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      summary: newSummary.trim(),
      content: newContent.trim(),
      author: finalAuthor,
      date: todayDate,
      imageUrl: finalImage,
      isFeatured: isFeatured,
      status: 'published',
      publisherRole: 'moderator',
      views: 1
    };

    setNewsList((prev) => [publishedItem, ...prev]);
    addLog('মডারেটর সংবাদ সরাসরি প্রকাশ', `শিরোনাম: "${newTitle.trim()}" (${finalAuthor})`);

    // Reset Form
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewImageUrl('');
    setIsFeatured(false);
    setShowAuthorName(true);
    setErrorMsg('');
    setSuccessMsg('সংবাদটি সফলভাবে পোর্টালে সরাসরি প্রকাশিত হয়েছে!');

    setTimeout(() => {
      setSuccessMsg('');
      setIsPublishModalOpen(false);
    }, 1500);
  };

  // Donor Actions
  const handleApproveDonor = (id: string) => {
    setDonorsList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'approved' } : d))
    );
    const donor = donorsList.find((d) => d.id === id);
    addLog('মডারেটর অনুমোদন', `রক্তদাতা ${donor?.name || id} ফোন নম্বর যাচাই করে অনুমোদন দেওয়া হয়েছে।`);
  };

  const handleRejectDonor = (id: string) => {
    setDonorsList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'rejected' } : d))
    );
    addLog('মডারেটর বাতিল', `রক্তদাতা আইডি ${id} মডারেটর দ্বারা বাতিল করা হয়েছে।`);
  };

  // Hospital Actions
  const handleAddHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospName.trim() || !hospPhone.trim() || !hospAddress.trim()) return;

    const servicesArr = hospServicesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newHosp: Hospital = {
      id: 'hosp-' + Date.now(),
      name: hospName.trim(),
      type: hospType,
      address: hospAddress.trim(),
      phone: hospPhone.trim(),
      emergencyPhone: hospEmergencyPhone.trim() || hospPhone.trim(),
      bedsCount: Number(hospBeds) || 10,
      hasEmergency: hospHasEmergency,
      hasAmbulance: hospHasAmbulance,
      hasICU: hospHasICU,
      services: servicesArr.length > 0 ? servicesArr : ['জরুরি চিকিৎসা', 'আউটডোর'],
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    };

    setHospitalsList((prev) => [newHosp, ...prev]);
    addLog('মডারেটর হাসপাতাল যুক্ত', `নতুন প্রতিষ্ঠান: "${hospName.trim()}" (${hospType})`);

    // Reset
    setHospName('');
    setHospAddress('');
    setHospPhone('');
    setHospEmergencyPhone('');
    setIsAddHospitalModalOpen(false);
  };

  const handleDeleteHospital = (id: string, name: string) => {
    if (window.confirm(`আপনি কি "${name}" মুছে ফেলতে চান?`)) {
      setHospitalsList((prev) => prev.filter((h) => h.id !== id));
      addLog('মডারেটর হাসপাতাল ডিলিট', `প্রতিষ্ঠান মুছে ফেলা হয়েছে: ${name}`);
    }
  };

  // Ambulance Actions
  const handleAddAmbulanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ambTitle.trim() || !ambPhone.trim() || !ambDriver.trim()) return;

    const newAmb: Ambulance = {
      id: 'amb-' + Date.now(),
      title: ambTitle.trim(),
      provider: ambProvider,
      driverName: ambDriver.trim(),
      phone: ambPhone.trim(),
      baseLocation: ambLocation.trim() || 'মোড়েলগঞ্জ সদর',
      isAC: ambIsAC,
      isOxygenAvailable: ambIsOxygen,
      isAvailable: true
    };

    setAmbulancesList((prev) => [newAmb, ...prev]);
    addLog('মডারেটর অ্যাম্বুলেন্স যুক্ত', `অ্যাম্বুলেন্স: "${ambTitle.trim()}" (চালক: ${ambDriver})`);

    setAmbTitle('');
    setAmbDriver('');
    setAmbPhone('');
    setIsAddAmbulanceModalOpen(false);
  };

  const handleDeleteAmbulance = (id: string, title: string) => {
    if (window.confirm(`আপনি কি "${title}" অ্যাম্বুলেন্স সেবাটি মুছে ফেলতে চান?`)) {
      setAmbulancesList((prev) => prev.filter((a) => a.id !== id));
      addLog('মডারেটর অ্যাম্বুলেন্স ডিলিট', `অ্যাম্বুলেন্স মুছে ফেলা হয়েছে: ${title}`);
    }
  };

  // Govt Office Actions
  const handleAddOfficeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offName.trim() || !offOfficer.trim() || !offPhone.trim()) return;

    const servicesArr = offServicesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newOff: GovtOffice = {
      id: 'off-' + Date.now(),
      name: offName.trim(),
      headOfficer: offOfficer.trim(),
      address: offAddress.trim() || 'উপজেলা পরিষদ কমপ্লেক্স, মোড়েলগঞ্জ',
      phone: offPhone.trim(),
      email: offEmail.trim() || undefined,
      officeHours: offHours.trim(),
      services: servicesArr.length > 0 ? servicesArr : ['নাগরিক সেবা', 'তথ্য প্রদান']
    };

    setOfficesList((prev) => [newOff, ...prev]);
    addLog('মডারেটর অফিস যুক্ত', `সরকারি অফিস: "${offName.trim()}" (দায়িত্বপ্রাপ্ত: ${offOfficer})`);

    setOffName('');
    setOffOfficer('');
    setOffPhone('');
    setOffEmail('');
    setIsAddOfficeModalOpen(false);
  };

  const handleDeleteOffice = (id: string, name: string) => {
    if (window.confirm(`আপনি কি "${name}" দপ্তরটি মুছে ফেলতে চান?`)) {
      setOfficesList((prev) => prev.filter((o) => o.id !== id));
      addLog('মডারেটর দপ্তর ডিলিট', `অফিস মুছে ফেলা হয়েছে: ${name}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Moderator Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>মডারেটর কন্ট্রোল প্যানেল</span>
              </span>
              <span className="text-xs text-slate-300">| {MOD_PROFILE_NAME}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black mt-1 text-white flex items-center gap-2">
              <span>হ্যালো মোড়েলগঞ্জ পোর্টালে মডারেশন</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {moderatorPermissions.canManageNews && (
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-400/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>সংবাদ প্রকাশ করুন</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="px-3 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-200 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-rose-700/50"
              title="মডারেটর প্যানেল থেকে বের হয়ে নাগরিক মোডে যান"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: News & Notices */}
      {activeTab === 'news' && (
        <div className="space-y-6">

          {/* Published News Management Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 min-w-0">
                <Newspaper className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="truncate">পোর্টালে প্রকাশিত সকল সংবাদ ও নোটিশমালা ({publishedNews.length})</span>
              </h3>
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>নতুন যুক্ত করুন</span>
              </button>
            </div>

            {publishedNews.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                কোনো সংবাদ প্রকাশিত হয়নি।
              </div>
            ) : (
              <div className="space-y-3">
                {publishedNews.map((news) => (
                  <div
                    key={news.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors overflow-hidden ${
                      news.pendingAction === 'deletion'
                        ? 'border-rose-300 bg-rose-50/70'
                        : news.pendingAction === 'edit'
                        ? 'border-amber-300 bg-amber-50/70'
                        : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 w-full sm:w-auto flex-1">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5 sm:mt-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded shrink-0">
                            {news.category}
                          </span>
                          {news.isFeatured && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded shrink-0">
                              ★ ফিচারড
                            </span>
                          )}

                          {news.pendingAction === 'deletion' && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.2 rounded border border-rose-300 flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3 text-rose-600 animate-spin" />
                              <span>এডমিন অনুমোদনের অপেক্ষায় (ডিলিট)</span>
                            </span>
                          )}

                          {news.pendingAction === 'edit' && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.2 rounded border border-amber-300 flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                              <span>এডমিন অনুমোদনের অপেক্ষায় (পরিবর্তন)</span>
                            </span>
                          )}

                          <span className="text-[10px] text-slate-400 shrink-0">{news.date}</span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 break-words leading-snug mt-1">
                          {news.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">প্রতিবেদক: {news.author}</p>
                      </div>
                    </div>

                    {/* Moderator Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {news.pendingAction ? (
                        <button
                          onClick={() => handleCancelPendingAction(news.id, news.title)}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="অনুরোধ বাতিল করুন"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>অনুরোধ বাতিল</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenEditModal(news)}
                            className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-lg border border-sky-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="সংবাদ পরিবর্তন করুন (এডমিন অনুমোদন সাপেক্ষ)"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>পরিবর্তন করুন</span>
                          </button>

                          <button
                            onClick={() => handleRequestDeleteNews(news.id, news.title)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="সংবাদ মুছে ফেলুন (এডমিন অনুমোদন সাপেক্ষ)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: Blood Donors Approval */}
      {activeTab === 'donors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-600" />
                <span>নতুন রক্তদাতা নিবন্ধনের ফোন নম্বর ও তথ্য যাচাইকরণ ({pendingDonors.length})</span>
              </h3>
            </div>

            {pendingDonors.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                যাচাইকরণের জন্য নতুন কোনো রক্তদাতা আবেদন নেই।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black bg-rose-600 text-white px-2.5 py-0.5 rounded-full">
                          {donor.bloodGroup}
                        </span>
                        <span className="text-[11px] text-slate-500">{donor.registeredAt}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">{donor.name}</h4>
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-rose-600" />
                        <a href={`tel:${donor.phone}`} className="hover:underline text-rose-800">
                          {donor.phone}
                        </a>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {donor.union}, {donor.village}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-rose-200/60">
                      <button
                        onClick={() => handleApproveDonor(donor.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>ফোন নম্বর সঠিক & অনুমোদন</span>
                      </button>
                      <button
                        onClick={() => handleRejectDonor(donor.id)}
                        className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Hospitals & Clinics Management */}
      {activeTab === 'hospitals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-600" />
                  <span>হাসপাতাল, ক্লিনিক ও ডায়াগনস্টিক সেন্টারের তথ্য ব্যবস্থাপনা</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">মডারেটর হিসেবে নতুন স্বাস্থ্য কেন্দ্র ও ক্লিনিকের তথ্য পোর্টালে যুক্ত করুন</p>
              </div>

              <button
                onClick={() => setIsAddHospitalModalOpen(true)}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন হাসপাতাল/ক্লিনিক যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitalsList.map((hosp) => (
                <div
                  key={hosp.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                        {hosp.type}
                      </span>
                      <span className="text-xs font-bold text-slate-600">বেড: {hosp.bedsCount}টি</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900">{hosp.name}</h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hosp.address}</span>
                    </p>
                    <p className="text-xs text-slate-700 font-bold flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>ফোন: {hosp.phone} | জরুরি: {hosp.emergencyPhone}</span>
                    </p>

                    <div className="flex items-center gap-2 flex-wrap pt-1 text-[10px]">
                      {hosp.hasEmergency && <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">২৪/৭ জরুরি</span>}
                      {hosp.hasAmbulance && <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">অ্যাম্বুলেন্স আছে</span>}
                      {hosp.hasICU && <span className="bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">ICU সেবা</span>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => handleDeleteHospital(hosp.id, hosp.name)}
                      className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছে ফেলুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Ambulances Management */}
      {activeTab === 'ambulances' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span>জরুরি অ্যাম্বুলেন্স সেবার নম্বর ও বিবরণ ব্যবস্থাপনা</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">জরুরি রোগীর জন্য মোড়েলগঞ্জের অ্যাম্বুলেন্স চালক ও প্রতিষ্ঠানের তালিকা আপডেট রাখুন</p>
              </div>

              <button
                onClick={() => setIsAddAmbulanceModalOpen(true)}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন অ্যাম্বুলেন্স যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambulancesList.map((amb) => (
                <div
                  key={amb.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                        {amb.provider}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${amb.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                        {amb.isAvailable ? 'সক্রিয় আছে' : 'অনুপলব্ধ'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900">{amb.title}</h4>
                    <p className="text-xs text-slate-700 font-bold flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>চালক: {amb.driverName} ({amb.phone})</span>
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>অবস্থান: {amb.baseLocation}</span>
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[10px]">
                      {amb.isAC && <span className="bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">এসি (AC)</span>}
                      {amb.isOxygenAvailable && <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">অক্সিজেন সুবিধা</span>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => handleDeleteAmbulance(amb.id, amb.title)}
                      className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছে ফেলুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Govt Offices Management */}
      {activeTab === 'offices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-teal-600" />
                  <span>সরকারি অফিস ও দপ্তরের তথ্য নির্দেশিকা</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">উপজেলা নির্বাহী অফিস, থানা, কৃষি, শিক্ষা ইত্যাদি সরকারি অফিসের হটলাইন তালিকা</p>
              </div>

              <button
                onClick={() => setIsAddOfficeModalOpen(true)}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন অফিস যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {officesList.map((off) => (
                <div
                  key={off.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{off.name}</h4>
                    <p className="text-xs text-teal-800 font-bold">দায়িত্বপ্রাপ্ত কর্মকর্তা: {off.headOfficer}</p>
                    <p className="text-xs text-slate-700 font-bold flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>ফোন: {off.phone} {off.email ? `| ইমেইল: ${off.email}` : ''}</span>
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{off.address}</span>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>সময়সূচী: {off.officeHours}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => handleDeleteOffice(off.id, off.name)}
                      className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছে ফেলুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: News Direct Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 sticky top-0 z-10 border-b border-emerald-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-white truncate">
                    সংবাদ সরাসরি প্রকাশ করুন
                  </h3>
                  <p className="text-xs text-emerald-200 truncate">
                    মডারেটর কর্তৃক অনুমোদিত সংবাদ যা সঙ্গে সঙ্গেই পোর্টালে দেখাবে
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0 ml-2 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishNewsSubmit} className="p-4 sm:p-6 overflow-y-auto grow space-y-4">
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সংবাদের শিরোনাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোড়েলগঞ্জে নতুন সেতু উদ্বোধন হলো..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিষয়শ্রেণী (Category)
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as NewsItem['category'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    <option value="local">স্থানীয় সংবাদ</option>
                    <option value="emergency">জরুরি নোটিশ</option>
                    <option value="development">উন্নয়ন ও অবকাঠামো</option>
                    <option value="health">স্বাস্থ্য সেবা</option>
                    <option value="sports">খেলাধুলা</option>
                    <option value="education">শিক্ষা ও সংস্কৃতি</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    প্রতিবেদকের নাম প্রকাশের পছন্দ <span className="text-rose-500">*</span>
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-2">
                    <label className="flex items-center gap-2 text-xs text-slate-800 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="showAuthorOptionMod"
                        checked={showAuthorName === true}
                        onChange={() => setShowAuthorName(true)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>
                        নাম প্রকাশ করুন (<strong className="text-emerald-800 font-bold">{MOD_PROFILE_NAME}</strong>)
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-800 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="showAuthorOptionMod"
                        checked={showAuthorName === false}
                        onChange={() => setShowAuthorName(false)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>
                        নাম গোপন রাখুন / অফিসিয়াল (<strong className="text-slate-600 font-bold">হ্যালো মোড়েলগঞ্জ বার্তা</strong>)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সংক্ষিপ্ত সারসংক্ষেপ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="সংবাদের মূল অংশ এক দুই লাইনে প্রকাশ করুন..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পূর্ণাঙ্গ বিবরণ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="বিস্তারিত ঘটনাপ্রবাহ সুন্দর করে লিখুন..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সংবাদের ছবি আপলোড
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      id="mod-new-news-image-input"
                      className="hidden"
                      onChange={handleNewNewsImageFileUpload}
                    />
                    <label
                      htmlFor="mod-new-news-image-input"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>গ্যালারি / ফাইল থেকে ছবি নির্বাচন করুন</span>
                    </label>
                  </div>

                  {newImageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/50 p-2.5 flex items-center gap-3">
                      <img
                        src={newImageUrl}
                        alt="News Preview"
                        className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-900">ছবি সংযুক্ত রয়েছে</p>
                        <p className="text-[10px] text-slate-500">আপলোড সম্পন্ন হয়েছে</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewImageUrl('')}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0"
                        title="ছবি মুছে ফেলুন"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <p className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>অথবা ডিফল্ট ক্যাটাগরি ছবি সিলেক্ট করুন:</span>
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {imagePresets.map((preset, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setNewImageUrl(preset.url)}
                            className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all shrink-0 cursor-pointer ${
                              newImageUrl === preset.url
                                ? 'bg-emerald-800 text-white border-emerald-800'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeaturedMod"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="isFeaturedMod" className="text-xs font-bold text-slate-800 cursor-pointer">
                  প্রধান ফিচারে (Featured Carousel) এই সংবাদ প্রদর্শন করুন
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>পোর্টালে সরাসরি প্রকাশ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Moderator Edit News Modal */}
      {editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 sticky top-0 z-10 border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Edit className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-white truncate">
                    সংবাদ পরিবর্তন / সংশোধন করুন
                  </h3>
                  <p className="text-xs text-sky-200 truncate">
                    পরিবর্তনের প্রস্তাবটি এডমিনের (Admin) অনুমোদনের জন্য পাঠানো হবে
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingNews(null)}
                className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0 ml-2 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditNewsSubmit} className="p-4 sm:p-6 overflow-y-auto grow space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সংবাদের শিরোনাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিষয়শ্রেণী (Category)
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as NewsItem['category'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
                  >
                    <option value="local">স্থানীয় সংবাদ</option>
                    <option value="emergency">জরুরি নোটিশ</option>
                    <option value="development">উন্নয়ন ও অবকাঠামো</option>
                    <option value="health">স্বাস্থ্য সেবা</option>
                    <option value="sports">খেলাধুলা</option>
                    <option value="education">শিক্ষা ও সংস্কৃতি</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    প্রতিবেদকের নাম প্রকাশের পছন্দ
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1.5">
                    <label className="flex items-center gap-2 text-xs text-slate-800 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="editShowAuthorOptionMod"
                        checked={editShowAuthorName === true}
                        onChange={() => setEditShowAuthorName(true)}
                        className="w-3.5 h-3.5 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <span>নাম প্রকাশ করুন ({MOD_PROFILE_NAME})</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-800 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="editShowAuthorOptionMod"
                        checked={editShowAuthorName === false}
                        onChange={() => setEditShowAuthorName(false)}
                        className="w-3.5 h-3.5 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <span>নাম গোপন রাখুন / অফিসিয়াল নোটিশ</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সংক্ষিপ্ত সারসংক্ষেপ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পূর্ণাঙ্গ বিবরণ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সংবাদের ছবি
                </label>
                <div className="space-y-2">
                  {editImageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2.5 flex items-center gap-3">
                      <img
                        src={editImageUrl}
                        alt="Current Preview"
                        className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">সংযুক্ত ছবি</p>
                        <p className="text-[10px] text-slate-500 truncate">নতুন ছবি দিলে এটি পরিবর্ধিত হবে</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditImageUrl('')}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0"
                        title="ছবি মুছে ফেলুন"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      id="mod-edit-news-image-input"
                      className="hidden"
                      onChange={handleEditNewsImageFileUpload}
                    />
                    <label
                      htmlFor="mod-edit-news-image-input"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>ডিভাইস থেকে নতুন ছবি আপলোড করুন</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>পরিবর্তনের জন্য এডমিন অনুমোদনে পাঠান</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Hospital Modal */}
      {isAddHospitalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-sky-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-sky-800">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-sky-300" />
                <h3 className="font-bold text-base sm:text-lg">হাসপাতাল/ক্লিনিকের তথ্য যোগ</h3>
              </div>
              <button onClick={() => setIsAddHospitalModalOpen(false)} className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHospitalSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোড়েলগঞ্জ ডিজি কেয়ার হাসপাতাল"
                  value={hospName}
                  onChange={(e) => setHospName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ধরন</label>
                  <select
                    value={hospType}
                    onChange={(e) => setHospType(e.target.value as Hospital['type'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="সরকারি হাসপাতাল">সরকারি হাসপাতাল</option>
                    <option value="বেসরকারি ক্লিনিক">বেসরকারি ক্লিনিক</option>
                    <option value="ডায়াগনস্টিক সেন্টার">ডায়াগনস্টিক সেন্টার</option>
                    <option value="ইউনিয়ন স্বাস্থ্য কেন্দ্র">ইউনিয়ন স্বাস্থ্য কেন্দ্র</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বেড সংখ্যা</label>
                  <input
                    type="number"
                    value={hospBeds}
                    onChange={(e) => setHospBeds(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: হাসপাতাল রোড, মোড়েলগঞ্জ"
                  value={hospAddress}
                  onChange={(e) => setHospAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01712xxxxxx"
                    value={hospPhone}
                    onChange={(e) => setHospPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">জরুরি যোগাযোগ</label>
                  <input
                    type="tel"
                    placeholder="01812xxxxxx"
                    value={hospEmergencyPhone}
                    onChange={(e) => setHospEmergencyPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সেবাসমূহ (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  placeholder="আউটডোর, রক্ত পরীক্ষা, আল্ট্রাসোনোগ্রাফি"
                  value={hospServicesText}
                  onChange={(e) => setHospServicesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-700 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hospHasEmergency}
                    onChange={(e) => setHospHasEmergency(e.target.checked)}
                  />
                  <span>জরুরি বিভাগ</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hospHasAmbulance}
                    onChange={(e) => setHospHasAmbulance(e.target.checked)}
                  />
                  <span>অ্যাম্বুলেন্স</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hospHasICU}
                    onChange={(e) => setHospHasICU(e.target.checked)}
                  />
                  <span>ICU</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                পোর্টালে যুক্ত করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Ambulance Modal */}
      {isAddAmbulanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-amber-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-amber-800">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-amber-300" />
                <h3 className="font-bold text-base sm:text-lg">অ্যাম্বুলেন্স সেবা যুক্ত করুন</h3>
              </div>
              <button onClick={() => setIsAddAmbulanceModalOpen(false)} className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAmbulanceSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সেবার শিরোনাম / নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোড়েলগঞ্জ রেড ক্রিসেন্ট অ্যাম্বুলেন্স"
                  value={ambTitle}
                  onChange={(e) => setAmbTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মালিকানা / ধরন</label>
                  <select
                    value={ambProvider}
                    onChange={(e) => setAmbProvider(e.target.value as Ambulance['provider'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="সরকারি">সরকারি</option>
                    <option value="রেড ক্রিসেন্ট">রেড ক্রিসেন্ট</option>
                    <option value="বেসরকারি">বেসরকারি</option>
                    <option value="স্বেচ্ছাসেবী">স্বেচ্ছাসেবী</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">চালকের নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                    value={ambDriver}
                    onChange={(e) => setAmbDriver(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01711xxxxxx"
                    value={ambPhone}
                    onChange={(e) => setAmbPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অবস্থান</label>
                  <input
                    type="text"
                    placeholder="যেমন: মোড়েলগঞ্জ হাসপাতাল মোড়"
                    value={ambLocation}
                    onChange={(e) => setAmbLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-700 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ambIsAC}
                    onChange={(e) => setAmbIsAC(e.target.checked)}
                  />
                  <span>এসি (AC) অ্যাম্বুলেন্স</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ambIsOxygen}
                    onChange={(e) => setAmbIsOxygen(e.target.checked)}
                  />
                  <span>অক্সিজেন সংযোগ</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                পোর্টালে যুক্ত করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Add Govt Office Modal */}
      {isAddOfficeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-teal-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-teal-800">
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-teal-300" />
                <h3 className="font-bold text-base sm:text-lg">সরকারি দপ্তরের তথ্য যোগ</h3>
              </div>
              <button onClick={() => setIsAddOfficeModalOpen(false)} className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOfficeSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অফিসের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোড়েলগঞ্জ উপজেলা কৃষি অফিস"
                  value={offName}
                  onChange={(e) => setOffName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">দায়িত্বপ্রাপ্ত কর্মকর্তা *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: উপজেলা কৃষি অফিসার (ইউএও)"
                  value={offOfficer}
                  onChange={(e) => setOffOfficer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01712xxxxxx"
                    value={offPhone}
                    onChange={(e) => setOffPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল</label>
                  <input
                    type="email"
                    placeholder="office@gov.bd"
                    value={offEmail}
                    onChange={(e) => setOffEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা</label>
                <input
                  type="text"
                  placeholder="উপজেলা পরিষদ কমপ্লেক্স, মোড়েলগঞ্জ"
                  value={offAddress}
                  onChange={(e) => setOffAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অফিস সময়সূচী</label>
                <input
                  type="text"
                  value={offHours}
                  onChange={(e) => setOffHours(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রদেয় সেবাসমূহ (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  placeholder="কৃষি পরামর্শ, সার বরাদ্দ, কৃষক সেবা"
                  value={offServicesText}
                  onChange={(e) => setOffServicesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                পোর্টালে যুক্ত করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------- MODERATOR TAB: 3D MAP ------------------- */}
      {activeTab === 'map3d' && (
        <Morrelganj3DMap
          regionsList={regionsList}
          setRegionsList={setRegionsList}
          isEditable={true}
          userRole="moderator"
          addLog={addLog}
        />
      )}

      {/* ------------------- MODERATOR TAB: BUSES ------------------- */}
      {activeTab === 'buses' && (
        <BusScheduleView
          busSchedules={busSchedules}
          setBusSchedules={setBusSchedules}
          ticketCounters={ticketCounters}
          setTicketCounters={setTicketCounters}
          isEditable={true}
          userRole="moderator"
          currentModeratorEmail={MOD_EMAIL}
          addLog={addLog}
        />
      )}
    </div>
  );
};

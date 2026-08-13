import React, { useState, useEffect } from 'react';
import {
  Search,
  HeartHandshake,
  Cross,
  Stethoscope,
  Compass,
  Building2,
  Ambulance as AmbulanceIcon,
  Newspaper,
  PhoneCall,
  MapPin,
  Clock,
  ExternalLink,
  ShieldAlert,
  Calendar,
  User,
  CheckCircle2,
  Flame,
  ArrowRight,
  Filter,
  PlusCircle,
  Eye,
  Star,
  Share2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Shield,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  Home,
  Truck,
  Bus,
  Globe
} from 'lucide-react';
import {
  NewsItem,
  BloodDonor,
  Hospital,
  Doctor,
  TouristSpot,
  TourGuide,
  GovtOffice,
  Ambulance,
  BloodGroup,
  MorrelganjUnion,
  BusSchedule,
  TicketCounter,
  UpazilaRegion
} from '../types';
import { MORRELGANJ_UPAZILA_INFO, ALL_MORRELGANJ_UNIONS_LIST } from '../data/morrelgonjRegionData';
import { BusScheduleView } from './BusScheduleView';
import { Morrelganj3DMap } from './Morrelganj3DMap';

interface CitizenViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  newsList: NewsItem[];
  donorsList: BloodDonor[];
  hospitalsList: Hospital[];
  doctorsList: Doctor[];
  spotsList: TouristSpot[];
  guidesList: TourGuide[];
  officesList: GovtOffice[];
  ambulancesList: Ambulance[];
  busSchedules: BusSchedule[];
  ticketCounters: TicketCounter[];
  regionsList?: UpazilaRegion[];
  upazilaInfo?: typeof MORRELGANJ_UPAZILA_INFO;
  onOpenDonorModal: () => void;
  onOpenModeratorModal?: () => void;
  onOpenEmergencyModal: () => void;
  onOpenAiDrawer: () => void;
}

export const CitizenView: React.FC<CitizenViewProps> = ({
  activeTab,
  setActiveTab,
  newsList,
  donorsList,
  hospitalsList,
  doctorsList,
  spotsList,
  guidesList,
  officesList,
  ambulancesList,
  busSchedules,
  ticketCounters,
  regionsList,
  upazilaInfo,
  onOpenDonorModal,
  onOpenModeratorModal,
  onOpenEmergencyModal,
  onOpenAiDrawer
}) => {
  // Global search input
  const [searchQuery, setSearchQuery] = useState('');

  // News State
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('all');
  const [activeNewsModal, setActiveNewsModal] = useState<NewsItem | null>(null);

  // Lock background scrolling when news detail modal is open
  useEffect(() => {
    if (activeNewsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeNewsModal]);

  // Donor Search State
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [selectedUnion, setSelectedUnion] = useState<string>('all');

  // Doctor Filter State
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('all');

  // Citizen Hamburger Menu State for Carousel Options
  const [isCitizenHamburgerOpen, setIsCitizenHamburgerOpen] = useState(false);

  // Tourist Spots Slider State
  const [currentSpotSlide, setCurrentSpotSlide] = useState(0);

  useEffect(() => {
    if (!spotsList || spotsList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSpotSlide((prev) => (prev + 1) % spotsList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [spotsList]);

  const handleNextSpotSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (spotsList.length > 0) {
      setCurrentSpotSlide((prev) => (prev + 1) % spotsList.length);
    }
  };

  const handlePrevSpotSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (spotsList.length > 0) {
      setCurrentSpotSlide((prev) => (prev - 1 + spotsList.length) % spotsList.length);
    }
  };

  // Filtered Approved News
  const publishedNews = newsList.filter((n) => n.status === 'published');
  const filteredNews = publishedNews.filter((item) => {
    const matchesCategory = selectedNewsCategory === 'all' || item.category === selectedNewsCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Filtered Approved Donors
  const approvedDonors = donorsList.filter((d) => d.status === 'approved');
  const filteredDonors = approvedDonors.filter((d) => {
    const matchesGroup = selectedBloodGroup === 'all' || d.bloodGroup === selectedBloodGroup;
    const matchesUnion = selectedUnion === 'all' || d.union === selectedUnion;
    const matchesQuery =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery);
    return matchesGroup && matchesUnion && matchesQuery;
  });

  // Filtered Doctors
  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesSpec = selectedSpeciality === 'all' || doc.speciality.includes(selectedSpeciality);
    const matchesQuery =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.chamberAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesQuery;
  });

  // Unique Doctor Specialities
  const doctorSpecialities = Array.from(new Set(doctorsList.map((d) => d.speciality.split(' ')[0])));

  // Carousel Service Options for Hamburger Menu
  const carouselOptions = [
    {
      id: 'donors',
      title: 'রক্তদাতা ও সংগ্রহ (ব্লাড ব্যাংক)',
      shortLabel: 'রক্তদাতা',
      subtitle: `${approvedDonors.length}+ নিবন্ধিত রক্তদাতা`,
      icon: HeartHandshake,
      badge: approvedDonors.length,
      color: 'bg-rose-600'
    },
    {
      id: 'doctors',
      title: 'বিশেষজ্ঞ ডাক্তার ও সময়সূচি',
      shortLabel: 'বিশেষজ্ঞ ডাক্তার',
      subtitle: `${doctorsList.length} জন স্পেশালিস্ট ডাক্তার`,
      icon: Stethoscope,
      badge: doctorsList.length,
      color: 'bg-emerald-600'
    },
    {
      id: 'hospitals',
      title: 'হাসপাতাল, ক্লিনিক ও ডায়াগনস্টিক',
      shortLabel: 'হাসপাতাল',
      subtitle: `${hospitalsList.length} টি চিকিৎসা কেন্দ্র`,
      icon: Cross,
      badge: hospitalsList.length,
      color: 'bg-sky-600'
    },
    {
      id: 'ambulances',
      title: 'জরুরি ২৪/৭ অ্যাম্বুলেন্স সেবা',
      shortLabel: 'অ্যাম্বুলেন্স',
      subtitle: `${ambulancesList.length} টি অ্যাম্বুলেন্স গাড়ি`,
      icon: AmbulanceIcon,
      badge: ambulancesList.length,
      color: 'bg-amber-600'
    },
    {
      id: 'spots',
      title: 'মোড়েলগঞ্জের দর্শনীয় স্থান ও ভ্রমণ',
      shortLabel: 'দর্শনীয় স্থান',
      subtitle: `${spotsList.length} টি ট্যুরিস্ট স্পট`,
      icon: Compass,
      badge: spotsList.length,
      color: 'bg-teal-600'
    },
    {
      id: 'offices',
      title: 'সরকারি দপ্তর ও উপজেলা পরিষদ অফিস',
      shortLabel: 'সরকারি অফিস',
      subtitle: `${officesList.length} টি উপজেলা অফিস`,
      icon: Building2,
      badge: officesList.length,
      color: 'bg-indigo-600'
    },
    {
      id: 'news',
      title: 'সর্বশেষ সংবাদ, খবর ও বুলেটিন',
      shortLabel: 'সংবাদ',
      subtitle: `${publishedNews.length} টি প্রকাশিত সংবাদ`,
      icon: Newspaper,
      badge: publishedNews.length,
      color: 'bg-emerald-700'
    }
  ];

  return (
    <div className="space-y-6 pb-12">

      {/* ------------------- TAB: HOME / প্রচ্ছদ ------------------- */}
      {activeTab === 'home' && (
        <div className="space-y-8">
          {/* Hero Banner Section */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 text-white shadow-xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-25 mix-blend-overlay" />
            <div className="relative z-10 p-6 sm:p-10 max-w-4xl space-y-5">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                স্মার্ট ডিজিটাল মোড়েলগঞ্জ পোর্টাল
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                হ্যালো মোড়েলগঞ্জ — <span className="text-emerald-400">এক ক্লিকে</span> মোড়েলগঞ্জের সকল জরুরি সেবা
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                মোড়েলগঞ্জ উপজেলার হাসপাতাল ও সরকারি অফিসের নম্বর এবং দর্শনীয় স্থান ও ট্যুর গাইডের তথ্য সম্বলিত সমন্বিত ডিজিটাল সেবা।
              </p>

              {/* Universal Search Input */}
              <div className="pt-2">
                <div className="relative max-w-xl bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 flex items-center shadow-lg">
                  <Search className="w-5 h-5 text-emerald-300 ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="হাসপাতাল, সরকারি অফিস বা প্রয়োজনীয় তথ্য খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-300 focus:outline-none"
                  />
                  <button
                    onClick={onOpenAiDrawer}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>AI সার্চ</span>
                  </button>
                </div>
              </div>

              {/* Quick Service Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3">
                <button
                  onClick={() => setActiveTab('map3d')}
                  className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Globe className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">মোড়েলগঞ্জ পরিচিতি</h4>
                    <p className="text-[10px] text-indigo-200">১৬ ইউনিয়ন ও তথ্য</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('buses')}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">বাস সময়সূচী</h4>
                    <p className="text-[10px] text-emerald-200">কাউন্টার ও ভাড়া</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('donors')}
                  className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">রক্তদাতা ও সংগ্রহ</h4>
                    <p className="text-[10px] text-rose-200">{approvedDonors.length}+ সক্রিয় ডোনার</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('doctors')}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">বিশেষজ্ঞ ডাক্তার</h4>
                    <p className="text-[10px] text-emerald-200">{doctorsList.length} জন স্পেশালিস্ট</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Cross className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">হাসপাতাল ও ক্লিনিক</h4>
                    <p className="text-[10px] text-sky-200">{hospitalsList.length} টি চিকিৎসা কেন্দ্র</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('ambulances')}
                  className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <AmbulanceIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">অ্যাম্বুলেন্স সেবা</h4>
                    <p className="text-[10px] text-amber-200">জরুরি পেশেন্ট সাপোর্ট</p>
                  </div>
                </button>
              </div>

              {/* Tourist Spots Slider & Option Section */}
              {spotsList && spotsList.length > 0 && (
                <div className="pt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-200 px-1">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                      <Compass className="w-4 h-4 text-emerald-300" />
                      <span>মোড়েলগঞ্জের দর্শনীয় স্থান</span>
                    </span>
                    <span className="text-[11px] text-slate-300 font-medium bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {currentSpotSlide + 1} / {spotsList.length}
                    </span>
                  </div>

                  {/* Tourist Spot Image Slider */}
                  <div
                    onClick={() => setActiveTab('spots')}
                    className="relative h-44 sm:h-56 w-full rounded-2xl overflow-hidden border border-white/20 shadow-lg group cursor-pointer bg-slate-900"
                  >
                    <img
                      src={spotsList[currentSpotSlide]?.imageUrl}
                      alt={spotsList[currentSpotSlide]?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Spot Details Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-white flex flex-col justify-end px-10">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="bg-emerald-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <MapPin className="w-3 h-3 text-emerald-200" />
                          {spotsList[currentSpotSlide]?.location}
                        </span>
                        {spotsList[currentSpotSlide]?.featured && (
                          <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md">
                            ★ আকর্ষণীয়
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white drop-shadow-md leading-tight truncate">
                        {spotsList[currentSpotSlide]?.name}
                      </h4>
                      <p className="text-[11px] text-slate-200 line-clamp-1 mt-0.5 opacity-90">
                        {spotsList[currentSpotSlide]?.description}
                      </p>
                    </div>

                    {/* Prev / Next Navigation Controls */}
                    <button
                      onClick={handlePrevSpotSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-950 text-white p-1.5 rounded-full backdrop-blur-xs transition-all cursor-pointer border border-white/20 z-10"
                      aria-label="পূর্ববর্তী ছবি"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleNextSpotSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-950 text-white p-1.5 rounded-full backdrop-blur-xs transition-all cursor-pointer border border-white/20 z-10"
                      aria-label="পরবর্তী ছবি"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Slider Indicator Dots */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-xs z-10">
                      {spotsList.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSpotSlide(idx);
                          }}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === currentSpotSlide ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/40'
                          }`}
                          aria-label={`স্লাইড ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tourist Spots Clean Option Button - Matches Top Quick Service Cards */}
                  <button
                    onClick={() => setActiveTab('spots')}
                    className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">দর্শনীয় স্থান ও ভ্রমণ</h4>
                        <p className="text-[10px] text-emerald-200 truncate">{spotsList.length} টি স্থান ও গাইড</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-300 group-hover:text-white shrink-0 ml-2">
                      <span>দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Urgent Blood Need Banner */}
          <div className="bg-gradient-to-r from-rose-600 to-rose-800 text-white rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4 border border-rose-500/30">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <HeartHandshake className="w-7 h-7 text-white animate-bounce" />
              </div>
              <div>
                <span className="bg-white text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  জরুরি আবেদন
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                  আপনি কি রক্তদানে ইচ্ছুক? আপনার ১ ব্যাগ রক্ত বাঁচাবে একটি প্রাণ!
                </h3>
                <p className="text-xs text-rose-100">
                  মোড়েলগঞ্জের নতুন রক্তদাতা হিসেবে এখনই নাম নিবন্ধিত করুন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenDonorModal}
                className="bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ডোনার রেজিস্ট্রেশন</span>
              </button>

              <button
                onClick={() => setActiveTab('donors')}
                className="bg-rose-900/60 hover:bg-rose-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-400/30 cursor-pointer"
              >
                রক্তদাতা খুঁজুন
              </button>
            </div>
          </div>

          {/* Moderator Recruitment Banner */}
          {onOpenModeratorModal && (
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4 border border-sky-500/30">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <span className="bg-sky-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    সিটিজেন প্যানেল
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                    মোড়েলগঞ্জ পোর্টালে মডারেটর হিসেবে অবদান রাখতে চান?
                  </h3>
                  <p className="text-xs text-sky-200">
                    আমাদের উপজেলার সঠিক তথ্য আপডেট রাখা ও জরুরী স্বাস্থ্যসেবায় সহমর্মী মডারেটর হিসেবে যুক্ত হোন।
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenModeratorModal}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-slate-950" />
                <span>মডারেটর হতে আবেদন করুন</span>
              </button>
            </div>
          )}

          {/* Featured News Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-lg text-slate-900">মোড়েলগঞ্জের শীর্ষ সংবাদ</h3>
              </div>
              <button
                onClick={() => setActiveTab('news')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>সব সংবাদ দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedNews.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 bg-emerald-800 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg">
                        {item.category === 'emergency'
                          ? 'জরুরি নোটিশ'
                          : item.category === 'development'
                          ? 'উন্নয়ন'
                          : item.category === 'health'
                          ? 'স্বাস্থ্য'
                          : 'স্থানীয়'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {item.author}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2">{item.summary}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => setActiveNewsModal(item)}
                      className="w-full py-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>বিস্তারিত পড়ুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Direct Phone Helplines Section */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">২৪ ঘণ্টা সচল</span>
                <h3 className="font-extrabold text-xl text-white">মোড়েলগঞ্জ জরুরি সেবা ডিরেক্টরি</h3>
              </div>

              <button
                onClick={onOpenEmergencyModal}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>সব হটলাইন নম্বর</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <a
                href="tel:01713241250"
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div>
                  <p className="text-[11px] text-slate-400">উপজেলা স্বাস্থ্য কমপ্লেক্স</p>
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-400">01713-241250</h4>
                </div>
                <PhoneCall className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </a>

              <a
                href="tel:01713374150"
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div>
                  <p className="text-[11px] text-slate-400">মোড়েলগঞ্জ থানা (ডিউটি)</p>
                  <h4 className="font-bold text-sm text-white group-hover:text-sky-400">01713-374150</h4>
                </div>
                <ShieldAlert className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              </a>

              <a
                href="tel:01713991100"
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div>
                  <p className="text-[11px] text-slate-400">ফায়ার সার্ভিস স্টেশন</p>
                  <h4 className="font-bold text-sm text-white group-hover:text-amber-400">01713-991100</h4>
                </div>
                <Flame className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB: NEWS / সংবাদ ------------------- */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="font-extrabold text-xl text-slate-900">মোড়েলগঞ্জ স্থানীয় সংবাদ ও আপডেট</h2>
              <p className="text-xs text-slate-500 mt-0.5">মোড়েলগঞ্জের সর্বশেষ পরিস্থিতি, উন্নয়ন ও নোটিশমালা</p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>সংবাদ সরাসরি মডারেটর প্যানেল কর্তৃক প্রকাশিত হয়</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'সব সংবাদ' },
              { id: 'local', label: 'স্থানীয় সংবাদ' },
              { id: 'emergency', label: 'জরুরি নোটিশ' },
              { id: 'development', label: 'উন্নয়ন' },
              { id: 'health', label: 'স্বাস্থ্য' },
              { id: 'sports', label: 'খেলাধুলা' },
              { id: 'education', label: 'শিক্ষা' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedNewsCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedNewsCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-800 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-xs">
                      {item.category === 'emergency'
                        ? 'জরুরি নোটিশ'
                        : item.category === 'development'
                        ? 'উন্নয়ন'
                        : item.category === 'health'
                        ? 'স্বাস্থ্য'
                        : 'স্থানীয়'}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {item.author}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.summary}</p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setActiveNewsModal(item)}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>সম্পূর্ণ সংবাদ পড়ুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------- TAB: DONORS / রক্তদাতা ------------------- */}
      {activeTab === 'donors' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-700 to-rose-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <HeartHandshake className="w-4 h-4 text-rose-200" />
                <span>হ্যালো মোড়েলগঞ্জ রক্তদান ব্যাংক</span>
              </div>
              <h2 className="font-extrabold text-2xl text-white">রক্তদাতা অনুসন্ধান ও ডোনার সংগ্রাহক</h2>
              <p className="text-xs text-rose-200 mt-1">
                জরুরি প্রয়োজনে মোড়েলগঞ্জের নির্দিষ্ট ইউনিয়ন বা রক্তের গ্রুপের ডোনার খুঁজুন
              </p>
            </div>

            <button
              onClick={onOpenDonorModal}
              className="bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন ডোনার নিবন্ধন</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-rose-600" />
              <span>ফিল্টার করুন:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search Box */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">কীওয়ার্ড বা নাম</label>
                <input
                  type="text"
                  placeholder="নাম, গ্রাম বা ফোন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Blood Group Select */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">রক্তের গ্রুপ</label>
                <select
                  value={selectedBloodGroup}
                  onChange={(e) => setSelectedBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="all">সব গ্রুপের রক্তদাতা</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg} গ্রুপ
                    </option>
                  ))}
                </select>
              </div>

              {/* Union Select */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">মোড়েলগঞ্জ ইউনিয়ন</label>
                <select
                  value={selectedUnion}
                  onChange={(e) => setSelectedUnion(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="all">সকল ইউনিয়ন ও পৌরসভা</option>
                  {ALL_MORRELGANJ_UNIONS_LIST.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Donors List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDonors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-900">{donor.name}</h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                            অনুমোদিত
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-600" />
                          {donor.union}, {donor.village}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">সর্বশেষ রক্তদান:</span>
                      <span className="font-semibold text-slate-800">{donor.lastDonationDate}</span>
                    </div>
                    {donor.notes && (
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">নোট:</span>
                        <span className="font-medium text-emerald-700 italic">{donor.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:${donor.phone}`}
                    className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>কল করুন</span>
                  </a>

                  <a
                    href={`https://wa.me/88${donor.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>হোয়াটসঅ্যাপ</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------- TAB: HOSPITALS / হাসপাতাল ------------------- */}
      {activeTab === 'hospitals' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-xl text-slate-900">মোড়েলগঞ্জ হাসপাতাল ও ক্লিনিক নির্দেশিকা</h2>
              <p className="text-xs text-slate-500 mt-0.5">জরুরি চিকিৎসা কেন্দ্র, উপ-স্বাস্থ্য কেন্দ্র ও ক্লিনিকের সময়সূচি</p>
            </div>

            <button
              onClick={onOpenEmergencyModal}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>জরুরি অ্যাম্বুলেন্স কল</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hospitalsList.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={
                        hosp.imageUrl ||
                        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={hosp.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      {hosp.type}
                    </span>
                    {hosp.hasEmergency && (
                      <span className="absolute top-3 right-3 bg-rose-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-xs">
                        ২৪ ঘণ্টা জরুরি বিভাগ
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-base text-slate-900">{hosp.name}</h3>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      {hosp.address}
                    </p>

                    <div className="space-y-1 pt-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        উপলব্ধ চিকিৎসাসেবা:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {hosp.services.map((srv, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200"
                          >
                            ✓ {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${hosp.emergencyPhone}`}
                    className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>জরুরি ডেস্ক</span>
                  </a>

                  <a
                    href={`tel:${hosp.phone}`}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>তথ্য কেন্দ্র</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------- TAB: DOCTORS / ডাক্তার ------------------- */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-extrabold text-xl text-slate-900">বিশেষজ্ঞ ডাক্তারদের চেম্বার ও সময়সূচি</h2>
                <p className="text-xs text-slate-500 mt-0.5">মোড়েলগঞ্জের গাইনি, মেডিসিন, শিশু ও হৃদরোগ স্পেশালিস্টদের ঠিকানা</p>
              </div>

              <button
                onClick={onOpenAiDrawer}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <span>AI ডাক্তার খোঁজেন</span>
              </button>
            </div>

            {/* Speciality Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none">
              <button
                onClick={() => setSelectedSpeciality('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                  selectedSpeciality === 'all'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                সব বিশেষজ্ঞ
              </button>
              {doctorSpecialities.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpeciality(spec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                    selectedSpeciality === spec
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={
                      doc.imageUrl ||
                      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
                    }
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-emerald-700 font-bold mt-0.5">{doc.degree}</p>
                    <span className="inline-block bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-emerald-200 mt-1">
                      {doc.speciality}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 border border-slate-100">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block font-medium">চেম্বার ঠিকানা:</span>
                      <span className="font-bold text-slate-800">{doc.chamberAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block font-medium">সাক্ষাৎ ও সময়সূচি:</span>
                      <span className="font-bold text-slate-800">
                        {doc.visitingDays} ({doc.visitingTime})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href={`tel:${doc.serialPhone}`}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>সিরিয়াল দিন: {doc.serialPhone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------- TAB: SPOTS / দর্শনীয় স্থান ------------------- */}
      {activeTab === 'spots' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="font-extrabold text-xl text-slate-900">মোড়েলগঞ্জের দর্শনীয় স্থান ও ট্যুর গাইড</h2>
            <p className="text-xs text-slate-500 mt-0.5">পানগুছি নদীর সৌন্দর্য, ম্যানগ্রোভ বন ও ইতিহাস সমৃদ্ধ মোড়েলগঞ্জ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spotsList.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 left-3 bg-slate-900/90 text-white font-bold text-xs px-3 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {spot.location}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-lg text-slate-900">{spot.name}</h3>

                    <p className="text-xs text-slate-600 leading-relaxed">{spot.description}</p>

                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-xs space-y-1">
                      <p className="font-bold text-emerald-900">যেভাবে যাবেন:</p>
                      <p className="text-emerald-800">{spot.howToGo}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                    <span>ভ্রমণের উপযুক্ত সময়:</span>
                    <span className="font-bold text-slate-800">{spot.bestTimeToVisit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tour Guides Directory */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-700" />
              <span>মোড়েলগঞ্জ ও সুন্দরবন ট্যুর গাইড ডিরেক্টরি</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guidesList.map((guide) => (
                <div
                  key={guide.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{guide.name}</h4>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {guide.rating}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold">{guide.organization}</p>
                    <p className="text-xs text-slate-500 mt-1">{guide.areaOfSpecialty}</p>
                  </div>

                  <a
                    href={`tel:${guide.phone}`}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>কল করুন: {guide.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB: OFFICES / সরকারি অফিস ------------------- */}
      {activeTab === 'offices' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h2 className="font-extrabold text-xl text-slate-900">মোড়েলগঞ্জ সরকারি অফিস সমূহের ঠিকানা ও সময়সূচি</h2>
            <p className="text-xs text-slate-500 mt-0.5">ইউএনও অফিস, থানা, ভূমি অফিস, পল্লী বিদ্যুৎ ও ফায়ার সার্ভিস ডিরেক্টরি</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {officesList.map((office) => (
              <div
                key={office.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{office.name}</h3>
                  <p className="text-xs text-emerald-700 font-bold mt-0.5">{office.headOfficer}</p>

                  <div className="mt-3 space-y-2 text-xs text-slate-600">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </p>

                    <p className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-800">{office.officeHours}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      প্রদানকৃত নাগরিক সেবা সমূহ:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1 pl-1">
                      {office.services.map((srv, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`tel:${office.phone}`}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>অফিসিয়াল হটলাইন: {office.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------- TAB: AMBULANCES / অ্যাম্বুলেন্স ------------------- */}
      {activeTab === 'ambulances' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-xl text-slate-900">মোড়েলগঞ্জ অ্যাম্বুলেন্স সার্ভিস ডিরেক্টরি</h2>
              <p className="text-xs text-slate-500 mt-0.5">জরুরি পেশেন্ট স্থানান্তরের জন্য এসি ও নন-এসি অ্যাম্বুলেন্স সেবা</p>
            </div>

            <button
              onClick={onOpenEmergencyModal}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>৯৯৯ কল করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ambulancesList.map((amb) => (
              <div
                key={amb.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{amb.title}</h3>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                      {amb.provider}
                    </span>
                  </div>

                  <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <p className="flex justify-between">
                      <span className="text-slate-400">ড্রাইভার নাম:</span>
                      <span className="font-bold text-slate-800">{amb.driverName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">অবস্থান:</span>
                      <span className="font-medium text-slate-700">{amb.baseLocation}</span>
                    </p>

                    <div className="pt-2 border-t border-slate-200 flex gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          amb.isAC ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {amb.isAC ? '✓ AC সুবিধা বিদ্যমান' : 'Non-AC'}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          amb.isOxygenAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {amb.isOxygenAvailable ? '✓ অক্সিজেন সিলিন্ডার আছে' : 'অক্সিজেন নাই'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <a
                    href={`tel:${amb.phone}`}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>ড্রাইভারের নাম্বারে কল করুন: {amb.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------- TAB: 3D MAP & UPZILA INFO / মোড়েলগঞ্জ পরিচিতি ------------------- */}
      {activeTab === 'map3d' && (
        <Morrelganj3DMap
          regionsList={regionsList}
          upazilaInfo={upazilaInfo}
          onSelectRegion={(region) => {
            // Optional callback
          }}
        />
      )}

      {/* ------------------- TAB: BUS SCHEDULES / বাস সময়সূচী ------------------- */}
      {activeTab === 'buses' && (
        <BusScheduleView
          busSchedules={busSchedules}
          ticketCounters={ticketCounters}
        />
      )}

      {/* News Full View Modal */}
      {activeNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Sticky Header */}
            <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 border-b border-slate-800 sticky top-0 z-20">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">স্থানীয় সংবাদ বিবরণ</h3>
                  <p className="text-[11px] text-slate-400 truncate">প্রকাশিত খবর ও পূর্ণাঙ্গ বার্তা</p>
                </div>
              </div>
              <button
                onClick={() => setActiveNewsModal(null)}
                className="text-slate-300 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer shrink-0 ml-2 focus:outline-none"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto grow p-4 sm:p-6 space-y-4">
              <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={activeNewsModal.imageUrl}
                  alt={activeNewsModal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-semibold">
                  প্রকাশকাল: {activeNewsModal.date}
                </span>
                <span>•</span>
                <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md font-bold border border-emerald-100">
                  প্রতিবেদক: {activeNewsModal.author}
                </span>
              </div>

              <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">
                {activeNewsModal.title}
              </h2>

              <p className="text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200/80 leading-relaxed">
                {activeNewsModal.summary}
              </p>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                {activeNewsModal.content}
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setActiveNewsModal(null)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition-colors shadow-2xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

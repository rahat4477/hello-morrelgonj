import React from 'react';
import {
  HeartHandshake,
  Shield,
  UserCheck,
  PhoneCall,
  Flame,
  Search,
  Bot,
  Newspaper,
  Cross,
  Stethoscope,
  Compass,
  Building2,
  Ambulance as AmbulanceIcon,
  Home,
  Menu,
  X,
  User,
  LogOut,
  Building,
  Truck,
  PlusCircle,
  ChevronRight,
  AlertCircle,
  Activity,
  Image,
  Bus,
  Globe,
  Share2,
  Smartphone,
  Download
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onOpenRoleModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenDonorModal: () => void;
  onOpenModeratorModal?: () => void;
  onOpenAiDrawer: () => void;
  onOpenAppModal?: () => void;
  pendingCount: number;
  onLogout?: () => void;
  pendingNewsCount?: number;
  pendingDonorsCount?: number;
  pendingModeratorAppsCount?: number;
  siteLogo?: string;
  siteFavicon?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  onOpenRoleModal,
  onOpenEmergencyModal,
  onOpenDonorModal,
  onOpenModeratorModal,
  onOpenAiDrawer,
  onOpenAppModal,
  pendingCount,
  onLogout,
  pendingNewsCount = 0,
  pendingDonorsCount = 0,
  pendingModeratorAppsCount = 0,
  siteLogo = '/logo.jpg',
  siteFavicon
}) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'প্রচ্ছদ', icon: Home },
    { id: 'map3d', label: 'মোড়েলগঞ্জ পরিচিতি', icon: Globe },
    { id: 'news', label: 'সংবাদ', icon: Newspaper },
    { id: 'buses', label: 'বাস সময়সূচী', icon: Bus },
    { id: 'donors', label: 'রক্তদাতা', icon: HeartHandshake },
    { id: 'hospitals', label: 'হাসপাতাল', icon: Cross },
    { id: 'doctors', label: 'ডাক্তার', icon: Stethoscope },
    { id: 'spots', label: 'দর্শনীয় স্থান', icon: Compass },
    { id: 'offices', label: 'সরকারি অফিস', icon: Building2 },
    { id: 'ambulances', label: 'অ্যাম্বুলেন্স', icon: AmbulanceIcon },
  ];

  // Admin Drawer Items
  const adminNavItems = [
    { id: 'map3d', label: 'মোড়েলগঞ্জ পরিচিতি', icon: Globe, badge: null, subtitle: '১৬ ইউনিয়ন ও ১ পৌরসভার তথ্য' },
    { id: 'pending', label: 'পেন্ডিং আবেদন ও পরিবর্তন', icon: AlertCircle, badge: pendingCount, subtitle: 'রক্তদাতা, তথ্য ও আবেদন রিভিউ' },
    { id: 'moderators', label: 'মডারেটর পারমিশন ও আবেদন', icon: UserCheck, badge: pendingModeratorAppsCount, subtitle: 'ফিচার এক্সেস কন্ট্রোল' },
    { id: 'branding', label: 'লোগো ও ফ্যাবআইকন সেটআপ', icon: Image, badge: null, subtitle: 'পোর্টালে লোগো ও আইকন আপলোড' },
    { id: 'facebook', label: 'ফেসবুক পেজ অটো-পোস্টিং', icon: Share2, badge: null, subtitle: 'সংবাদ সরাসরি ফেসবুক পেজে পোস্ট' },
    { id: 'buses', label: 'বাস সময়সূচী ও কাউন্টার', icon: Bus, badge: null, subtitle: 'বাস চলাচলের সময় ও ফোন নম্বর' },
    { id: 'donors', label: 'রক্তদাতা ব্যবস্থাপনা', icon: HeartHandshake, badge: pendingDonorsCount, subtitle: 'নিবন্ধিত রক্তদাতাদের তালিকা' },
    { id: 'news', label: 'সংবাদ ও বুলেটিন প্রকাশ', icon: Newspaper, badge: pendingNewsCount, subtitle: 'জরুরি বিজ্ঞপ্তি ও খবর' },
    { id: 'hospitals', label: 'হাসপাতাল ও ক্লিনিক', icon: Cross, badge: null, subtitle: 'চিকিৎসা কেন্দ্রের তালিকা' },
    { id: 'doctors', label: 'বিশেষজ্ঞ ডাক্তার', icon: Stethoscope, badge: null, subtitle: 'ডাক্তারদের সময়সূচি' },
    { id: 'offices', label: 'সরকারি দপ্তর ও অফিস', icon: Building2, badge: null, subtitle: 'উপজেলা প্রশাসন তথ্য' },
    { id: 'ambulances', label: 'অ্যাম্বুলেন্স সেবা', icon: AmbulanceIcon, badge: null, subtitle: 'জরুরি অ্যাম্বুলেন্স ডিরেক্টরি' },
    { id: 'logs', label: 'সিস্টেম একটিভিটি লগ', icon: Activity, badge: null, subtitle: 'সিস্টেম কার্যক্রমের ইতিহাস' },
  ];

  // Moderator Drawer Items
  const moderatorNavItems = [
    { id: 'map3d', label: 'মোড়েলগঞ্জ পরিচিতি', icon: Globe, badge: null, subtitle: '১৬ ইউনিয়ন ও ১ পৌরসভার তথ্য' },
    { id: 'buses', label: 'বাস সময়সূচী ও কাউন্টার', icon: Bus, badge: null, subtitle: 'বাসের সময় ও কাউন্টার নাম্বার' },
    { id: 'news', label: 'সংবাদ ও নোটিশ ব্যবস্থাপনা', icon: Newspaper, badge: pendingNewsCount, subtitle: 'বিজ্ঞপ্তি প্রকাশ ও সংশোধন' },
    { id: 'donors', label: 'রক্তদাতা অনুমোদন', icon: HeartHandshake, badge: pendingDonorsCount, subtitle: 'রক্তদাতা আবেদন বাছাই' },
    { id: 'hospitals', label: 'হাসপাতাল ও ক্লিনিক তথ্য', icon: Building, badge: null, subtitle: 'চিকিৎসা কেন্দ্রের ডেটা' },
    { id: 'ambulances', label: 'অ্যাম্বুলেন্স সেবাসমূহ', icon: Truck, badge: null, subtitle: 'জরুরি গাড়ি ব্যবস্থাপনা' },
    { id: 'offices', label: 'সরকারি অফিস তথ্য', icon: Building2, badge: null, subtitle: 'অফিসের ফোন নম্বর' },
    { id: 'doctors', label: 'বিশেষজ্ঞ ডাক্তার', icon: Stethoscope, badge: null, subtitle: 'ডাক্তারদের তথ্য' },
    { id: 'spots', label: 'দর্শনীয় স্থান', icon: Compass, badge: null, subtitle: 'ট্যুরিস্ট স্পট' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Alert */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px] animate-pulse">
            জরুরি
          </span>
          <p className="truncate text-xs">
            মোড়েলগঞ্জ ডিজিটাল নাগরিক সেবায় আপনাকে স্বাগতম
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenAppModal && (
            <button
              onClick={onOpenAppModal}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-0.5 rounded-md text-xs font-black transition-colors cursor-pointer shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 অ্যাপ ডাউনলোড</span>
            </button>
          )}

          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>জরুরি হেল্পলাইন</span>
          </button>

          {userRole !== 'citizen' && (
            <button
              onClick={onOpenRoleModal}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-2.5 py-1 rounded-md text-xs border border-emerald-700 transition-colors cursor-pointer shadow-2xs font-bold"
            >
              {userRole === 'admin' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-amber-300">এডমিন ড্যাশবোর্ড</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-bold text-sky-300">মডারেটর ড্যাশবোর্ড</span>
                </>
              )}
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => setActiveTab(userRole === 'moderator' ? 'news' : 'home')}
        >
          {/* Favicon / Small Icon */}
          <div className="w-12 h-12 sm:w-11 sm:h-11 rounded-full p-0.5 flex items-center justify-center shadow-xs border border-emerald-500/30 shrink-0 overflow-hidden bg-transparent">
            <img
              src={siteFavicon || siteLogo}
              alt="Favicon"
              className="w-full h-full object-cover rounded-full bg-transparent"
            />
          </div>

          {/* Main Logo Image in place of text */}
          {siteLogo ? (
            <div className="flex items-center bg-transparent">
              <img
                src={siteLogo}
                alt="hellomorrelgonj logo"
                className="h-14 sm:h-11 md:h-13 lg:h-14 w-auto max-w-[280px] sm:max-w-[300px] md:max-w-[400px] object-contain rounded-md bg-transparent"
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                hellomorrelgonj
              </h1>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded-md border border-emerald-200 inline-block self-start mt-1">
                মোড়েলগঞ্জ
              </span>
            </div>
          )}
        </div>

        {/* Right side items: Actions + Hamburger button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Action Buttons Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {onOpenAppModal && (
              <button
                onClick={onOpenAppModal}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer border border-amber-400"
              >
                <Smartphone className="w-4 h-4 text-slate-950 animate-bounce" />
                <span>অ্যান্ড্রয়েড অ্যাপ</span>
              </button>
            )}

            {onOpenModeratorModal && userRole === 'citizen' && (
              <button
                onClick={onOpenModeratorModal}
                className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-800 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-sky-600" />
                <span>মডারেটর হতে আবেদন</span>
              </button>
            )}

            <button
              onClick={onOpenDonorModal}
              className="flex items-center gap-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <span>ডোনার রেজিস্ট্রেশন</span>
            </button>

            <button
              onClick={onOpenAiDrawer}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>AI মোড়েলগঞ্জ হেল্পার</span>
            </button>
          </div>

          {/* AI Helper & App trigger for mobile */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenAppModal && (
              <button
                onClick={onOpenAppModal}
                className="bg-amber-500 text-slate-950 p-2 rounded-xl border border-amber-400 cursor-pointer flex items-center gap-1 text-xs font-black shadow-2xs"
                title="অ্যান্ড্রয়েড অ্যাপ ডাউনলোড"
              >
                <Smartphone className="w-4 h-4 text-slate-950" />
                <span className="inline text-[11px] font-black">অ্যাপ</span>
              </button>
            )}

            <button
              onClick={onOpenAiDrawer}
              className="bg-emerald-50 text-emerald-700 p-2 rounded-xl border border-emerald-200 cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="AI সহকারী"
            >
              <Bot className="w-5 h-5 text-emerald-600" />
              <span className="hidden sm:inline">AI হেল্পার</span>
            </button>
          </div>

          {/* Hamburger Menu Button (Right Side) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-all cursor-pointer border border-emerald-200 flex items-center justify-center group relative"
            title="হ্যাম্বারগার মেনু খুলুন"
            aria-label="হ্যাম্বারগার মেনু"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 group-hover:scale-105 transition-transform" />
            {pendingCount > 0 && userRole !== 'citizen' && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce ring-2 ring-white">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Desktop */}
      <div className="hidden lg:block bg-slate-900 text-slate-200 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <nav className="flex items-center gap-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Role badge */}
          <div className="py-1">
            {userRole === 'admin' && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                এডমিন মোড
              </span>
            )}
            {userRole === 'moderator' && (
              <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                মডারেটর মোড
              </span>
            )}
            {userRole === 'citizen' && (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1 rounded-full">
                নাগরিক পোর্টাল
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Slide-Over Drawer Navigation Menu */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-slate-900 text-slate-100 h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-slate-800 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full p-0.5 flex items-center justify-center shadow-xs shrink-0 overflow-hidden border border-slate-700">
                  <img src={siteFavicon || siteLogo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                {siteLogo ? (
                  <div className="flex flex-col justify-center">
                    <img src={siteLogo} alt="Logo" className="h-10 sm:h-12 w-auto object-contain max-w-[180px] sm:max-w-[220px] rounded-md" />
                    <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                      {userRole === 'moderator'
                        ? 'মডারেটর কন্ট্রোল প্যানেল'
                        : userRole === 'admin'
                        ? 'এডমিন কন্ট্রোল প্যানেল'
                        : 'সিটিজেন পোর্টাল'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 leading-tight">হ্যালো মোড়েলগঞ্জ</h2>
                    <p className="text-xs text-emerald-700 font-semibold">
                      {userRole === 'moderator'
                        ? 'মডারেটর কন্ট্রোল প্যানেল'
                        : userRole === 'admin'
                        ? 'এডমিন কন্ট্রোল প্যানেল'
                        : 'সিটিজেন পোর্টাল'}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* If Admin Role */}
              {userRole === 'admin' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-400" />
                      এডমিন ফিচার প্যানেল
                    </span>
                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded-full font-bold">
                      {adminNavItems.length} টি অপশন
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {adminNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white border-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 text-amber-400 border border-amber-500/20'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <div className="font-extrabold truncate">{item.label}</div>
                              <div className={`text-[10px] font-normal truncate mt-0.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          {item.badge !== null && item.badge > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                              isActive ? 'bg-slate-950 text-amber-300' : 'bg-amber-500 text-slate-950'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* If Moderator Role */}
              {userRole === 'moderator' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-sky-400" />
                      মডারেটর ফিচার প্যানেল
                    </span>
                    <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800/60 px-2 py-0.5 rounded-full font-bold">
                      {moderatorNavItems.length} টি অপশন
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {moderatorNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                            isActive
                              ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md ring-2 ring-sky-400/30'
                              : 'bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white border-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-slate-950 text-sky-300' : 'bg-slate-900 text-sky-400 border border-sky-500/20'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <div className="font-extrabold truncate">{item.label}</div>
                              <div className={`text-[10px] font-normal truncate mt-0.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          {item.badge !== null && item.badge > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                              isActive ? 'bg-slate-950 text-sky-300' : 'bg-amber-500 text-slate-950'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Citizen Navigation Links */}
              {userRole === 'citizen' && (
                <div className="space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 px-1 flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-emerald-400" />
                    সার্ভিস ও ক্যাটাগরি মেনু
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setDrawerOpen(false);
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            isActive
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md ring-2 ring-emerald-400/30'
                              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-700/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action shortcuts */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                {onOpenAppModal && (
                  <button
                    onClick={() => {
                      onOpenAppModal();
                      setDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-md"
                  >
                    <Smartphone className="w-4 h-4 text-slate-950" />
                    <span>অ্যান্ড্রয়েড অ্যাপ ইনস্টল / ডাউনলোড</span>
                  </button>
                )}

                {onOpenModeratorModal && userRole === 'citizen' && (
                  <button
                    onClick={() => {
                      onOpenModeratorModal();
                      setDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>মডারেটর পদে আবেদন করুন</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onOpenDonorModal();
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>নতুন ডোনার রেজিস্ট্রেশন</span>
                </button>

                <button
                  onClick={() => {
                    onOpenRoleModal();
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer transition-colors"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>রোল পরিবর্তন করুন</span>
                </button>
              </div>
            </div>

            {/* Bottom Section: Profile & Logout */}
            {userRole === 'moderator' ? (
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
                {/* Profile Card */}
                <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-inner">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">মডারেটর, হ্যালো মোড়েলগঞ্জ</h3>
                    <p className="text-[11px] text-slate-400 truncate">moderator@morrelganj.gov.bd</p>
                    <span className="inline-block bg-sky-950 text-sky-400 border border-sky-800/80 px-1.5 py-0.2 rounded-md text-[10px] font-semibold mt-0.5">
                      অনুমোদিত মডারেটর
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>লগআউট করুন</span>
                </button>
              </div>
            ) : userRole === 'admin' ? (
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-inner">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">প্রধান এডমিন</h3>
                    <p className="text-[11px] text-slate-400 truncate">admin@morrelganj.gov.bd</p>
                    <span className="inline-block bg-amber-950 text-amber-400 border border-amber-800/80 px-1.5 py-0.2 rounded-md text-[10px] font-semibold mt-0.5">
                      সিস্টেম এডমিনিস্ট্রেটর
                    </span>
                  </div>
                </div>
                {onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-200 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>লগআউট (সিটিজেন মোড)</span>
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};


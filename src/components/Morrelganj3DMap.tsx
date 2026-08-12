import React, { useState, useEffect } from 'react';
import {
  Compass,
  ZoomIn,
  ZoomOut,
  MapPin,
  Users,
  Building,
  GraduationCap,
  PhoneCall,
  Search,
  Sparkles,
  Globe,
  Award,
  ShieldCheck,
  TrendingUp,
  Map as MapIcon,
  Edit,
  X,
  Save,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Check,
  Trash2,
  Upload
} from 'lucide-react';
import { UpazilaRegion, UserRole } from '../types';
import { MORRELGANJ_REGIONS } from '../data/morrelgonjRegionData';
import { saveToFirestore, deleteFromFirestore } from '../lib/useFirestoreSync';

interface Morrelganj3DMapProps {
  onSelectRegion?: (region: UpazilaRegion) => void;
  regionsList?: UpazilaRegion[];
  setRegionsList?: React.Dispatch<React.SetStateAction<UpazilaRegion[]>>;
  isEditable?: boolean;
  userRole?: UserRole;
  addLog?: (action: string, details: string) => void;
}

export const Morrelganj3DMap: React.FC<Morrelganj3DMapProps> = ({
  onSelectRegion,
  regionsList: propRegions,
  setRegionsList,
  isEditable = false,
  userRole = 'citizen',
  addLog
}) => {
  const allRegions = propRegions && propRegions.length > 0 ? propRegions : MORRELGANJ_REGIONS;

  // Filter list depending on user role:
  // Citizens only see approved regions. Moderators and Admins see all.
  const displayableRegions = allRegions.filter((reg) => {
    if (userRole === 'citizen') {
      return reg.status !== 'pending' && reg.status !== 'rejected';
    }
    return true;
  });

  // 3D Camera Controls State
  const [rotateX, setRotateX] = useState<number>(55); // Pitch
  const [rotateZ, setRotateZ] = useState<number>(-25); // Yaw
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [heightMetric, setHeightMetric] = useState<'population' | 'areaSqKm' | 'literacyRate'>('population');

  // View modes
  const [viewMode, setViewMode] = useState<'3d' | 'grid' | 'table'>('3d');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'পৌরসভা' | 'ইউনিয়ন'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');

  // Selected & Hovered Region
  const [selectedRegion, setSelectedRegion] = useState<UpazilaRegion | null>(displayableRegions[0] || null);
  const [hoveredRegion, setHoveredRegion] = useState<UpazilaRegion | null>(null);

  // Auto-rotate animation
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Touch & Mouse Drag Camera State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    x: number;
    y: number;
    rotX: number;
    rotZ: number;
  } | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MODAL STATES FOR EDITING UNION
  const [editingRegionModal, setEditingRegionModal] = useState<UpazilaRegion | null>(null);
  const [regName, setRegName] = useState('');
  const [regEngName, setRegEngName] = useState('');
  const [regType, setRegType] = useState<'পৌরসভা' | 'ইউনিয়ন'>('ইউনিয়ন');
  const [regArea, setRegArea] = useState('');
  const [regChairman, setRegChairman] = useState('');
  const [regChairmanImage, setRegChairmanImage] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOffice, setRegOffice] = useState('');
  const [regPop, setRegPop] = useState('');
  const [regLiteracy, setRegLiteracy] = useState('');
  const [regVoter, setRegVoter] = useState('');
  const [regPlacesText, setRegPlacesText] = useState('');
  const [regDesc, setRegDesc] = useState('');

  // Sync selectedRegion if displayable list changes
  useEffect(() => {
    if (selectedRegion) {
      const found = displayableRegions.find((r) => r.id === selectedRegion.id);
      if (found) {
        setSelectedRegion(found);
      } else if (displayableRegions.length > 0) {
        setSelectedRegion(displayableRegions[0]);
      }
    } else if (displayableRegions.length > 0) {
      setSelectedRegion(displayableRegions[0]);
    }
  }, [allRegions]);

  // Handle Mouse Drag Camera Rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, rotX: rotateX, rotZ: rotateZ });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotateZ((dragStart.rotZ - dx * 0.5) % 360);
    setRotateX(Math.max(15, Math.min(80, dragStart.rotX - dy * 0.4)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        rotX: rotateX,
        rotZ: rotateZ
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStart || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setRotateZ((dragStart.rotZ - dx * 0.5) % 360);
    setRotateX(Math.max(15, Math.min(80, dragStart.rotX - dy * 0.4)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotateZ((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  const handleResetCamera = () => {
    setRotateX(55);
    setRotateZ(-25);
    setZoomLevel(1);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Filter and Sort Regions
  const filteredRegions = displayableRegions.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.chairmanOrMayorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.famousPlaces.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || reg.type === typeFilter;

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? reg.status === 'pending' || reg.pendingAction === 'edit'
        : reg.status !== 'pending' && reg.pendingAction !== 'edit';

    return matchesSearch && matchesType && matchesStatus;
  });

  // Dynamic 3D Pillar Height calculation
  const maxMetricVal = Math.max(
    ...allRegions.map((r) => {
      if (heightMetric === 'population') return r.population;
      if (heightMetric === 'areaSqKm') return r.areaSqKm;
      return parseFloat(r.literacyRate) || 50;
    })
  );

  const getPillarHeight = (reg: UpazilaRegion) => {
    let val = reg.population;
    if (heightMetric === 'areaSqKm') val = reg.areaSqKm;
    if (heightMetric === 'literacyRate') val = parseFloat(reg.literacyRate) || 50;
    const ratio = val / (maxMetricVal || 1);
    return Math.max(18, Math.round(ratio * 75));
  };

  // --- SAVE REGION EDIT HANDLER ---
  const handleChairmanImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('ছবিটি ৫ মেগাবাইটের বেশি। অনুগ্রহ করে ছোট আকারের ছবি নির্বাচন করুন।');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setRegChairmanImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenEditRegion = (reg: UpazilaRegion) => {
    setEditingRegionModal(reg);
    setRegName(reg.name);
    setRegEngName(reg.englishName || reg.name);
    setRegType(reg.type);
    setRegArea(String(reg.areaSqKm));
    setRegChairman(reg.chairmanOrMayorName);
    setRegChairmanImage(reg.chairmanImage || '');
    setRegPhone(reg.chairmanPhone);
    setRegOffice(reg.officeLocation);
    setRegPop(String(reg.population));
    setRegLiteracy(reg.literacyRate);
    setRegVoter(reg.voterCount ? String(reg.voterCount) : '');
    setRegPlacesText(reg.famousPlaces.join(', '));
    setRegDesc(reg.description);
  };

  const handleSaveRegionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegionModal) return;

    const places = regPlacesText.split(',').map((p) => p.trim()).filter(Boolean);
    const isAdmin = userRole === 'admin';

    if (isAdmin) {
      // Direct Live Update
      const updated: UpazilaRegion = {
        ...editingRegionModal,
        name: regName.trim() || editingRegionModal.name,
        englishName: regEngName.trim() || editingRegionModal.englishName,
        type: regType,
        areaSqKm: parseFloat(regArea) || editingRegionModal.areaSqKm,
        chairmanOrMayorName: regChairman.trim(),
        chairmanImage: regChairmanImage.trim() || undefined,
        chairmanPhone: regPhone.trim(),
        officeLocation: regOffice.trim(),
        population: parseInt(regPop, 10) || editingRegionModal.population,
        literacyRate: regLiteracy.trim(),
        voterCount: parseInt(regVoter, 10) || editingRegionModal.voterCount,
        famousPlaces: places.length > 0 ? places : editingRegionModal.famousPlaces,
        description: regDesc.trim(),
        status: 'approved',
        pendingAction: undefined,
        pendingEditData: undefined
      };

      if (setRegionsList) {
        setRegionsList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      }
      saveToFirestore('regions', updated);

      if (selectedRegion?.id === updated.id) {
        setSelectedRegion(updated);
      }

      if (addLog) {
        addLog('এডমিন ইউনিয়ন তথ্য আপডেট', `ইউনিয়ন "${updated.name}" এর তথ্য আপডেট করা হয়েছে।`);
      }
      triggerToast(`✅ "${updated.name}" তথ্য সরাসরি সেভ ও আপডেট করা হয়েছে!`);
    } else {
      // Moderator Submission -> Creates Pending Edit
      const updated: UpazilaRegion = {
        ...editingRegionModal,
        pendingAction: 'edit',
        pendingEditData: {
          name: regName.trim(),
          englishName: regEngName.trim(),
          type: regType,
          areaSqKm: parseFloat(regArea) || editingRegionModal.areaSqKm,
          chairmanOrMayorName: regChairman.trim(),
          chairmanImage: regChairmanImage.trim() || undefined,
          chairmanPhone: regPhone.trim(),
          officeLocation: regOffice.trim(),
          population: parseInt(regPop, 10) || editingRegionModal.population,
          literacyRate: regLiteracy.trim(),
          voterCount: parseInt(regVoter, 10) || editingRegionModal.voterCount,
          famousPlaces: places.length > 0 ? places : editingRegionModal.famousPlaces,
          description: regDesc.trim()
        },
        submittedBy: 'মডারেটর',
        submittedAt: new Date().toLocaleDateString('bn-BD')
      };

      if (setRegionsList) {
        setRegionsList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      }
      saveToFirestore('regions', updated);

      if (selectedRegion?.id === updated.id) {
        setSelectedRegion(updated);
      }

      if (addLog) {
        addLog('মডারেটর ইউনিয়ন তথ্য সংশোধনের আবেদন', `ইউনিয়ন "${editingRegionModal.name}" এর আপডেট পেন্ডিং লিস্টে যোগ করা হয়েছে।`);
      }
      triggerToast(`📩 "${editingRegionModal.name}" এর সংশোধিত তথ্য জমা হয়েছে। এডমিন অনুমোদনের পর প্রকাশিত হবে।`);
    }

    setEditingRegionModal(null);
  };

  // ADMIN APPROVE / REJECT HANDLERS
  const handleAdminApproveUnion = (reg: UpazilaRegion) => {
    if (reg.pendingAction === 'edit' && reg.pendingEditData) {
      const merged: UpazilaRegion = {
        ...reg,
        ...reg.pendingEditData,
        status: 'approved',
        pendingAction: undefined,
        pendingEditData: undefined
      };
      if (setRegionsList) {
        setRegionsList((prev) => prev.map((r) => (r.id === reg.id ? merged : r)));
      }
      saveToFirestore('regions', merged);
      if (addLog) addLog('এডমিন ইউনিয়ন সংশোধন অনুমোদন', `ইউনিয়ন "${merged.name}" এর সংশোধিত তথ্য অনুমোদন করা হয়েছে।`);
      triggerToast(`✅ "${merged.name}" তথ্য সংশোধন অনুমোদন করা হয়েছে!`);
    } else {
      const approvedReg: UpazilaRegion = {
        ...reg,
        status: 'approved',
        pendingAction: undefined
      };
      if (setRegionsList) {
        setRegionsList((prev) => prev.map((r) => (r.id === reg.id ? approvedReg : r)));
      }
      saveToFirestore('regions', approvedReg);
      if (addLog) addLog('এডমিন নতুন ইউনিয়ন অনুমোদন', `নতুন ইউনিয়ন "${approvedReg.name}" অনুমোদন করা হয়েছে।`);
      triggerToast(`✅ new Union "${approvedReg.name}" সফলভাবে পোর্টালে প্রকাশ করা হয়েছে!`);
    }
  };

  const handleAdminRejectUnion = (reg: UpazilaRegion) => {
    if (reg.pendingAction === 'edit') {
      const cleared: UpazilaRegion = {
        ...reg,
        pendingAction: undefined,
        pendingEditData: undefined
      };
      if (setRegionsList) {
        setRegionsList((prev) => prev.map((r) => (r.id === reg.id ? cleared : r)));
      }
      saveToFirestore('regions', cleared);
      if (addLog) addLog('এডমিন ইউনিয়ন সংশোধন বাতিল', `ইউনিয়ন "${reg.name}" এর সংশোধনের আবেদন বাতিল করা হয়েছে।`);
      triggerToast(`❌ "${reg.name}" সংশোধনের অনুরোধ বাতিল করা হয়েছে।`);
    } else {
      if (setRegionsList) {
        setRegionsList((prev) => prev.filter((r) => r.id !== reg.id));
      }
      deleteFromFirestore('regions', reg.id);
      if (addLog) addLog('এডমিন নতুন ইউনিয়ন আবেদন বাতিল', `ইউনিয়ন "${reg.name}" এর নতুন সংযোজন আবেদন বাতিল করা হয়েছে।`);
      triggerToast(`❌ "${reg.name}" সংযোজনের আবেদন বাতিল করা হয়েছে।`);
    }
  };

  const canEdit = isEditable || userRole === 'admin' || userRole === 'moderator';

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white border border-emerald-500/40 shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Clean Header Bar focused on Unions & Municipality */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>মোড়েলগঞ্জ ইউনিয়ন ও পৌরসভা পরিচিতি</span>
            </span>
            <span className="text-xs text-emerald-200/80 font-bold bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700">
              {allRegions.length} টি প্রশাসনিক এলাকা
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            ইউনিয়ন ও পৌরসভা পরিচিতি নির্দেশিকা
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            মোড়েলগঞ্জের ১৬টি ইউনিয়ন ও ১টি পৌরসভার জনমিতি, আয়তন, চেয়ারম্যান ও যোগাযোগের বিস্তারিত
          </p>
        </div>
      </div>

      {/* Moderator Info Notice */}
      {userRole === 'moderator' && (
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900 text-xs font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            মডারেটর বার্তা: ইউনিয়নের কোনো তথ্য সংশোধন করা হলে তা পেন্ডিং হিসেবে জমা হবে এবং এডমিন এপ্রুভালের পর সরাসরি পোর্টালে দেখাবে।
          </span>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>৩ডি ম্যাপ</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>কার্ড ভিউ</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>তালিকা ভিউ</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl justify-end">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ইউনিয়ন, পৌরসভা বা চেয়ারম্যানের নাম খুঁজুন..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            >
              <option value="all">সকল টাইপ ({displayableRegions.length})</option>
              <option value="পৌরসভা">পৌরসভা</option>
              <option value="ইউনিয়ন">ইউনিয়ন</option>
            </select>

            {userRole !== 'citizen' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-amber-300 text-xs bg-amber-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-amber-900"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="approved">প্রকাশিত / এপ্রুভড</option>
                <option value="pending">পেন্ডিং এপ্রুভাল</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: 3D INTERACTIVE CANVAS & SIDE PANEL */}
      {viewMode === '3d' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 relative bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[520px] flex flex-col justify-between">
            {/* Top Canvas Header Bar */}
            <div className="p-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md z-20 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-extrabold text-emerald-300">
                  ৩ডি ডিজিটাল ম্যাপ (মোড়েলগঞ্জ)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`px-3 py-1 rounded-lg border transition-all text-xs font-bold cursor-pointer ${
                    isAutoRotating
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isAutoRotating ? 'অটো-ঘূর্ণন চালু' : 'ঘূর্ণন বন্ধ'}
                </button>
                <button
                  onClick={handleResetCamera}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-colors cursor-pointer"
                >
                  রিসেট
                </button>
              </div>
            </div>

            {/* 3D MAP STAGE */}
            <div
              className="relative w-full h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="relative transition-transform duration-75 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `scale(${zoomLevel}) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`
                }}
              >
                {/* 3D Ground Mesh Platform */}
                <div
                  className="w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] rounded-3xl bg-slate-900/90 border-2 border-emerald-500/30 shadow-2xl relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20 rounded-3xl" />

                  {/* Render Regions 3D Pillars */}
                  {filteredRegions.map((region) => {
                    const isSelected = selectedRegion?.id === region.id;
                    const isHovered = hoveredRegion?.id === region.id;
                    const pillarH = getPillarHeight(region);
                    const isMuni = region.type === 'পৌরসভা';
                    const isPending = region.status === 'pending' || region.pendingAction === 'edit';

                    return (
                      <div
                        key={region.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRegion(region);
                          if (onSelectRegion) onSelectRegion(region);
                        }}
                        onMouseEnter={() => setHoveredRegion(region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        className="absolute cursor-pointer transition-all duration-300"
                        style={{
                          left: `${region.gridPos.x}%`,
                          top: `${region.gridPos.y}%`,
                          transformStyle: 'preserve-3d',
                          transform: `translate3d(-50%, -50%, ${
                            isSelected ? 25 : isHovered ? 15 : 0
                          }px)`
                        }}
                      >
                        <div
                          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl shadow-xl transition-all duration-300"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <div
                            className={`w-full h-full rounded-xl border flex flex-col justify-between p-1 shadow-2xl transition-all duration-300 ${
                              isPending
                                ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-300 text-white ring-2 ring-amber-400'
                                : isSelected
                                ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 border-white ring-4 ring-emerald-400/50 text-white'
                                : isHovered
                                ? 'bg-gradient-to-br from-sky-400 to-blue-600 border-sky-200 text-white'
                                : isMuni
                                ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 border-amber-200 text-slate-900 font-extrabold'
                                : 'bg-gradient-to-br from-slate-800 via-slate-800 to-emerald-950 border-emerald-500/40 text-emerald-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[9px]">
                              <span
                                className={`px-1 py-0.2 rounded font-bold ${
                                  isMuni
                                    ? 'bg-slate-900 text-amber-300'
                                    : 'bg-emerald-950/80 text-emerald-300'
                                }`}
                              >
                                {isMuni ? 'পৌর' : 'ইউপি'}
                              </span>

                              {isPending && (
                                <Clock className="w-2.5 h-2.5 text-amber-200 animate-spin" />
                              )}
                            </div>

                            <span className="text-[10px] font-extrabold truncate text-center leading-tight">
                              {region.name.replace('ইউনিয়ন', '').replace('মোড়েলগঞ্জ', '')}
                            </span>
                          </div>

                          <div
                            className={`absolute left-0 right-0 top-full origin-top rounded-b-xl transition-all duration-200 ${
                              isSelected
                                ? 'bg-emerald-700/90'
                                : isMuni
                                ? 'bg-amber-700/90'
                                : 'bg-slate-900/90 border-t border-emerald-700/50'
                            }`}
                            style={{
                              height: `${pillarH}px`,
                              transform: 'rotateX(-90deg)'
                            }}
                          />
                        </div>

                        <div
                          className={`absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 whitespace-nowrap z-20 ${
                            isSelected || isHovered ? 'scale-110' : 'scale-100'
                          }`}
                          style={{
                            transform: `translate(-50%, -100%) translateZ(${
                              isSelected ? pillarH + 35 : pillarH + 20
                            }px)`
                          }}
                        >
                          <div
                            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold shadow-2xl border flex items-center gap-1 ${
                              isPending
                                ? 'bg-amber-500 text-slate-950 border-white ring-2 ring-amber-300'
                                : isSelected
                                ? 'bg-emerald-500 text-slate-950 border-white ring-2 ring-emerald-300'
                                : isMuni
                                ? 'bg-amber-500 text-slate-950 border-amber-200'
                                : 'bg-slate-900/95 text-slate-100 border-slate-700'
                            }`}
                          >
                            <MapPin className="w-3 h-3" />
                            <span>{region.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Floating Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((z) => Math.max(0.6, z - 0.15));
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs px-2 text-emerald-400 font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((z) => Math.min(1.8, z + 0.15));
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Region Details Side Panel */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-5 flex flex-col justify-between">
            {selectedRegion ? (
              <div className="space-y-5">
                {/* Pending Badge Banner */}
                {(selectedRegion.status === 'pending' || selectedRegion.pendingAction === 'edit') && (
                  <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-amber-900 text-xs font-bold space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-800 font-extrabold">
                        <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                        <span>এডমিন অনুমোদনের অপেক্ষায় (পেন্ডিং)</span>
                      </span>
                      <span className="bg-amber-200 text-amber-950 text-[10px] px-2 py-0.5 rounded font-black">
                        {selectedRegion.status === 'pending' ? 'নতুন সংযোজন' : 'তথ্য সংশোধন'}
                      </span>
                    </div>

                    {selectedRegion.pendingEditData && (
                      <p className="text-[11px] text-amber-800 font-medium">
                        সংশোধিত চেয়ারম্যান: {selectedRegion.pendingEditData.chairmanOrMayorName || selectedRegion.chairmanOrMayorName} | ফোন: {selectedRegion.pendingEditData.chairmanPhone || selectedRegion.chairmanPhone}
                      </p>
                    )}

                    {userRole === 'admin' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleAdminApproveUnion(selectedRegion)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>অনুমোদন করুন</span>
                        </button>
                        <button
                          onClick={() => handleAdminRejectUnion(selectedRegion)}
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>বাতিল করুন</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        selectedRegion.type === 'পৌরসভা'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {selectedRegion.type}
                    </span>

                    {canEdit && (
                      <button
                        onClick={() => handleOpenEditRegion(selectedRegion)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>তথ্য সংশোধন</span>
                      </button>
                    )}
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>{selectedRegion.name}</span>
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedRegion.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      জনসংখ্যা
                    </span>
                    <span className="text-base font-bold text-slate-800 block">
                      {selectedRegion.population.toLocaleString('bn-BD')} জন
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
                      মোট আয়তন
                    </span>
                    <span className="text-base font-bold text-slate-800 block">
                      {selectedRegion.areaSqKm} বর্গ কিমি
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                      স্বাক্ষরতার হার
                    </span>
                    <span className="text-base font-bold text-slate-800 block">
                      {selectedRegion.literacyRate}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-0.5">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      মোট ভোটার
                    </span>
                    <span className="text-base font-bold text-slate-800 block">
                      {selectedRegion.voterCount?.toLocaleString('bn-BD')} জন
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200/80 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 block flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {selectedRegion.type === 'পৌরসভা' ? 'মেয়র / প্রশাসক তথ্য' : 'বর্তমান ইউপি চেয়ারম্যান'}
                  </span>

                  <div className="flex items-center gap-3 text-xs">
                    <img
                      src={
                        selectedRegion.chairmanImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={selectedRegion.chairmanOrMayorName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-extrabold text-slate-900 text-sm block truncate">
                        {selectedRegion.chairmanOrMayorName}
                      </span>
                      <span className="text-slate-500 text-[11px] block truncate">
                        {selectedRegion.officeLocation}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    দর্শনীয় ও বিখ্যাত স্থানসমূহ:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRegion.famousPlaces.map((place) => (
                      <span
                        key={place}
                        className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
                      >
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-2 text-slate-400">
                <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">
                  মোড়েলগঞ্জ পরিচিতি থেকে যেকোনো ইউনিয়ন বা পৌরসভা সিলেক্ট করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CARD GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRegions.map((reg) => {
            const isPending = reg.status === 'pending' || reg.pendingAction === 'edit';
            return (
              <div
                key={reg.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-3 flex flex-col justify-between ${
                  isPending ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {reg.type}
                    </span>

                    {isPending && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>পেন্ডিং অনুমোদন</span>
                      </span>
                    )}

                    {canEdit && (
                      <button
                        onClick={() => handleOpenEditRegion(reg)}
                        className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>সংশোধন</span>
                      </button>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900">{reg.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{reg.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-2 text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        reg.chairmanImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={reg.chairmanOrMayorName}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-500 shadow-2xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-extrabold text-slate-900 text-xs block truncate">
                        {reg.chairmanOrMayorName}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {reg.type === 'পৌরসভা' ? 'মেয়র / প্রশাসক' : 'ইউপি চেয়ারম্যান'}
                      </span>
                    </div>
                  </div>
                  <p><strong>জনসংখ্যা:</strong> {reg.population.toLocaleString('bn-BD')} জন</p>
                </div>

                {userRole === 'admin' && isPending && (
                  <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                    <button
                      onClick={() => handleAdminApproveUnion(reg)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>অনুমোদন</span>
                    </button>
                    <button
                      onClick={() => handleAdminRejectUnion(reg)}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>বাতিল</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 3: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
              <tr>
                <th className="p-3.5">নাম</th>
                <th className="p-3.5">ধরণ</th>
                <th className="p-3.5">দায়িত্বপ্রাপ্ত কর্মকর্তা/মেয়র</th>
                <th className="p-3.5">জনসংখ্যা</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                {canEdit && <th className="p-3.5">অ্যাকশন</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegions.map((reg) => {
                const isPending = reg.status === 'pending' || reg.pendingAction === 'edit';
                return (
                  <tr key={reg.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-bold text-slate-900">{reg.name}</td>
                    <td className="p-3.5">{reg.type}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            reg.chairmanImage ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={reg.chairmanOrMayorName}
                          className="w-7 h-7 rounded-full object-cover border border-emerald-500 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span className="font-bold text-slate-800">{reg.chairmanOrMayorName}</span>
                      </div>
                    </td>
                    <td className="p-3.5">{reg.population.toLocaleString('bn-BD')}</td>
                    <td className="p-3.5">
                      {isPending ? (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          পেন্ডিং অনুমোদন
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          প্রকাশিত
                        </span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="p-3.5 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditRegion(reg)}
                          className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold rounded-md flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>সংশোধন</span>
                        </button>

                        {userRole === 'admin' && isPending && (
                          <>
                            <button
                              onClick={() => handleAdminApproveUnion(reg)}
                              className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-700 flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>অনুমোদন</span>
                            </button>
                            <button
                              onClick={() => handleAdminRejectUnion(reg)}
                              className="px-2 py-1 bg-rose-600 text-white font-bold rounded-md hover:bg-rose-700 flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* --- EDIT REGION MODAL --- */}
      {editingRegionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    {editingRegionModal.name} - তথ্য সংশোধন
                  </h3>
                  <p className="text-xs text-slate-400">
                    {userRole === 'moderator'
                      ? 'মডারেটর সংশোধন (এডমিন এপ্রুভালের পর প্রকাশিত হবে)'
                      : 'এডমিন সরাসরি লাইভ আপডেট'}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditingRegionModal(null)} className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRegionSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {editingRegionModal.type === 'পৌরসভা' ? 'মেয়র/প্রশাসকের নাম *' : 'ইউপি চেয়ারম্যানের নাম *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regChairman}
                    onChange={(e) => setRegChairman(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {editingRegionModal.type === 'পৌরসভা' ? 'মেয়র/প্রশাসকের ছবি' : 'ইউপি চেয়ারম্যানের ছবি'}
                  </label>
                  <div className="flex items-center gap-2">
                    {regChairmanImage ? (
                      <div className="relative group shrink-0">
                        <img
                          src={regChairmanImage}
                          alt="Chairman Preview"
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setRegChairmanImage('')}
                          className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700 transition-colors cursor-pointer"
                          title="ছবি মুছে ফেলুন"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <Upload className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        id="reg-chairman-image-file"
                        className="hidden"
                        onChange={handleChairmanImageUpload}
                      />
                      <label
                        htmlFor="reg-chairman-image-file"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>ডিভাইস থেকে আপলোড করুন</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">জনসংখ্যা</label>
                  <input
                    type="number"
                    value={regPop}
                    onChange={(e) => setRegPop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অফিসের ঠিকানা</label>
                <input
                  type="text"
                  value={regOffice}
                  onChange={(e) => setRegOffice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্বাক্ষরতার হার</label>
                  <input
                    type="text"
                    value={regLiteracy}
                    onChange={(e) => setRegLiteracy(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভোটার সংখ্যা</label>
                  <input
                    type="number"
                    value={regVoter}
                    onChange={(e) => setRegVoter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিখ্যাত/দর্শনীয় স্থান (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  value={regPlacesText}
                  onChange={(e) => setRegPlacesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ</label>
                <textarea
                  rows={3}
                  value={regDesc}
                  onChange={(e) => setRegDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{userRole === 'moderator' ? 'সংশোধনের অনুরোধ পাঠান' : 'তাত্ক্ষণিক তথ্য আপডেট করুন'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

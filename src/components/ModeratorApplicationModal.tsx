import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, User, Phone, Mail, MapPin, Briefcase, FileText, IdCard, Sparkles, Lock, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import { ModeratorApplication, MorrelganjUnion, ModeratorPermissions } from '../types';
import { ALL_MORRELGANJ_UNIONS_LIST } from '../data/morrelgonjRegionData';

interface ModeratorApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (application: Omit<ModeratorApplication, 'id' | 'status' | 'submittedAt'>) => void;
}

const UNIONS = ALL_MORRELGANJ_UNIONS_LIST as MorrelganjUnion[];

export const ModeratorApplicationModal: React.FC<ModeratorApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmitApplication
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [union, setUnion] = useState<MorrelganjUnion>('মোড়েলগঞ্জ সদর');
  const [village, setVillage] = useState('');
  const [profession, setProfession] = useState('');
  const [reason, setReason] = useState('');
  const [nidOrId, setNidOrId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Requested permissions corresponding to all Moderator Dashboard hamburger menu options
  const [requestedPermissions, setRequestedPermissions] = useState<ModeratorPermissions>({
    canManageMap3d: true,
    canManageNews: true,
    canManageDonors: true,
    canManageHospitals: true,
    canManageAmbulances: true,
    canManageOffices: true,
    canManageBuses: true
  });

  if (!isOpen) return null;

  const togglePermission = (key: keyof ModeratorPermissions) => {
    setRequestedPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !phone.trim() || !password.trim() || !village.trim() || !profession.trim() || !reason.trim()) {
      setErrorMsg('অনুগ্রহ করে সকল প্রয়োজনীয় (স্টার চিহ্নিত) ঘরগুলো সঠিকভাবে পূরণ করুন।');
      return;
    }

    if (phone.trim().length < 11) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    const hasAtLeastOnePermission = Object.values(requestedPermissions).some(v => v);
    if (!hasAtLeastOnePermission) {
      setErrorMsg('অনুগ্রহ করে মডারেটর প্যানেলের অন্তত একটি বিষয় নির্বাচন করুন।');
      return;
    }

    setErrorMsg('');
    onSubmitApplication({
      applicantName: applicantName.trim(),
      phone: phone.trim(),
      password: password.trim(),
      email: email.trim() || undefined,
      union,
      village: village.trim(),
      profession: profession.trim(),
      reason: reason.trim(),
      nidOrId: nidOrId.trim() || undefined,
      requestedPermissions
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      // Reset form
      setApplicantName('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setEmail('');
      setUnion('মোড়েলগঞ্জ সদর');
      setVillage('');
      setProfession('');
      setReason('');
      setNidOrId('');
      onClose();
    }, 2200);
  };

  const PERMISSION_OPTIONS = [
    { key: 'canManageMap3d' as const, label: 'মোড়েলগঞ্জ পরিচিতি ও ৩ডি ম্যাপ', desc: 'ইউনিয়ন ও পৌরসভার ম্যাপ ও পরিচিতি তথ্য' },
    { key: 'canManageNews' as const, label: 'সংবাদ ও নোটিশ প্রকাশ', desc: 'জরুরী ঘোষণা, স্থানীয় সংবাদ ও নোটিশ' },
    { key: 'canManageDonors' as const, label: 'রক্তদাতা অনুমোদন ও আপডেট', desc: 'রক্তদাতাদের রেজিস্টার ও ফোন ভেরিফিকেশন' },
    { key: 'canManageHospitals' as const, label: 'হাসপাতাল ও ডায়াগনস্টিক', desc: 'উপজেলার ক্লিনিক, হাসপাতাল ও আইসিইউ তথ্য' },
    { key: 'canManageAmbulances' as const, label: 'অ্যাম্বুলেন্স সেবা', desc: 'জরুরি ড্রাইভার ও গাড়ির যোগাযোগ নম্বর' },
    { key: 'canManageOffices' as const, label: 'সরকারি দপ্তর ও পরিষদ', desc: 'ইউনিয়ন পরিষদ ও সরকারি অফিসের হটলাইন' },
    { key: 'canManageBuses' as const, label: 'বাস সময়সূচী ও কাউন্টার', desc: 'বাস ভাড়া, সময়সূচি ও টিকিট কাউন্টার' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 p-5 text-white flex items-center justify-between border-b border-emerald-800/60 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  অফিসিয়াল প্যানেল
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                মোড়েলগঞ্জ পোর্টাল মডারেটর আবেদন
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-black text-xl text-slate-900">
                আবেদন সফলভাবে জমা হয়েছে!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                আপনার সেট করা পাসওয়ার্ড ও মোবাইল নম্বর দিয়ে অনুমোদন পাওয়ার পর মডারেটর ড্যাশবোর্ডে লগইন করতে পারবেন। এডমিন আপনার তথ্যসমূহ ও নির্বাচিত বিষয়সমূহ পর্যালোচনা করে অনুমোদন দিবেন।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Notice banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  হ্যালো মোড়েলগঞ্জ পোর্টালের উন্নয়ন ও তথ্য সঠিক রাখতে দায়িত্ববান নাগরিক, শিক্ষক, ছাত্র ও সমাজসেবকদের মডারেটর হিসেবে যুক্ত করা হচ্ছে। নিচে আপনার আইডি (মোবাইল) ও পাসওয়ার্ড সেট করে আবেদন করুন।
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                  {errorMsg}
                </div>
              )}

              {/* Applicant Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>আবেদনকারীর নাম <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="যেমন: মোঃ কামরুল ইসলাম"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>মোবাইল নম্বর (লগইন আইডি) <span className="text-rose-500">*</span></span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>ইমেইল ঠিকানা (ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>মডারেটর লগইন পাসওয়ার্ড সেট করুন <span className="text-rose-500">*</span></span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600 block">পাসওয়ার্ড <span className="text-rose-500">*</span></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড দিন (অন্তত ৪ ডিজিট)"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600 block">পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-500">*</span></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  অনুমোদনের পর এই মোবাইল নম্বর ও আপনার সেট করা পাসওয়ার্ড ব্যবহার করে মডারেটর ড্যাশবোর্ডে প্রবেশ করতে পারবেন।
                </p>
              </div>

              {/* Hamburger Menu Permissions Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>কোন কোন বিষয় এর তথ্য দিতে ইচ্ছুক? (মডারেটর অপশন সিলেক্ট করুন) <span className="text-rose-500">*</span></span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    হ্যামবার্গার মেনু অপশনস
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  যেসব বিষয় পরিচালনা বা তথ্য প্রদান করতে চান সেগুলো টিক দিন। এডমিন পর্যালোচনার সময় এক্সেস পরিবর্তন করতে পারবেন।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {PERMISSION_OPTIONS.map((item) => {
                    const isChecked = requestedPermissions[item.key];
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => togglePermission(item.key)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/30'
                            : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 ${isChecked ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <h5 className={`text-xs font-bold leading-tight ${isChecked ? 'text-emerald-950' : 'text-slate-700'}`}>
                            {item.label}
                          </h5>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Union & Village Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>ইউনিয়ন / এলাকা <span className="text-rose-500">*</span></span>
                  </label>
                  <select
                    value={union}
                    onChange={(e) => setUnion(e.target.value as MorrelganjUnion)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white"
                  >
                    {UNIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>গ্রাম / মহল্লা <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="যেমন: খাউলিয়া পুরানো বাজার"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </div>

              {/* Profession & NID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>পেশা / সামাজিক পরিচয় <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="যেমন: সহকারী শিক্ষক / অনার্স ২য় বর্ষ শিক্ষার্থী"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <IdCard className="w-4 h-4 text-emerald-600" />
                    <span>এনআইডি / জাতীয় পরিচয়পত্র (ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    value={nidOrId}
                    onChange={(e) => setNidOrId(e.target.value)}
                    placeholder="যেমন: 199XXXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>কেন মডারেটর হতে চান? (উদ্দেশ্য ও সামাজিক কাজ) <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="মোড়েলগঞ্জের তথ্যাদি নির্ভুল রাখতে, জরুরী রক্তদাতা ও হাসপাতালে সহায়তা করতে কীভাবে অবদান রাখতে চান তা সংক্ষেপে লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>আবেদন জমা দিন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


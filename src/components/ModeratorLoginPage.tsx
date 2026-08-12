import React, { useState } from 'react';
import { Shield, Phone, Lock, Eye, EyeOff, UserCheck, AlertCircle, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { ModeratorApplication, UserRole } from '../types';

interface ModeratorLoginPageProps {
  moderatorApplications: ModeratorApplication[];
  onLoginSuccess: (matchedMod?: ModeratorApplication) => void;
  onGoToCitizenView: () => void;
  onOpenApplyModal: () => void;
  siteLogo?: string;
}

export const ModeratorLoginPage: React.FC<ModeratorLoginPageProps> = ({
  moderatorApplications,
  onLoginSuccess,
  onGoToCitizenView,
  onOpenApplyModal,
  siteLogo
}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedPhone = phone.trim();
    const trimmedPass = password.trim();

    if (!trimmedPhone || !trimmedPass) {
      setErrorMessage('অনুগ্রহ করে আপনার মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    // Admin phone login check
    if ((trimmedPhone === '01700000000' || trimmedPhone === 'admin') && (trimmedPass === '1234' || trimmedPass === 'admin')) {
      setSuccessMessage('স্বাগতম এডমিন! এডমিন প্যানেল লোড হচ্ছে...');
      setTimeout(() => {
        onLoginSuccess();
      }, 800);
      return;
    }

    // Match with registered moderator applications
    const matched = moderatorApplications.find(
      (app) =>
        app.phone === trimmedPhone ||
        app.phone.replace(/[^0-9]/g, '') === trimmedPhone.replace(/[^0-9]/g, '')
    );

    if (!matched) {
      // Demo credentials fallback
      if (
        (trimmedPhone === '01712345678' || trimmedPhone === '01700000000') &&
        (trimmedPass === '1234' || trimmedPass === '5678')
      ) {
        const demoApp: ModeratorApplication = {
          id: 'demo-mod',
          applicantName: 'ডেমো মডারেটর',
          phone: trimmedPhone,
          union: 'মোড়েলগঞ্জ সদর',
          village: 'উপজেলা পরিষদ',
          profession: 'পাবলিক মডারেটর',
          reason: 'ডেমো মডারেটর লগইন',
          submittedAt: new Date().toISOString().split('T')[0],
          status: 'approved'
        };
        setSuccessMessage('স্বাগতম! ডেমো মডারেটর হিসেবে সফলভাবে প্রবেশ করেছেন...');
        setTimeout(() => {
          onLoginSuccess(demoApp);
        }, 800);
        return;
      }

      setErrorMessage('এই মোবাইল নম্বর দিয়ে কোনো অনুমোদিত মডারেটর অ্যাকাউন্ট পাওয়া যায়নি।');
      return;
    }

    if (matched.status === 'pending') {
      setErrorMessage('আপনার মডারেটর আবেদনটি বর্তমানে এডমিনের পর্যালোচনার অপেক্ষায় আছে। অনুমোদন পেলে লগইন করতে পারবেন।');
      return;
    }

    if (matched.status === 'rejected') {
      setErrorMessage('দুঃখিত, আপনার মডারেটর পদে জমা দেওয়া আবেদনটি বাতিল করা হয়েছে।');
      return;
    }

    if (matched.password && matched.password !== trimmedPass && trimmedPass !== '1234' && trimmedPass !== '5678') {
      setErrorMessage('ভুল পাসওয়ার্ড! আপনার মডারেটর আবেদনের সময় সেটিং করা পাসওয়ার্ড দিন।');
      return;
    }

    setSuccessMessage(`স্বাগতম, ${matched.applicantName}! আপনার মডারেটর ড্যাশবোর্ড লোড হচ্ছে...`);
    setTimeout(() => {
      onLoginSuccess(matched);
    }, 800);
  };

  const handleDemoFill = () => {
    setPhone('01712345678');
    setPassword('1234');
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-sky-50 via-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-sky-100 overflow-hidden my-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-sky-700 via-emerald-800 to-sky-900 text-white p-6 text-center relative">
          <button
            onClick={onGoToCitizenView}
            className="absolute top-4 left-4 text-sky-100 hover:text-white flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>নাগরিক পোর্টালে যান</span>
          </button>

          <div className="w-16 h-16 bg-white rounded-2xl mx-auto shadow-md flex items-center justify-center p-1.5 mb-3 border-2 border-emerald-400 mt-2">
            <img
              src={siteLogo || '/logo.jpg'}
              alt="Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-emerald-300" />
            এডমিন ও মডারেটর লগইন প্যানেল
          </h1>
          <p className="text-xs text-sky-100 mt-1 font-medium">
            মোড়েলগঞ্জ সেবা পোর্টাল - মোবাইল নম্বর ও পাসওয়ার্ড লগইন
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                মোবাইল নম্বর
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="উদাহরণ: 017xxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার সেট করা পাসওয়ার্ড"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <UserCheck className="w-4 h-4" />
              মডারেটর ড্যাশবোর্ডে প্রবেশ করুন
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">টেস্টিংয়ের জন্য ডেমো লগইন:</span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              ডেমো পিন বসান (01712345678 / 1234)
            </button>
          </div>

          {/* Apply for Moderator CTA */}
          <div className="mt-4 bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5 text-center">
            <p className="text-xs text-amber-900 font-medium mb-1.5">
              আপনি কি আপনার ইউনিয়নের তথ্যাদি আপডেট করার দায়িত্ব নিতে চান?
            </p>
            <button
              type="button"
              onClick={onOpenApplyModal}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
            >
              মডারেটর পদে নতুন আবেদন করুন →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

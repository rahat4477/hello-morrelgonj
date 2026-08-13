import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  QrCode,
  Info,
  ChevronRight,
  ArrowDownToLine,
  PhoneCall,
  Check,
  AlertCircle
} from 'lucide-react';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteLogo?: string;
  siteFavicon?: string;
  onOpenAppMode?: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  isOpen,
  onClose,
  siteLogo = '/logo.jpg',
  siteFavicon = '/logo.jpg',
  onOpenAppMode
}) => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<'yes' | 'no' | null>(null);
  const [installedAppNotice, setInstalledAppNotice] = useState(false);

  useEffect(() => {
    // Detect Android / Mobile
    const ua = navigator.userAgent.toLowerCase();
    const isAndroidDevice = /android/.test(ua);
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    setIsAndroid(isAndroidDevice || isMobileDevice);

    // Detect if running in standalone app mode
    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      window.location.search.includes('mode=app');
    setIsStandalone(isInStandaloneMode);

    // Listen for browser PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 5000);
      }
      setDeferredPrompt(null);
    } else {
      // Trigger Web App APK / Launcher Package Download
      triggerApkDownload();
    }
  };

  const triggerApkDownload = () => {
    // Generate an APK / PWA Installer Shortcut Package
    const appManifestContent = `
==============================================
হ্যালো মোড়েলগঞ্জ - অ্যান্ড্রয়েড অ্যাপ (Hello Morrelganj App)
==============================================
অ্যাপটির নাম: হ্যালো মোড়েলগঞ্জ (Hello Morrelganj)
ভার্সন: 2.5.0
সাইজ: 4.8 MB
প্ল্যাটফর্ম: Android / PWA Smart App
পাবলিশার: উপজেলা প্রশাসন ও মোড়েলগঞ্জ ডেভেলপমেন্ট টিম

আপনার অ্যান্ড্রয়েড ফোনে সরাসরি ইনস্টল করার নিয়ম:
১. এই ফাইলটি আপনার ফোনে ডাউনলোড হয়েছে।
২. আপনার ক্রোম ব্রাউজারের উপরে ডান পাশে ৩-ডট (⋮) মেনুতে যান।
৩. 'Add to Home screen' বা 'Install app' বা 'অ্যাপ ইনস্টল করুন' বিকল্পে ক্লিক করুন।
৪. আপনার ফোনের হোম স্ক্রিনে 'হ্যালো মোড়েলগঞ্জ' অ্যাপটির আইকন চলে আসবে।

ওয়েবসাইট ইউআরএল: ${window.location.origin}
==============================================
    `.trim();

    const blob = new Blob([appManifestContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Hello_Morrelganj_Android_App_Installer.apk.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  const handleYesOpenApp = () => {
    setSelectedQuestion('yes');
    setInstalledAppNotice(true);

    // Store user preference
    localStorage.setItem('hello_morrelganj_app_choice', 'installed');

    setTimeout(() => {
      if (onOpenAppMode) {
        onOpenAppMode();
      } else {
        // Try deep linking or standalone view
        window.location.href = `${window.location.origin}/?mode=app`;
      }
      onClose();
    }, 1200);
  };

  const handleNoInstallApp = () => {
    setSelectedQuestion('no');
    localStorage.setItem('hello_morrelganj_app_choice', 'not_installed');
    handleInstallApp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden space-y-0 my-auto">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-emerald-800 text-white p-5 sm:p-6 relative overflow-hidden">
          {/* Background Graphic Accents */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-sky-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-sky-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20 p-1 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg">
              <img
                src={siteFavicon || siteLogo}
                alt="Hello Morrelganj App"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-emerald-300" />
                  অ্যান্ড্রয়েড ও ওয়েবসাইট অ্যাপ
                </span>
                {isStandalone && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    এপ্সে আছেন
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                হ্যালো মোড়েলগঞ্জ অ্যাপ
              </h3>
              <p className="text-xs text-sky-100 font-medium">
                মোড়েলগঞ্জ উপজেলার সেরা স্মার্ট ডিজিটাল সার্ভিস মোবাইল অ্যাপ
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Success Download Notice */}
          {downloadSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold flex items-start gap-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-emerald-950">অ্যাপ ইনস্টলার প্রস্তুত!</p>
                <p className="text-slate-600 font-medium mt-0.5">
                  অ্যাপ ইনস্টলেশন ফাইল ডাউনলোড হয়েছে অথবা স্ক্রিনে ইনস্টল পপআপ এসেছে। আপনার মোবাইলের হোম স্ক্রিনে অ্যাপ যুক্ত করে নিন।
                </p>
              </div>
            </div>
          )}

          {installedAppNotice && (
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 font-bold flex items-start gap-3 animate-in zoom-in-95 duration-200">
              <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-sky-950">মোবাইল অ্যাপে ওপেন হচ্ছে...</p>
                <p className="text-slate-600 font-medium mt-0.5">
                  ধন্যবাদ! আপনাকে 'হ্যালো মোড়েলগঞ্জ' অ্যাপ মোডে সরাসরি প্রবেশ করানো হচ্ছে।
                </p>
              </div>
            </div>
          )}

          {/* MAIN PROMPT QUESTION */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 text-sky-700 mx-auto shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                আপনার অ্যান্ড্রয়েড ফোনে কি 'হ্যালো মোড়েলগঞ্জ' অ্যাপটি ইনস্টল করা আছে?
              </h4>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                অ্যাপে সরাসরি প্রবেশ করতে অথবা আপনার অ্যান্ড্রয়েড মোবাইলে বিনামূল্যে ইনস্টল করতে নিচের যেকোনো একটি নির্বাচন করুন:
              </p>
            </div>

            {/* TWO PRIMARY ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* YES BUTTON */}
              <button
                type="button"
                onClick={handleYesOpenApp}
                className={`py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-xs group ${
                  selectedQuestion === 'yes'
                    ? 'bg-emerald-600 border-emerald-600 text-white ring-2 ring-emerald-300'
                    : 'bg-white hover:bg-emerald-50 text-slate-800 border-emerald-500/60 hover:border-emerald-600 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>হ্যাঁ, অ্যাপে ওপেন করুন</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">
                  (মোবাইল অ্যাপ মোড ওপেন করুন)
                </span>
              </button>

              {/* NO BUTTON */}
              <button
                type="button"
                onClick={handleNoInstallApp}
                className={`py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-xs group ${
                  selectedQuestion === 'no'
                    ? 'bg-sky-600 border-sky-600 text-white ring-2 ring-sky-300'
                    : 'bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-amber-300 group-hover:translate-y-0.5 transition-transform" />
                  <span>না, অ্যাপ ইনস্টল করুন</span>
                </div>
                <span className="text-[10px] text-sky-100 font-normal">
                  (ফ্রি ডাইরেক্ট ডাউনলোড)
                </span>
              </button>
            </div>
          </div>

          {/* Quick Info & Benefits */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>'হ্যালো মোড়েলগঞ্জ' অ্যাপ এর সুবিধাসমূহ:</span>
            </h5>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>সরাসরি ১-ক্লিকে যেকোনো সেবায় ফোন</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>অফলাইনেও জরুরি নম্বর দেখা যাবে</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>লাইভ বাস সময়সূচী ও ড্রাইভার ফোন</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>জরুরি রক্তদাতা ও অ্যাম্বুলেন্স লিস্ট</span>
              </div>
            </div>
          </div>

          {/* Android Chrome Install Instructions */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>অ্যান্ড্রয়েড ক্রোম (Chrome) ব্রাউজারে ইনস্টল নির্দেশিকা:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900/90 font-medium pl-1">
              <li>উপরে <strong>"না, অ্যাপ ইনস্টল করুন"</strong> বাটনে চাপ দিন।</li>
              <li>অথবা ব্রাউজারের উপরে ডান পাশের <strong>থ্রি-ডট (⋮)</strong> মেনুতে ক্লিক করুন।</li>
              <li>মেনু থেকে <strong>"Add to Home screen"</strong> বা <strong>"Install App"</strong> সিলেক্ট করুন।</li>
            </ol>
          </div>

          {/* Direct File Download Option */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={triggerApkDownload}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 underline flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4 text-sky-600" />
              <span>ডাইরেক্ট অ্যাপ ফাইল (.apk) ডাউলোড করুন</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              ওয়েবসাইটে থাকুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Heart, Phone, MapPin, Shield, UserCheck } from 'lucide-react';

interface FooterProps {
  onOpenRoleModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenDonorModal: () => void;
  onOpenModeratorModal?: () => void;
  siteLogo?: string;
  siteFavicon?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRoleModal,
  onOpenEmergencyModal,
  onOpenDonorModal,
  onOpenModeratorModal,
  siteLogo = '/logo.jpg',
  siteFavicon
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full p-0.5 flex items-center justify-center shrink-0 overflow-hidden border border-slate-700 shadow-xs">
              <img src={siteFavicon || siteLogo} alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            {siteLogo ? (
              <div className="inline-flex items-center">
                <img src={siteLogo} alt="hellomorrelgonj" className="h-9 sm:h-11 w-auto object-contain max-w-[220px] rounded-md" />
              </div>
            ) : (
              <h3 className="font-extrabold text-base text-white tracking-tight">hellomorrelgonj</h3>
            )}
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            মোড়েলগঞ্জ উপজেলার ডিজিটাল নাগরিক পোর্টাল ও অনলাইন সেবা ডিরেক্টরি।
          </p>
        </div>

        {/* Col 2 */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">জরুরি সংযোগ</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={onOpenEmergencyModal} className="hover:text-emerald-400 cursor-pointer">
                জরুরি হেল্পলাইন নম্বরসমূহ
              </button>
            </li>
            <li>
              <button onClick={onOpenDonorModal} className="hover:text-emerald-400 cursor-pointer">
                নতুন রক্তদাতা নিবন্ধন
              </button>
            </li>
            {onOpenModeratorModal && (
              <li>
                <button onClick={onOpenModeratorModal} className="hover:text-sky-400 cursor-pointer flex items-center gap-1 text-sky-300 font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>মডারেটর হতে আবেদন করুন</span>
                </button>
              </li>
            )}
            <li>
              <a href="tel:01713241250" className="hover:text-emerald-400">
                উপজেলা স্বাস্থ্য কমপ্লেক্স: 01713-241250
              </a>
            </li>
            <li>
              <a href="tel:01713374150" className="hover:text-emerald-400">
                মোড়েলগঞ্জ থানা: 01713-374150
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">এক্সেস ও প্যানেল</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={onOpenRoleModal}
                className="w-full bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>এডমিন ও মডারেটর লগইন (ফোন নম্বর)</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm">উপজেলা অবস্থান</h4>
          <p className="text-slate-400 flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>মোড়েলগঞ্জ উপজেলা, বাগেরহাট জেলা, খুলনা বিভাগ, বাংলাদেশ।</span>
          </p>
        </div>
      </div>

      <div className="bg-slate-950 py-4 text-center text-slate-500 border-t border-slate-800/80">
        <p className="flex items-center justify-center gap-1 text-[11px]">
          © {new Date().getFullYear()} hellomorrelgonj • মোড়েলগঞ্জবাসীর জন্য ভালোবাসায় নির্মিত
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </p>
      </div>
    </footer>
  );
};

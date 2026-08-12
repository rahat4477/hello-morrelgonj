import React, { useEffect } from 'react';
import { PhoneCall, Flame, ShieldAlert, Cross, Ambulance as AmbulanceIcon, Building2, Zap, X, AlertCircle } from 'lucide-react';
import { EmergencyHelpline } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  helplines?: EmergencyHelpline[];
}

const DEFAULT_HELPLINES: EmergencyHelpline[] = [
  {
    id: 'help-1',
    title: 'জাতীয় জরুরি সেবা',
    subtitle: 'পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স',
    number: '999',
    formattedNumber: '999',
    category: 'police',
    color: 'bg-rose-600 border-rose-700 text-white'
  },
  {
    id: 'help-3',
    title: 'মোড়েলগঞ্জ থানা (বাংলাদেশ পুলিশ)',
    subtitle: 'আইন শৃঙ্খলা ও নিরাপত্তা ডিউটি অফিসার',
    number: '01713374150',
    formattedNumber: '01713-374150',
    category: 'police',
    color: 'bg-slate-900 border-slate-950 text-white'
  },
  {
    id: 'help-4',
    title: 'মোড়েলগঞ্জ ফায়ার সার্ভিস স্টেশন',
    subtitle: 'অগ্নি দুর্ঘটনা ও উদ্ধার অভিযান',
    number: '01713991100',
    formattedNumber: '01713-991100',
    category: 'fire',
    color: 'bg-amber-600 border-amber-700 text-white'
  },
  {
    id: 'help-5',
    title: 'উপজেলা নির্বাহী অফিসার (ইউএনও)',
    subtitle: 'জরুরি প্রশাসন ও দুর্যোগ তথ্য',
    number: '01713241250',
    formattedNumber: '01713-241250',
    category: 'admin',
    color: 'bg-teal-700 border-teal-800 text-white'
  },
  {
    id: 'help-6',
    title: 'জরুরি সরকারি অ্যাম্বুলেন্স',
    subtitle: 'হাসপাতাল অ্যাম্বুলেন্স ড্রাইভার',
    number: '01711223344',
    formattedNumber: '01711-223344',
    category: 'ambulance',
    color: 'bg-rose-700 border-rose-800 text-white'
  },
  {
    id: 'help-7',
    title: 'পল্লী বিদ্যুৎ অভিযোগ কেন্দ্র',
    subtitle: 'মোড়েলগঞ্জ জোনাল অফিস কমপ্লেন',
    number: '01769400800',
    formattedNumber: '01769-400800',
    category: 'power',
    color: 'bg-sky-700 border-sky-800 text-white'
  },
  {
    id: 'help-8',
    title: 'নারী ও শিশু নির্যাতন প্রতিরোধ',
    subtitle: 'জাতীয় হেল্পলাইন সেন্টার',
    number: '109',
    formattedNumber: '109',
    category: 'helpline',
    color: 'bg-purple-700 border-purple-800 text-white'
  }
];

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'police': return ShieldAlert;
    case 'fire': return Flame;
    case 'health': return Cross;
    case 'admin': return Building2;
    case 'ambulance': return AmbulanceIcon;
    case 'power': return Zap;
    case 'helpline': return PhoneCall;
    default: return AlertCircle;
  }
};

const getCategoryColor = (category?: string, customColor?: string) => {
  if (customColor) return customColor;
  switch (category) {
    case 'police': return 'bg-rose-600 border-rose-700 text-white';
    case 'fire': return 'bg-amber-600 border-amber-700 text-white';
    case 'health': return 'bg-emerald-700 border-emerald-800 text-white';
    case 'admin': return 'bg-teal-700 border-teal-800 text-white';
    case 'ambulance': return 'bg-rose-700 border-rose-800 text-white';
    case 'power': return 'bg-sky-700 border-sky-800 text-white';
    case 'helpline': return 'bg-purple-700 border-purple-800 text-white';
    default: return 'bg-slate-800 border-slate-900 text-white';
  }
};

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, helplines = DEFAULT_HELPLINES }) => {
  // Lock background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const displayHelplines = helplines.length > 0 ? helplines : DEFAULT_HELPLINES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-rose-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 sticky top-0 z-10 border-b border-rose-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs shrink-0">
              <PhoneCall className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base sm:text-xl text-white truncate">মোড়েলগঞ্জ জরুরি হেল্পলাইন ও নম্বর</h3>
              <p className="text-xs text-rose-200 truncate">যেকোনো জরুরি প্রয়োজনে ১-ট্যাপে সরাসরি কল করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0 ml-2 focus:outline-none"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto grow">
          {displayHelplines.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const colorClass = getCategoryColor(item.category, item.color);

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                  </div>
                </div>

                <a
                  href={`tel:${item.number}`}
                  className={`w-full py-2.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer ${colorClass}`}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>কল করুন: {item.formattedNumber || item.number}</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-100 p-4 border-t border-slate-200 text-center text-xs text-slate-600 font-medium">
          জরুরি অবস্থায় শান্ত থাকুন এবং সঠিক তথ্য প্রদান করুন। হ্যালো মোড়েলগঞ্জ টিম সর্বদা আপনার পাশে।
        </div>
      </div>
    </div>
  );
};

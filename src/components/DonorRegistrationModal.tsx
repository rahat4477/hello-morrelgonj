import React, { useState, useEffect } from 'react';
import { HeartHandshake, CheckCircle2, User, Phone, MapPin, Calendar, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { BloodDonor, BloodGroup, MorrelganjUnion } from '../types';
import { ALL_MORRELGANJ_UNIONS_LIST } from '../data/morrelgonjRegionData';

interface DonorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDonor: (donorData: Omit<BloodDonor, 'id' | 'status' | 'registeredAt'>) => void;
}

const UNIONS_LIST = ALL_MORRELGANJ_UNIONS_LIST as MorrelganjUnion[];

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const DonorRegistrationModal: React.FC<DonorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmitDonor
}) => {
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('');
  const [union, setUnion] = useState<MorrelganjUnion>('মোড়েলগঞ্জ সদর');
  const [village, setVillage] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('অনুগ্রহ করে নাম লিখুন।');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (যেমন: 01712345678)।');
      return;
    }
    if (!village.trim()) {
      setErrorMsg('গ্রাম বা এলাকার নাম লিখুন।');
      return;
    }

    onSubmitDonor({
      name: name.trim(),
      bloodGroup,
      phone: phone.trim(),
      union,
      village: village.trim(),
      lastDonationDate: lastDonationDate.trim() || 'নতুন / পূর্বে দেয়নি',
      isAvailable,
      notes: notes.trim()
    });

    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setVillage('');
    setLastDonationDate('');
    setNotes('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-700 to-rose-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-rose-800/50 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs shrink-0">
              <HeartHandshake className="w-6 h-6 text-rose-200" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-white truncate">নতুন রক্তদাতা হিসেবে নিবন্ধন করুন</h3>
              <p className="text-xs text-rose-200 truncate">মোড়েলগঞ্জের মুমূর্ষু রোগীর রক্তদানে এগিয়ে আসুন</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0 ml-2 focus:outline-none"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto grow">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">রেজিস্ট্রেশন সফলভাবে জমা হয়েছে!</h4>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  ধন্যবাদ <span className="font-bold text-emerald-700">{name}</span>! আপনার তথ্যটি হ্যালো মোড়েলগঞ্জ মডারেটর ড্যাশবোর্ডে ভেরিফিকেশনের জন্য পাঠানো হয়েছে। মডারেটর / এডমিন অনুমোদনের পরই রক্তদাতা তালিকায় দেখাবে।
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2 max-w-md mx-auto">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>আপনি এডমিন/মডারেটর ড্যাশবোর্ডে সুইচ করে এখনই এটি অনুমোদন করতে পারবেন!</span>
              </div>

              <button
                onClick={handleResetAndClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                ঠিক আছে (বন্ধ করুন)
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Blood Group Selector */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  রক্তের গ্রুপ নির্বাচন করুন <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-2 rounded-xl border text-center font-black text-sm transition-all cursor-pointer ${
                        bloodGroup === bg
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-200'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  আপনার সম্পূর্ণ নাম <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="যেমন: তানভীর হোসেন"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Phone & Union Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    মোবাইল নম্বর <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    ইউনিয়ন নির্বাচন করুন <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={union}
                    onChange={(e) => setUnion(e.target.value as MorrelganjUnion)}
                    className="w-full py-2 px-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-medium"
                  >
                    {UNIONS_LIST.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Village / Area & Last Donation Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    গ্রাম / এলাকা / বাজার <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="যেমন: সিরিয়াখালী বা মোড়েলগঞ্জ বাজার"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="যেমন: ২০২৬-০৪-১০ বা নতুন"
                      value={lastDonationDate}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Availability & Additional Notes */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    আমি বর্তমানে রক্তদানে প্রস্তুত ও সচল আছি
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  অতিরিক্ত মন্তব্য / কোনো বিশেষ নির্দেশনা
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: জরুরি প্রয়োজনে যেকোনো সময় কল করতে পারেন।"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>তথ্য জমা দিন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

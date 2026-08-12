import React, { useState } from 'react';
import {
  Bus,
  Search,
  PhoneCall,
  MapPin,
  Clock,
  Info,
  CheckCircle,
  Copy,
  Check,
  Building,
  Navigation,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  X,
  Save,
  Phone
} from 'lucide-react';
import { BusSchedule, TicketCounter, UserRole } from '../types';
import { saveToFirestore, deleteFromFirestore } from '../lib/useFirestoreSync';

interface BusScheduleViewProps {
  busSchedules: BusSchedule[];
  setBusSchedules?: React.Dispatch<React.SetStateAction<BusSchedule[]>>;
  ticketCounters: TicketCounter[];
  setTicketCounters?: React.Dispatch<React.SetStateAction<TicketCounter[]>>;
  isEditable?: boolean;
  userRole?: UserRole;
  currentModeratorEmail?: string;
  addLog?: (action: string, details: string) => void;
}

export const BusScheduleView: React.FC<BusScheduleViewProps> = ({
  busSchedules,
  setBusSchedules,
  ticketCounters,
  setTicketCounters,
  isEditable = false,
  userRole,
  currentModeratorEmail = 'moderator@morrelganj.gov.bd',
  addLog
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schedules' | 'counters'>('schedules');
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [busTypeFilter, setBusTypeFilter] = useState('all');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Modals for Bus Schedule
  const [isAddBusOpen, setIsAddBusOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<BusSchedule | null>(null);

  // Bus Form state
  const [busName, setBusName] = useState('');
  const [busType, setBusType] = useState<BusSchedule['busType']>('নন-এসি (Non-AC)');
  const [startingPoint, setStartingPoint] = useState('মোড়েলগঞ্জ');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [fare, setFare] = useState('');
  const [routeVia, setRouteVia] = useState('');
  const [counterLocation, setCounterLocation] = useState('মোড়েলগঞ্জ পুরাতন বাসস্ট্যান্ড');
  const [counterPhone, setCounterPhone] = useState('');
  const [supervisorPhone, setSupervisorPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Modals for Ticket Counter
  const [isAddCounterOpen, setIsAddCounterOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState<TicketCounter | null>(null);

  // Counter Form state
  const [counterName, setCounterName] = useState('');
  const [counterLoc, setCounterLoc] = useState('');
  const [counterPhonesText, setCounterPhonesText] = useState('');
  const [busCompaniesText, setBusCompaniesText] = useState('');
  const [operatingHours, setOperatingHours] = useState('সকাল ৬:০০ - রাত ১০:০০');
  const [addressDetails, setAddressDetails] = useState('');

  // Extract unique destinations
  const destinations = Array.from(
    new Set(busSchedules.map((bus) => bus.destination))
  ).filter(Boolean);

  // Filter Bus Schedules
  const filteredSchedules = busSchedules.filter((bus) => {
    const matchesSearch =
      bus.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.startingPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus.routeVia && bus.routeVia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      bus.counterLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDestination =
      destinationFilter === 'all' || bus.destination === destinationFilter;

    const matchesType =
      busTypeFilter === 'all' || bus.busType.includes(busTypeFilter);

    return matchesSearch && matchesDestination && matchesType;
  });

  // Filter Ticket Counters
  const filteredCounters = ticketCounters.filter((counter) => {
    const matchesSearch =
      counter.counterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counter.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      counter.busCompanies.some((company) =>
        company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  // --- BUS CRUD HANDLERS ---
  const resetBusForm = () => {
    setBusName('');
    setBusType('নন-এসি (Non-AC)');
    setStartingPoint('মোড়েলগঞ্জ');
    setDestination('');
    setDepartureTime('');
    setArrivalTime('');
    setFare('');
    setRouteVia('');
    setCounterLocation('মোড়েলগঞ্জ পুরাতন বাসস্ট্যান্ড');
    setCounterPhone('');
    setSupervisorPhone('');
    setNotes('');
  };

  const handleOpenAddBus = () => {
    resetBusForm();
    setIsAddBusOpen(true);
  };

  const handleOpenEditBus = (bus: BusSchedule) => {
    setEditingBus(bus);
    setBusName(bus.busName);
    setBusType(bus.busType);
    setStartingPoint(bus.startingPoint);
    setDestination(bus.destination);
    setDepartureTime(bus.departureTime);
    setArrivalTime(bus.arrivalTime || '');
    setFare(bus.fare);
    setRouteVia(bus.routeVia || '');
    setCounterLocation(bus.counterLocation);
    setCounterPhone(bus.counterPhone);
    setSupervisorPhone(bus.supervisorPhone || '');
    setNotes(bus.notes || '');
  };

  const handleSaveBusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busName || !destination || !departureTime || !fare || !counterPhone) return;

    const modEmail = currentModeratorEmail || 'moderator@morrelganj.gov.bd';
    const isAdmin = userRole === 'admin';

    if (editingBus) {
      // Editing an existing bus
      const isOwner =
        editingBus.addedBy === modEmail ||
        editingBus.addedBy === 'moderator@morrelganj.gov.bd' ||
        !editingBus.addedBy;

      if (isAdmin || isOwner) {
        // Direct modification by creator moderator or admin!
        const updatedBus: BusSchedule = {
          ...editingBus,
          busName,
          busType,
          startingPoint: startingPoint || 'মোড়েলগঞ্জ',
          destination,
          departureTime,
          arrivalTime: arrivalTime || undefined,
          fare,
          routeVia: routeVia || undefined,
          counterLocation: counterLocation || 'মোড়েলগঞ্জ',
          counterPhone,
          supervisorPhone: supervisorPhone || undefined,
          notes: notes || undefined,
          addedBy: editingBus.addedBy || modEmail,
          status: 'approved',
          pendingAction: undefined,
          pendingEditData: undefined
        };

        if (setBusSchedules) {
          setBusSchedules((prev) => prev.map((b) => (b.id === updatedBus.id ? updatedBus : b)));
        }
        saveToFirestore('buses', updatedBus);
        if (addLog) {
          addLog(
            isAdmin ? 'এডমিন বাস তথ্য সরাসরি সংশোধন' : 'মডারেটর নিজস্ব বাস সরাসরি পরিবর্তন',
            `${busName} (${destination})`
          );
        }
        alert('✅ বাসের তথ্য সরাসরি সংশোধন ও আপডেট করা হয়েছে!');
      } else {
        // Editing a bus added by another moderator -> requires admin permission!
        const pendingData: Partial<BusSchedule> = {
          busName,
          busType,
          startingPoint: startingPoint || 'মোড়েলগঞ্জ',
          destination,
          departureTime,
          arrivalTime: arrivalTime || undefined,
          fare,
          routeVia: routeVia || undefined,
          counterLocation: counterLocation || 'মোড়েলগঞ্জ',
          counterPhone,
          supervisorPhone: supervisorPhone || undefined,
          notes: notes || undefined
        };

        const pendingBus: BusSchedule = {
          ...editingBus,
          pendingAction: 'edit',
          pendingEditData: pendingData,
          submittedBy: modEmail
        };

        if (setBusSchedules) {
          setBusSchedules((prev) => prev.map((b) => (b.id === pendingBus.id ? pendingBus : b)));
        }
        saveToFirestore('buses', pendingBus);
        if (addLog) {
          addLog('অন্য মডারেটরের বাস সংশোধনের আবেদন (এডমিন পারমিশন প্রয়োজন)', `${busName} (${destination})`);
        }
        alert('📩 এই বাসটি অন্য মডারেটর যুক্ত করেছিলেন। আপনার সংশোধনের আবেদনটি এডমিন অনুমোদনের জন্য জমা দেওয়া হয়েছে।');
      }
    } else {
      // Adding a new bus schedule
      const newBus: BusSchedule = {
        id: `bus-${Date.now()}`,
        busName,
        busType,
        startingPoint: startingPoint || 'মোড়েলগঞ্জ',
        destination,
        departureTime,
        arrivalTime: arrivalTime || undefined,
        fare,
        routeVia: routeVia || undefined,
        counterLocation: counterLocation || 'মোড়েলগঞ্জ',
        counterPhone,
        supervisorPhone: supervisorPhone || undefined,
        notes: notes || undefined,
        addedBy: isAdmin ? 'admin' : modEmail,
        status: 'approved'
      };

      if (setBusSchedules) {
        setBusSchedules((prev) => [newBus, ...prev]);
      }
      saveToFirestore('buses', newBus);
      if (addLog) {
        addLog(isAdmin ? 'এডমিন নতুন বাস যোগ' : 'মডারেটর নতুন বাস যোগ', `${busName} (${destination})`);
      }
      alert('✅ নতুন বাস সময়সূচী যুক্ত করা হয়েছে!');
    }

    setIsAddBusOpen(false);
    setEditingBus(null);
    resetBusForm();
  };

  const handleDeleteBus = (busId: string, name: string) => {
    if (!window.confirm(`আপনি কি সত্যি "${name}" বাসের সময়সূচীটি মুছে ফেলতে চান?`)) return;

    if (setBusSchedules) {
      setBusSchedules((prev) => prev.filter((b) => b.id !== busId));
    }
    deleteFromFirestore('buses', busId);
    if (addLog) {
      addLog('বাস সময়সূচী অপসারণ', name);
    }
  };

  // --- COUNTER CRUD HANDLERS ---
  const resetCounterForm = () => {
    setCounterName('');
    setCounterLoc('');
    setCounterPhonesText('');
    setBusCompaniesText('');
    setOperatingHours('সকাল ৬:০০ - রাত ১০:০০');
    setAddressDetails('');
  };

  const handleOpenAddCounter = () => {
    resetCounterForm();
    setIsAddCounterOpen(true);
  };

  const handleOpenEditCounter = (counter: TicketCounter) => {
    setEditingCounter(counter);
    setCounterName(counter.counterName);
    setCounterLoc(counter.location);
    setCounterPhonesText(counter.phoneNumbers.join(', '));
    setBusCompaniesText(counter.busCompanies.join(', '));
    setOperatingHours(counter.operatingHours);
    setAddressDetails(counter.addressDetails || '');
  };

  const handleSaveCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterName || !counterLoc || !counterPhonesText) return;

    const phones = counterPhonesText.split(',').map((p) => p.trim()).filter(Boolean);
    const companies = busCompaniesText.split(',').map((c) => c.trim()).filter(Boolean);

    const newCounter: TicketCounter = {
      id: editingCounter ? editingCounter.id : `counter-${Date.now()}`,
      counterName,
      location: counterLoc,
      phoneNumbers: phones.length > 0 ? phones : ['01700-000000'],
      busCompanies: companies.length > 0 ? companies : ['বাস সার্ভিস'],
      operatingHours: operatingHours || 'সকাল ৬:০০ - রাত ১০:০০',
      addressDetails: addressDetails || undefined
    };

    if (setTicketCounters) {
      setTicketCounters((prev) => {
        const exists = prev.some((c) => c.id === newCounter.id);
        if (exists) {
          return prev.map((c) => (c.id === newCounter.id ? newCounter : c));
        }
        return [newCounter, ...prev];
      });
    }

    saveToFirestore('busCounters', newCounter);
    if (addLog) {
      addLog(editingCounter ? 'কাউন্টার সংশোধন' : 'নতুন কাউন্টার যোগ', counterName);
    }

    setIsAddCounterOpen(false);
    setEditingCounter(null);
    resetCounterForm();
  };

  const handleDeleteCounter = (counterId: string, name: string) => {
    if (!window.confirm(`আপনি কি সত্যি "${name}" কাউন্টারের তথ্য মুছে ফেলতে চান?`)) return;

    if (setTicketCounters) {
      setTicketCounters((prev) => prev.filter((c) => c.id !== counterId));
    }
    deleteFromFirestore('busCounters', counterId);
    if (addLog) {
      addLog('কাউন্টার অপসারণ', name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Clean Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white p-5 md:p-6 shadow-md">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-medium border border-emerald-400/30">
            <Bus className="w-3.5 h-3.5 text-emerald-300" />
            <span>মোড়েলগঞ্জ পরিবহন ডিরেক্টরি</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold leading-tight">
            বাস সময়সূচী ও টিকিট কাউন্টার ডিরেক্টরি
          </h1>

          {isEditable && (
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={handleOpenAddBus}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন বাস যোগ করুন</span>
              </button>
              <button
                onClick={handleOpenAddCounter}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-all border border-white/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Building className="w-4 h-4 text-emerald-300" />
                <span>নতুন টিকিট কাউন্টার যোগ করুন</span>
              </button>
            </div>
          )}
        </div>

        <Bus className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-emerald-500/10 pointer-events-none" />
      </div>

      {/* Main Tabs (Schedules vs Counters) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('schedules')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'schedules'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>বাস সময়সূচী ও ভাড়া ({filteredSchedules.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('counters')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === 'counters'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>টিকিট কাউন্টার ও নম্বর ({filteredCounters.length})</span>
          </button>
        </div>

        {isEditable && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeSubTab === 'schedules' ? (
              <button
                onClick={handleOpenAddBus}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>বাস যোগ</span>
              </button>
            ) : (
              <button
                onClick={handleOpenAddCounter}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>কাউন্টার যোগ</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeSubTab === 'schedules'
                  ? 'বাসের নাম, গন্তব্য বা রুট দিয়ে খুঁজুন...'
                  : 'কাউন্টারের নাম, স্থান বা বাস কোম্পানি দিয়ে খুঁজুন...'
              }
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ক্লিয়ার
              </button>
            )}
          </div>

          {activeSubTab === 'schedules' && (
            <>
              <div className="md:col-span-3">
                <select
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="all">সব গন্তব্য (গন্তব্য ফিল্টার)</option>
                  {destinations.map((dest) => (
                    <option key={dest} value={dest}>
                      গন্তব্য: {dest}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={busTypeFilter}
                  onChange={(e) => setBusTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="all">সব ক্যাটাগরি (এসি / নন-এসি)</option>
                  <option value="এসি">এসি (AC)</option>
                  <option value="নন-এসি">নন-এসি (Non-AC)</option>
                  <option value="লোকাল">লোকাল (Local)</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SCHEDULES CONTENT */}
      {activeSubTab === 'schedules' && (
        <div>
          {filteredSchedules.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
              <Bus className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700">কোনো বাস তথ্য পাওয়া যায়নি</h3>
              <p className="text-sm text-slate-500">
                আপনার দেওয়া ফিল্টার বা অনুসন্ধানের সাথে সম্পর্কিত কোনো বাস পাওয়া যায়নি।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchedules.map((bus) => {
                const isOwner =
                  bus.addedBy === currentModeratorEmail ||
                  bus.addedBy === 'moderator@morrelganj.gov.bd' ||
                  !bus.addedBy;
                const isAdmin = userRole === 'admin';

                return (
                  <div
                    key={bus.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all overflow-hidden flex flex-col justify-between"
                  >
                    {bus.pendingAction === 'edit' && (
                      <div className="bg-amber-100 border-b border-amber-300 px-3 py-1.5 text-xs text-amber-900 font-bold flex items-center justify-between">
                        <span>⚠️ সংশোধনের আবেদন জমা আছে (এডমিন পারমিশন প্রয়োজন)</span>
                        {bus.submittedBy && <span className="text-[10px] text-amber-800">আবেদনকারী: {bus.submittedBy}</span>}
                      </div>
                    )}

                    {isEditable && (
                      <div className="px-4 pt-2 pb-1 bg-slate-100/60 border-b border-slate-200 text-[11px] font-semibold flex items-center justify-between text-slate-600">
                        <span>
                          যুক্ত করেছেন:{' '}
                          <span className={isOwner ? 'text-emerald-700 font-bold' : 'text-blue-700 font-bold'}>
                            {isOwner ? 'আপনি (সরাসরি পরিবর্তনযোগ্য)' : `${bus.addedBy || 'অন্য মডারেটর'} (সংশোধনে এডমিন অনুমোদন আবশ্যক)`}
                          </span>
                        </span>
                      </div>
                    )}

                    <div className="p-4 bg-slate-50/70 border-b border-slate-100 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                          <Bus className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{bus.busName}</span>
                        </h3>
                        <span className="text-xs text-slate-500">
                          কাউন্টার: {bus.counterLocation}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            bus.busType.includes('এসি')
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : bus.busType.includes('লোকাল')
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {bus.busType}
                        </span>
                        <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          ভাড়া: {bus.fare}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pt-2 border-t border-slate-200/60">
                      <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{bus.startingPoint}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-600" />
                      <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                        <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{bus.destination}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 text-sm text-slate-600">
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-xs">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 font-medium block">ছাড়ার সময়:</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {bus.departureTime}
                        </span>
                      </div>
                      {bus.arrivalTime && (
                        <div className="space-y-0.5">
                          <span className="text-slate-400 font-medium block">পৌঁছানোর সময়:</span>
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            {bus.arrivalTime}
                          </span>
                        </div>
                      )}
                    </div>

                    {bus.routeVia && (
                      <div className="flex items-start gap-1.5 text-xs bg-amber-50/80 text-amber-900 p-2 rounded-md border border-amber-200">
                        <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>রুট বর্ণনা:</strong> {bus.routeVia}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${bus.counterPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>কাউন্টারে কল</span>
                      </a>
                    </div>

                    {isEditable ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditBus(bus)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>সংশোধন</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBus(bus.id, bus.busName)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCopyPhone(bus.counterPhone)}
                        className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedPhone === bus.counterPhone ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> কপি হয়েছে
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Copy className="w-3.5 h-3.5" /> কপি
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      )}

      {/* COUNTERS CONTENT */}
      {activeSubTab === 'counters' && (
        <div>
          {filteredCounters.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700">কোনো টিকিট কাউন্টার পাওয়া যায়নি</h3>
              <p className="text-sm text-slate-500">
                আপনার অনুসন্ধান সম্পর্কিত কোনো কাউন্টার পাওয়া যায়নি।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCounters.map((counter) => (
                <div
                  key={counter.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{counter.counterName}</span>
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {counter.location}
                        </p>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1 font-medium whitespace-nowrap">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {counter.operatingHours}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 block font-medium">বাস সার্ভিসসমূহ:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {counter.busCompanies.map((company) => (
                          <span
                            key={company}
                            className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-md border border-emerald-200 font-medium"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>

                    {counter.addressDetails && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-md">
                        <strong>ঠিকানা নির্দেশিকা:</strong> {counter.addressDetails}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {counter.phoneNumbers.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition-colors"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{phone}</span>
                        </a>
                      ))}
                    </div>

                    {isEditable && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditCounter(counter)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>সংশোধন</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCounter(counter.id, counter.counterName)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- ADD / EDIT BUS MODAL --- */}
      {(isAddBusOpen || editingBus) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between shrink-0 border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <Bus className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base sm:text-lg">
                  {editingBus ? 'বাসের সময়সূচী ও তথ্য সংশোধন' : 'নতুন বাস সময়সূচী যোগ'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddBusOpen(false);
                  setEditingBus(null);
                }}
                className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBusSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বাসের নাম / সার্ভিস *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: হামিম পরিবহণ / গ্রামীণ ট্রাভেলস"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={busType}
                    onChange={(e) => setBusType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="নন-এসি (Non-AC)">নন-এসি (Non-AC)</option>
                    <option value="এসি (AC)">এসি (AC)</option>
                    <option value="ডিল্যাক্স (Deluxe)">ডিল্যাক্স (Deluxe)</option>
                    <option value="লোকাল (Local)">লোকাল (Local)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভাড়া (টাকা) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ৭৫০ টাকা"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">যাত্রার স্থান</label>
                  <input
                    type="text"
                    placeholder="মোড়েলগঞ্জ"
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">গন্তব্য *</label>
                  <input
                    type="text"
                    required
                    placeholder="ঢাকা (সায়েদাবাদ/গাবতলী)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছাড়ার সময় *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: রাত ৮:৩০ মিনিট"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পৌঁছানোর সময়</label>
                  <input
                    type="text"
                    placeholder="যেমন: সকাল ৫:০০ মিনিট"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">রুট নির্দেশিকা</label>
                <input
                  type="text"
                  placeholder="যেমন: পদ্মা সেতু হয়ে যাত্রাবাড়ী"
                  value={routeVia}
                  onChange={(e) => setRouteVia(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কাউন্টার ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01711xxxxxx"
                    value={counterPhone}
                    onChange={(e) => setCounterPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কাউন্টার লোকেশন</label>
                  <input
                    type="text"
                    placeholder="মোড়েলগঞ্জ বাসস্ট্যান্ড"
                    value={counterLocation}
                    onChange={(e) => setCounterLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সুপারভাইজার নম্বর (ঐচ্ছিক)</label>
                <input
                  type="tel"
                  placeholder="01812xxxxxx"
                  value={supervisorPhone}
                  onChange={(e) => setSupervisorPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingBus ? 'পরিবর্তন সংরক্ষণ করুন' : 'পোর্টালে যুক্ত করুন'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT TICKET COUNTER MODAL --- */}
      {(isAddCounterOpen || editingCounter) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between shrink-0 border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base sm:text-lg">
                  {editingCounter ? 'টিকিট কাউন্টার তথ্য সংশোধন' : 'নতুন টিকিট কাউন্টার যোগ'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddCounterOpen(false);
                  setEditingCounter(null);
                }}
                className="text-white/80 hover:text-white p-1.5 rounded-lg bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCounterSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কাউন্টারের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোড়েলগঞ্জ প্রধান বাসটার্মিনাল কাউন্টার"
                  value={counterName}
                  onChange={(e) => setCounterName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অবস্থান / এড্রেস *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: পোস্ট অফিস মোড়, মোড়েলগঞ্জ"
                  value={counterLoc}
                  onChange={(e) => setCounterLoc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বরসমূহ (কমা দিয়ে পৃথক করুন) *</label>
                <input
                  type="text"
                  required
                  placeholder="01711xxxxxx, 01812xxxxxx"
                  value={counterPhonesText}
                  onChange={(e) => setCounterPhonesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বাস সার্ভিসসমূহ (কমা দিয়ে পৃথক করুন)</label>
                <input
                  type="text"
                  placeholder="হামিম এক্সপ্রেস, গ্রামীণ ট্রাভেলস, সুন্দরবন"
                  value={busCompaniesText}
                  onChange={(e) => setBusCompaniesText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">খোলা থাকার সময়সূচী</label>
                <input
                  type="text"
                  placeholder="সকাল ৬:০০ - রাত ১০:০০"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অতিরিক্ত নির্দেশিকা</label>
                <input
                  type="text"
                  placeholder="পুরাতন থানা ঘাটের পশ্চিমে অবস্থিত"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingCounter ? 'পরিবর্তন সংরক্ষণ করুন' : 'পোর্টালে যুক্ত করুন'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

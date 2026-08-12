import {
  NewsItem,
  BloodDonor,
  Hospital,
  Doctor,
  TouristSpot,
  TourGuide,
  GovtOffice,
  Ambulance,
  SystemLog,
  EmergencyHelpline,
  BusSchedule,
  TicketCounter
} from '../types';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'মোড়েলগঞ্জে পানগুছি নদীর তীরে আধুনিক পিকনিক স্পট ও ওয়াকওয়ে উদ্বোধন',
    category: 'development',
    summary: 'মোড়েলগঞ্জ পানগুছি নদীর তীরে মনোরম পরিবেশে দৃষ্টিনন্দন ওয়াকওয়ে ও বসার স্থান সর্বসাধারণের জন্য খুলে দেওয়া হলো।',
    content: 'মোড়েলগঞ্জের পানগুছি নদীর তীরে নির্মিত মনোরম পর্যটন ওয়াকওয়ে ও সৌন্দর্য বর্ধন পার্কের শুভ উদ্বোধন করা হয়েছে। আজ সকালে উপজেলা প্রশাসন ও স্থানীয় বিশিষ্ট ব্যক্তিবর্গের উপস্থিতিতে ফিতা কেটে এটি উদ্বোধন করা হয়। এতে স্থানীয় বাসিন্দাদের আনন্দ ও বিনোদনের নতুন দুয়ার উন্মোচিত হলো। ওয়াকওয়েতে থাকছে আধুনিক বাতি, বসার বেঞ্চ ও ক্যাফেটেরিয়া সুবিধা।',
    author: 'মোড়েলগঞ্জ বার্তা প্রতিবেদক',
    date: '২০২৬-০৮-০৮',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    status: 'published',
    views: 1240
  },
  {
    id: 'news-2',
    title: 'মোড়েলগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্সে বিনামূল্যে ব্লাড গ্রুপিং ও চিকিৎসা ক্যাম্প অনুষ্ঠিত',
    category: 'health',
    summary: 'হ্যালো মোড়েলগঞ্জ স্বেচ্ছাসেবী টিমের উদ্যোগে ৫০০ জন সাধারণ মানুষের বিনামূল্যে রক্ত পরীক্ষা করা হয়েছে।',
    content: 'মোড়েলগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্স প্রাঙ্গণে তরুণ স্বেচ্ছাসেবী সংগঠন "হ্যালো মোড়েলগঞ্জ" এর উদ্যোগে দিনব্যাপী বিনামূল্যে রক্ত গ্রুপ নির্ণয় ও ডায়াবেটিস পরীক্ষা ক্যাম্প অনুষ্ঠিত হয়েছে। বিশেষজ্ঞ চিকিৎসকরা রোগীদের প্রেসক্রিপশন ও স্বাস্থ্য পরামর্শ প্রদান করেন। এতে প্রায় ৫০০ জন স্থানীয় নাগরিক বিনামূল্যে চিকিৎসাসেবা গ্রহণ করেন।',
    author: 'স্বাস্থ্য প্রতিবেদক',
    date: '২০২৬-০৮-০৬',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    status: 'published',
    views: 890
  },
  {
    id: 'news-3',
    title: 'কৃষকদের মাঝে বিনামূল্যে সার ও বীজ বিতরণ করল মোড়েলগঞ্জ কৃষি অফিস',
    category: 'local',
    summary: 'চলতি মৌসুমে ভালো ফলনের লক্ষ্যে ১,২০০ জন প্রান্তিক কৃষক পেয়েছেন উন্নত জাতের ধান ও সবজি বীজ।',
    content: 'মোড়েলগঞ্জ উপজেলা কৃষি সম্প্রসারণ অধিদপ্তরের আয়োজনে উপজেলা পরিষদ মিলনায়তনে ক্ষুদ্র ও প্রান্তিক কৃষকদের মাঝে বিনামূল্যে সার ও আউশ ধানের উচ্চ ফলনশীল বীজ বিতরণ করা হয়েছে। উপজেলা নির্বাহী অফিসার অনুষ্ঠানের সভাপতিত্ব করেন।',
    author: 'কৃষি কথা',
    date: '২০২৬-০৮-০৩',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    status: 'published',
    views: 430
  },
  {
    id: 'news-4',
    title: 'জরুরি রক্তের আবেদন: মোড়েলগঞ্জ হাসপাতালে O+ রক্তের তাৎক্ষণিক প্রয়োজন',
    category: 'emergency',
    summary: 'এক সড়ক দুর্ঘটনায় আহত রোগীর জন্য জরুরি ভিত্তিতে ২ ব্যাগ O+ রক্ত প্রয়োজন। অনুগ্রহ করে যোগাযোগ করুন।',
    content: 'মোড়েলগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্সে চিকিৎসাধীন এক দুস্থ গর্ভবতী মায়ের জরুরি অপারেশনের জন্য ২ ব্যাগ O+ গ্রুপের রক্ত প্রয়োজন। রক্তদানে আগ্রহীরা অবিলম্বে হ্যালো মোড়েলগঞ্জ ব্লাড ডোনার টিমের সাথে যোগাযোগ করুন। ফোন: ০১৭১১-৯৯৮৮৭৭।',
    author: 'জরুরি ব্লাড ডেস্ক',
    date: '২০২৬-০৮-০৯',
    imageUrl: 'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    status: 'published',
    views: 1850
  }
];

export const INITIAL_DONORS: BloodDonor[] = [
  {
    id: 'bd-1',
    name: 'তানভীর আহমেদ',
    bloodGroup: 'A+',
    phone: '01712-345678',
    union: 'মোড়েলগঞ্জ সদর',
    village: 'সিরিয়াখালী',
    lastDonationDate: '২০২৬-০৪-১০',
    isAvailable: true,
    status: 'approved',
    registeredAt: '২০২৫-১২-১০',
    totalDonations: 6,
    notes: 'জরুরি প্রয়োজনে যেকোনো সময় কল দিতে পারেন।'
  },
  {
    id: 'bd-2',
    name: 'মেহেদী হাসান রনি',
    bloodGroup: 'B+',
    phone: '01819-876543',
    union: 'দৈবজ্ঞহাটি',
    village: 'পয়লাটপুর',
    lastDonationDate: '২০২৬-০২-১৫',
    isAvailable: true,
    status: 'approved',
    registeredAt: '২০২৬-০১-০৫',
    totalDonations: 4
  },
  {
    id: 'bd-3',
    name: 'রাশেদুল ইসলাম',
    bloodGroup: 'O+',
    phone: '01911-223344',
    union: 'বারইখালী',
    village: 'বারইখালী বাজার',
    lastDonationDate: '২০২৫-১১-২০',
    isAvailable: true,
    status: 'approved',
    registeredAt: '২০২৫-১০-১৫',
    totalDonations: 9
  },
  {
    id: 'bd-4',
    name: 'সাব্বির হোসেন',
    bloodGroup: 'AB+',
    phone: '01755-667788',
    union: 'পঞ্চকরণ',
    village: 'দেবরাজ',
    lastDonationDate: '২০২৬-০৩-০১',
    isAvailable: true,
    status: 'approved',
    registeredAt: '২০২৬-০২-০১',
    totalDonations: 3
  },
  {
    id: 'bd-5',
    name: 'সোহেল রানা',
    bloodGroup: 'O-',
    phone: '01677-112233',
    union: 'নিশানবাড়িয়া',
    village: 'গোলবুনিয়া',
    lastDonationDate: '২০২৫-০৯-১০',
    isAvailable: true,
    status: 'approved',
    registeredAt: '২০২৫-০৮-২০',
    totalDonations: 5,
    notes: 'বিরল O- রক্তদাতা, জরুরি বাইক ব্যাকআপ সুবিধা আছে।'
  },
  {
    id: 'bd-6',
    name: 'সাইফুল ইসলাম রাসেল',
    bloodGroup: 'A-',
    phone: '01733-445566',
    union: 'রামচন্দ্রপুর',
    village: 'চকপোতদার',
    lastDonationDate: 'নতুন / পূর্বে দেয়নি',
    isAvailable: true,
    status: 'pending',
    registeredAt: '২০২৬-০৮-০৮',
    totalDonations: 0,
    notes: 'নতুন ডোনার রেজিস্ট্রেশন পেন্ডিং অনুমোদনের অপেক্ষায়।'
  },
  {
    id: 'bd-7',
    name: 'আসাদুল হক',
    bloodGroup: 'B-',
    phone: '01822-998877',
    union: 'জিউধরা',
    village: 'জিউধরা',
    lastDonationDate: '২০২৬-০৫-০১',
    isAvailable: true,
    status: 'approved',
    registeredAt: '২০২৬-০৩-২০',
    totalDonations: 2
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'মোড়েলগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্স (৫০ শয্যা)',
    type: 'সরকারি হাসপাতাল',
    address: 'হাসপাতাল রোড, মোড়েলগঞ্জ সদর, বাগেরহাট',
    phone: '01713-241250',
    emergencyPhone: '01713-241251',
    bedsCount: 50,
    hasEmergency: true,
    hasAmbulance: true,
    hasICU: false,
    services: [
      '২৪ ঘণ্টা জরুরি বিভাগ',
      'ইনডোর ও আউটডোর চিকিৎসা',
      'মাতৃত্ব ও প্রসূতি সেবা',
      'ডিজিটাল এক্স-রে ও প্যাথলজি',
      'ইপিআই টিকাদান কেন্দ্র',
      'বিনামূল্যে সরকারি ওষুধ বিতরণ'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hosp-2',
    name: 'মোড়েলগঞ্জ সেন্ট্রাল হাসপাতাল ও ডায়াগনস্টিক সেন্টার',
    type: 'বেসরকারি ক্লিনিক',
    address: 'বাসস্ট্যান্ড সংলগ্ন, স্টেশন রোড, মোড়েলগঞ্জ',
    phone: '01711-889900',
    emergencyPhone: '01711-889901',
    bedsCount: 20,
    hasEmergency: true,
    hasAmbulance: true,
    hasICU: false,
    services: [
      'বিশেষজ্ঞ ডাক্তারের চেম্বার',
      'আধুনিক আল্ট্রাসনোগ্রাম',
      'ইসিজি ও কম্পিউটারাইজড প্যাথলজি',
      'জরুরি অপারেশন থিয়েটার (OT)',
      'কেবিন ও সাধারণ ওয়ার্ড'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hosp-3',
    name: 'দৈবজ্ঞহাটি ইউনিয়ন উপ-স্বাস্থ্য কেন্দ্র',
    type: 'ইউনিয়ন স্বাস্থ্য কেন্দ্র',
    address: 'দৈবজ্ঞহাটি বাজার, মোড়েলগঞ্জ',
    phone: '01815-554433',
    emergencyPhone: '01815-554433',
    bedsCount: 5,
    hasEmergency: false,
    hasAmbulance: false,
    hasICU: false,
    services: [
      'প্রাথমিক স্বাস্থ্যসেবা',
      'গর্ভবতী মায়ের স্বাস্থ্য পরীক্ষা',
      'শিশু টিকাদান ও পুষ্টি পরামর্শ'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hosp-4',
    name: 'পঞ্চানন জেনারেল ক্লিনিক ও ল্যাবরেটরি',
    type: 'ডায়াগনস্টিক সেন্টার',
    address: 'কলেজ রোড, মোড়েলগঞ্জ',
    phone: '01922-334455',
    emergencyPhone: '01922-334455',
    bedsCount: 10,
    hasEmergency: true,
    hasAmbulance: true,
    hasICU: false,
    services: ['হরমোন টেস্ট', 'ডিজিটাল ইসিজি', 'ভিজিট রুম', '২৪ ঘণ্টা অ্যাম্বুলেন্স']
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'ডাঃ মো: রফিকুল ইসলাম',
    degree: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস (মেডিসিন)',
    speciality: 'মেডিসিন ও হৃদরোগ বিশেষজ্ঞ',
    hospitalAffiliation: 'উপজেলা স্বাস্থ্য কমপ্লেক্স, মোড়েলগঞ্জ',
    chamberAddress: 'সেন্ট্রাল হাসপাতাল চেম্বার, স্টেশন রোড, মোড়েলগঞ্জ',
    visitingDays: 'শনিবার হতে বুধবার',
    visitingTime: 'বিকাল ৪:০০ - রাত ৮:০০',
    serialPhone: '01711-889900',
    fee: '৫০০ টাকা',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'doc-2',
    name: 'ডাঃ নার্গিস সুলতানা',
    degree: 'এমবিবিএস, ডিজিও (গাইনি ও প্রসূতি)',
    speciality: 'স্ত্রী রোগ, গাইনি ও প্রসূতি বিদ্যা বিশেষজ্ঞ',
    hospitalAffiliation: 'সাবেক কনসালট্যান্ট, জেলা হাসপাতাল',
    chamberAddress: 'মোড়েলগঞ্জ সেবা ক্লিনিক, হাসপাতাল রোড',
    visitingDays: 'প্রতিদিন (শুক্রবার বাদে)',
    visitingTime: 'বিকাল ৩:০০ - সন্ধ্যা ৭:০০',
    serialPhone: '01812-445566',
    fee: '৬০০ টাকা',
    imageUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7896d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'doc-3',
    name: 'ডাঃ অনুপম রায়',
    degree: 'এমবিবিএস, ডি-কার্ড (হৃদরোগ), এমডি (কার্ডিওলজি কোর্স)',
    speciality: 'হৃদরোগ, উচ্চ রক্তচাপ ও বাতজ্বর বিশেষজ্ঞ',
    hospitalAffiliation: 'খুলনা মেডিকেল কলেজ হাসপাতাল',
    chamberAddress: 'পঞ্চানন ক্লিনিক, কলেজ রোড, মোড়েলগঞ্জ',
    visitingDays: 'শুক্রবার ও শনিবার',
    visitingTime: 'সকাল ১০:০০ - বিকাল ৪:০০',
    serialPhone: '01922-334455',
    fee: '৭০০ টাকা',
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'doc-4',
    name: 'ডাঃ তানভীর হোসেন',
    degree: 'এমবিবিএস, ডিসিএইচ (শিশু স্বাস্থ্য)',
    speciality: 'নবজাতক, শিশু ও কিশোর রোগ বিশেষজ্ঞ',
    hospitalAffiliation: 'উপজেলা স্বাস্থ্য কমপ্লেক্স, মোড়েলগঞ্জ',
    chamberAddress: 'মেডিকেল কর্নার, বাসস্ট্যান্ড, মোড়েলগঞ্জ',
    visitingDays: 'প্রতিদিন',
    visitingTime: 'বিকাল ৫:০০ - রাত ৮:৩০',
    serialPhone: '01733-112233',
    fee: '৫০০ টাকা'
  }
];

export const INITIAL_SPOTS: TouristSpot[] = [
  {
    id: 'spot-1',
    name: 'পানগুছি রিভারভিউ ওয়াকওয়ে ও নদীতীর',
    location: 'পানগুছি নদীর পাড়, মোড়েলগঞ্জ সদর',
    description: 'মোড়েলগঞ্জ শহরের পাশ দিয়ে বয়ে যাওয়া প্রমত্তা পানগুছি নদীর কোল ঘেঁষে গড়ে ওঠা অত্যন্ত সুন্দর সৌন্দর্যমণ্ডিত রিভারসাইড পার্ক। পড়ন্ত বিকেলে সূর্যাস্ত দেখা ও নদীর ঠাণ্ডা বাতাসে ঘুরে বেড়ানোর জন্য এটি মোড়েলগঞ্জের সেরা স্থান।',
    howToGo: 'মোড়েলগঞ্জ বাসস্ট্যান্ড বা ফেরিঘাট থেকে রিকশা বা ইজিবাইকে ৫ মিনিটে পৌঁছানো যায়।',
    bestTimeToVisit: 'বিকাল ৪:০০ থেকে সন্ধ্যা ৭:০০',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 'spot-2',
    name: 'মোড়েলগঞ্জ উপজেলা পরিষদ দিঘি ও গ্রিন পার্ক',
    location: 'উপজেলা পরিষদ চত্বর, মোড়েলগঞ্জ',
    description: 'বিশাল লেক, সবুজ গাছগাছালি ও প্যাডেল বোটিং সমৃদ্ধ শান্ত ও সুন্দর পারিবারিক বিনোদন কেন্দ্র। শিশুদের জন্য খেলার স্থান ও ছায়াসুনিবিড় বেঞ্চ রয়েছে।',
    howToGo: 'উপজেলা পরিষদ চত্বরে হেঁটে বা রিকশায় যাওয়া যায়।',
    bestTimeToVisit: 'সকাল ৯:০০ - সন্ধ্যা ৬:০০',
    imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 'spot-3',
    name: 'ঐতিহাসিক মোড়েল সাহেবের কোঠি ও রবার্ট মোড়েল কুঠি স্মৃতি স্থান',
    location: 'মোড়েলগঞ্জ সদর নিলখী রোড',
    description: '১৮৪৯ সালে ব্রিটিশ নীলকর রবার্ট মোড়েল এই অঞ্চলে নীলকুঠি ও বসতি স্থাপন করেন, যার নামানুসারে পরবর্তীতে এই এলাকার নাম হয় মোড়েলগঞ্জ। প্রাচীন ইটের ধ্বংসাবশেষ ও ঐতিহাসিক স্মৃতিচিহ্ন প্রাচীন ইতিহাসপ্রেমীদের আকর্ষণ করে।',
    howToGo: 'মোড়েলগঞ্জ বাজার থেকে ভ্যান বা রিকশায় ১০ মিনিট।',
    bestTimeToVisit: 'সকাল ১০:০০ - বিকাল ৫:০০',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    featured: false
  },
  {
    id: 'spot-4',
    name: 'চিঙ্গড়াখালী ম্যানগ্রোভ নদী মোহনা ও সুন্দরবন তোরণ',
    location: 'চিঙ্গড়াখালী ইউনিয়ন, মোড়েলগঞ্জ',
    description: 'সুন্দরবনের প্রবেশদ্বার সংলগ্ন ম্যানগ্রোভ বন, নদী ও সামুদ্রিক প্রকৃতির অপরূপ লীলাভূমি। সুন্দরবনে যাওয়ার বোট ট্যুরের জন্য মোড়েলগঞ্জের এটি একটি জনপ্রিয় ল্যান্ডিং পয়েন্ট।',
    howToGo: 'মোড়েলগঞ্জ শহর থেকে ট্রলার বা মোটরসাইকেলে ২০ কিলোমিটার দক্ষিণ-পূর্বে।',
    bestTimeToVisit: 'শীতকাল (নভেম্বর - ফেব্রুয়ারি)',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800',
    featured: true
  }
];

export const INITIAL_GUIDES: TourGuide[] = [
  {
    id: 'guide-1',
    name: 'রাকিবুল ইসলাম (রাকিব)',
    organization: 'মোড়েলগঞ্জ সুন্দরবন ইকো ট্যুরস',
    phone: '01712-345678',
    services: ['পানগুছি বোট ক্রুজ', 'সুন্দরবন ডে-ট্যুর গাইড', 'ছবি তোলার সাহায্য', 'স্থানীয় খাবার আয়োজন'],
    areaOfSpecialty: 'সুন্দরবন ম্যানগ্রোভ বন ও নদী ভ্রমণ',
    rating: 4.9
  },
  {
    id: 'guide-2',
    name: 'সোহেল তানভীর',
    organization: 'পানগুছি ট্যুরিজম অর্গানাইজার',
    phone: '01819-987654',
    services: ['ফ্যামিলি ট্রিপ প্যাকেজ', 'বোট রিজার্ভেশন', 'ঐতিহাসিক স্থান পরিদর্শন'],
    areaOfSpecialty: 'মোড়েলগঞ্জ ও বাগেরহাট প্রত্নতাত্ত্বিক ভ্রমণ',
    rating: 4.8
  }
];

export const INITIAL_OFFICES: GovtOffice[] = [
  {
    id: 'off-1',
    name: 'উপজেলা নির্বাহী অফিসারের কার্যালয় (ইউএনও অফিস)',
    headOfficer: 'উপজেলা নির্বাহী অফিসার (ইউএনও)',
    address: 'উপজেলা পরিষদ কমপ্লেক্স, মোড়েলগঞ্জ, বাগেরহাট',
    phone: '01713-241250',
    email: 'unomorrelganj@mopa.gov.bd',
    officeHours: 'রবিবার - বৃহস্পতিবার (সকাল ৯:০০ - বিকাল ৪:০০)',
    services: [
      'উপজেলা প্রশাসনিক কার্যক্রম ও তদারকি',
      'জাতীয় সামাজিক নিরাপত্তা সুবিধা',
      'আইন শৃঙ্খলা ও ত্রাণ দুর্যোগ ব্যবস্থাপনা',
      'মোবাইল কোর্ট পরিচালনা'
    ]
  },
  {
    id: 'off-2',
    name: 'মোড়েলগঞ্জ থানা (বাংলাদেশ পুলিশ)',
    headOfficer: 'অফিসার ইনচার্জ (ওসি)',
    address: 'থানা রোড, মোড়েলগঞ্জ সদর',
    phone: '01713-374150',
    email: 'ocmorrelganj@police.gov.bd',
    officeHours: '২৪ ঘণ্টা নিরবচ্ছিন্ন সেবা',
    services: [
      'জরুরি ৯৯৯ পুলিশি সাহায্য',
      'জিডি (GD) ও মামলা গ্রহণ',
      'আইন শৃঙ্খলা রক্ষা ও নিরাপত্তা',
      'পাসপোর্ট ভেরিফিকেশন'
    ]
  },
  {
    id: 'off-3',
    name: 'উপজেলা সহকারী কমিশনার (ভূমি) এর কার্যালয় (এসিল্যান্ড)',
    headOfficer: 'সহকারী কমিশনার (ভূমি)',
    address: 'উপজেলা ভূমি অফিস চত্বর, মোড়েলগঞ্জ',
    phone: '01713-241252',
    email: 'aclandmorrelganj@land.gov.bd',
    officeHours: 'রবিবার - বৃহস্পতিবার (সকাল ৯:০০ - বিকাল ৪:০০)',
    services: [
      'ই-নামজারি ও রেকর্ড সংশোধন',
      'ভূমি উন্নয়ন কর বা খাজনা আদায়',
      'খাস জমি ও অর্পিত সম্পত্তি ব্যবস্থাপনা'
    ]
  },
  {
    id: 'off-4',
    name: 'বাগেরহাট পল্লী বিদ্যুৎ সমিতি (মোড়েলগঞ্জ জোনাল অফিস)',
    headOfficer: 'ডিজিএম (DGM)',
    address: 'পাওয়ার হাউস রোড, মোড়েলগঞ্জ',
    phone: '01769-400800',
    email: 'pbes.morrelganj@gmail.com',
    officeHours: '২৪ ঘণ্টা কমপ্লেন সার্ভিস (অফিস: ৯:০০-৪:০০)',
    services: [
      'নতুন বিদ্যুৎ সংযোগ আবেদন',
      'বিদ্যুৎ বিভ্রাট কমপ্লেন সমাধান (অভিযোগ কেন্দ্র)',
      'মিটার রিডিং ও বিল সংশোধন'
    ]
  },
  {
    id: 'off-5',
    name: 'ফায়ার সার্ভিস ও সিভিল ডিফেন্স স্টেশন, মোড়েলগঞ্জ',
    headOfficer: 'স্টেশন অফিসার',
    address: 'মোড়েলগঞ্জ বাইপাস রোড, বাগেরহাট',
    phone: '01713-991100',
    email: 'fireservice.morrelganj@gmail.com',
    officeHours: '২৪ ঘণ্টা জরুরি সেবা',
    services: [
      'অগ্নি নির্বাপণ ও উদ্ধার কাজ',
      'নৌ দুর্ঘটনা ও ডুবুরি সেবা',
      'সড়ক দুর্ঘটনাকবলিত গাড়ি উদ্ধার'
    ]
  }
];

export const INITIAL_AMBULANCES: Ambulance[] = [
  {
    id: 'amb-1',
    title: 'মোড়েলগঞ্জ সরকারি হাসপাতাল অ্যাম্বুলেন্স',
    provider: 'সরকারি',
    driverName: 'আব্দুস সালাম',
    phone: '01711-223344',
    isAC: false,
    isOxygenAvailable: true,
    baseLocation: 'উপজেলা স্বাস্থ্য কমপ্লেক্স, মোড়েলগঞ্জ',
    isAvailable: true
  },
  {
    id: 'amb-2',
    title: 'রেড ক্রিসেন্ট জরুরি অক্সিজেন ও অ্যাম্বুলেন্স',
    provider: 'রেড ক্রিসেন্ট',
    driverName: 'মো: জহিরুল ইসলাম',
    phone: '01811-334455',
    isAC: true,
    isOxygenAvailable: true,
    baseLocation: 'মোড়েলগঞ্জ সদর বাজার',
    isAvailable: true
  },
  {
    id: 'amb-3',
    title: 'সেন্ট্রাল ফ্রিজিং ও পেশেন্ট কেয়ার অ্যাম্বুলেন্স',
    provider: 'বেসরকারি',
    driverName: 'আলমগীর হোসেন',
    phone: '01911-445566',
    isAC: true,
    isOxygenAvailable: true,
    baseLocation: 'স্টেশন রোড, মোড়েলগঞ্জ',
    isAvailable: true
  },
  {
    id: 'amb-4',
    title: 'পানগুছি সেবামূলক অ্যাম্বুলেন্স সার্ভিস',
    provider: 'স্বেচ্ছাসেবী',
    driverName: 'শফিকুল আলম',
    phone: '01712-556677',
    isAC: false,
    isOxygenAvailable: true,
    baseLocation: 'দৈবজ্ঞহাটি বাজার',
    isAvailable: true
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-1',
    timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('bn-BD'),
    userRole: 'admin',
    action: 'সিস্টেম চালু',
    details: 'হ্যালো মোড়েলগঞ্জ পোর্টাল সক্রিয় করা হয়েছে।'
  },
  {
    id: 'log-2',
    timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('bn-BD'),
    userRole: 'moderator',
    action: 'ডোনার তথ্য যাচাই',
    details: 'নতুন নিবন্ধিত রক্তদাতার তথ্য মডারেটর ড্যাশবোর্ডে সারিবদ্ধ করা হয়েছে।'
  }
];

export const INITIAL_HELPLINES: EmergencyHelpline[] = [
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
    id: 'help-2',
    title: 'মোড়েলগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্স',
    subtitle: '২৪ ঘণ্টা জরুরি চিকিৎসা ও ভর্তি',
    number: '01713241250',
    formattedNumber: '01713-241250',
    category: 'health',
    color: 'bg-emerald-700 border-emerald-800 text-white'
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

export const INITIAL_BUS_SCHEDULES: BusSchedule[] = [
  {
    id: 'bus-1',
    busName: 'সুন্দরবন পরিবহন (এসি)',
    busType: 'এসি (AC)',
    startingPoint: 'মোড়েলগঞ্জ',
    destination: 'ঢাকা',
    departureTime: 'সকাল ০৭:১৫ মি.',
    arrivalTime: 'দুপুর ১২:৪৫ মি.',
    fare: '৳ ৯৫০',
    routeVia: 'পদ্মা সেতু হয়ে (সায়দাবাদ / গাবতলী)',
    counterLocation: 'মোড়েলগঞ্জ বাসস্ট্যান্ড কাউন্টার',
    counterPhone: '01711-234567',
    supervisorPhone: '01812-345678',
    notes: 'পদ্মা সেতু দিয়ে দ্রুততম সময়ে ঢাকা গাবতলী/কল্যাণপুর পৌঁছায়।',
    addedBy: 'moderator@morrelganj.gov.bd',
    status: 'approved'
  },
  {
    id: 'bus-2',
    busName: 'হানিফ এন্টারপ্রাইজ',
    busType: 'নন-এসি (Non-AC)',
    startingPoint: 'মোড়েলগঞ্জ',
    destination: 'ঢাকা',
    departureTime: 'সকাল ০৮:৩০ মি.',
    arrivalTime: 'দুপুর ০২:০০ মি.',
    fare: '৳ ৭৫০',
    routeVia: 'পদ্মা সেতু হয়ে (সায়দাবাদ / যাত্রাবাড়ী)',
    counterLocation: 'ফেরীঘাট কাউন্টার, মোড়েলগঞ্জ',
    counterPhone: '01712-987654',
    supervisorPhone: '01911-554433',
    notes: 'আরামদায়ক আসন ও অভিজ্ঞ ড্রাইভার।',
    addedBy: 'moderator@morrelganj.gov.bd',
    status: 'approved'
  },
  {
    id: 'bus-3',
    busName: 'ঈগল পরিবহন (এসি ডিল্যাক্স)',
    busType: 'এসি (AC)',
    startingPoint: 'মোড়েলগঞ্জ',
    destination: 'ঢাকা',
    departureTime: 'রাত ০৯:৩০ মি.',
    arrivalTime: 'ভোর ০৩:৩০ মি.',
    fare: '৳ ১০৫০',
    routeVia: 'পদ্মা সেতু হয়ে (সায়দাবাদ / মহাখালী)',
    counterLocation: 'চৌহুঙ্গী মোড় কাউন্টার, মোড়েলগঞ্জ',
    counterPhone: '01815-112233',
    supervisorPhone: '01718-990011',
    notes: 'রাত্রিকালীন সার্ভিস, চার্জিং পয়েন্ট ও কম্বল সুবিধা।',
    addedBy: 'admin',
    status: 'approved'
  },
  {
    id: 'bus-4',
    busName: 'গোল্ডেন লাইন এক্সপ্রেস',
    busType: 'এসি (AC)',
    startingPoint: 'মোড়েলগঞ্জ',
    destination: 'চট্টগ্রাম',
    departureTime: 'বিকাল ০৫:০০ মি.',
    arrivalTime: 'ভোর ০৫:০০ মি.',
    fare: '৳ ১৩০০',
    routeVia: 'পদ্মা সেতু - ফেরিঘাট - চট্টগ্রাম অলংকার',
    counterLocation: 'মোড়েলগঞ্জ বাসস্ট্যান্ড',
    counterPhone: '01922-334455',
    notes: 'সরাসরি মোড়েলগঞ্জ থেকে চট্টগ্রাম।',
    addedBy: 'mod2@morrelganj.gov.bd',
    status: 'approved'
  },
  {
    id: 'bus-5',
    busName: 'মোড়েলগঞ্জ - খুলনা লোকাল বাস',
    busType: 'লোকাল (Local)',
    startingPoint: 'মোড়েলগঞ্জ',
    destination: 'খুলনা',
    departureTime: 'প্রতি ৩০ মিনিট পর পর (সকাল ০৬:০০ - সন্ধ্যা ০৬:৩০)',
    arrivalTime: '২ ঘণ্টা সময় লাগে',
    fare: '৳ ১২০',
    routeVia: 'বাগেরহাট - রূপসা - খুলনা রূপসা ঘাট',
    counterLocation: 'মোড়েলগঞ্জ লোকাল বাস টার্মিনাল',
    counterPhone: '01715-667788',
    notes: 'বাগেরহাট ও খুলনা রুটে সারাদিন সার্ভিস।',
    addedBy: 'moderator@morrelganj.gov.bd',
    status: 'approved'
  },
  {
    id: 'bus-6',
    busName: 'বাগেরহাট এক্সপ্রেস',
    busType: 'নন-এসি (Non-AC)',
    startingPoint: 'মোড়েলগঞ্জ',
    destination: 'বাগেরহাট',
    departureTime: 'প্রতি ১৫ মিনিট পর পর',
    arrivalTime: '৪৫ মিনিট',
    fare: '৳ ৫০',
    routeVia: 'সাইনবোর্ড - বাগেরহাট বাসস্ট্যান্ড',
    counterLocation: 'ফেরীঘাট মোড়েলগঞ্জ',
    counterPhone: '01811-223344',
    notes: 'বাগেরহাট জেলা সদরে যাতায়াতের সহজ বাস।',
    addedBy: 'moderator@morrelganj.gov.bd',
    status: 'approved'
  },
  {
    id: 'bus-7',
    busName: 'ফাল্গুনী পরিবহন (এসি)',
    busType: 'এসি (AC)',
    startingPoint: 'ঢাকা',
    destination: 'মোড়েলগঞ্জ',
    departureTime: 'রাত ১০:০০ মি.',
    arrivalTime: 'ভোর ০৪:০০ মি.',
    fare: '৳ ১০০০',
    routeVia: 'পদ্মা সেতু হয়ে মোড়েলগঞ্জ',
    counterLocation: 'সায়দাবাদ / গাবতলী ঢাকা',
    counterPhone: '01714-556677',
    notes: 'ঢাকা থেকে মোড়েলগঞ্জ পৌঁছানোর সেরা নাইট সার্ভিস।',
    addedBy: 'mod2@morrelganj.gov.bd',
    status: 'approved'
  }
];

export const INITIAL_BUS_COUNTERS: TicketCounter[] = [
  {
    id: 'counter-1',
    counterName: 'সুন্দরবন পরিবহন মোড়েলগঞ্জ প্রধান কাউন্টার',
    location: 'মোড়েলগঞ্জ নতুন বাসস্ট্যান্ড, মোড়েলগঞ্জ সদর',
    phoneNumbers: ['01711-234567', '01812-345678'],
    busCompanies: ['সুন্দরবন পরিবহন'],
    operatingHours: 'সকাল ০৬:০০ মি. - রাত ১১:০০ মি.',
    addressDetails: 'মোড়েলগঞ্জ ফেরীঘাট প্রধান সড়কের পাশে।'
  },
  {
    id: 'counter-2',
    counterName: 'হানিফ এন্টারপ্রাইজ কাউন্টার',
    location: 'চৌহুঙ্গী মোড়, মোড়েলগঞ্জ',
    phoneNumbers: ['01712-987654', '01911-554433'],
    busCompanies: ['হানিফ এন্টারপ্রাইজ'],
    operatingHours: 'সকাল ০৬:৩০ মি. - রাত ১০:৩০ মি.',
    addressDetails: 'চৌহুঙ্গী মোড় জামে মসজিদের বিপরীতে।'
  },
  {
    id: 'counter-3',
    counterName: 'ঈগল পরিবহন ও গোল্ডেন লাইন যৌথ কাউন্টার',
    location: 'মোড়েলগঞ্জ বাস টার্মিনাল',
    phoneNumbers: ['01815-112233', '01922-334455'],
    busCompanies: ['ঈগল পরিবহন', 'গোল্ডেন লাইন'],
    operatingHours: 'সকাল ০৭:০০ মি. - রাত ১১:৩০ মি.',
    addressDetails: 'বাস টার্মিনাল ভবন, ১ম তলা।'
  },
  {
    id: 'counter-4',
    counterName: 'লোকাল বাস মালিক সমিতি অফিস',
    location: 'মোড়েলগঞ্জ বাসস্ট্যান্ড',
    phoneNumbers: ['01715-667788', '01811-223344'],
    busCompanies: ['মোড়েলগঞ্জ-খুলনা লোকাল', 'বাগেরহাট এক্সপ্রেস'],
    operatingHours: 'সকাল ০৫:৩০ মি. - রাত ০৭:০০ মি.',
    addressDetails: 'লোকাল বাস কাউন্টার।'
  }
];

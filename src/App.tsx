import React, { useState } from 'react';
import { Header } from './components/Header';
import { CitizenView } from './components/CitizenView';
import { AdminDashboard } from './components/AdminDashboard';
import { ModeratorDashboard } from './components/ModeratorDashboard';
import { ModeratorLoginPage } from './components/ModeratorLoginPage';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { DonorRegistrationModal } from './components/DonorRegistrationModal';
import { ModeratorApplicationModal } from './components/ModeratorApplicationModal';
import { EmergencyModal } from './components/EmergencyModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { Footer } from './components/Footer';

import {
  UserRole,
  NewsItem,
  BloodDonor,
  Hospital,
  Doctor,
  TouristSpot,
  TourGuide,
  GovtOffice,
  Ambulance,
  SystemLog,
  ModeratorPermissions,
  ModeratorApplication,
  EmergencyHelpline,
  BusSchedule,
  TicketCounter,
  UpazilaRegion,
  FacebookSettings
} from './types';

import {
  INITIAL_NEWS,
  INITIAL_DONORS,
  INITIAL_HOSPITALS,
  INITIAL_DOCTORS,
  INITIAL_SPOTS,
  INITIAL_GUIDES,
  INITIAL_OFFICES,
  INITIAL_AMBULANCES,
  INITIAL_LOGS,
  INITIAL_HELPLINES,
  INITIAL_BUS_SCHEDULES,
  INITIAL_BUS_COUNTERS
} from './data/morrelgonjInitialData';
import {
  MORRELGANJ_REGIONS,
  MORRELGANJ_UPAZILA_INFO
} from './data/morrelgonjRegionData';
import { useFirestoreSync, saveToFirestore, clearCollectionInFirestore } from './lib/useFirestoreSync';
import { ensureTransparentLogo } from './utils/imageUtils';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Site Logo & Favicon State - Live Synced with Firestore & LocalStorage
  const [siteLogo, setSiteLogoState] = useState<string>(() => {
    return localStorage.getItem('morrelgonj_site_logo') || '/logo.jpg';
  });
  const [siteFavicon, setSiteFaviconState] = useState<string>(() => {
    return localStorage.getItem('morrelgonj_site_favicon') || '/logo.jpg';
  });

  useFirestoreSync<{ id: string; siteLogo?: string; siteFavicon?: string }>(
    'site_branding',
    [{ id: 'config', siteLogo, siteFavicon }],
    (data) => {
      if (data && data.length > 0) {
        const docLogo = data[0].siteLogo;
        const docFavicon = data[0].siteFavicon;
        if (docLogo) {
          setSiteLogoState(docLogo);
          localStorage.setItem('morrelgonj_site_logo', docLogo);
        }
        if (docFavicon) {
          setSiteFaviconState(docFavicon);
          localStorage.setItem('morrelgonj_site_favicon', docFavicon);
        }
      }
    }
  );

  const setSiteLogo = (newLogo: string) => {
    setSiteLogoState(newLogo);
    localStorage.setItem('morrelgonj_site_logo', newLogo);
    saveToFirestore('site_branding', { id: 'config', siteLogo: newLogo, siteFavicon });
  };

  const setSiteFavicon = (newFavicon: string) => {
    setSiteFaviconState(newFavicon);
    localStorage.setItem('morrelgonj_site_favicon', newFavicon);
    saveToFirestore('site_branding', { id: 'config', siteLogo, siteFavicon: newFavicon });
  };

  // Dynamic favicon head tag updater
  React.useEffect(() => {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = siteFavicon;
  }, [siteFavicon]);

  // Moderator Permissions State Controlled by Admin
  const [moderatorPermissions, setModeratorPermissions] = useState<ModeratorPermissions>({
    canManageNews: true,
    canManageDonors: true,
    canManageHospitals: true,
    canManageAmbulances: true,
    canManageOffices: true
  });

  // Main Lists State
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS);
  const [donorsList, setDonorsList] = useState<BloodDonor[]>(INITIAL_DONORS);
  const [hospitalsList, setHospitalsList] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [spotsList, setSpotsList] = useState<TouristSpot[]>(INITIAL_SPOTS);
  const [guidesList, setGuidesList] = useState<TourGuide[]>(INITIAL_GUIDES);
  const [officesList, setOfficesList] = useState<GovtOffice[]>(INITIAL_OFFICES);
  const [ambulancesList, setAmbulancesList] = useState<Ambulance[]>(INITIAL_AMBULANCES);
  const [helplinesList, setHelplinesList] = useState<EmergencyHelpline[]>(INITIAL_HELPLINES);
  const [busSchedules, setBusSchedules] = useState<BusSchedule[]>(INITIAL_BUS_SCHEDULES);
  const [ticketCounters, setTicketCounters] = useState<TicketCounter[]>(INITIAL_BUS_COUNTERS);
  const [regionsList, setRegionsList] = useState<UpazilaRegion[]>(MORRELGANJ_REGIONS);
  const [upazilaInfo, setUpazilaInfo] = useState<typeof MORRELGANJ_UPAZILA_INFO>(MORRELGANJ_UPAZILA_INFO);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(INITIAL_LOGS);

  // Moderator Applications State
  const [moderatorApplications, setModeratorApplications] = useState<ModeratorApplication[]>([]);

  // Automatic one-time cleanup of all example/demo data from Firestore
  React.useEffect(() => {
    const clearDemoDataFromFirestore = async () => {
      const collectionsToClear = [
        'news',
        'donors',
        'hospitals',
        'doctors',
        'spots',
        'guides',
        'offices',
        'ambulances',
        'helplines',
        'buses',
        'busCounters',
        'logs',
        'moderatorApplications'
      ];
      for (const col of collectionsToClear) {
        await clearCollectionInFirestore(col);
      }
    };
    clearDemoDataFromFirestore();
  }, []);

  // Firestore Real-Time Cloud Sync
  useFirestoreSync('news', INITIAL_NEWS, setNewsList);
  useFirestoreSync('donors', INITIAL_DONORS, setDonorsList);
  useFirestoreSync('hospitals', INITIAL_HOSPITALS, setHospitalsList);
  useFirestoreSync('doctors', INITIAL_DOCTORS, setDoctorsList);
  useFirestoreSync('spots', INITIAL_SPOTS, setSpotsList);
  useFirestoreSync('guides', INITIAL_GUIDES, setGuidesList);
  useFirestoreSync('offices', INITIAL_OFFICES, setOfficesList);
  useFirestoreSync('ambulances', INITIAL_AMBULANCES, setAmbulancesList);
  useFirestoreSync('helplines', INITIAL_HELPLINES, setHelplinesList);
  useFirestoreSync('buses', INITIAL_BUS_SCHEDULES, setBusSchedules);
  useFirestoreSync('busCounters', INITIAL_BUS_COUNTERS, setTicketCounters);
  useFirestoreSync('regions', MORRELGANJ_REGIONS, setRegionsList);
  useFirestoreSync('upazilaInfo', [MORRELGANJ_UPAZILA_INFO as any], (data) => {
    if (data && data.length > 0) {
      setUpazilaInfo(data[0] as any);
    }
  });
  useFirestoreSync('logs', INITIAL_LOGS, setSystemLogs);
  useFirestoreSync('moderatorApplications', [], setModeratorApplications);

  // Facebook Auto-Post Settings State
  const [facebookSettings, setFacebookSettings] = useState<FacebookSettings>({
    pageId: '',
    pageAccessToken: '',
    autoPostEnabled: true
  });

  useFirestoreSync<{ id: string; pageId?: string; pageAccessToken?: string; autoPostEnabled?: boolean; pageName?: string; pageFollowers?: number; lastVerifiedAt?: string }>(
    'facebook_settings',
    [{ id: 'config', pageId: '', pageAccessToken: '', autoPostEnabled: true }],
    (data) => {
      if (data && data.length > 0) {
        const cfg = data[0];
        setFacebookSettings({
          pageId: cfg.pageId || '',
          pageAccessToken: cfg.pageAccessToken || '',
          autoPostEnabled: cfg.autoPostEnabled !== undefined ? cfg.autoPostEnabled : true,
          pageName: cfg.pageName,
          pageFollowers: cfg.pageFollowers,
          lastVerifiedAt: cfg.lastVerifiedAt
        });
      }
    }
  );

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [isModeratorModalOpen, setIsModeratorModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // URL Routing & Path Listener (/moderator, /admin, #moderator)
  const [routePath, setRoutePath] = useState<string>(
    () => window.location.pathname.toLowerCase() + window.location.hash.toLowerCase()
  );

  React.useEffect(() => {
    const checkRoute = () => {
      const fullPath = (window.location.pathname + window.location.hash).toLowerCase();
      setRoutePath(fullPath);

      if (
        fullPath.includes('/moderator') ||
        fullPath.includes('/mod') ||
        fullPath.includes('#moderator')
      ) {
        // Moderator route active
      } else if (fullPath.includes('/admin') || fullPath.includes('#admin')) {
        // Admin route active
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, [userRole]);

  // Helper to append activity logs
  const addLog = (action: string, details: string) => {
    const time =
      new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) +
      ' - ' +
      new Date().toLocaleDateString('bn-BD');
    const newLog: SystemLog = {
      id: 'log-' + Date.now(),
      timestamp: time,
      userRole,
      action,
      details
    };
    setSystemLogs((prev) => [newLog, ...prev]);
  };

  // Submit Donor Application from Citizen Modal
  const handleSubmitDonor = (donorData: Omit<BloodDonor, 'id' | 'status' | 'registeredAt'>) => {
    const newDonor: BloodDonor = {
      ...donorData,
      id: 'bd-' + Date.now(),
      status: 'pending',
      registeredAt: new Date().toISOString().split('T')[0]
    };
    setDonorsList((prev) => [newDonor, ...prev]);
    saveToFirestore('donors', newDonor);
    addLog('নতুন ডোনার নিবন্ধন আবেদন', `${donorData.name} (${donorData.bloodGroup}, ${donorData.union}) আবেদন জমা দিয়েছেন।`);
  };

  // Submit Moderator Application from Citizen Modal
  const handleSubmitModeratorApplication = (
    appData: Omit<ModeratorApplication, 'id' | 'status' | 'submittedAt'>
  ) => {
    const newApp: ModeratorApplication = {
      ...appData,
      id: 'mod-app-' + Date.now(),
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setModeratorApplications((prev) => [newApp, ...prev]);
    saveToFirestore('moderatorApplications', newApp);
    addLog('মডারেটর আবেদন জমা', `${appData.applicantName} (${appData.union}) এর মডারেটর পদে আবেদন প্রাপ্ত হয়েছে।`);
  };

  const pendingDonorsCount = donorsList.filter((d) => d.status === 'pending').length;
  const pendingNewsCount = newsList.filter((n) => n.pendingAction !== undefined).length;
  const pendingModeratorAppsCount = moderatorApplications.filter((a) => a.status === 'pending').length;
  const totalPending = pendingDonorsCount + pendingNewsCount + pendingModeratorAppsCount;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        siteLogo={siteLogo}
        siteFavicon={siteFavicon}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenDonorModal={() => setIsDonorModalOpen(true)}
        onOpenModeratorModal={() => setIsModeratorModalOpen(true)}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        pendingCount={totalPending}
        pendingNewsCount={pendingNewsCount}
        pendingDonorsCount={pendingDonorsCount}
        pendingModeratorAppsCount={pendingModeratorAppsCount}
        onLogout={() => {
          setUserRole('citizen');
          setActiveTab('home');
          addLog('লগআউট', 'সেশন শেষ করে নাগরিক মোডে ফিরে গেছেন।');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* Render View Based on Selected Role */}
        {userRole === 'admin' ? (
          <AdminDashboard
            newsList={newsList}
            setNewsList={setNewsList}
            donorsList={donorsList}
            setDonorsList={setDonorsList}
            hospitalsList={hospitalsList}
            setHospitalsList={setHospitalsList}
            doctorsList={doctorsList}
            setDoctorsList={setDoctorsList}
            spotsList={spotsList}
            setSpotsList={setSpotsList}
            officesList={officesList}
            setOfficesList={setOfficesList}
            ambulancesList={ambulancesList}
            setAmbulancesList={setAmbulancesList}
            helplinesList={helplinesList}
            setHelplinesList={setHelplinesList}
            regionsList={regionsList}
            setRegionsList={setRegionsList}
            systemLogs={systemLogs}
            addLog={addLog}
            moderatorPermissions={moderatorPermissions}
            setModeratorPermissions={setModeratorPermissions}
            moderatorApplications={moderatorApplications}
            setModeratorApplications={setModeratorApplications}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            siteLogo={siteLogo}
            setSiteLogo={setSiteLogo}
            siteFavicon={siteFavicon}
            setSiteFavicon={setSiteFavicon}
            facebookSettings={facebookSettings}
            setFacebookSettings={setFacebookSettings}
          />
        ) : userRole === 'moderator' ? (
          <ModeratorDashboard
            donorsList={donorsList}
            setDonorsList={setDonorsList}
            newsList={newsList}
            setNewsList={setNewsList}
            hospitalsList={hospitalsList}
            setHospitalsList={setHospitalsList}
            ambulancesList={ambulancesList}
            setAmbulancesList={setAmbulancesList}
            officesList={officesList}
            setOfficesList={setOfficesList}
            busSchedules={busSchedules}
            setBusSchedules={setBusSchedules}
            ticketCounters={ticketCounters}
            setTicketCounters={setTicketCounters}
            regionsList={regionsList}
            setRegionsList={setRegionsList}
            upazilaInfo={upazilaInfo}
            setUpazilaInfo={setUpazilaInfo}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            moderatorPermissions={moderatorPermissions}
            facebookSettings={facebookSettings}
            onLogout={() => {
              setUserRole('citizen');
              setActiveTab('home');
              setRoutePath('/');
              window.history.pushState({}, '', '/');
              addLog('লগআউট', 'মডারেটর সেশন শেষ করে নাগরিক মোডে ফিরে গেছেন।');
            }}
            addLog={addLog}
          />
        ) : (routePath.includes('/moderator') || routePath.includes('/mod') || routePath.includes('#moderator') || routePath.includes('#mod')) ? (
          <ModeratorLoginPage
            moderatorApplications={moderatorApplications}
            siteLogo={siteLogo}
            onLoginSuccess={(matchedMod) => {
              if (matchedMod) {
                setUserRole('moderator');
                const perms = matchedMod.approvedPermissions || matchedMod.requestedPermissions;
                if (perms) {
                  setModeratorPermissions(perms);
                }
                addLog('মডারেটর লগইন', `মডারেটর ${matchedMod.applicantName} সফলভাবে ড্যাশবোর্ডে প্রবেশ করেছেন।`);
              } else {
                setUserRole('admin');
                addLog('এডমিন লগইন', 'এডমিন সফলভাবে ড্যাশবোর্ডে প্রবেশ করেছেন।');
              }
            }}
            onGoToCitizenView={() => {
              setRoutePath('/');
              window.history.pushState({}, '', '/');
            }}
            onOpenApplyModal={() => setIsModeratorModalOpen(true)}
          />
        ) : (
          <CitizenView
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            newsList={newsList}
            donorsList={donorsList}
            hospitalsList={hospitalsList}
            doctorsList={doctorsList}
            spotsList={spotsList}
            guidesList={guidesList}
            officesList={officesList}
            ambulancesList={ambulancesList}
            busSchedules={busSchedules}
            ticketCounters={ticketCounters}
            regionsList={regionsList}
            upazilaInfo={upazilaInfo}
            onOpenDonorModal={() => setIsDonorModalOpen(true)}
            onOpenModeratorModal={() => setIsModeratorModalOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        siteLogo={siteLogo}
        siteFavicon={siteFavicon}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenDonorModal={() => setIsDonorModalOpen(true)}
        onOpenModeratorModal={() => setIsModeratorModalOpen(true)}
      />

      {/* Modals */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={userRole}
        moderatorApplications={moderatorApplications}
        onSelectRole={(role, matchedModerator) => {
          setUserRole(role);
          if (role === 'moderator') {
            setRoutePath('#moderator');
            window.history.pushState({}, '', '#moderator');
            if (matchedModerator) {
              const perms = matchedModerator.approvedPermissions || matchedModerator.requestedPermissions;
              if (perms) {
                setModeratorPermissions(perms);
              }
            }
          } else if (role === 'admin') {
            setRoutePath('#admin');
            window.history.pushState({}, '', '#admin');
          } else {
            setRoutePath('/');
            window.history.pushState({}, '', '/');
          }
          addLog('রোল পরিবর্তন', `বর্তমান সক্রিয় ভূমিকা: ${role.toUpperCase()}${matchedModerator ? ` (${matchedModerator.applicantName})` : ''}`);
        }}
      />

      <DonorRegistrationModal
        isOpen={isDonorModalOpen}
        onClose={() => setIsDonorModalOpen(false)}
        onSubmitDonor={handleSubmitDonor}
      />

      <ModeratorApplicationModal
        isOpen={isModeratorModalOpen}
        onClose={() => setIsModeratorModalOpen(false)}
        onSubmitApplication={handleSubmitModeratorApplication}
      />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        helplines={helplinesList}
      />

      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        userRole={userRole}
      />
    </div>
  );
}

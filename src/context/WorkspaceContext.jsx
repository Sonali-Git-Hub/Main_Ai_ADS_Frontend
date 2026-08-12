import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext();

const MODULE_TO_PATH = {
  dashboard: '/dashboard',
  brands: '/brand-dna',
  strategy: '/strategy',
  seo: '/seo-intelligence',
  calendar: '/calendar',
  studio: '/content-studio',
  campaigns: '/campaigns',
  creative: '/creative-studio',
  repurpose: '/repurpose',
  assets: '/asset-library',
  approvals: '/approvals-desk',
  analytics: '/analytics',
  team: '/team-rbac',
  settings: '/settings-billing',
};

const PATH_TO_MODULE = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/brand-dna': 'brands',
  '/brands': 'brands',
  '/strategy': 'strategy',
  '/seo': 'seo',
  '/seo-intelligence': 'seo',
  '/calendar': 'calendar',
  '/content-studio': 'studio',
  '/studio': 'studio',
  '/campaigns': 'campaigns',
  '/creative-studio': 'creative',
  '/creative': 'creative',
  '/repurpose': 'repurpose',
  '/asset-library': 'assets',
  '/assets': 'assets',
  '/approvals': 'approvals',
  '/approvals-desk': 'approvals',
  '/analytics': 'analytics',
  '/team-rbac': 'team',
  '/team': 'team',
  '/settings-billing': 'settings',
  '/settings': 'settings',
};

function getModuleFromLocation() {
  if (typeof window === 'undefined') return 'dashboard';
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  return PATH_TO_MODULE[path] || 'dashboard';
}

export const WorkspaceProvider = ({ children }) => {
  // Navigation & History Tracking (Synced with Browser URL Routes)
  const [activeModule, setActiveModuleState] = useState(getModuleFromLocation);
  const [navigationHistory, setNavigationHistory] = useState([]);

  const setActiveModule = (newModule) => {
    if (newModule !== activeModule) {
      setNavigationHistory(prev => [...prev, activeModule]);
      setActiveModuleState(newModule);

      const targetPath = MODULE_TO_PATH[newModule] || '/dashboard';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ module: newModule }, '', targetPath);
      }
    }
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const prevModule = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setActiveModuleState(prevModule);
      const targetPath = MODULE_TO_PATH[prevModule] || '/dashboard';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ module: prevModule }, '', targetPath);
      }
    } else if (activeModule !== 'dashboard') {
      setActiveModuleState('dashboard');
      if (window.location.pathname !== '/dashboard') {
        window.history.pushState({ module: 'dashboard' }, '', '/dashboard');
      }
    }
  };

  // Sync state on browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const currentMod = getModuleFromLocation();
      setActiveModuleState(currentMod);
    };

    window.addEventListener('popstate', handlePopState);

    // Set clean URL on initial load if at root /
    const initialPath = MODULE_TO_PATH[activeModule] || '/dashboard';
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState({ module: activeModule }, '', initialPath);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const canGoBack = navigationHistory.length > 0 || activeModule !== 'dashboard';
  
  // Settings Modal & Personalization Preferences State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('personalization');

  const [appearance, setAppearanceState] = useState(() => {
    try {
      return localStorage.getItem('aisa_appearance') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const [accentColor, setAccentColorState] = useState(() => {
    try {
      return localStorage.getItem('aisa_accent_color') || 'default';
    } catch (e) {
      return 'default';
    }
  });

  const [region, setRegionState] = useState(() => {
    try {
      return localStorage.getItem('aisa_region') || 'India';
    } catch (e) {
      return 'India';
    }
  });

  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('aisa_language') || 'English';
    } catch (e) {
      return 'English';
    }
  });

  const [multiScheduleReminder, setMultiScheduleReminderState] = useState(() => {
    try {
      return localStorage.getItem('aisa_multi_schedule_reminder') || 'Enabled';
    } catch (e) {
      return 'Enabled';
    }
  });

  // Target data for redirecting from Calendar or other modules directly into Content Studio
  const [studioTarget, setStudioTarget] = useState(null);

  // Pipeline Shared States
  const [brandDnaData, setBrandDnaData] = useState(null);
  const [seoSearchData, setSeoSearchData] = useState(null);
  const [generatedStrategy, setGeneratedStrategy] = useState(null);

  // Active Generated Content payload shared between Content Studio and Creative Studio
  const [generatedContent, setGeneratedContentState] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_last_generated_content');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const setGeneratedContent = (data) => {
    setGeneratedContentState(data);
    try {
      if (data) localStorage.setItem('aisa_last_generated_content', JSON.stringify(data));
      else localStorage.removeItem('aisa_last_generated_content');
    } catch (e) {}
  };

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailDigest: true,
    desktopPush: true,
    soundEffects: true,
    productUpdates: false,
  });

  const [dataControlPreferences, setDataControlPreferences] = useState({
    saveChatHistory: true,
    shareWorkspaceLinks: true,
    allowAnalytics: true,
  });

  const setAppearance = (val) => {
    setAppearanceState(val);
    try {
      localStorage.setItem('aisa_appearance', val);
    } catch (e) {}
  };

  const setAccentColor = (val) => {
    setAccentColorState(val);
    try {
      localStorage.setItem('aisa_accent_color', val);
    } catch (e) {}
  };

  const setRegion = (val) => {
    setRegionState(val);
    try {
      localStorage.setItem('aisa_region', val);
    } catch (e) {}
  };

  const setLanguage = (val) => {
    setLanguageState(val);
    try {
      localStorage.setItem('aisa_language', val);
    } catch (e) {}
  };

  const setMultiScheduleReminder = (val) => {
    setMultiScheduleReminderState(val);
    try {
      localStorage.setItem('aisa_multi_schedule_reminder', val);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setAppearance(nextTheme);
  };

  useEffect(() => {
    let effectiveTheme = appearance;
    if (appearance === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [appearance]);

  // Theme & Role
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_theme');
      return saved || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeRole, setActiveRole] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role || 'AgencyAdmin';
      }
    } catch (e) {}
    return 'AgencyAdmin';
  });

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('aisa_user', JSON.stringify(userData));
    if (userData.role) {
      setActiveRole(userData.role);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aisa_user');
    setIsSettingsModalOpen(false);
    setActiveModuleState('dashboard');
  };


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);
  
  // Workspace & Brand DNA Memory
  // Workspace & Brand DNA Memory - Persistent User State
  const [workspaces, setWorkspaces] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_workspaces');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
    try {
      return localStorage.getItem('aisa_active_ws_id') || '';
    } catch (e) {
      return '';
    }
  });

  // Keep localStorage synced whenever workspaces state changes
  useEffect(() => {
    try {
      localStorage.setItem('aisa_workspaces', JSON.stringify(workspaces));
    } catch (e) {}
  }, [workspaces]);

  useEffect(() => {
    try {
      if (activeWorkspaceId) {
        localStorage.setItem('aisa_active_ws_id', activeWorkspaceId);
      }
    } catch (e) {}
  }, [activeWorkspaceId]);

  // Sync workspaces from MongoDB Atlas Database on Page Load / Refresh / User Login
  useEffect(() => {
    const fetchWorkspacesFromDb = async () => {
      try {
        const email = user?.email || localStorage.getItem('aisa_user_email') || '';
        const url = email 
          ? `http://localhost:5000/api/workspace/list?userEmail=${encodeURIComponent(email)}`
          : 'http://localhost:5000/api/workspace/list';

        const res = await fetch(url, {
          headers: email ? { 'x-user-email': email } : {}
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.workspaces)) {
          if (data.workspaces.length > 0) {
            const formatted = data.workspaces.map(w => ({
              ...w,
              id: w._id || w.id,
              brandVoiceTone: w.brandVoiceTone || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative', 'Reliable'] },
              voiceGuidelines: w.voiceGuidelines || { formalityScore: 4, toneKeywords: w.brandVoiceTone?.toneKeywords || ['Professional', 'Innovative'] }
            }));
            setWorkspaces(formatted);
            setActiveWorkspaceId(prevId => {
              const exists = formatted.some(item => (item.id === prevId || item._id === prevId));
              return exists ? prevId : (formatted[0].id || formatted[0]._id);
            });
          } else {
            // DB is empty for this user account (user has created no brands yet)
            setWorkspaces([]);
            setActiveWorkspaceId('');
            try {
              localStorage.removeItem('aisa_workspaces');
              localStorage.removeItem('aisa_active_ws_id');
            } catch (e) {}
          }
        }
      } catch (err) {
        console.log('Workspace DB Fetch Note:', err.message);
      }
    };

    fetchWorkspacesFromDb();
  }, [user]);



  // Credits & Subscriptions
  const [credits, setCredits] = useState({
    tier: 'Agency',
    balance: 120,
    history: [
      { id: 'tx_001', type: 'MONTHLY_ALLOCATION', credits: 150, timestamp: '2026-07-01T00:00:00Z', note: 'Agency Plan Monthly Renewal' },
      { id: 'tx_002', type: 'DEDUCTION', credits: -10, timestamp: '2026-07-15T10:30:00Z', note: 'AI Carousel Visual Generation' }
    ]
  });

  const [approvalsQueue, setApprovalsQueue] = useState([
    {
      id: 'cnt_101',
      workspaceId: 'ws_001',
      title: 'How AI Ads Transforms Agency Content Production Velocity',
      type: 'BLOG',
      platform: 'Website Blog',
      status: 'APPROVED',
      wordCount: 2150,
      author: 'Senior Copywriter',
      approver: 'Client Marketing Director',
      factCheck: { passed: true, score: 100, status: 'VERIFIED', flags: [] },
      checks: {
        brandDna: { passed: true, score: 98, message: 'Strong alignment with brand voice.' },
        seo: { passed: true, score: 92, message: 'Keywords optimized correctly.' },
        strategy: { passed: true, score: 95, message: 'Matches Q3 campaign goals.' },
        fact: { passed: true, score: 100, message: 'All claims verified.' }
      },
      content: `# How AI Ads Transforms Agency Content Production Velocity\n\nIn today's fast-paced digital ecosystem, agencies are under immense pressure to deliver high-quality content at unprecedented speeds. Enter AI Ads, a game-changing platform designed to supercharge your content production workflow...\n\nBy leveraging advanced machine learning algorithms, AI Ads not only automates repetitive tasks but also ensures that every piece of content remains perfectly aligned with your unique Brand DNA.`,
      history: [
        { id: 'h1', action: 'Submitted for Review', by: 'Senior Copywriter', date: '2026-07-22T09:00:00Z' },
        { id: 'h2', action: 'Approved', by: 'Client Marketing Director', date: '2026-07-22T10:00:00Z', note: 'Looks great, ready to publish.' }
      ],
      createdAt: '2026-07-22T10:00:00Z',
      scheduledDate: '2026-07-28'
    },
    {
      id: 'cnt_102',
      workspaceId: 'ws_001',
      title: '5 Steps to Build Bulletproof Brand DNA in 2026',
      type: 'SOCIAL',
      platform: 'LinkedIn',
      status: 'PENDING',
      author: 'Brand Strategist',
      factCheck: { passed: true, score: 95, status: 'VERIFIED', flags: [] },
      checks: {
        brandDna: { passed: true, score: 95, message: 'Tone is professional and engaging.' },
        seo: { passed: true, score: 88, message: 'Good use of hashtags.' },
        strategy: { passed: false, score: 70, message: 'Missing CTA for the upcoming webinar.' },
        fact: { passed: true, score: 100, message: 'No factual claims made.' }
      },
      content: `Is your Brand DNA ready for the challenges of 2026? 🚀\n\nBuilding a bulletproof brand identity requires more than just a logo and a color palette. It demands a deep understanding of your core values, your target audience's evolving needs, and a consistent voice across all channels.\n\nHere are 5 actionable steps you can take today to fortify your brand's foundation:\n1. Revisit your core mission statement...\n\nSwipe through our latest carousel to learn more!`,
      history: [
        { id: 'h1', action: 'Submitted for Review', by: 'Brand Strategist', date: '2026-07-24T14:30:00Z' }
      ],
      createdAt: '2026-07-24T14:30:00Z',
      scheduledDate: '2026-07-29'
    },
    {
      id: 'cnt_103',
      workspaceId: 'ws_001',
      title: 'Unlocking 400% ROI With Multi-Tenant Campaign Operations',
      type: 'BLOG',
      platform: 'Medium',
      status: 'RED_FLAG_CITATION_NEEDED',
      wordCount: 1800,
      author: 'Gemini 3.5 Editorial Engine',
      factCheck: {
        passed: false,
        score: 60,
        status: 'RED_FLAG_CITATION_NEEDED',
        flags: [{ type: 'UNSUPPORTED_STATISTIC', severity: 'HIGH', message: 'Unverified statistical claim found: "400% ROI". Requires verified source citation.' }]
      },
      checks: {
        brandDna: { passed: true, score: 90, message: 'Tone is authoritative.' },
        seo: { passed: true, score: 96, message: 'Excellent keyword density.' },
        strategy: { passed: true, score: 94, message: 'Matches ROI focus.' },
        fact: { passed: false, score: 60, message: 'Unverified statistic: "400% ROI".' }
      },
      content: `# Unlocking 400% ROI With Multi-Tenant Campaign Operations\n\nManaging multiple client campaigns simultaneously has traditionally been a logistical nightmare for large-scale agencies. However, recent data suggests that adopting a multi-tenant operational model can increase your overall return on investment by a staggering 400%.\n\nThis article explores the architectural shifts required to achieve such unprecedented growth, focusing on unified dashboards, centralized asset management, and AI-driven automation.`,
      history: [
        { id: 'h1', action: 'Generated via AI', by: 'Gemini 3.5', date: '2026-07-25T08:00:00Z' },
        { id: 'h2', action: 'Requested Revision', by: 'Agency Admin', date: '2026-07-25T09:15:00Z', note: 'We need to cite the source for the 400% ROI claim before publishing.' }
      ],
      createdAt: '2026-07-25T09:15:00Z',
      scheduledDate: '2026-08-05'
    }
  ]);

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState([]);

  const [isQuickPostOpen, setIsQuickPostOpen] = useState(false);
  const [isScraperOpen, setIsScraperOpen] = useState(false);
  const [scraperMode, setScraperMode] = useState('NEW_BRAND'); // 'ACTIVE_BRAND' or 'NEW_BRAND'
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isAISAAssistantOpen, setIsAISAAssistantOpen] = useState(false);

  const openScraperModal = (mode = 'NEW_BRAND') => {
    setScraperMode(mode);
    setIsScraperOpen(true);
  };

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Brand DNA synced for UWO AI Ads', time: '10m ago', unread: true },
    { id: 2, text: 'Blog draft flagged: Citation Needed', time: '1h ago', unread: true }
  ]);
  const [userAvatar, setUserAvatar] = useState(null);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId || w._id === activeWorkspaceId) || workspaces[0] || {
    id: 'ws_empty',
    brandName: 'No Brand Loaded',
    domainUrl: 'https://',
    logoUrl: '',
    brandColors: ['#6366F1', '#8B5CF6'],
    targetAudience: [],
    brandVoiceTone: { formalityScore: 3, toneKeywords: [] },
    competitorLandscape: [],
    contentPillars: [],
    socialMediaPresence: [],
    contactInfo: { email: '', phone: '', location: '' },
    industryCategory: 'General',
    missionStatement: '',
    tagline: '',
    approvedClaims: [],
    restrictedClaims: []
  };

  const addWorkspace = async (newWs) => {
    try {
      const email = user?.email || localStorage.getItem('aisa_user_email') || '';
      const payload = { ...newWs, userEmail: email };

      // Persist workspace to MongoDB Atlas ONLY when user clicks "Save & Lock Brand DNA Memory"
      const res = await fetch('http://localhost:5000/api/workspace/save-dna', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': email
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.workspace) {
        const savedDoc = {
          ...data.workspace,
          id: data.workspace._id || data.workspace.id || `ws_${Date.now()}`,
          brandVoiceTone: data.workspace.brandVoiceTone || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative', 'Reliable'] },
          voiceGuidelines: data.workspace.voiceGuidelines || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative'] }
        };
        setWorkspaces(prev => {
          const exists = prev.some(w => (w.id === savedDoc.id || w._id === savedDoc.id));
          if (exists) return prev.map(w => (w.id === savedDoc.id || w._id === savedDoc.id) ? savedDoc : w);
          return [savedDoc, ...prev];
        });
        setActiveWorkspaceId(savedDoc.id);
        return savedDoc;
      }
    } catch (e) {
      console.log('Workspace Save DNA Error:', e.message);
    }

    // Local Fallback if offline
    const formatted = {
      ...newWs,
      id: newWs._id || newWs.id || `ws_${Date.now()}`,
      brandVoiceTone: newWs.brandVoiceTone || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative', 'Reliable'] },
      voiceGuidelines: newWs.voiceGuidelines || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative'] }
    };
    setWorkspaces(prev => {
      const exists = prev.some(w => (w.id === formatted.id || w._id === formatted.id));
      if (exists) return prev;
      return [formatted, ...prev];
    });
    setActiveWorkspaceId(formatted.id);
    return formatted;
  };


  const updateWorkspace = async (id, updatedData) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/workspace/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && data.workspace) {
        const updatedDoc = { ...data.workspace, id: data.workspace._id || data.workspace.id || id };
        setWorkspaces(prev => prev.map(w => (w.id === id || w._id === id) ? updatedDoc : w));
        return;
      }
    } catch (e) {
      console.log('Workspace Update Note:', e.message);
    }
    setWorkspaces(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, ...updatedData } : w));
  };



  const deleteWorkspace = async (idToDelete) => {
    if (!idToDelete) return;
    try {
      await fetch(`http://localhost:5000/api/workspace/${idToDelete}`, { method: 'DELETE' });
    } catch (e) {
      console.log('Workspace Delete Note:', e.message);
    }
    const updated = workspaces.filter(w => w.id !== idToDelete && w._id !== idToDelete);
    setWorkspaces(updated);
    if (activeWorkspaceId === idToDelete || activeWorkspace?._id === idToDelete) {
      if (updated.length > 0) {
        setActiveWorkspaceId(updated[0].id || updated[0]._id);
      }
    }
  };


  const deductVisualCredits = (cost = 5, reason = 'AI Visual Synthesis') => {
    if (credits.balance < cost) {
      alert(`Insufficient visual credits. Current balance: ${credits.balance}, required: ${cost}. Please top up.`);
      return false;
    }
    setCredits(prev => ({
      ...prev,
      balance: prev.balance - cost,
      history: [{ id: `tx_${Date.now()}`, type: 'DEDUCTION', credits: -cost, timestamp: new Date().toISOString(), note: reason }, ...prev.history]
    }));
    return true;
  };

  const topUpCredits = (amount = 50, packName = '50 Credit Pack') => {
    setCredits(prev => ({
      ...prev,
      balance: prev.balance + amount,
      history: [{ id: `tx_${Date.now()}`, type: 'PURCHASE', credits: amount, timestamp: new Date().toISOString(), note: `Razorpay: ${packName}` }, ...prev.history]
    }));
  };

  const updateApprovalStatus = (id, newStatus, comment = '') => {
    setApprovalsQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus, reviewerComment: comment } : item));
  };

  const addCalendarEvent = (event) => {
    setCalendarEvents(prev => [{ id: `cal_${Date.now()}_${Math.random()}`, ...event }, ...prev]);
  };

  const bulkAddCalendarEvents = (events) => {
    const newEvents = events.map((event, i) => ({
      id: `cal_${Date.now()}_${i}_${Math.random()}`,
      ...event
    }));
    setCalendarEvents(prev => [...newEvents, ...prev]);
  };

  return (
    <WorkspaceContext.Provider value={{
      activeModule, setActiveModule, goBack, canGoBack, navigationHistory,
      theme, toggleTheme,
      user, loginUser, logout,
      activeRole, setActiveRole,
      workspaces, activeWorkspaceId, setActiveWorkspaceId, activeWorkspace, addWorkspace, updateWorkspace, deleteWorkspace,

      credits, deductVisualCredits, topUpCredits,
      approvalsQueue, setApprovalsQueue, updateApprovalStatus,
      calendarEvents, setCalendarEvents, addCalendarEvent, bulkAddCalendarEvents,
      isQuickPostOpen, setIsQuickPostOpen,
      isScraperOpen, setIsScraperOpen, scraperMode, setScraperMode, openScraperModal,

      isCreditModalOpen, setIsCreditModalOpen,
      isAISAAssistantOpen, setIsAISAAssistantOpen,
      notifications, setNotifications,
      userAvatar, setUserAvatar,

      // New Account Settings Modal & Personalization
      isSettingsModalOpen, setIsSettingsModalOpen,
      activeSettingsTab, setActiveSettingsTab,
      appearance, setAppearance,
      accentColor, setAccentColor,
      region, setRegion,
      language, setLanguage,
      multiScheduleReminder, setMultiScheduleReminder,
      notificationPreferences, setNotificationPreferences,
      dataControlPreferences, setDataControlPreferences,
      studioTarget, setStudioTarget,
      generatedContent, setGeneratedContent,

      // End-to-End Pipeline State & Actions
      brandDnaData, setBrandDnaData,
      seoSearchData, setSeoSearchData,
      generatedStrategy, setGeneratedStrategy,
      sendContentToApprovals: (payload) => {
        const newItem = {
          id: `cnt_${Date.now()}`,
          workspaceId: activeWorkspaceId || 'ws_001',
          title: payload.topic || payload.title || payload.subject || payload.headline || 'Generated Marketing Post',
          type: (payload.type || payload.postType || 'SOCIAL').toUpperCase(),
          platform: payload.platform || 'instagram',
          status: 'PENDING',
          author: 'Content Studio AI',
          content: payload.caption || payload.longCaption || payload.body || payload.leadParagraph || '',
          payload: payload,
          createdAt: new Date().toISOString(),
          scheduledDate: payload.scheduledDate || new Date().toISOString().split('T')[0],
          checks: {
            brandDna: { passed: true, score: 98, message: 'Aligned with Brand DNA.' },
            seo: { passed: true, score: 95, message: 'Optimized keywords.' },
            strategy: { passed: true, score: 96, message: 'Campaign goal matched.' },
            fact: { passed: true, score: 100, message: 'No citations needed.' }
          }
        };
        setApprovalsQueue(prev => [newItem, ...prev]);
        setActiveModule('approvals');
      },
      approveAndSendToCreative: (item) => {
        const updatedQueue = approvalsQueue.map(i =>
          (i.id === item.id || i._id === item._id) ? { ...i, status: 'APPROVED' } : i
        );
        setApprovalsQueue(updatedQueue);

        const contentPayload = item.payload || {
          topic: item.title,
          type: item.type,
          platform: item.platform,
          hook: item.title,
          caption: item.content,
          shortCaption: item.content?.slice(0, 100),
          longCaption: item.content,
          cta: 'Click link to learn more!',
          hashtags: ['#AIMarketing', '#BrandDNA', '#Growth']
        };

        setGeneratedContent(contentPayload);
        setStudioTarget(contentPayload);
        setActiveModule('creative');
      }
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);

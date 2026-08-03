import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  // Navigation & History Tracking
  const [activeModule, setActiveModuleState] = useState('dashboard');
  const [navigationHistory, setNavigationHistory] = useState([]);

  const setActiveModule = (newModule) => {
    if (newModule !== activeModule) {
      setNavigationHistory(prev => [...prev, activeModule]);
      setActiveModuleState(newModule);
    }
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const prevModule = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setActiveModuleState(prevModule);
    } else if (activeModule !== 'dashboard') {
      setActiveModuleState('dashboard');
    }
  };

  const canGoBack = navigationHistory.length > 0 || activeModule !== 'dashboard';
  
  // Theme & Role
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_theme');
      return saved || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  const [activeRole, setActiveRole] = useState('AgencyAdmin');

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

  // Sync workspaces from MongoDB Atlas Database on Page Load / Refresh
  useEffect(() => {
    const fetchWorkspacesFromDb = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/workspace/list');
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
            // DB is empty (user deleted all brands)
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
  }, []);



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
      status: 'APPROVED',
      wordCount: 2150,
      author: 'Senior Copywriter',
      approver: 'Client Marketing Director',
      factCheck: { passed: true, score: 100, status: 'VERIFIED', flags: [] },
      createdAt: '2026-07-22T10:00:00Z',
      scheduledDate: '2026-07-28'
    },
    {
      id: 'cnt_102',
      workspaceId: 'ws_001',
      title: '5 Steps to Build Bulletproof Brand DNA in 2026',
      type: 'SOCIAL',
      platform: 'LinkedIn',
      status: 'INTERNAL_REVIEW',
      author: 'Brand Strategist',
      factCheck: { passed: true, score: 95, status: 'VERIFIED', flags: [] },
      createdAt: '2026-07-24T14:30:00Z',
      scheduledDate: '2026-07-29'
    },
    {
      id: 'cnt_103',
      workspaceId: 'ws_001',
      title: 'Unlocking 400% ROI With Multi-Tenant Campaign Operations',
      type: 'BLOG',
      status: 'RED_FLAG_CITATION_NEEDED',
      wordCount: 1800,
      author: 'Gemini 3.5 Editorial Engine',
      factCheck: {
        passed: false,
        score: 60,
        status: 'RED_FLAG_CITATION_NEEDED',
        flags: [{ type: 'UNSUPPORTED_STATISTIC', severity: 'HIGH', message: 'Unverified statistical claim found: "400% ROI". Requires verified source citation.' }]
      },
      createdAt: '2026-07-25T09:15:00Z'
    }
  ]);

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 'cal_1', title: 'SEO Pillar Launch: Content Velocity', date: '2026-07-27', platform: 'Blog', pillar: 'Enterprise AI', status: 'SCHEDULED', owner: 'SEO Lead' },
    { id: 'cal_2', title: 'LinkedIn Carousel: Brand DNA 101', date: '2026-07-28', platform: 'LinkedIn', pillar: 'Brand Governance', status: 'APPROVED', owner: 'Senior Copywriter' },
    { id: 'cal_3', title: 'Reel Script: Stop Fragmentation', date: '2026-07-30', platform: 'Instagram', pillar: 'Social Studio Ops', status: 'DRAFT', owner: 'Content Writer' }
  ]);

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


  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('aisa_theme', nextTheme);
  };

  const addWorkspace = async (newWs) => {
    try {
      // Persist workspace to MongoDB Atlas ONLY when user clicks "Save & Lock Brand DNA Memory"
      const res = await fetch('http://localhost:5000/api/workspace/save-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWs)
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
    setCalendarEvents(prev => [{ id: `cal_${Date.now()}`, ...event }, ...prev]);
  };

  return (
    <WorkspaceContext.Provider value={{
      activeModule, setActiveModule, goBack, canGoBack, navigationHistory,
      theme, toggleTheme,
      activeRole, setActiveRole,
      workspaces, activeWorkspaceId, setActiveWorkspaceId, activeWorkspace, addWorkspace, updateWorkspace, deleteWorkspace,

      credits, deductVisualCredits, topUpCredits,
      approvalsQueue, setApprovalsQueue, updateApprovalStatus,
      calendarEvents, addCalendarEvent,
      isQuickPostOpen, setIsQuickPostOpen,
      isScraperOpen, setIsScraperOpen, scraperMode, setScraperMode, openScraperModal,

      isCreditModalOpen, setIsCreditModalOpen,
      isAISAAssistantOpen, setIsAISAAssistantOpen,
      notifications, setNotifications,
      userAvatar, setUserAvatar
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);

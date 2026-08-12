import React, { useState, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Settings, 
  Search, 
  Sparkles, 
  Bell, 
  Database, 
  User, 
  CreditCard, 
  LogOut, 
  X, 
  Monitor, 
  Palette, 
  Globe, 
  Languages, 
  Clock, 
  ChevronRight, 
  Check, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Camera, 
  Image, 
  Key, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  Volume2, 
  Sliders
} from 'lucide-react';

export const SettingsModal = () => {
  const { 
    isSettingsModalOpen, 
    setIsSettingsModalOpen,
    activeSettingsTab,
    setActiveSettingsTab,
    appearance, 
    setAppearance,
    accentColor, 
    setAccentColor,
    region, 
    setRegion,
    language, 
    setLanguage,
    multiScheduleReminder, 
    setMultiScheduleReminder,
    notificationPreferences,
    setNotificationPreferences,
    dataControlPreferences,
    setDataControlPreferences,
    userAvatar, 
    setUserAvatar,
    user, 
    logout,
    credits,
    setIsCreditModalOpen
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Password Visibility State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  if (!isSettingsModalOpen) return null;

  const getUserName = (u) => {
    if (!u?.email) return 'Agency User';
    const prefix = u.email.split('@')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  };

  const navItems = [
    { id: 'personalization', label: 'Personalization', icon: Sparkles },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'datacontrols', label: 'Data controls', icon: Database },
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
  ];

  const accentColorOptions = [
    { id: 'default', label: 'Default', hex: '#6366f1' },
    { id: 'purple', label: 'Electric Purple', hex: '#a855f7' },
    { id: 'blue', label: 'Ocean Blue', hex: '#0284c7' },
    { id: 'emerald', label: 'Emerald Green', hex: '#10b981' },
    { id: 'amber', label: 'Sunset Amber', hex: '#f59e0b' },
    { id: 'rose', label: 'Rose Pink', hex: '#f43f5e' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Unable to access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.translate(canvasRef.current.width, 0);
      context.scale(-1, 1);
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setUserAvatar(dataUrl);
      stopCamera();
    }
  };

  const triggerExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      user: user?.email,
      appearance,
      accentColor,
      region,
      language,
      exportedAt: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aisa_workspace_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter check for search query
  const matchesSearch = (text) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800/80 rounded-[28px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[580px] max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar */}
        <div className="w-full md:w-72 bg-slate-50/80 dark:bg-[#0a0e1a] border-r border-slate-200 dark:border-slate-800/80 p-5 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-4">
            {/* Modal Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/20">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h2>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              />
            </div>

            {/* Navigation List */}
            <nav className="space-y-1 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSettingsTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSettingsTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-brand-500 translate-x-0.5' : 'text-slate-400 opacity-60'}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Logout Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={logout}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              LOG OUT
            </button>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0d1322] relative overflow-hidden">
          {/* Header Bar */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white capitalize">
                {navItems.find(i => i.id === activeSettingsTab)?.label || 'Personalization'}
              </h3>
            </div>
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* PERSONALIZATION TAB */}
            {activeSettingsTab === 'personalization' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* 1. Appearance */}
                {matchesSearch('appearance layout theme dark light system') && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Appearance</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Choose your preferred layout theme.</p>
                    </div>
                    <div className="relative min-w-[170px]">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <select
                        value={appearance}
                        onChange={(e) => setAppearance(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-white dark:bg-[#151c2e] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none shadow-sm"
                      >
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Accent Color */}
                {matchesSearch('accent color theme brand identity color') && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Accent color</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Personalize your AI's identity color.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Active color circle preview */}
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: accentColorOptions.find(o => o.id === accentColor)?.hex || '#6366f1' }}
                      />
                      <div className="relative min-w-[170px]">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <Palette className="w-4 h-4" />
                        </div>
                        <select
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-white dark:bg-[#151c2e] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none shadow-sm"
                        >
                          {accentColorOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Region */}
                {matchesSearch('region filter language country india us uk global') && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Region</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Filter languages by region.</p>
                    </div>
                    <div className="relative min-w-[170px]">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-white dark:bg-[#151c2e] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none shadow-sm"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Global">Global</option>
                        <option value="Europe">Europe</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Language */}
                {matchesSearch('language english hindi spanish french german dashboard') && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Language</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select your preferred dashboard language.</p>
                    </div>
                    <div className="relative min-w-[170px]">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Languages className="w-4 h-4" />
                      </div>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-white dark:bg-[#151c2e] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none shadow-sm"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Spanish">Spanish (Español)</option>
                        <option value="French">French (Français)</option>
                        <option value="German">German (Deutsch)</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Multi Schedule Reminder */}
                {matchesSearch('multi schedule reminder alarms repeating') && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-brand-500" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Multi Schedule Reminder</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage all your repeating schedules and alarms here.</p>
                    </div>
                    <div className="relative min-w-[170px]">
                      <select
                        value={multiScheduleReminder}
                        onChange={(e) => setMultiScheduleReminder(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-[#151c2e] border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/50 appearance-none shadow-sm"
                      >
                        <option value="Enabled">Enabled (All Alarms)</option>
                        <option value="Disabled">Disabled</option>
                        <option value="Priority Only">Priority Reminders Only</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeSettingsTab === 'notifications' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Email Digest</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive weekly summaries of brand analytics and campaign performance.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.emailDigest}
                    onChange={(e) => setNotificationPreferences({...notificationPreferences, emailDigest: e.target.checked})}
                    className="w-5 h-5 text-brand-600 accent-brand-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Desktop Push Alerts</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Instant notifications for post approvals and AI scraper finishes.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.desktopPush}
                    onChange={(e) => setNotificationPreferences({...notificationPreferences, desktopPush: e.target.checked})}
                    className="w-5 h-5 text-brand-600 accent-brand-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sound Effects</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Play audio chime on AI generation completion.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPreferences.soundEffects}
                    onChange={(e) => setNotificationPreferences({...notificationPreferences, soundEffects: e.target.checked})}
                    className="w-5 h-5 text-brand-600 accent-brand-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* DATA CONTROLS TAB */}
            {activeSettingsTab === 'datacontrols' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Save AI Chat History</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Retain session context for multi-brand campaign optimization.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dataControlPreferences.saveChatHistory}
                    onChange={(e) => setDataControlPreferences({...dataControlPreferences, saveChatHistory: e.target.checked})}
                    className="w-5 h-5 text-brand-600 accent-brand-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Export Workspace Data</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Download your settings, active brands, and logs as JSON.</p>
                  </div>
                  <button
                    onClick={triggerExportData}
                    className="px-3.5 py-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-xs border border-brand-500/20 hover:bg-brand-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeSettingsTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center border-2 border-brand-500/30">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getUserName(user)}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input type="text" defaultValue={getUserName(user)} className="w-full glass-input text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input type="email" defaultValue={user?.email || ''} readOnly className="w-full glass-input text-xs bg-slate-100 dark:bg-slate-800/40 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            )}

            {/* BILLING TAB */}
            {activeSettingsTab === 'billing' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-600/10 to-purple-600/10 border border-brand-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider">Current Active Plan</span>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Agency Pro ($799/mo)</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Visual Credits: <strong className="text-brand-500">{credits?.balance || 250}</strong> remaining</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSettingsModalOpen(false);
                      setIsCreditModalOpen(true);
                    }}
                    className="btn-primary text-xs"
                  >
                    Top Up Credits
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex justify-end gap-3">
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

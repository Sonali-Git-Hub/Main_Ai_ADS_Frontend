import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Building2, 
  ShieldCheck, 
  ChevronDown,
  Plus,
  User,
  Users,
  UserCheck,
  ArrowLeft,
  Trash2,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export const Header = () => {
  const { 
    workspaces, 
    activeWorkspace, 
    setActiveWorkspaceId, 
    deleteWorkspace,
    theme, 
    toggleTheme, 
    credits, 
    setIsCreditModalOpen,
    setIsScraperOpen,
    openScraperModal,
    setIsAISAAssistantOpen,
    setIsSettingsModalOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,

    goBack,
    canGoBack,
    activeModule,
    setActiveModule,
    userAvatar,
    user,
    logout,
    t
  } = useWorkspace();

  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const workspaceRef = useRef(null);
  const profileRef = useRef(null);

  const getUserDisplayName = () => {
    try {
      const savedName = localStorage.getItem('aisa_user_name');
      if (savedName) return savedName;
    } catch(e){}
    if (user?.name) return user.name;
    if (user?.fullName) return user.fullName;
    if (user?.email) {
      const prefix = user.email.split('@')[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return 'Agency User';
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target)) {
        setShowWorkspaceMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-white/80 dark:bg-[#070b19]/80 backdrop-blur-xl sticky top-0 z-30 transition-colors w-full overflow-x-clip">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 h-full flex items-center justify-between gap-1 sm:gap-4">
        {/* Left: Mobile Toggle, Back Button & Workspace Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
        {/* Mobile Navigation Drawer Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-400 transition-colors shrink-0 shadow-2xs"
          title="Toggle Mobile Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-brand-500" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        {/* Universal Back Button */}
        {canGoBack && (
          <button 
            onClick={goBack}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 hover:bg-brand-500/10 text-slate-800 dark:text-slate-200 hover:text-brand-500 dark:hover:text-brand-400 font-bold text-xs transition-all shadow-xs hover:shadow-sm group shrink-0"
            title="Go to previous page"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500 group-hover:-translate-x-0.5 transition-transform shrink-0" />
            <span className="hidden sm:inline">{t('back', 'Back')}</span>
          </button>
        )}

        <div className="relative min-w-0 shrink" ref={workspaceRef}>
          <button 
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 shadow-xs hover:shadow-md transition-all text-left max-w-full"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs p-0.5 sm:p-1">
              {activeWorkspace?.logoUrl || activeWorkspace?.faviconUrl ? (
                <img src={activeWorkspace.logoUrl || activeWorkspace.faviconUrl} alt={activeWorkspace.brandName} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500" />
              )}
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 block truncate max-w-[75px] min-[380px]:max-w-[100px] min-[440px]:max-w-[140px] sm:max-w-[180px] md:max-w-[220px]">
                {activeWorkspace?.brandName}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
          </button>

          {/* Workspace Dropdown */}
          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] glass-card bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('workspaces', 'Workspaces')}</div>
              {workspaces.map(ws => {
                const wsId = ws.id || ws._id;
                const isActive = wsId === (activeWorkspace.id || activeWorkspace._id);
                return (
                  <div
                    key={wsId}
                    onClick={() => {
                      setActiveWorkspaceId(wsId);
                      setShowWorkspaceMenu(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between group/ws text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${isActive ? 'text-brand-400 font-medium bg-brand-500/10' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {ws.logoUrl || ws.faviconUrl ? (
                        <img src={ws.logoUrl || ws.faviconUrl} alt={ws.brandName} className="w-5 h-5 rounded-lg object-contain bg-white shrink-0 border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <Building2 className="w-4 h-4 text-brand-400 shrink-0" />
                      )}
                      <span className="truncate">{ws.brandName}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorkspace(wsId);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-70 hover:opacity-100"
                      title={`Delete ${ws.brandName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              <div className="border-t border-slate-200 dark:border-slate-800 mt-1 pt-1 px-2">
                <button 
                  onClick={() => {
                    setShowWorkspaceMenu(false);
                    if (openScraperModal) openScraperModal('NEW_BRAND');
                    else setIsScraperOpen(true);
                  }}
                  className="w-full py-2 px-3 flex items-center gap-2 text-xs font-medium text-brand-500 hover:bg-brand-500/10 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('autoScrapeNewBrandDna', '+ Auto Scrape New Brand DNA')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 ml-auto sm:ml-0">
        {/* Profile Button & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              showProfileMenu || activeModule === 'settings'
                ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-500/10 dark:border-brand-500/30 dark:text-brand-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            title="User Profile Menu"
          >
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover" />
            ) : (
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-60 max-w-[calc(100vw-1.5rem)] glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t('signedInAs', 'Signed In As')}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">{getUserDisplayName()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="inline-block text-[10px] bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-extrabold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/30 uppercase">
                    {user?.plan ? `${user.plan} Tier` : 'Free Tier'}
                  </span>
                  <span className="inline-block text-[10px] bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {t('activeAccount', 'Active Account')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsSettingsModalOpen(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  {t('accountSettings', 'Account Settings')}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left py-2 px-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors text-xs font-semibold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  {t('signOut', 'Sign Out')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
  );
};

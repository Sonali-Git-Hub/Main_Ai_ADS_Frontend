import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  LayoutGrid, 
  Dna, 
  Search, 
  Target, 
  Layers, 
  Calendar, 
  PenTool, 
  CheckCircle2, 
  Palette, 
  FolderKanban, 
  Globe, 
  Settings, 
  X,
  Sun,
  Moon,
  LogOut,
  User,
  ChevronUp
} from 'lucide-react';

export const Sidebar = ({ isMobileMenuOpen: propIsMobile, setIsMobileMenuOpen: propSetIsMobile }) => {
  const { 
    activeModule, 
    setActiveModule, 
    setIsSettingsModalOpen, 
    isMobileMenuOpen: contextIsMobile,
    setIsMobileMenuOpen: contextSetIsMobile,
    user,
    userAvatar,
    activeWorkspace,
    theme,
    toggleTheme,
    logout,
    t 
  } = useWorkspace();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileCardRef = useRef(null);

  const isMobileMenuOpen = propIsMobile !== undefined ? propIsMobile : contextIsMobile;
  const setIsMobileMenuOpen = propSetIsMobile || contextSetIsMobile;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileCardRef.current && !profileCardRef.current.contains(e.target)) {
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

  const modules = [
    { id: 'dashboard', label: t('dashboard', '1. Dashboard'), icon: LayoutGrid },
    { id: 'brands', label: t('brands', '2. Brand DNA'), icon: Dna },
    { id: 'seo', label: t('seo', '3. SEO Intelligence'), icon: Search },
    { id: 'strategy', label: t('strategy', '4. Strategy'), icon: Target },
    { id: 'campaigns', label: t('campaigns', '5. Campaigns'), icon: Layers },
    { id: 'calendar', label: t('calendar', '6. Calendar'), icon: Calendar },
    { id: 'studio', label: t('studio', '7. Content Studio'), icon: PenTool },
    { id: 'approvals', label: t('approvals', '8. Approvals Desk'), icon: CheckCircle2 },
    { id: 'creative', label: t('creative', '9. Creative Studio'), icon: Palette },
    { id: 'assets', label: t('assets', '10. Asset Library'), icon: FolderKanban },
    { id: 'websiteBuilder', label: t('websiteBuilder', '11. AI Website Builder'), icon: Globe },
    { id: 'settings', label: t('settings', '12. Settings & Billing'), icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveModule(id);
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
    if (id === 'settings') {
      setIsSettingsModalOpen(true);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in transition-opacity"
        />
      )}

      <aside className={`h-screen bg-white dark:bg-[#0b0f19] shadow-[8px_0_30px_rgba(0,0,0,0.03)] dark:shadow-[8px_0_30px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-all duration-300 z-50 fixed lg:sticky top-0 left-0 w-64 select-none ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Header / Logo */}
          <div className="h-20 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="AI ADS™ Logo" 
                className="w-12 h-12 sm:w-13 sm:h-13 object-contain shrink-0 drop-shadow-sm" 
              />
              <div className="min-w-0 flex-1 flex items-center">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent leading-none">
                  AI Ads
                </span>
                <sup className="text-xs font-extrabold text-cyan-400 ml-1 font-sans -mt-3">TM</sup>
              </div>
            </div>

            {/* Mobile close button */}
            {isMobileMenuOpen && (
              <button 
                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Close Navigation Menu"
              >
                <X className="w-4 h-4 text-brand-500" />
              </button>
            )}
          </div>

          {/* Clean Navigation Item List */}
          <nav className="px-3 py-3 space-y-1 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleNavClick(m.id)}
                  className={`w-full relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] transition-all duration-200 text-left group ${
                    isActive 
                      ? 'bg-gradient-to-r from-brand-500/15 via-brand-500/10 to-blue-500/10 text-brand-600 dark:text-brand-400 font-semibold shadow-[0_4px_16px_rgba(123,97,255,0.12)] border-0' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-brand-500/10 hover:pl-4 font-medium'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-cyan-400 via-brand-500 to-indigo-600 shadow-[0_0_10px_var(--brand-glow,#7B61FF)]" />
                  )}
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive 
                      ? 'text-brand-600 dark:text-brand-400' 
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`} />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Sidebar Container: User Profile Card */}
          <div className="p-3 bg-white dark:bg-[#0b0f19] shrink-0 space-y-2.5 relative" ref={profileCardRef}>
            {/* Floating Profile & Account Dropdown Popover */}
            {showProfileMenu && (
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-[#0b0f19] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 p-3.5 z-50 animate-in fade-in slide-in-from-bottom-2 space-y-3 backdrop-blur-xl">
                <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5">
                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-extrabold uppercase tracking-wider">{t('signedInAs', 'Signed In As')}</p>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                    {user?.name || user?.fullName || user?.email?.split('@')[0] || 'Agency Admin'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email || 'admin@agency.ai'}</p>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="inline-block text-[9.5px] bg-brand-500/15 text-brand-600 dark:text-brand-400 font-extrabold px-2.5 py-0.5 rounded-full border border-brand-500/30 uppercase tracking-wide">
                      {user?.plan ? `${user.plan} Tier` : 'Enterprise Suite'}
                    </span>
                    <span className="inline-block text-[9.5px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                      {t('activeAccount', 'Active')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsSettingsModalOpen(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left py-2 px-2.5 hover:bg-brand-500/10 dark:hover:bg-brand-500/20 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl transition-all text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 group/item"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-brand-500 transition-colors" />
                    {t('accountSettings', 'Account Settings')}
                  </button>

                  {logout && (
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left py-2 px-2.5 hover:bg-red-500/10 text-red-500 rounded-xl transition-all text-xs font-bold flex items-center gap-2 mt-0.5"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      {t('signOut', 'Sign Out')}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Active User / Workspace Footer Card (Clickable to trigger popover) */}
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 shadow-xs hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer select-none group"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                  {userAvatar ? (
                    <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (user?.name || user?.email || 'A').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-bold text-slate-900 dark:text-white truncate leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {user?.name || user?.email?.split('@')[0] || 'Agency Admin'}
                  </p>
                  <p className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.role === 'SuperAdmin' ? 'Super Admin' : activeWorkspace?.name || 'Enterprise Suite'}
                  </p>
                </div>
              </div>

              {/* Direct Theme Switcher Button (Sun / Moon) in place of angular bracket */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTheme();
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all shrink-0 ml-1 cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:scale-110 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};



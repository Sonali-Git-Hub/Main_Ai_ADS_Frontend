import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Building2, 
  Sparkles, 
  Sun, 
  Moon, 
  Bell, 
  ShieldCheck, 
  ChevronDown,
  Plus,
  User,
  UserCheck,
  ArrowLeft
} from 'lucide-react';

export const Header = () => {
  const { 
    workspaces, 
    activeWorkspace, 
    setActiveWorkspaceId, 
    activeRole, 
    setActiveRole, 
    theme, 
    toggleTheme, 
    credits, 
    setIsCreditModalOpen,
    setIsScraperOpen,
    notifications,
    goBack,
    canGoBack,
    activeModule,
    setActiveModule,
    userAvatar
  } = useWorkspace();

  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const roles = [
    { id: 'AgencyAdmin', label: 'Agency Administrator' },
    { id: 'Strategist', label: 'Brand Strategist' },
    { id: 'SEOSpecialist', label: 'SEO Operations Lead' },
    { id: 'Writer', label: 'Senior Copywriter' },
    { id: 'Compliance', label: 'Compliance & Legal' },
    { id: 'ClientReviewer', label: 'Client Portal User' }
  ];

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Back Button & Workspace Switcher */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Universal Back Button */}
        {canGoBack && (
          <button 
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 hover:bg-[#7B61FF]/10 text-slate-800 dark:text-slate-200 hover:text-[#7B61FF] dark:hover:text-[#A882FF] font-bold text-xs transition-all shadow-sm group"
            title="Go to previous page"
          >
            <ArrowLeft className="w-4 h-4 text-[#7B61FF] group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        <div className="relative">
          <button 
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 bg-slate-100/70 dark:bg-slate-900/80 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-xs overflow-hidden">
              {activeWorkspace?.logoUrl ? (
                <img src={activeWorkspace.logoUrl} alt={activeWorkspace.brandName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-4 h-4 text-brand-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100">{activeWorkspace?.brandName}</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 bg-brand-500/20 text-brand-400 rounded-full font-medium hidden sm:inline">Brand DNA</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[100px] sm:max-w-[140px]">{activeWorkspace?.domainUrl}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
          </button>

          {/* Workspace Dropdown */}
          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspaces</div>
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspaceId(ws.id);
                    setShowWorkspaceMenu(false);
                  }}
                  className={`w-full px-3 py-2 flex items-center gap-3 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ${ws.id === activeWorkspace.id ? 'text-brand-400 font-medium bg-brand-500/10' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <Building2 className="w-4 h-4 text-brand-400" />
                  <span className="truncate">{ws.brandName}</span>
                </button>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-800 mt-1 pt-1 px-2">
                <button 
                  onClick={() => {
                    setShowWorkspaceMenu(false);
                    setIsScraperOpen(true);
                  }}
                  className="w-full py-2 px-3 flex items-center gap-2 text-xs font-medium text-brand-500 hover:bg-brand-500/10 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Auto Scrape New Brand DNA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Badge */}
        <div className="relative hidden md:block">
          <button 
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role: {roles.find(r => r.id === activeRole)?.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute top-full left-0 mt-2 w-56 glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch Role View</div>
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRole(r.id);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ${r.id === activeRole ? 'text-brand-400 font-bold bg-brand-500/10' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Visual Credit Badge */}
        <button 
          onClick={() => setIsCreditModalOpen(true)}
          className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/20 via-brand-500/20 to-cyan-500/20 border border-brand-500/40 hover:border-brand-400 text-slate-800 dark:text-slate-100 transition-all shadow-glow"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div className="text-left hidden xs:block">
            <div className="text-[10px] uppercase font-bold text-cyan-400 leading-tight">Visual Credits</div>
            <div className="text-xs font-extrabold text-brand-400">{credits.balance} Credits</div>
          </div>
          <span className="text-[10px] bg-brand-500 text-white font-bold px-1.5 py-0.5 rounded-full ml-1">+Top Up</span>
        </button>

        {/* Profile Button */}
        <button
          onClick={() => setActiveModule('settings')}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
            activeModule === 'settings' 
              ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-500/10 dark:border-brand-500/30 dark:text-brand-400' 
              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
          title="Profile & Settings"
        >
          {userAvatar ? (
            <img src={userAvatar} alt="Profile" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative transition-all"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute top-full right-0 mt-2 w-72 glass-card bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400">
                <span>Notifications</span>
                <button className="text-brand-400 hover:underline">Mark all read</button>
              </div>
              <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs border border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{n.text}</p>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

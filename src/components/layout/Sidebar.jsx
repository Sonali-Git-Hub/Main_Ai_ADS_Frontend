import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  LayoutDashboard, 
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
  User as UserIcon,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { activeModule, setActiveModule, activeWorkspace, setIsSettingsModalOpen, collapsed, setCollapsed, user, t } = useWorkspace();

  const userAvatar = user?.avatarUrl || user?.photoURL || user?.avatar || '';
  const userName = (() => {
    if (user?.name && user.name.trim()) return user.name;
    if (user?.displayName && user.displayName.trim()) return user.displayName;
    if (user?.fullName && user.fullName.trim()) return user.fullName;
    if (user?.username && user.username.trim()) return user.username;
    if (user?.email) {
      const prefix = user.email.split('@')[0];
      return prefix
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
    }
    return activeWorkspace?.brandName || 'Agency Administrator';
  })();

  const modules = [
    { id: 'dashboard', label: t('dashboard', '1. Dashboard'), icon: LayoutDashboard },
    { id: 'brands', label: t('brands', '2. Brand DNA'), icon: Dna },
    { id: 'seo', label: t('seo', '3. SEO Intelligence'), icon: Search },
    { id: 'strategy', label: t('strategy', '4. Strategy'), icon: Target },
    { id: 'calendar', label: t('calendar', '5. Calendar'), icon: Calendar },
    { id: 'studio', label: t('studio', '6. Content Studio'), icon: PenTool },
    { id: 'websiteBuilder', label: t('websiteBuilder', '7. AI Website Builder'), icon: Globe },
    { id: 'campaigns', label: t('campaigns', '8. Campaigns'), icon: Layers },
    { id: 'creative', label: t('creative', '9. Creative Studio'), icon: Palette },
    { id: 'assets', label: t('assets', '10. Asset Library'), icon: FolderKanban },
    { id: 'approvals', label: t('approvals', '11. Approvals Desk'), icon: CheckCircle2 },
    { id: 'settings', label: t('settings', '12. Settings & Billing'), icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in transition-opacity"
        />
      )}

      <aside className={`h-screen max-h-screen bg-white dark:bg-[#090d16] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-50 fixed lg:sticky top-0 left-0 overflow-hidden ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl w-64' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'lg:w-16' : 'lg:w-60'}`}>
        <div className="flex flex-col h-full justify-between overflow-hidden">
          {/* Logo Header */}
          <div className="h-11 flex items-center justify-between px-3 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
            <button 
              onClick={() => {
                if (isMobileMenuOpen) {
                  setIsMobileMenuOpen(false);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              className="flex items-center gap-2 overflow-visible group relative w-full focus:outline-none text-left cursor-pointer py-0.5"
              title={collapsed ? "Open Sidebar" : "Collapse Sidebar"}
            >
              <div className="relative flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="AI Ads™ Logo" 
                  className="w-7 h-7 rounded-lg object-cover shadow-xs border border-slate-200/50 dark:border-slate-800/80 bg-white group-hover:scale-105 transition-all duration-200" 
                />
              </div>
              {(!collapsed || isMobileMenuOpen) && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-800 dark:text-white text-xs tracking-wide truncate">AI Ads™</span>
                    <span className="text-[9px] bg-brand-500/20 text-brand-400 font-bold px-1 rounded border border-brand-500/30 shrink-0">v1.0</span>
                  </div>
                </div>
              )}

              {/* Hover Tooltip when Collapsed */}
              {collapsed && !isMobileMenuOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 flex items-center gap-1.5 -translate-x-2 group-hover:translate-x-0">
                  <PanelLeftOpen className="w-3.5 h-3.5 text-brand-400" />
                  <span>Open</span>
                </div>
              )}

              {/* Hover Collapse Icon Indicator when Expanded */}
              {!collapsed && !isMobileMenuOpen && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-400 group-hover:text-brand-500 shrink-0">
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </div>
              )}
            </button>

            {/* Mobile drawer close button */}
            {isMobileMenuOpen && (
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5 text-brand-500" />
              </button>
            )}
          </div>

          {/* User Profile Container */}
          <div className="px-3 py-1 flex items-center justify-center gap-2 border-b border-slate-100 dark:border-slate-800/40 shrink-0">
            <div className="relative shrink-0" title={`Logged in as ${userName}`}>
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="w-6 h-6 rounded-full object-cover shadow-xs border border-slate-200 dark:border-slate-700/80" 
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-[10px] shadow-xs">
                  <UserIcon className="w-3 h-3" />
                </div>
              )}
            </div>
            {(!collapsed || isMobileMenuOpen) && (
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">{userName}</p>
              </div>
            )}
          </div>

          {/* Navigation List (12 Modules) */}
          <nav className="px-2 py-1 flex flex-col justify-around flex-1 overflow-hidden">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveModule(m.id);
                    setIsMobileMenuOpen(false);
                    if (m.id === 'settings') {
                      setIsSettingsModalOpen(true);
                    }
                  }}
                  className={`flex items-center gap-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                    collapsed && !isMobileMenuOpen 
                      ? 'w-8 h-8 justify-center mx-auto p-0' 
                      : 'w-full px-2.5 py-1 justify-start'
                  } ${
                    isActive 
                      ? 'bg-brand-500/15 text-brand-600 border border-brand-500/40 dark:bg-gradient-to-r dark:from-brand-600/30 dark:to-brand-500/10 dark:text-brand-300 dark:border-brand-500/50 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-500/10 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-brand-500/10'
                  }`}
                  title={collapsed && !isMobileMenuOpen ? m.label : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-brand-500'}`} />
                  {(!collapsed || isMobileMenuOpen) && <span className="truncate text-xs">{m.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

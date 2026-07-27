import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  LayoutDashboard, 
  Dna, 
  Target, 
  Search, 
  Calendar, 
  PenTool, 
  Layers, 
  Palette, 
  Repeat, 
  FolderKanban, 
  CheckCircle2, 
  BarChart3, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Send,
  Zap
} from 'lucide-react';

export const Sidebar = () => {
  const { activeModule, setActiveModule, setIsQuickPostOpen } = useWorkspace();
  const [collapsed, setCollapsed] = useState(false);

  const modules = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'brands', label: '2. Brand DNA', icon: Dna },
    { id: 'strategy', label: '3. Strategy', icon: Target },
    { id: 'seo', label: '4. SEO Intelligence', icon: Search },
    { id: 'calendar', label: '5. Calendar', icon: Calendar },
    { id: 'studio', label: '6. Content Studio', icon: PenTool },
    { id: 'campaigns', label: '7. Campaigns', icon: Layers },
    { id: 'creative', label: '8. Creative Studio', icon: Palette },
    { id: 'repurpose', label: '9. Repurpose', icon: Repeat },
    { id: 'assets', label: '10. Asset Library', icon: FolderKanban },
    { id: 'approvals', label: '11. Approvals Desk', icon: CheckCircle2 },
    { id: 'analytics', label: '12. Analytics', icon: BarChart3 },
    { id: 'team', label: '13. Team & RBAC', icon: Users },
    { id: 'settings', label: '14. Settings & Billing', icon: Settings },
  ];

  return (
    <aside className={`h-screen sticky top-0 bg-white dark:bg-[#090d16] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div>
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-lg shadow-glow flex-shrink-0">
              AI
            </div>
            {!collapsed && (
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-800 dark:text-white text-base tracking-wide">AI Ads™</span>
                  <span className="text-[10px] bg-brand-500/20 text-brand-400 font-bold px-1 rounded">v1.0</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">UWO Ecosystem</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
 
        {/* Quick Social Post Button container */}
        <div className="p-3">
          <button
            onClick={() => setIsQuickPostOpen(true)}
            className={`w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-accent hover:from-brand-500 hover:to-purple-500 text-white font-semibold text-xs shadow-glow flex items-center justify-center gap-2 transition-all active:scale-95 ${collapsed ? 'px-0' : ''}`}
            title="Quick Social Post"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            {!collapsed && <span>Quick Social Post</span>}
          </button>
        </div>
 
        {/* Navigation List (14 Modules) */}
        <nav className="px-2 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive 
                    ? 'bg-brand-500/10 text-brand-600 border border-brand-500/30 dark:bg-gradient-to-r dark:from-brand-600/30 dark:to-purple-600/10 dark:text-white dark:border-brand-500/40 shadow-glow font-semibold' 
                    : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {!collapsed && <span className="truncate">{m.label}</span>}
                {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-brand-400 animate-pulse"></div>}
              </button>
            );
          })}
        </nav>
      </div>
 
      {/* Footer Ecosystem Badge */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
            <span>AISA™ Engine Active</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Plan. Create. Optimize. Approve.</p>
        </div>
      )}
    </aside>
  );
};

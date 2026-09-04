import React from 'react';
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
  X
} from 'lucide-react';

export const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { activeModule, setActiveModule, setIsSettingsModalOpen, t } = useWorkspace();

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

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in transition-opacity"
        />
      )}

      <aside className={`h-screen bg-white dark:bg-[#0b0f19] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-50 fixed lg:sticky top-0 left-0 w-64 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Header / Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="AI ADS™ Logo" 
                className="w-9 h-9 rounded-xl object-cover shadow-xs border border-slate-200/60 dark:border-slate-700/60 bg-white" 
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white text-[15px] tracking-tight">AI ADS</span>
                  <span className="text-[9px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold px-1.5 py-0.2 rounded border border-brand-500/20">v1.0</span>
                </div>
                <p className="text-[9.5px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">Enterprise Suite</p>
              </div>
            </div>

            {/* Mobile close button */}
            {isMobileMenuOpen && (
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4 text-brand-500" />
              </button>
            )}
          </div>

          {/* Navigation List (Exact 12 Items Matching Design) */}
          <nav className="px-3 py-3 space-y-1 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-[13px] transition-all text-left group ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-semibold dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`} />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

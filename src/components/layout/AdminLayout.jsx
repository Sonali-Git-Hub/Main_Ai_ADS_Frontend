import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AdminDashboardModule } from '../../features/admin/AdminDashboard';
import { Shield, LogOut, Sparkles } from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useWorkspace();

  return (
    <div className="min-h-screen bg-[#05050f] text-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0a0c15]/95 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-6">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-wide flex items-center gap-2">
              AI Ads™ <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold bg-brand-500/20 text-brand-400">Super Admin</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Ecosystem Control Panel</p>
          </div>
        </div>

        {/* Right: User & Logout */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{user?.name || user?.email?.split('@')[0]}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          
          <div className="w-px h-8 bg-slate-800/80"></div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors font-medium text-sm border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
        <AdminDashboardModule />
      </main>
    </div>
  );
};

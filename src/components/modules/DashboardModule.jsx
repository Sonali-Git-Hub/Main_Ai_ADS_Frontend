import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { 
  Dna, 
  Search, 
  PenTool, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Layers,
  Zap,
  Repeat
} from 'lucide-react';

export const DashboardModule = () => {
  const { activeWorkspace, setActiveModule, setIsQuickPostOpen, setIsScraperOpen, approvalsQueue, credits } = useWorkspace();

  const stats = [
    { label: 'Verified Brand DNA Memory', value: '100%', sub: 'Immutable positioning locked', icon: Dna, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/30' },
    { label: 'Fact-Check Verification Rate', value: '98.4%', sub: '0 unverified stats published', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Production SLA Velocity', value: '< 12s', sub: 'Long-form editorial drafting', icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    { label: 'Visual Credits Balance', value: `${credits.balance}`, sub: `${credits.tier} Subscription Plan`, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900/60 via-slate-900 to-purple-950/60 border border-brand-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 px-2.5 py-0.5 rounded-full">Canonical Overview</span>
            <span className="text-xs text-slate-400">Operating Model: Brand → Strategy → SEO → Create → Approve → Publish</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">AI Ads™ Operations Hub</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Currently governing <strong className="text-white">{activeWorkspace.brandName}</strong> ({activeWorkspace.domainUrl}). All AI output is anchored to immutable Brand DNA positioning.
          </p>
        </div>
        
        <div className="flex gap-2 relative z-10">
          <button 
            onClick={() => setIsScraperOpen(true)}
            className="btn-secondary text-xs"
          >
            <Dna className="w-4 h-4 text-brand-400" />
            Enter Your Brand
          </button>
          <button 
            onClick={() => setIsQuickPostOpen(true)}
            className="btn-primary text-xs"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            Quick Social Post
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl glass-card border ${s.bg} flex items-center justify-between`}>
              <div>
                <span className="text-xs font-semibold text-slate-400 block">{s.label}</span>
                <div className="text-2xl font-extrabold text-white my-0.5">{s.value}</div>
                <span className="text-[10px] text-slate-400">{s.sub}</span>
              </div>
              <div className={`p-3 rounded-2xl bg-slate-900/60 border border-slate-800 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch Production Rail */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          End-to-End Production Pipeline Shortcuts
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button 
            onClick={() => setActiveModule('brands')}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Dna className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">1. Brand DNA</span>
            <span className="text-[10px] text-slate-400">Positioning & Claims</span>
          </button>

          <button 
            onClick={() => setActiveModule('seo')}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">2. SEO Briefs</span>
            <span className="text-[10px] text-slate-400">Topic Clusters & Intent</span>
          </button>

          <button 
            onClick={() => setActiveModule('studio')}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PenTool className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">3. Editorial Studio</span>
            <span className="text-[10px] text-slate-400">8-Step Draft & Fact Check</span>
          </button>

          <button 
            onClick={() => setActiveModule('approvals')}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">4. Approvals Desk</span>
            <span className="text-[10px] text-slate-400">Role Sign-off & Client Portal</span>
          </button>

          <button 
            onClick={() => setActiveModule('repurpose')}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition-all text-left group col-span-2 md:col-span-1"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Repeat className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">5. Repurposing</span>
            <span className="text-[10px] text-slate-400">1 Asset to 5 Formats</span>
          </button>
        </div>
      </div>

      {/* Recent Approvals & Drafts Table */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            Recent Production Items & Governance Status
          </h2>
          <button 
            onClick={() => setActiveModule('approvals')}
            className="text-xs text-brand-400 hover:underline flex items-center gap-1 font-semibold"
          >
            View Approvals Queue <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Title & Format</th>
                <th className="pb-3 px-3">Author</th>
                <th className="pb-3 px-3">Fact Check Gate</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {approvalsQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-200 block">{item.title}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.type} {item.platform ? `(${item.platform})` : ''}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">{item.author}</td>
                  <td className="py-3 px-3">
                    {item.factCheck?.passed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED ({item.factCheck.score}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Citation Needed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      item.status === 'RED_FLAG_CITATION_NEEDED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button 
                      onClick={() => setActiveModule('approvals')}
                      className="text-xs font-semibold text-brand-400 hover:text-brand-300 underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

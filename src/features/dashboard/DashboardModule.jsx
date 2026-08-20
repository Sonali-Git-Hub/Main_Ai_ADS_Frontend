import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { analyticsAPI, approvalsAPI } from '../../services/api';

import {
  Dna, Search, PenTool, CheckCircle2, ArrowUpRight, TrendingUp, Clock,
  ShieldCheck, Layers, Zap, Repeat, Loader2, RefreshCw, AlertCircle, Rocket
} from 'lucide-react';

export const DashboardModule = () => {
  const { activeWorkspace, setActiveModule, setIsQuickPostOpen, setIsScraperOpen, openScraperModal } = useWorkspace();
  const [analytics, setAnalytics] = useState(null);
  const [approvalsQueue, setApprovalsQueue] = useState([]);
  const [loading, setLoading] = useState(true);


  const workspaceId = activeWorkspace?._id || activeWorkspace?.id;

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, queueRes] = await Promise.all([
          analyticsAPI.getSummary(workspaceId ? { workspaceId } : {}),
          approvalsAPI.getQueue(),
        ]);

        if (isMounted) {
          if (analyticsRes.analytics) setAnalytics(analyticsRes.analytics);
          if (queueRes.queue) setApprovalsQueue(queueRes.queue);
        }
      } catch (err) {
        console.log('Dashboard fetch fallback:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => { isMounted = false; };
  }, [workspaceId]);

  const filteredQueue = approvalsQueue.filter(item => item.workspaceId === workspaceId);

  let verificationRate = '0%';
  let unverifiedText = '0 unverified stats published';

  if (filteredQueue.length > 0) {
    const passedCount = filteredQueue.filter(item => item.factCheck?.passed).length;
    verificationRate = Math.round((passedCount / filteredQueue.length) * 100) + '%';
    const unverifiedCount = filteredQueue.length - passedCount;
    unverifiedText = `${unverifiedCount} item${unverifiedCount === 1 ? '' : 's'} unverified`;
  } else {
    verificationRate = 'N/A';
    unverifiedText = 'No items generated yet';
  }

  const stats = [
    {
      label: 'Total Campaigns',
      value: analytics?.campaigns?.total || 0,
      sub: `${analytics?.campaigns?.active || 0} currently active`,
      icon: Layers,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20 dark:border-purple-500/30'
    },
    {
      label: 'Generated Content',
      value: analytics?.content?.total || 0,
      sub: 'Total items generated',
      icon: PenTool,
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/20 dark:border-brand-500/30'
    },
    {
      label: 'Downloaded',
      value: analytics?.downloads?.total || 0,
      sub: 'Assets downloaded',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto p-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-50 via-white to-purple-50 dark:from-brand-900/60 dark:via-slate-900 dark:to-purple-950/60 border border-brand-200 dark:border-brand-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-500/20 px-2.5 py-0.5 rounded-full">Canonical Operations</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Brand → Strategy → SEO → Create → Approve → Publish</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Ads™ Operations Hub</h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
            Currently governing <strong className="text-slate-900 dark:text-white">{activeWorkspace?.brandName || 'your brand'}</strong> ({activeWorkspace?.domainUrl || 'website'}). All output is anchored to immutable Brand DNA.
          </p>
        </div>

        <div className="flex gap-2 relative z-10">
          <button
            onClick={() => setActiveModule('brands')}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Dna className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Brand DNA
          </button>
          <button
            onClick={() => setIsQuickPostOpen(true)}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Quick Post
          </button>

        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl glass-card border ${s.bg} flex items-center justify-between`}>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">{s.label}</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white my-0.5">{s.value}</div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{s.sub}</span>
              </div>
              <div className={`p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Shortcuts */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" /> End-to-End Content Pipeline
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: 'brands', label: '1. Brand DNA', sub: 'Positioning & Claims', icon: Dna, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/10' },
            { id: 'seo', label: '2. SEO Briefs', sub: 'Topic Clusters & Intent', icon: Search, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
            { id: 'studio', label: '3. Editorial Studio', sub: 'Multi-Channel Generation', icon: PenTool, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
            { id: 'approvals', label: '4. Approvals Desk', sub: 'Governance & Verification', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
            { id: 'repurpose', label: '5. Repurposing', sub: '1 Asset to 5 Formats', icon: Repeat, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveModule(step.id)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all text-left group"
              >
                <div className={`w-8 h-8 rounded-xl ${step.bg} ${step.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{step.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{step.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Production Items Queue */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" /> Recent Production Items & Governance Status
          </h2>
          <button
            onClick={() => setActiveModule('approvals')}
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
          >
            View Approvals Queue <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          </div>
        ) : filteredQueue.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-slate-900 dark:text-slate-200 font-extrabold text-sm">No production items yet</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">You haven't generated any drafts or campaigns for this brand yet. Get started by scraping the Brand DNA or writing a new post.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-3">Content</th>
                  <th className="pb-3 px-3">Type</th>
                  <th className="pb-3 px-3">Verified</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredQueue.slice(0, 5).map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-slate-100/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.title}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">{item.type} {item.platform ? `(${item.platform})` : ''}</span>
                    </td>
                    <td className="py-3 px-3">
                      {item.factCheck?.passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3" /> VERIFIED ({item.factCheck.score}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 dark:border-rose-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Citation Needed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'APPROVED' ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30' :
                        item.status === 'RED_FLAG_CITATION_NEEDED' ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30' :
                        'bg-amber-500/10 dark:bg-amber-500/20 text-amber-650 dark:text-amber-300 border border-amber-500/20 dark:border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={() => setActiveModule('approvals')}
                        className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

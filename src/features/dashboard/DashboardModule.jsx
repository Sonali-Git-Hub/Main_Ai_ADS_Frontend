import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { analyticsAPI, campaignAPI } from '../../services/api';

import {
  Search, PenTool, CheckCircle2, ArrowUpRight, TrendingUp,
  Layers, Zap, Repeat, Loader2, RefreshCw, AlertCircle, Rocket, Dna, FolderKanban
} from 'lucide-react';

export const DashboardModule = () => {
  const { activeWorkspace, setActiveModule, setIsQuickPostOpen, setIsScraperOpen, openScraperModal, workspaces = [], globalAssets = [], user, t } = useWorkspace();
  const [analytics, setAnalytics] = useState(null);
  const [campaignsList, setCampaignsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const workspaceId = activeWorkspace?._id || activeWorkspace?.id;

  const userEmail = user?.email || localStorage.getItem('aisa_user_email') || activeWorkspace?.userEmail || '';

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, campaignsRes] = await Promise.all([
          analyticsAPI.getSummary({
            workspaceId: workspaceId || undefined,
            brandName: activeWorkspace?.brandName || undefined,
            userEmail: userEmail || undefined
          }),
          campaignAPI.list(workspaceId ? { workspaceId } : {}).catch(() => ({ campaigns: [], total: 0 })),
        ]);

        if (isMounted) {
          if (analyticsRes.analytics) setAnalytics(analyticsRes.analytics);
          if (campaignsRes?.campaigns) setCampaignsList(campaignsRes.campaigns);
        }
      } catch (err) {
        console.log('Dashboard fetch fallback:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => { isMounted = false; };
  }, [workspaceId, activeWorkspace?.brandName, userEmail]);

  // Total Brands strictly for this single logged-in user (not global count)
  const totalBrandsCount = (workspaces && workspaces.length > 0)
    ? workspaces.length 
    : (analytics?.brands?.total || 1);

  // Real generated content count saved in DB & Asset Library (excludes planned calendar slots)
  const totalGeneratedAssetsCount = analytics?.posts?.total !== undefined 
    ? analytics.posts.total 
    : (globalAssets?.length || 0);

  // Total Campaigns strictly for this active brand
  const brandRegex = activeWorkspace?.brandName ? new RegExp(activeWorkspace.brandName.trim(), 'i') : null;
  const brandCampaigns = campaignsList.filter(c => {
    if (workspaceId && (c.workspaceId === workspaceId || c.workspaceId?._id === workspaceId)) return true;
    if (brandRegex && (brandRegex.test(c.campaignName || '') || brandRegex.test(c.brandName || ''))) return true;
    return false;
  });

  const totalCampaignsCount = brandCampaigns.length > 0 
    ? brandCampaigns.length 
    : (analytics?.campaigns?.total || 0);

  const activeCampaignsCount = brandCampaigns.length > 0
    ? brandCampaigns.filter(c => ['Active', 'ACTIVE', 'running'].includes(c.status)).length
    : (analytics?.campaigns?.active || 0);

  const stats = [
    {
      label: 'Total Brands',
      value: totalBrandsCount,
      sub: `${totalBrandsCount} brand profile${totalBrandsCount === 1 ? '' : 's'} in your account`,
      icon: Dna,
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/20 dark:border-brand-500/30 hover:border-brand-500/50',
      moduleId: 'brands'
    },
    {
      label: 'Total Generated Content',
      value: totalGeneratedAssetsCount,
      sub: `Saved in Asset Library & DB (excl. calendar)`,
      icon: FolderKanban,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/20 dark:border-indigo-500/30 hover:border-indigo-500/50',
      moduleId: 'assets'
    },
    {
      label: 'Total Campaigns',
      value: totalCampaignsCount,
      sub: `${activeCampaignsCount} currently active`,
      icon: Layers,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20 dark:border-purple-500/30 hover:border-purple-500/50',
      moduleId: 'campaigns'
    }
  ];

  return (
    <div className="space-y-4 animate-in fade-in w-full max-w-[1600px] mx-auto px-1 sm:px-4 pt-1 pb-6">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-50 via-white to-purple-50 dark:from-brand-900/60 dark:via-slate-900 dark:to-purple-950/60 border border-brand-200 dark:border-brand-500/30 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="relative z-10 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-500/20 px-2.5 py-0.5 rounded-full">{t('canonicalOps', 'Canonical Operations')}</span>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t('opsFlow', 'Brand → Strategy → SEO → Create → Approve → Publish')}</span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{t('opsHubTitle', 'AI ADS™ Operations Hub')}</h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            {t('currentlyGoverning', 'Currently governing')} <strong className="text-slate-900 dark:text-white">{activeWorkspace?.brandName || 'your brand'}</strong> ({activeWorkspace?.domainUrl || 'website'}). {t('anchoredToDna', 'All output is anchored to immutable Brand DNA.')}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto relative z-10">
          <button
            onClick={() => openScraperModal ? openScraperModal() : setIsScraperOpen(true)}
            className="btn-secondary text-xs flex-1 md:flex-none flex items-center justify-center gap-1.5 py-2.5 px-3 cursor-pointer"
          >
            <Dna className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="truncate">{t('brandDna', 'Enter Your Brand')}</span>
          </button>
          <button
            onClick={() => setIsQuickPostOpen(true)}
            className="btn-secondary text-xs flex-1 md:flex-none flex items-center justify-center gap-1.5 py-2.5 px-3"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="truncate">{t('quickPost', 'Quick Post')}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              onClick={() => s.moduleId && setActiveModule(s.moduleId)}
              className={`p-4 sm:p-5 rounded-2xl glass-card border ${s.bg} flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] shadow-xs group`}
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{s.label}</span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white my-0.5">{s.value}</div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{s.sub}</span>
              </div>
              <div className={`p-2.5 sm:p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 ${s.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Shortcuts */}
      <div className="p-4 sm:p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" /> {t('endToEndPipeline', 'End-to-End Content Pipeline')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { id: 'brands', label: t('dnaStepTitle', '1. Brand DNA'), sub: t('dnaStepSub', 'Positioning & Claims'), icon: Dna, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/10' },
            { id: 'seo', label: t('seoStepTitle', '2. SEO Briefs'), sub: t('seoStepSub', 'Topic Clusters & Intent'), icon: Search, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
            { id: 'studio', label: t('studioStepTitle', '3. Editorial Studio'), sub: t('studioStepSub', 'Multi-Channel Generation'), icon: PenTool, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/10' },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveModule(step.id)}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl ${step.bg} ${step.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{step.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">{step.sub}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

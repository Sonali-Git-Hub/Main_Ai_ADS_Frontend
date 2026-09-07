import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '../../context/WorkspaceContext';
import { analyticsAPI, campaignAPI } from '../../services/api';

import {
  Search, PenTool, CheckCircle2, ArrowUpRight, TrendingUp,
  Layers, Zap, Repeat, Loader2, RefreshCw, AlertCircle, Rocket, Dna, FolderKanban, Sparkles, Globe, Lock
} from 'lucide-react';

export const DashboardModule = () => {
  const {
    activeWorkspace,
    setActiveModule,
    setIsQuickPostOpen,
    setIsScraperOpen,
    openScraperModal,
    workspaces = [],
    globalAssets = [],
    user,
    t,
    showCustomAlert,
    setIsSettingsModalOpen,
    setActiveSettingsTab
  } = useWorkspace();
  const [analytics, setAnalytics] = useState(null);
  const [campaignsList, setCampaignsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const workspaceId = activeWorkspace?._id || activeWorkspace?.id;

  const userEmail = user?.email || localStorage.getItem('aisa_user_email') || activeWorkspace?.userEmail || '';

  const displayName = (() => {
    try {
      const savedName = localStorage.getItem('aisa_user_name');
      if (savedName && savedName.trim()) return savedName.trim();
      const savedUser = localStorage.getItem('aisa_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.name && parsed.name.trim()) return parsed.name.trim();
        if (parsed.fullName && parsed.fullName.trim()) return parsed.fullName.trim();
      }
    } catch(e) {}
    if (user?.name && user.name.trim()) return user.name.trim();
    if (user?.fullName && user.fullName.trim()) return user.fullName.trim();
    if (user?.email) {
      const prefix = user.email.split('@')[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return 'Creator';
  })();

  const timeGreeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const userPlanNorm = (user?.plan || 'starter').toLowerCase();
  const isStarter = userPlanNorm === 'starter' || userPlanNorm === 'base' || userPlanNorm === 'free';

  const handleWebsiteBuilderClick = () => {
    if (isStarter) {
      if (showCustomAlert) {
        showCustomAlert({
          title: 'AI Website Builder is Locked',
          message: 'AI Website Builder requires the Pro or higher subscription plan. Upgrade now to generate, customize, and deploy AI websites.',
          type: 'warning',
          confirmText: 'Upgrade to Pro',
          cancelText: 'Cancel',
          onConfirm: () => {
            setActiveModule('settings');
            if (setActiveSettingsTab) setActiveSettingsTab('billing');
            if (setIsSettingsModalOpen) setIsSettingsModalOpen(true);
          }
        });
      } else {
        setActiveModule('websiteBuilder');
      }
      return;
    }
    setActiveModule('websiteBuilder');
    if (window.location.pathname !== '/website-builder') {
      window.history.pushState({ module: 'websiteBuilder' }, '', '/website-builder');
    }
  };

  const handleAssetLibraryClick = () => {
    setActiveModule('assets');
    if (window.location.pathname !== '/asset-library') {
      window.history.pushState({ module: 'assets' }, '', '/asset-library');
    }
  };

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
      color: 'text-amber-600 dark:text-amber-400',
      labelColor: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
      iconBg: 'bg-amber-500/15 dark:bg-amber-500/25',
      moduleId: 'brands'
    },
    {
      label: 'Total Generated Content',
      value: totalGeneratedAssetsCount,
      sub: `Saved in Asset Library & DB (excl. calendar)`,
      icon: FolderKanban,
      color: 'text-indigo-600 dark:text-indigo-400',
      labelColor: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
      iconBg: 'bg-indigo-500/15 dark:bg-indigo-500/25',
      moduleId: 'assets'
    },
    {
      label: 'Total Campaigns',
      value: totalCampaignsCount,
      sub: `${activeCampaignsCount} currently active`,
      icon: Layers,
      color: 'text-purple-600 dark:text-purple-400',
      labelColor: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
      iconBg: 'bg-purple-500/15 dark:bg-purple-500/25',
      moduleId: 'campaigns'
    }
  ];

  return (
    <div className="space-y-4 animate-in fade-in w-full max-w-[1600px] mx-auto px-1 sm:px-4 pt-1 pb-6">
      {/* ── LUXURY ANIMATED WELCOME BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-indigo-500/10 dark:from-brand-950/40 dark:via-purple-950/30 dark:to-slate-900/60 border border-brand-500/25 dark:border-brand-500/30 shadow-[0_12px_40px_-10px_rgba(123,97,255,0.12)] relative overflow-hidden backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        {/* Animated ambient glowing orb in background */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-brand-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 space-y-2 max-w-2xl">
          {/* Top Status Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>AI Growth Engine Active</span>
            </span>
          </div>

          {/* Animated Greeting with User's Name */}
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{timeGreeting},</span>
              <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 dark:from-brand-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-xs">
                {displayName}
              </span>
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 2, duration: 1.8 }}
                className="inline-block origin-bottom-right"
              >
                👋
              </motion.span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('currentlyGoverning', 'Currently governing')} <strong className="text-slate-900 dark:text-white font-bold">{activeWorkspace?.brandName || 'your brand'}</strong> ({activeWorkspace?.domainUrl || 'website'}). {t('anchoredToDna', 'All campaign outputs & visuals are anchored to your immutable Brand DNA.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto relative z-10 shrink-0">
          <button
            onClick={() => openScraperModal ? openScraperModal() : setIsScraperOpen(true)}
            className="btn-secondary text-xs flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold shadow-xs hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Dna className="w-3.5 h-3.5 text-brand-500" />
            <span className="truncate">{t('brandDna', 'Enter Your Brand')}</span>
          </button>
          
          <button
            onClick={() => setIsQuickPostOpen(true)}
            className="btn-primary text-xs flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold shadow-md shadow-brand-500/20 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="truncate">{t('quickPost', 'Quick Post')}</span>
          </button>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + idx * 0.08, ease: 'easeOut' }}
              onClick={() => s.moduleId && setActiveModule(s.moduleId)}
              className={`p-5 sm:p-6 rounded-2xl ${s.bg} accent-card-hover flex items-center justify-between cursor-pointer group`}
            >
              <div className="space-y-1">
                <span className={`text-xs font-extrabold ${s.labelColor} block tracking-tight`}>{s.label}</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight block">
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">{s.sub}</span>
              </div>
              <div className={`p-3.5 sm:p-4 rounded-2xl ${s.iconBg} ${s.color} group-hover:scale-110 transition-transform shadow-xs shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pipeline Shortcuts */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] space-y-4">
        <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" /> {t('endToEndPipeline', 'End-to-End Content Pipeline')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { id: 'brands', label: t('dnaStepTitle', '1. Brand DNA'), sub: t('dnaStepSub', 'Positioning & Claims'), icon: Dna, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/10' },
            { id: 'seo', label: t('seoStepTitle', '2. SEO Briefs'), sub: t('seoStepSub', 'Topic Clusters & Intent'), icon: Search, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
            { id: 'studio', label: t('studioStepTitle', '3. Editorial Studio'), sub: t('studioStepSub', 'Multi-Channel Generation'), icon: PenTool, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
            { id: 'assets', label: t('assetsStepTitle', '4. Asset Library'), sub: t('assetsStepSub', 'Saved Media & Vault'), icon: FolderKanban, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
            { id: 'websiteBuilder', label: t('websiteBuilderStepTitle', '5. Website Builder'), sub: t('websiteBuilderStepSub', 'AI Pages & Sites'), icon: Globe, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', isLocked: isStarter },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id === 'websiteBuilder' && isStarter) {
                    handleWebsiteBuilderClick();
                    return;
                  }
                  if (step.id === 'assets') {
                    handleAssetLibraryClick();
                    return;
                  }
                  setActiveModule(step.id);
                  const pathMap = {
                    brands: '/brand-dna',
                    seo: '/seo-briefs',
                    studio: '/content-studio',
                    assets: '/asset-library',
                    websiteBuilder: '/website-builder',
                  };
                  if (pathMap[step.id]) {
                    window.history.pushState({ module: step.id }, '', pathMap[step.id]);
                  }
                }}
                className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 accent-card-hover text-left group flex flex-col justify-between relative cursor-pointer ${
                  step.isLocked ? 'hover:border-amber-500/40' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl ${step.bg} ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {step.isLocked && (
                      <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-md shadow-2xs">
                        <Lock className="w-2.5 h-2.5" /> PRO
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{step.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 block">{step.sub}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

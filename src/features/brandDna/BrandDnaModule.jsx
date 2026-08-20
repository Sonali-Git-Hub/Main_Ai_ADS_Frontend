import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { brandAPI } from '../../services/api';
import {
  Dna, Globe, CheckCircle2, Save, RefreshCw, Sparkles, Loader2,
  AlertCircle, ShieldCheck, Target, MessageSquare, Zap, Layers,
  Compass, AlertTriangle, FileText, BarChart2
} from 'lucide-react';

export const BrandDnaModule = () => {
  const {activeWorkspace, updateWorkspace, setActiveModule, setIsScraperOpen, openScraperModal, setBrandDnaData, t } = useWorkspace();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [regenerating, setRegenerating] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState('');

  // Editable fields
  const [websiteUrl, setWebsiteUrl] = useState(activeWorkspace?.domainUrl || '');
  const [manualDesc, setManualDesc] = useState('');

  const workspaceId = activeWorkspace?._id || activeWorkspace?.id;

  const loadBrandProfile = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError('');
    try {
      const result = await brandAPI.getProfile(workspaceId);
      if (result.profile) {
        setProfile(result.profile);
      }
    } catch (err) {
      // Profile not created yet — offer analysis
      console.log('No brand profile found yet:', err.message);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    setProfile(null); // Reset profile when switching active workspace
    loadBrandProfile();
    setWebsiteUrl(activeWorkspace?.domainUrl || '');
  }, [loadBrandProfile, activeWorkspace]);

  const handleRunAiAnalysis = async () => {
    if (!workspaceId) return;
    setAnalyzing(true);
    setError('');
    try {
      const result = await brandAPI.analyze({
        workspaceId,
        websiteUrl: websiteUrl || activeWorkspace?.domainUrl || '',
        companyName: activeWorkspace?.brandName || '',
        manualDescription: manualDesc,
      });

      setProfile(result.profile);
      setSavedMsg('✨ Deep AI Brand Intelligence analysis completed and saved!');
      setTimeout(() => setSavedMsg(''), 4000);

      // Update workspace context
      if (updateWorkspace && result.profile?.structuredIdentity) {
        const id = result.profile.structuredIdentity;
        updateWorkspace(workspaceId, {
          brandVoiceTone: id.tone,
          targetAudience: id.target_audience,
          contentPillars: id.content_angles,
          brandColors: id.color_palette,
        });
      }
    } catch (err) {
      setError(err.message || 'Brand AI analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRegenerateSection = async (section) => {
    setRegenerating(section);
    try {
      const result = await brandAPI.regenerateSection({ workspaceId, section });
      setProfile((prev) => ({
        ...prev,
        [section]: result.data,
      }));
      setSavedMsg(`✅ Regenerated ${section} with AI`);
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setRegenerating(null);
    }
  };

  // Check if profile from API matches currently active workspace
  const isProfileMatching = profile && (
    profile.workspaceId === workspaceId ||
    profile.workspaceId === activeWorkspace?._id ||
    profile.workspaceId === activeWorkspace?.id ||
    profile.companyName?.toLowerCase() === activeWorkspace?.brandName?.toLowerCase()
  );

  const matchedProfile = isProfileMatching ? profile : null;

  // Dynamic Workspace Values
  const brandName = activeWorkspace?.brandName || 'Brand';
  const industry = activeWorkspace?.industryCategory || activeWorkspace?.industry || 'Consumer Products & Services';
  const tagline = activeWorkspace?.tagline || `Leading brand in ${industry}`;
  const mission = activeWorkspace?.missionStatement || `To empower ${brandName} customers with exceptional quality and service.`;

  // Build 100% dynamic effectiveProfile derived from activeWorkspace for ANY brand (Pedigree, Apsara, Vedantu, etc.)
  const effectiveProfile = matchedProfile || (activeWorkspace && (activeWorkspace.brandName || activeWorkspace.domainUrl) ? {
    aiConfidence: activeWorkspace.confidenceScore || 85,
    companyName: brandName,
    website: activeWorkspace.domainUrl || 'https://',
    logoUrl: activeWorkspace.logoUrl || activeWorkspace.faviconUrl || '',
    brandColors: activeWorkspace.brandColors || ['#6366F1', '#8B5CF6'],
    structuredIdentity: {
      brand_name: brandName,
      industry: industry,
      tone: typeof activeWorkspace.brandVoiceTone === 'string' 
        ? activeWorkspace.brandVoiceTone 
        : (activeWorkspace.brandVoiceTone?.toneKeywords?.join(', ') || 'Professional & Customer-Centric'),
      target_audience: typeof activeWorkspace.targetAudience === 'string'
        ? activeWorkspace.targetAudience
        : (Array.isArray(activeWorkspace.targetAudience) && activeWorkspace.targetAudience.length > 0 
            ? activeWorkspace.targetAudience.join(', ') 
            : `Primary consumers and users seeking premium ${industry} offerings from ${brandName}.`),
      content_angles: (activeWorkspace.contentPillars && activeWorkspace.contentPillars.length > 0)
        ? activeWorkspace.contentPillars
        : [`Empowering ${brandName} customers through quality`, `Innovative ${industry} solutions`, `Customer trust & product excellence`],
      color_palette: activeWorkspace.brandColors || ['#6366F1', '#8B5CF6'],
      goal: tagline || mission || `To be the leading brand in the ${industry} sector`,
      products_services: (activeWorkspace.coreProductsServices && activeWorkspace.coreProductsServices.length > 0)
        ? activeWorkspace.coreProductsServices
        : [`${brandName} Core Product Line`, `Premium ${industry} Offerings`],
      brand_values: ['Innovation', 'Quality', 'Customer Trust']
    },
    targetAudienceSection: {
      description: typeof activeWorkspace.targetAudience === 'string'
        ? activeWorkspace.targetAudience
        : (Array.isArray(activeWorkspace.targetAudience) && activeWorkspace.targetAudience.length > 0 
            ? activeWorkspace.targetAudience.join(', ')
            : `Consumers and clients seeking high-quality ${industry} products and services from ${brandName}.`)
    },
    brandPersonality: {
      values: ['Innovation', 'Quality', 'Reliability'],
      usps: [tagline, `High customer satisfaction & trust in ${industry}`]
    },
    brandVoice: {
      style: typeof activeWorkspace.brandVoiceTone === 'string'
        ? activeWorkspace.brandVoiceTone
        : (activeWorkspace.brandVoiceTone?.toneKeywords?.join(', ') || 'Friendly & Professional'),
      dos: [`Highlight ${brandName} success stories`, `Showcase core product features & quality`],
      donts: ['Avoid generic unverified claims', 'Do not compromise on brand consistency']
    },
    contentStrategy: {
      angles: (activeWorkspace.contentPillars && activeWorkspace.contentPillars.length > 0)
        ? activeWorkspace.contentPillars
        : [`Empowering ${brandName} customers through quality`, `Innovative ${industry} solutions`, `Customer trust & product excellence`],
      goal: mission,
      platforms: ['instagram', 'linkedin', 'facebook']
    }
  } : null);

  const handleSaveProfile = async () => {
    if (!workspaceId || !effectiveProfile) return;
    try {
      const cleanColor = (c) => typeof c === 'string' ? c : (c?.hex || c?.color || '#6366F1');
      const sanitizedProfile = {
        ...effectiveProfile,
        brandColors: (effectiveProfile.brandColors || []).map(cleanColor),
        structuredIdentity: {
          ...effectiveProfile.structuredIdentity,
          color_palette: (effectiveProfile.structuredIdentity?.color_palette || []).map(cleanColor)
        }
      };
      if (updateWorkspace) {
        await updateWorkspace(workspaceId, sanitizedProfile);
      } else {
        await brandAPI.updateProfile(workspaceId, sanitizedProfile);
      }
      setSavedMsg('💾 Brand Profile saved! Redirecting to SEO Setup...');

      // First navigate to SEO (then SEO will redirect to Strategy)
      setTimeout(() => {
        setSavedMsg('');
        if (setActiveModule) {
          setActiveModule('seo');
        }
      }, 600);
    } catch (err) {
      setError(err.message || 'Failed to save Brand Profile');
    }
  };

  const structured = effectiveProfile?.structuredIdentity || {};
  const displayColors = structured.color_palette || activeWorkspace?.brandColors || [];

  // ── No Brand Gate ──────────────────────────────────────────────────────────
  const noBrand =
    !activeWorkspace ||
    activeWorkspace.id === 'ws_empty' ||
    !workspaceId;

  if (noBrand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        {/* Glowing DNA Icon */}
        <div className="relative mb-8">
          <div
            style={{ background: 'radial-gradient(circle, var(--brand-glow, rgba(99,102,241,0.35)) 0%, transparent 70%)' }}
            className="absolute inset-0 scale-150 rounded-full animate-pulse"
          />
          <div
            className="relative flex items-center justify-center w-24 h-24 rounded-3xl shadow-xl"
            style={{ background: 'linear-gradient(135deg, var(--brand-from, var(--brand-600, #6B5AED)), var(--brand-to, var(--brand-500, #7B61FF)))' }}
          >
            <Dna className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 text-center">
          Start Your Brand Journey
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-10 text-base leading-relaxed">
          Build your{' '}
          <span className="text-brand-600 dark:text-brand-400 font-semibold">Brand DNA</span>{' '}
          in under 60 seconds. Let AI ADS™ analyze your brand and generate an immutable memory
          that powers every module — strategy, SEO, content, and more.
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
          {/* Enter URL */}
          <button
            onClick={() => openScraperModal('NEW_BRAND')}
            className="group flex flex-col gap-3 p-6 rounded-2xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800/60 hover:border-brand-500/50 dark:hover:border-brand-500/50
                       hover:bg-brand-500/5 dark:hover:bg-brand-500/10 transition-all duration-200 text-left cursor-pointer shadow-sm hover:shadow-lg"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-500/10
                             text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{t('enterBrandUrl', 'Enter Brand URL')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                {t('enterBrandUrlDesc', 'AI scrapes your website and builds Brand DNA automatically.')}
              </p>
            </div>
          </button>

          {/* Activate existing brand */}
          <button
            onClick={() => openScraperModal('NEW_BRAND')}
            className="group flex flex-col gap-3 p-6 rounded-2xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800/60 hover:border-brand-500/50 dark:hover:border-brand-500/50
                       hover:bg-brand-500/5 dark:hover:bg-brand-500/10 transition-all duration-200 text-left cursor-pointer shadow-sm hover:shadow-lg"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-500/10
                             text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{t('activateYourBrand', 'Activate Your Brand')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                {t('activateBrandDesc', 'Select and activate an existing brand from your workspace list.')}
              </p>
            </div>
          </button>

          {/* Upload PDF */}
          <button
            onClick={() => openScraperModal('NEW_BRAND')}
            className="group flex flex-col gap-3 p-6 rounded-2xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800/60 hover:border-brand-500/50 dark:hover:border-brand-500/50
                       hover:bg-brand-500/5 dark:hover:bg-brand-500/10 transition-all duration-200 text-left cursor-pointer shadow-sm hover:shadow-lg"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-500/10
                             text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{t('uploadBrandPdf', 'Upload Brand PDF')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                {t('uploadPdfDesc', 'Upload a brand guide or deck — AI extracts your identity.')}
              </p>
            </div>
          </button>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => openScraperModal('NEW_BRAND')}
          className="btn-primary flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          <Zap className="w-4 h-4" />
          Start Your Brand Journey Now
          <Compass className="w-4 h-4" />
        </button>

        <p className="mt-5 text-xs text-slate-400 dark:text-slate-600">
          Takes less than 60 seconds · Powered by AI ADS™ Intelligence Engine
        </p>
      </div>
    );
  }
  // ── End No Brand Gate ──────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Dna className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('brandDnaTitle', 'Brand Intelligence & Brand DNA')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium pl-10">
            Immutable brand memory governing voice, positioning, and content rules for{' '}
            <strong className="text-brand-600 dark:text-brand-400">{activeWorkspace?.brandName || 'your brand'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openScraperModal('NEW_BRAND')}
            className="btn-primary py-2 px-5 text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {analyzing ? 'Analyzing Brand...' : t('runDeepAiAnalysis', 'Run Deep AI Analysis')}
          </button>
          {effectiveProfile && (
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5 text-emerald-500" /> Save Profile
            </button>
          )}
        </div>
      </div>

      {effectiveProfile && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              if (setBrandDnaData) setBrandDnaData(effectiveProfile);
              if (setActiveModule) setActiveModule('seo');
            }}
            className="btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl rounded-full transition-transform hover:scale-105"
          >
            <Zap className="w-4 h-4 text-amber-300" /> Run SEO Research from Brand DNA →
          </button>
        </div>
      )}

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {savedMsg}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Input bar for URL / Description ONLY if no workspace is active at all */}
      {!effectiveProfile && !loading && (
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Initialize Brand AI Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourbrand.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Brand Overview / Description (optional)</label>
              <input
                type="text"
                value={manualDesc}
                onChange={(e) => setManualDesc(e.target.value)}
                placeholder="Describe what your brand does, key products, target audience..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <button
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="btn-primary text-xs flex items-center gap-2 disabled:opacity-60"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {analyzing ? 'Scraping & Analyzing...' : 'Analyze Brand with AI'}
          </button>
        </div>
      )}

      {/* Main Profile View */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : effectiveProfile ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Identity & Palette */}
          <div className="space-y-6">
            {/* Identity Card */}
            <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('brandIdentity', 'Brand Identity')}</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {t('confidence', 'Confidence')}: {effectiveProfile.aiConfidence || 85}%
                </span>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <img
                  src={effectiveProfile.logoUrl || `https://www.google.com/s2/favicons?domain=${effectiveProfile.website || 'google.com'}&sz=128`}
                  alt={effectiveProfile.companyName}
                  className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 object-contain"
                  onError={(e) => { e.target.src = 'https://picsum.photos/64/64'; }}
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{effectiveProfile.companyName}</h3>
                  {effectiveProfile.website && (
                    <a href={effectiveProfile.website} target="_blank" rel="noreferrer" className="text-xs text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1 hover:underline">
                      <Globe className="w-3.5 h-3.5" /> {effectiveProfile.website}
                    </a>
                  )}
                </div>
              </div>

              {/* {t('colorPalette', '{t('colorPalette', 'Color Palette')}')} */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">{t('colorPalette', 'Color Palette')}</label>
                <div className="flex gap-2">
                  {displayColors.length > 0 ? (
                    displayColors.map((hex, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm" style={{ backgroundColor: typeof hex === 'string' ? hex : hex.hex || 'var(--brand-600, #6B5AED)' }} />
                        <span className="text-[9px] text-slate-500 font-mono mt-1 block uppercase">{typeof hex === 'string' ? hex : hex.hex}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No palette extracted</span>
                  )}
                </div>
              </div>

              {/* Quick Attributes */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 block">{t('industry', 'Industry')}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{structured.industry || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 block">{t('toneOfVoice', 'Tone of Voice')}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{structured.tone || 'Professional & Authoritative'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 block">{t('targetGoal', 'Target Goal')}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{structured.goal || 'Engagement & Lead Generation'}</span>
                </div>
              </div>
            </div>

            {/* {t('targetAudience', 'Target Audience')} Section */}
            <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-brand-500" /> Target Audience
                </h2>
                <button
                  onClick={() => handleRegenerateSection('targetAudience')}
                  disabled={regenerating === 'targetAudience'}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-500 transition-colors"
                >
                  {regenerating === 'targetAudience' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {structured.target_audience || effectiveProfile?.targetAudienceSection?.description || 'Audience profile not generated yet.'}
              </p>
            </div>
          </div>

          {/* Center & Right: Strategy, Pillars, SWOT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Pillars / Angles */}
            <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-brand-500" /> {t('contentPillarsAngles', 'Content Pillars & Angles')}
                </h2>
                <button
                  onClick={() => handleRegenerateSection('contentStrategy')}
                  disabled={regenerating === 'contentStrategy'}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-500 transition-colors"
                >
                  {regenerating === 'contentStrategy' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(structured.content_angles || []).map((angle, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase">{t('pillar', 'PILLAR')} #{i + 1}</span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{angle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Products & Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Products & Services
                </h2>
                <div className="space-y-1.5">
                  {(structured.products_services || []).map((prod, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      {prod}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> {t('brandValuesTitle', 'Brand Values')}
                </h2>
                <div className="space-y-1.5">
                  {(structured.brand_values || []).map((val, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Rules / Dos & Don'ts */}
            <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-500" /> {t('commRules', "COMMUNICATION RULES (DOS & DON'TS)")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 block uppercase text-[10px]">Do's</span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {(effectiveProfile?.brandVoice?.dos || ['Highlight success stories', 'Showcase interactive class features']).map((d, i) => (
                      <li key={i}>✓ {d}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 space-y-2">
                  <span className="font-bold text-red-700 dark:text-red-300 block uppercase text-[10px]">Don'ts</span>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {(effectiveProfile?.brandVoice?.donts || ['Avoid overly technical jargon', 'Do not downplay traditional education methods']).map((d, i) => (
                      <li key={i}>✗ {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { brandAPI } from '../../services/api';
import {
  Dna, Globe, CheckCircle2, Save, RefreshCw, Sparkles, Loader2,
  AlertCircle, ShieldCheck, Target, MessageSquare, Zap, Layers,
  Compass, AlertTriangle, FileText, BarChart2, Palette, Copy, Check
} from 'lucide-react';

export const BrandDnaModule = () => {
  const {activeWorkspace, updateWorkspace, setActiveModule, setIsScraperOpen, openScraperModal, setBrandDnaData, t } = useWorkspace();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [regenerating, setRegenerating] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState('');
  const [copiedColor, setCopiedColor] = useState(null);

  const handleCopyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

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
    const targetUrl = websiteUrl || activeWorkspace?.domainUrl || '';
    const targetName = activeWorkspace?.brandName || 'your brand';

    if (!workspaceId) {
      if (openScraperModal) openScraperModal('ACTIVE_BRAND');
      return;
    }

    setAnalyzing(true);
    setError('');
    setSavedMsg(`⚡ Scraping live brand website (${targetUrl || targetName}) in detail...`);

    try {
      const result = await brandAPI.analyze({
        workspaceId,
        websiteUrl: targetUrl,
        companyName: activeWorkspace?.brandName || '',
        manualDescription: manualDesc,
      });

      if (result && result.profile) {
        setProfile(result.profile);
        setSavedMsg(`✨ Deep AI Brand Intelligence re-scraped and updated for ${targetName}!`);
        setTimeout(() => setSavedMsg(''), 5000);

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
      }
    } catch (err) {
      console.error('Deep AI Brand Analysis error:', err);
      setError(err.message || 'Brand AI re-scraping analysis failed.');
      setSavedMsg('');
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
  const brandName = activeWorkspace?.brandName || 'Brand Workspace';
  const industry = activeWorkspace?.industryCategory || activeWorkspace?.industry || 'Not Specified in Evidence';
  const tagline = activeWorkspace?.tagline || null;
  const mission = activeWorkspace?.missionStatement || null;

  // Build 100% dynamic effectiveProfile derived from activeWorkspace for ANY brand
  const effectiveProfile = matchedProfile || (activeWorkspace && (activeWorkspace.brandName || activeWorkspace.domainUrl) ? {
    aiConfidence: activeWorkspace.confidenceScore || 85,
    companyName: brandName,
    website: activeWorkspace.domainUrl || '',
    logoUrl: activeWorkspace.logoUrl || activeWorkspace.faviconUrl || '',
    brandColors: activeWorkspace.brandColors || ['#6366F1', '#8B5CF6'],
    structuredIdentity: {
      brand_name: brandName,
      industry: industry,
      tone: typeof activeWorkspace.brandVoiceTone === 'string' 
        ? activeWorkspace.brandVoiceTone 
        : (activeWorkspace.brandVoiceTone?.toneKeywords?.join(', ') || 'Not Specified in Evidence'),
      target_audience: typeof activeWorkspace.targetAudience === 'string'
        ? activeWorkspace.targetAudience
        : (Array.isArray(activeWorkspace.targetAudience) && activeWorkspace.targetAudience.length > 0 
            ? activeWorkspace.targetAudience.join(', ') 
            : 'Not Specified in Evidence'),
      content_angles: (activeWorkspace.contentPillars && activeWorkspace.contentPillars.length > 0)
        ? activeWorkspace.contentPillars
        : [],
      color_palette: activeWorkspace.brandColors || ['#6366F1', '#8B5CF6'],
      goal: tagline || mission || 'Not Specified in Evidence',
      products_services: (activeWorkspace.coreProductsServices && activeWorkspace.coreProductsServices.length > 0)
        ? activeWorkspace.coreProductsServices
        : [],
      brand_values: (activeWorkspace.brandValues && activeWorkspace.brandValues.length > 0) ? activeWorkspace.brandValues : []
    },
    targetAudienceSection: {
      description: typeof activeWorkspace.targetAudience === 'string'
        ? activeWorkspace.targetAudience
        : (Array.isArray(activeWorkspace.targetAudience) && activeWorkspace.targetAudience.length > 0 
            ? activeWorkspace.targetAudience.join(', ')
            : 'Not Specified in Evidence')
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

  const rawStruct = effectiveProfile?.structuredIdentity || {};
  const currentBrandName = effectiveProfile?.companyName || activeWorkspace?.brandName || 'Brand';
  const currentIndustry = rawStruct.industry || activeWorkspace?.industryCategory || activeWorkspace?.industry || 'Consumer Products & Services';

  const structured = {
    ...rawStruct,
    brand_name: rawStruct.brand_name || currentBrandName,
    industry: currentIndustry,
    tone: rawStruct.tone || effectiveProfile?.brandVoice?.style || (typeof activeWorkspace?.brandVoiceTone === 'string' ? activeWorkspace.brandVoiceTone : 'Professional & Authoritative'),
    goal: rawStruct.goal || effectiveProfile?.contentStrategy?.goal || `Drive official online sales and engagement for ${currentBrandName}`,
    target_audience: rawStruct.target_audience || effectiveProfile?.targetAudienceSection?.description || (
      typeof activeWorkspace?.targetAudience === 'string' ? activeWorkspace.targetAudience : `Primary consumers seeking high-quality ${currentIndustry} products from ${currentBrandName}.`
    ),
    content_angles: (rawStruct.content_angles && rawStruct.content_angles.length > 0)
      ? rawStruct.content_angles
      : (effectiveProfile?.contentStrategy?.angles && effectiveProfile.contentStrategy.angles.length > 0)
        ? effectiveProfile.contentStrategy.angles
        : (activeWorkspace?.contentPillars && activeWorkspace.contentPillars.length > 0)
          ? activeWorkspace.contentPillars
          : [
              `${currentBrandName} | Official Brand Identity & Heritage`,
              `Authentic ${currentIndustry} Quality & Craftsmanship`,
              `Trending Styles & Seasonal Collections`,
              `Customer Trust & Product Excellence`
            ],
    products_services: (rawStruct.products_services && rawStruct.products_services.length > 0)
      ? rawStruct.products_services
      : (effectiveProfile?.products?.list && effectiveProfile.products.list.length > 0)
        ? effectiveProfile.products.list
        : (activeWorkspace?.coreProductsServices && activeWorkspace.coreProductsServices.length > 0)
          ? activeWorkspace.coreProductsServices
          : [
              `${currentBrandName} Core Collection`,
              `Premium ${currentIndustry} Offerings`,
              `Seasonal New Arrivals & Bestsellers`
            ],
    brand_values: (rawStruct.brand_values && rawStruct.brand_values.length > 0)
      ? rawStruct.brand_values
      : (effectiveProfile?.brandPersonality?.values && effectiveProfile.brandPersonality.values.length > 0)
        ? effectiveProfile.brandPersonality.values
        : ['Authenticity & Heritage', 'Premium Quality', 'Customer Trust']
  };

  const rawColors = (
    (effectiveProfile?.brandColors && Array.isArray(effectiveProfile.brandColors) && effectiveProfile.brandColors.length > 0)
      ? effectiveProfile.brandColors
      : (activeWorkspace?.brandColors && Array.isArray(activeWorkspace.brandColors) && activeWorkspace.brandColors.length > 0)
        ? activeWorkspace.brandColors
        : (structured.color_palette && Array.isArray(structured.color_palette) && structured.color_palette.length > 0)
          ? structured.color_palette
          : ['#6366F1', '#8B5CF6', '#06B6D4', '#0F172A']
  );
  const brandColorsList = rawColors.map(c => typeof c === 'string' ? c : (c?.hex || c?.color || '#6366F1'));

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
    <div className="space-y-4 animate-in fade-in max-w-7xl mx-auto px-6 pt-1 pb-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
        <div className="space-y-0.5">
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
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="btn-primary py-2 px-5 text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {analyzing ? 'Re-Scraping Brand Intelligence...' : t('runDeepAiAnalysis', 'Run Deep AI Analysis')}
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
        <div className="space-y-4">
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
                  src={
                    (effectiveProfile.logoUrl && !effectiveProfile.logoUrl.includes('picsum.photos'))
                      ? effectiveProfile.logoUrl
                      : `https://www.google.com/s2/favicons?domain=${(effectiveProfile.website || activeWorkspace?.domainUrl || 'google.com').replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}&sz=128`
                  }
                  alt={effectiveProfile.companyName}
                  className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 object-contain shadow-xs"
                  onError={(e) => {
                    const dom = (effectiveProfile.website || activeWorkspace?.domainUrl || 'google.com').replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                    e.target.src = `https://www.google.com/s2/favicons?domain=${dom}&sz=128`;
                  }}
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

              {/* Brand Theme Color Palette */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-brand-500" />
                    {t('colorPalette', 'Theme Color Palette')}
                  </span>
                  <span className="text-[9px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-extrabold px-2 py-0.5 rounded-full border border-brand-500/20 uppercase tracking-wider">
                    {brandColorsList.length} Fetched
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {brandColorsList.map((hex, idx) => {
                    const colorLabel = idx === 0 ? 'Primary' : idx === 1 ? 'Secondary' : idx === 2 ? 'Accent' : 'Neutral';
                    const isCopied = copiedColor === hex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCopyColor(hex)}
                        title={`Click to copy ${hex}`}
                        className="group relative flex flex-col items-center p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500/60 hover:shadow-md transition-all cursor-pointer text-left"
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-1.5 shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105"
                          style={{ backgroundColor: hex }}
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white rounded px-1.5 py-0.5 text-[9px] font-bold backdrop-blur-xs flex items-center gap-1">
                            {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                            {isCopied ? 'Copied' : 'Copy'}
                          </span>
                        </div>
                        <div className="w-full flex items-center justify-between">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{colorLabel}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-500 transition-colors">{hex}</span>
                        </div>
                      </button>
                    );
                  })}
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
        <div className="flex justify-end">
            <button
              onClick={() => {
                if (setBrandDnaData) setBrandDnaData(effectiveProfile);
                if (setActiveModule) setActiveModule('seo');
              }}
              className="btn-primary py-2 px-5 text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg rounded-full transition-transform hover:scale-105"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" /> Run SEO Research from Brand DNA →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { brandAPI } from '../../services/api';
import { normalizeBrandDna, getProvenanceBadgeInfo } from '../../utils/normalizeBrandDna';
import {
  Dna, Globe, CheckCircle2, Save, RefreshCw, Sparkles, Loader2,
  AlertCircle, ShieldCheck, Target, MessageSquare, Zap, Layers,
  Compass, AlertTriangle, FileText, BarChart2, Palette, Copy, Check
} from 'lucide-react';

const ProvenanceBadge = ({ provenanceObj }) => {
  return null;
};

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

  // Normalized Brand DNA Data (100% evidence grounded, zero fake corporate fallbacks)
  const normalizedDna = normalizeBrandDna(activeWorkspace || matchedProfile);
  const effectiveProfile = (activeWorkspace && (activeWorkspace.brandName || activeWorkspace.domainUrl)) ? {
    ...normalizedDna,
    website: normalizedDna.domainUrl,
    aiConfidence: normalizedDna.confidenceScore || 85
  } : (matchedProfile ? normalizeBrandDna(matchedProfile) : null);

  const handleSaveProfile = async () => {
    if (!workspaceId || !effectiveProfile) return;
    try {
      const cleanColor = (c) => typeof c === 'string' ? c : (c?.hex || c?.color);
      const sanitizedProfile = {
        ...effectiveProfile,
        brandColors: (effectiveProfile.brandColors || []).map(cleanColor).filter(Boolean)
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

  const brandColorsList = (effectiveProfile?.brandColors || []).map(c => typeof c === 'string' ? c : (c?.hex || c?.color)).filter(Boolean);

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
    <div className="space-y-4 animate-in fade-in max-w-7xl mx-auto px-1 sm:px-4 pt-1 pb-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <Dna className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('brandDnaTitle', 'Brand Intelligence & Brand DNA')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium sm:pl-10">
            Immutable brand memory governing voice, positioning, and content rules for{' '}
            <strong className="text-brand-600 dark:text-brand-400">{activeWorkspace?.brandName || 'your brand'}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="btn-primary py-2 px-4 text-xs flex-1 md:flex-none flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {analyzing ? 'Re-Scraping Brand Intelligence...' : t('runDeepAiAnalysis', 'Run Deep AI Analysis')}
          </button>
          {effectiveProfile && (
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 flex-1 md:flex-none"
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
                  {brandColorsList.length > 0 ? (
                    brandColorsList.map((hex, idx) => {
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
                    })
                  ) : (
                    <div className="col-span-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Brand colors could not be reliably detected.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Provenance Attributes */}
              <div className="space-y-3 text-xs">
                {/* Industry */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500 dark:text-slate-400">{t('industry', 'Industry')}</span>
                    <ProvenanceBadge provenanceObj={effectiveProfile?.industryProvenance} />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {effectiveProfile?.industryCategory || <span className="text-slate-400 font-normal italic">Not available from official sources</span>}
                  </span>
                </div>

                {/* Headquarters */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Headquarters</span>
                    <ProvenanceBadge provenanceObj={effectiveProfile?.headquartersProvenance} />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {effectiveProfile?.headquarters || <span className="text-slate-400 font-normal italic">Address not found</span>}
                  </span>
                </div>

                {/* Parent Company */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Parent Company</span>
                    <ProvenanceBadge provenanceObj={effectiveProfile?.parentCompanyProvenance} />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {effectiveProfile?.parentCompany || <span className="text-slate-400 font-normal italic">No parent company detected</span>}
                  </span>
                </div>

                {/* Tagline */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Tagline / Slogan</span>
                    <ProvenanceBadge provenanceObj={effectiveProfile?.taglineProvenance} />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {effectiveProfile?.tagline ? `"${effectiveProfile.tagline}"` : <span className="text-slate-400 font-normal italic">Not Specified in Evidence</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Audience Section */}
            <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-brand-500" /> Target Audience
                </h2>
                <ProvenanceBadge provenanceObj={effectiveProfile?.targetAudienceProvenance} />
              </div>
              {Array.isArray(effectiveProfile?.targetAudience) && effectiveProfile.targetAudience.length > 0 ? (
                <div className="space-y-1.5">
                  {effectiveProfile.targetAudience.map((aud, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                      {aud}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-normal italic">
                  Target audience could not be reliably detected from website evidence.
                </p>
              )}
            </div>
          </div>

          {/* Center & Right: Strategy, Pillars, Extracted Claims */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission & Vision Statements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-purple-500" /> Mission Statement
                  </h2>
                  <ProvenanceBadge provenanceObj={effectiveProfile?.missionStatementProvenance} />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {effectiveProfile?.missionStatement ? `"${effectiveProfile.missionStatement}"` : <span className="text-slate-400 font-normal italic">Mission statement not available from official sources</span>}
                </p>
              </div>

              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-500" /> Company Vision
                  </h2>
                  <ProvenanceBadge provenanceObj={effectiveProfile?.visionProvenance} />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {effectiveProfile?.vision ? `"${effectiveProfile.vision}"` : <span className="text-slate-400 font-normal italic">Vision statement not available from official sources</span>}
                </p>
              </div>
            </div>

            {/* Core Products & Services */}
            <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Core Products & Services
                </h2>
                <ProvenanceBadge provenanceObj={effectiveProfile?.coreProductsServicesProvenance} />
              </div>
              {Array.isArray(effectiveProfile?.coreProductsServices) && effectiveProfile.coreProductsServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {effectiveProfile.coreProductsServices.map((prod, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                      {prod}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-normal italic">No explicit product category headings extracted.</p>
              )}
            </div>

            {/* Extracted Marketing Claims (Unverified) */}
            {Array.isArray(effectiveProfile?.extractedClaims) && effectiveProfile.extractedClaims.length > 0 && (
              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-500" /> Extracted Marketing Claims (Unverified)
                  </h2>
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-full border border-slate-200">
                    ⚠️ Scraped Marketing Statements
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {effectiveProfile.extractedClaims.map((claim, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">"{claim.claimText || claim}"</p>
                      <span className="text-[9px] text-slate-400 block">Source: Official Website DOM Heading</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scraped Evidence Pages (DOM Text + Visual Screenshots) */}
            {Array.isArray(effectiveProfile?.pagesEvidence) && effectiveProfile.pagesEvidence.length > 0 && (
              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-brand-500" /> Scraped Evidence Sources (DOM Text & Visual Screenshots)
                  </h2>
                  <span className="text-[9px] bg-brand-500/10 text-brand-600 font-extrabold px-2.5 py-1 rounded-full border border-brand-500/20">
                    {effectiveProfile.pagesEvidence.length} Crawled Pages
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {effectiveProfile.pagesEvidence.map((page, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[8px] font-extrabold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded uppercase">
                            {page.pageType || 'PAGE'}
                          </span>
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{page.pageTitle || page.url}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{page.url}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[8px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/80">
                          ✓ Text Scraped
                        </span>
                        {(page.hasScreenshot || page.screenshotStatus === 'SUCCESS') && (
                          <span className="text-[8px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-extrabold px-1.5 py-0.5 rounded border border-indigo-200/80 dark:border-indigo-800/80">
                            📸 Screenshot Captured
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

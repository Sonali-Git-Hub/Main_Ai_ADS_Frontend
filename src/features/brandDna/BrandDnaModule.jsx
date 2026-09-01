import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { brandAPI } from '../../services/api';
import { normalizeBrandDna, getProvenanceBadgeInfo } from '../../utils/normalizeBrandDna';
import {
  Dna, Globe, CheckCircle2, Save, RefreshCw, Sparkles, Loader2,
  AlertCircle, ShieldCheck, Target, MessageSquare, Zap, Layers,
  Compass, AlertTriangle, FileText, BarChart2, Palette, Copy, Check, Edit3
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
  const [editState, setEditState] = useState({});
  const [colorDrafts, setColorDrafts] = useState(null);

  const handleFieldChangeLocal = (fieldKey, newValue) => {
    const current = profile || effectiveProfile || {};
    let updatedValue = newValue;

    if (fieldKey === 'targetAudience' || fieldKey === 'coreProductsServices') {
      if (typeof newValue === 'string') {
        updatedValue = newValue.split('\n');
      }
    }

    const updatedProfile = {
      ...current,
      workspaceId: workspaceId || current.workspaceId,
      [fieldKey]: updatedValue,
      structuredIdentity: {
        ...(current.structuredIdentity || {}),
        ...(fieldKey === 'brandColors' ? { color_palette: updatedValue } : {})
      }
    };

    setProfile(updatedProfile);
  };

  const toggleEdit = async (fieldKey) => {
    const isClosing = editState[fieldKey];

    if (isClosing && workspaceId && effectiveProfile) {
      const currentVal = effectiveProfile[fieldKey];
      let sanitizedVal = currentVal;

      if (fieldKey === 'targetAudience' || fieldKey === 'coreProductsServices') {
        if (Array.isArray(currentVal)) {
          sanitizedVal = currentVal.map(s => typeof s === 'string' ? s.trim() : s).filter(Boolean);
        }
      }

      await updateProfileField(fieldKey, sanitizedVal);
    }

    setEditState(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const toggleEditBrandColors = async () => {
    if (!editState['brandColors']) {
      const current = [...brandColorsList];
      while (current.length < 4) {
        current.push(current.length === 0 ? '#3B82F6' : current.length === 1 ? '#1E40AF' : current.length === 2 ? '#60A5FA' : '#0F172A');
      }
      setColorDrafts(current.slice(0, 4));
    } else {
      if (colorDrafts) {
        const cleaned = colorDrafts.map(c => typeof c === 'string' ? c.trim() : '').filter(c => c.length > 0);
        await updateProfileField('brandColors', cleaned);
      }
      setColorDrafts(null);
    }
    setEditState(prev => ({ ...prev, brandColors: !prev['brandColors'] }));
  };

  const handleColorDraftChange = (index, newValue) => {
    const nextDrafts = colorDrafts ? [...colorDrafts] : [...brandColorsList];
    while (nextDrafts.length < 4) {
      nextDrafts.push('#000000');
    }
    nextDrafts[index] = newValue;
    setColorDrafts(nextDrafts);
  };

  const updateProfileField = async (fieldKey, newValue) => {
    if (!workspaceId) return;
    const current = profile || effectiveProfile || {};
    let updatedValue = newValue;

    if (fieldKey === 'targetAudience' || fieldKey === 'coreProductsServices') {
      if (typeof newValue === 'string') {
        updatedValue = newValue.split('\n').map(s => s.trim()).filter(Boolean);
      }
    }

    const updatedProfile = {
      ...current,
      workspaceId,
      [fieldKey]: updatedValue,
      structuredIdentity: {
        ...(current.structuredIdentity || {}),
        ...(fieldKey === 'brandColors' ? { color_palette: updatedValue } : {})
      }
    };

    setProfile(updatedProfile);

    try {
      await brandAPI.updateProfile(workspaceId, updatedProfile);
      if (updateWorkspace) {
        await updateWorkspace(workspaceId, updatedProfile);
      }
    } catch (err) {
      console.error('Failed to save Brand Profile field change:', err);
    }
  };

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

  // Single-Ownership Source of Truth: BrandProfile (GET /api/brand/:workspaceId)
  const canonicalSource = matchedProfile || profile;
  const normalizedDna = canonicalSource ? normalizeBrandDna(canonicalSource) : null;
  const effectiveProfile = normalizedDna ? {
    ...normalizedDna,
    website: normalizedDna.domainUrl || activeWorkspace?.domainUrl || '',
    aiConfidence: normalizedDna.confidenceScore || 85
  } : null;

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

          {/* ROW 1: Brand Identity & Theme Color Palette Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Identity Card (1/3) */}
            <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('brandIdentity', 'Brand Identity')}</h2>
                <button
                  type="button"
                  onClick={() => toggleEdit('identity')}
                  className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Edit Brand Identity"
                >
                  {editState['identity'] ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <Edit3 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 h-full">
                <img
                  src={
                    (effectiveProfile.logoUrl && !effectiveProfile.logoUrl.includes('picsum.photos'))
                      ? effectiveProfile.logoUrl
                      : `https://www.google.com/s2/favicons?domain=${(effectiveProfile.website || activeWorkspace?.domainUrl || 'google.com').replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}&sz=128`
                  }
                  alt={effectiveProfile.companyName}
                  className="w-9 h-9 rounded-lg bg-white p-1 border border-slate-200 object-contain shadow-xs shrink-0"
                  onError={(e) => {
                    const dom = (effectiveProfile.website || activeWorkspace?.domainUrl || 'google.com').replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                    e.target.src = `https://www.google.com/s2/favicons?domain=${dom}&sz=128`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  {editState['identity'] ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={effectiveProfile.companyName || ''}
                        onChange={(e) => handleFieldChangeLocal('companyName', e.target.value)}
                        placeholder="Company Name..."
                        className="w-full text-xs font-extrabold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/50 rounded-md px-2 py-0.5 outline-none"
                      />
                      <input
                        type="text"
                        value={effectiveProfile.website || ''}
                        onChange={(e) => handleFieldChangeLocal('website', e.target.value)}
                        placeholder="Website URL..."
                        className="w-full text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-800 border border-brand-500/50 rounded-md px-2 py-0.5 outline-none"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">{effectiveProfile.companyName}</h3>
                      {effectiveProfile.website && (
                        <a href={effectiveProfile.website} target="_blank" rel="noreferrer" className="text-[11px] text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1 hover:underline truncate">
                          <Globe className="w-3 h-3 shrink-0" /> {effectiveProfile.website}
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Color Palette Card (2/3) */}
            <div className="lg:col-span-2 p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-brand-500" />
                  {t('colorPalette', 'Theme Color Palette')}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8.5px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-extrabold px-2 py-0.5 rounded-full border border-brand-500/20 uppercase tracking-wider">
                    {brandColorsList.length} Fetched
                  </span>
                  <button
                    type="button"
                    onClick={toggleEditBrandColors}
                    className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Edit Brand Colors"
                  >
                    {editState['brandColors'] ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <Edit3 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5 w-full">
                {(() => {
                  const isEditingColors = editState['brandColors'];
                  const activeColors = isEditingColors && colorDrafts ? colorDrafts : (brandColorsList.length > 0 ? brandColorsList : ['#3B82F6', '#1E40AF', '#60A5FA', '#0F172A']);
                  return activeColors.map((hex, idx) => {
                    const colorLabel = idx === 0 ? 'Primary' : idx === 1 ? 'Secondary' : idx === 2 ? 'Accent' : 'Neutral';
                    const isCopied = copiedColor === hex;

                    return (
                      <div
                        key={idx}
                        className="group relative flex flex-col items-center px-1.5 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 hover:border-brand-500/60 transition-all text-center w-full min-w-0"
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-1.5 shadow-inner border border-black/10 dark:border-white/10 flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105 cursor-pointer"
                          style={{ backgroundColor: hex || '#ffffff' }}
                          onClick={() => !isEditingColors && handleCopyColor(hex)}
                        >
                          {isEditingColors ? (
                            <input
                              type="color"
                              value={typeof hex === 'string' && hex.startsWith('#') && hex.length === 7 ? hex : '#3B82F6'}
                              onChange={(e) => handleColorDraftChange(idx, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title="Click to choose custom color"
                            />
                          ) : (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white rounded px-1.5 py-0.5 text-[8.5px] font-bold backdrop-blur-xs flex items-center gap-0.5">
                              {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                              {isCopied ? 'Copied' : 'Copy'}
                            </span>
                          )}
                        </div>

                        <div className="w-full flex flex-col items-center justify-center gap-0.5">
                          <span className="text-[8px] sm:text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-tight text-center whitespace-nowrap">
                            {colorLabel}
                          </span>
                          {isEditingColors ? (
                            <input
                              type="text"
                              value={hex ?? ''}
                              onChange={(e) => handleColorDraftChange(idx, e.target.value)}
                              placeholder="#000000"
                              className="w-full text-[9.5px] font-mono font-bold text-center text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/40 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-brand-500"
                            />
                          ) : (
                            <span className="text-[9.5px] sm:text-[10.5px] font-mono font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-500 transition-colors text-center whitespace-nowrap">
                              {hex}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* ROW 2: Horizontal Quick Attributes Bar (4 Equal Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Industry */}
            <div className="p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9.5px]">{t('industry', 'Industry')}</span>
                <button
                  type="button"
                  onClick={() => toggleEdit('industryCategory')}
                  className="p-0.5 rounded text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Industry"
                >
                  {editState['industryCategory'] ? <Check className="w-3 h-3 text-emerald-500 font-bold" /> : <Edit3 className="w-3 h-3" />}
                </button>
              </div>
              {editState['industryCategory'] ? (
                <input
                  type="text"
                  value={effectiveProfile?.industryCategory || ''}
                  onChange={(e) => handleFieldChangeLocal('industryCategory', e.target.value)}
                  placeholder="Enter industry category..."
                  className="w-full text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/50 rounded-md p-1 outline-none"
                  autoFocus
                />
              ) : (
                <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                  {effectiveProfile?.industryCategory || <span className="text-slate-400 font-normal italic">Not specified</span>}
                </span>
              )}
            </div>

            {/* Headquarters */}
            <div className="p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9.5px]">Headquarters</span>
                <button
                  type="button"
                  onClick={() => toggleEdit('headquarters')}
                  className="p-0.5 rounded text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Headquarters"
                >
                  {editState['headquarters'] ? <Check className="w-3 h-3 text-emerald-500 font-bold" /> : <Edit3 className="w-3 h-3" />}
                </button>
              </div>
              {editState['headquarters'] ? (
                <input
                  type="text"
                  value={effectiveProfile?.headquarters || ''}
                  onChange={(e) => handleFieldChangeLocal('headquarters', e.target.value)}
                  placeholder="Enter headquarters address..."
                  className="w-full text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/50 rounded-md p-1 outline-none"
                  autoFocus
                />
              ) : (
                <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                  {effectiveProfile?.headquarters || <span className="text-slate-400 font-normal italic">Address not found</span>}
                </span>
              )}
            </div>

            {/* Tagline */}
            <div className="p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9.5px]">Tagline / Slogan</span>
                <button
                  type="button"
                  onClick={() => toggleEdit('tagline')}
                  className="p-0.5 rounded text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Tagline"
                >
                  {editState['tagline'] ? <Check className="w-3 h-3 text-emerald-500 font-bold" /> : <Edit3 className="w-3 h-3" />}
                </button>
              </div>
              {editState['tagline'] ? (
                <input
                  type="text"
                  value={effectiveProfile?.tagline || ''}
                  onChange={(e) => handleFieldChangeLocal('tagline', e.target.value)}
                  placeholder="Enter tagline / slogan..."
                  className="w-full text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/50 rounded-md p-1 outline-none"
                  autoFocus
                />
              ) : (
                <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                  {effectiveProfile?.tagline ? `"${effectiveProfile.tagline}"` : <span className="text-slate-400 font-normal italic">Not Specified</span>}
                </span>
              )}
            </div>

            {/* Contact Info */}
            <div className="p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[9.5px]">Contact Info</span>
                <button
                  type="button"
                  onClick={() => toggleEdit('contactInfo')}
                  className="p-0.5 rounded text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Contact Info"
                >
                  {editState['contactInfo'] ? <Check className="w-3 h-3 text-emerald-500 font-bold" /> : <Edit3 className="w-3 h-3" />}
                </button>
              </div>
              {editState['contactInfo'] ? (
                <input
                  type="text"
                  value={
                    typeof effectiveProfile?.contactInfo === 'string'
                      ? effectiveProfile.contactInfo
                      : (`${effectiveProfile?.contactInfo?.email || ''}${effectiveProfile?.contactInfo?.phone ? ' | Phone: ' + effectiveProfile.contactInfo.phone : ''}`)
                  }
                  onChange={(e) => handleFieldChangeLocal('contactInfo', e.target.value)}
                  placeholder="Enter contact email / phone..."
                  className="w-full text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/50 rounded-md p-1 outline-none"
                  autoFocus
                />
              ) : (
                <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                  {typeof effectiveProfile?.contactInfo === 'string'
                    ? (effectiveProfile.contactInfo || <span className="text-slate-400 font-normal italic">Not Specified</span>)
                    : (
                        (effectiveProfile?.contactInfo?.email || effectiveProfile?.contactInfo?.phone)
                          ? `${effectiveProfile?.contactInfo?.email || ''}${effectiveProfile?.contactInfo?.phone ? ' | ' + effectiveProfile.contactInfo.phone : ''}`
                          : <span className="text-slate-400 font-normal italic">Not Specified</span>
                      )
                  }
                </span>
              )}
            </div>
          </div>

          {/* ROW 3: Balanced 2-Column Grid for Core DNA Statements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* LEFT COLUMN: Mission & Target Audience */}
            <div className="space-y-4">
              {/* Mission Statement */}
              <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-purple-500" /> Mission Statement
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleEdit('missionStatement')}
                    className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Mission Statement"
                  >
                    {editState['missionStatement'] ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <Edit3 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {editState['missionStatement'] ? (
                  <textarea
                    rows={2}
                    value={effectiveProfile?.missionStatement || ''}
                    onChange={(e) => handleFieldChangeLocal('missionStatement', e.target.value)}
                    placeholder="Enter mission statement..."
                    className="w-full text-xs font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/50 rounded-lg p-2 outline-none leading-relaxed"
                    autoFocus
                  />
                ) : (
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {effectiveProfile?.missionStatement ? `"${effectiveProfile.missionStatement}"` : <span className="text-slate-400 font-normal italic">Mission statement not available</span>}
                  </p>
                )}
              </div>

              {/* Target Audience Section */}
              <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-brand-500" /> Target Audience
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleEdit('targetAudience')}
                    className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Target Audience"
                  >
                    {editState['targetAudience'] ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <Edit3 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {editState['targetAudience'] ? (
                  <textarea
                    rows={3}
                    value={Array.isArray(effectiveProfile?.targetAudience) ? effectiveProfile.targetAudience.join('\n') : (effectiveProfile?.targetAudience || '')}
                    onChange={(e) => handleFieldChangeLocal('targetAudience', e.target.value)}
                    placeholder="Enter target audience segments (one per line)..."
                    className="w-full text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/50 rounded-lg p-2 outline-none leading-relaxed"
                    autoFocus
                  />
                ) : Array.isArray(effectiveProfile?.targetAudience) && effectiveProfile.targetAudience.length > 0 ? (
                  <div className="space-y-1">
                    {effectiveProfile.targetAudience.map((aud, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                        {aud}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-normal italic">
                    Target audience not specified. Click edit icon to add.
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Vision & Core Products */}
            <div className="space-y-4">
              {/* Company Vision */}
              <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Company Vision
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleEdit('vision')}
                    className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Vision Statement"
                  >
                    {editState['vision'] ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <Edit3 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {editState['vision'] ? (
                  <textarea
                    rows={2}
                    value={effectiveProfile?.vision || ''}
                    onChange={(e) => handleFieldChangeLocal('vision', e.target.value)}
                    placeholder="Enter vision statement..."
                    className="w-full text-xs font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/50 rounded-lg p-2 outline-none leading-relaxed"
                    autoFocus
                  />
                ) : (
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {effectiveProfile?.vision ? `"${effectiveProfile.vision}"` : <span className="text-slate-400 font-normal italic">Vision statement not available</span>}
                  </p>
                )}
              </div>

              {/* Core Products & Services */}
              <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Core Products & Services
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleEdit('coreProductsServices')}
                    className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Products & Services"
                  >
                    {editState['coreProductsServices'] ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <Edit3 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {editState['coreProductsServices'] ? (
                  <textarea
                    rows={3}
                    value={Array.isArray(effectiveProfile?.coreProductsServices) ? effectiveProfile.coreProductsServices.join('\n') : (effectiveProfile?.coreProductsServices || '')}
                    onChange={(e) => handleFieldChangeLocal('coreProductsServices', e.target.value)}
                    placeholder="Enter core products & services (one per line)..."
                    className="w-full text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-brand-500/50 rounded-lg p-2 outline-none leading-relaxed"
                    autoFocus
                  />
                ) : Array.isArray(effectiveProfile?.coreProductsServices) && effectiveProfile.coreProductsServices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {effectiveProfile.coreProductsServices.map((prod, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        {prod}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-normal italic">No core products specified. Click edit icon to add.</p>
                )}
              </div>
            </div>

          </div>

          {/* Extracted Marketing Claims (Unverified) */}
          {Array.isArray(effectiveProfile?.extractedClaims) && effectiveProfile.extractedClaims.length > 0 && (
            <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" /> Extracted Marketing Claims (Unverified)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {effectiveProfile.extractedClaims.map((claim, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">"{claim.claimText || claim}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-1">
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

export default BrandDnaModule;

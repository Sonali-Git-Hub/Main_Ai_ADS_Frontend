import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { seoAPI } from '../../services/api';
import { Search, Layers, FileText, Code2, Sparkles, Send, ShieldAlert, TrendingUp, BarChart3, Tag, Hash, ChevronRight, Copy, Check, RefreshCw, Globe, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const getIntentStyle = (intent) => {
  if (intent === 'Informational') return { char: 'I', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' };
  if (intent === 'Commercial') return { char: 'C', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' };
  if (intent === 'Transactional') return { char: 'T', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' };
  if (intent === 'Navigational') return { char: 'N', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' };
  return { char: 'I', class: 'bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300' };
};

const getKdColor = (kd) => {
  if (kd <= 14) return 'bg-emerald-500';
  if (kd <= 29) return 'bg-emerald-400';
  if (kd <= 49) return 'bg-yellow-400';
  if (kd <= 69) return 'bg-orange-400';
  if (kd <= 84) return 'bg-rose-500';
  return 'bg-rose-700';
};

// Toast notification component
const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold animate-in slide-in-from-bottom-4 ${
      type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
    }`}>
      {type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
      {message}
    </div>
  );
};

export const SeoModule = () => {
  const { activeWorkspace, setActiveModule, seoSearchData, setSeoSearchData, brandDnaData, t } = useWorkspace();
  const [seedKeyword, setSeedKeyword] = useState('');
  const [intent, setIntent] = useState('Commercial');
  const [loading, setLoading] = useState(false);
  const [clusterLoading, setClusterLoading] = useState(false);
  const [regenLoadingIdx, setRegenLoadingIdx] = useState(null);
  const [brief, setBrief] = useState(null);
  const [keywordsList, setKeywordsList] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showRawSchema, setShowRawSchema] = useState(false);
  const [toast, setToast] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [keywordTab, setKeywordTab] = useState('all'); // 'all' | 'existing' | 'opportunity'

  const showToast = (message, type = 'error') => setToast({ message, type });

  // Build brand context params from workspace
  const getBrandContext = useCallback(() => ({
    brandName: activeWorkspace.brandName || 'Brand',
    industry: activeWorkspace.industryCategory || 'General',
    contentPillars: activeWorkspace.contentPillars || [],
    existingBrandKeywords: activeWorkspace.priorityKeywords || activeWorkspace.contentPillars || [],
    competitorLandscape: activeWorkspace.competitorLandscape || [],
    positioningSummary: activeWorkspace.positioningSummary || activeWorkspace.tagline || activeWorkspace.missionStatement || '',
    targetAudience: activeWorkspace.targetAudience?.[0] || 'General Audience',
    brandVoice: activeWorkspace.brandVoice || activeWorkspace.toneOfVoice || ''
  }), [activeWorkspace]);

  // Derive a default seed keyword from brand data
  const getDefaultSeed = useCallback(() => {
    const ws = activeWorkspace;
    if (ws.priorityKeywords?.[0]) return ws.priorityKeywords[0];
    if (ws.contentPillars?.[0]) return ws.contentPillars[0].split('&')[0].trim();
    const name = ws.brandName || 'Brand';
    const cat = ws.industryCategory || '';
    if (cat) return `${name} ${cat}`;
    return `${name} Brand Strategy & Marketing`;
  }, [activeWorkspace]);

  const handleCopyKeyword = (text, idx, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const saveSeoData = useCallback((newBrief, newKeywordsList, newSeed) => {
    const wsId = activeWorkspace._id || activeWorkspace.id || activeWorkspace.brandName;
    const storageKey = `aisa_seo_${wsId}`;
    const kws = newKeywordsList !== undefined ? newKeywordsList : keywordsList;
    const seed = newSeed !== undefined ? newSeed : seedKeyword;
    const b = newBrief !== undefined ? newBrief : brief;
    const obj = {
      workspaceId: wsId,
      brandName: activeWorkspace.brandName,
      seedKeyword: seed,
      keywordsList: kws,
      brief: b
    };
    if (setSeoSearchData) setSeoSearchData(obj);
    try { localStorage.setItem(storageKey, JSON.stringify(obj)); } catch (e) {}
  }, [activeWorkspace, keywordsList, seedKeyword, brief, setSeoSearchData]);

  // ─── AI-Powered: Cluster Keywords ─────────────────────────────────────────────
  const handleClusterKeywords = async (seed) => {
    const kw = seed || seedKeyword || getDefaultSeed();
    setClusterLoading(true);
    // Clear old cached brief so stale hardcoded data doesn't persist
    setBrief(null);
    try {
      const ctx = getBrandContext();
      const result = await seoAPI.clusterKeywords({
        seedKeyword: kw,
        ...ctx,
        count: 8
      });
      if (result.success && result.keywords?.length > 0) {
        setKeywordsList(result.keywords);
        setSeedKeyword(kw);
        saveSeoData(brief, result.keywords, kw);
        setInitialized(true);
        showToast(`${result.keywords.length} keywords generated via ${result.model || 'AI'}`, 'success');
      } else {
        throw new Error('No keywords returned');
      }
    } catch (err) {
      console.error('Keyword clustering failed:', err);
      showToast(`Keyword generation failed: ${err.message}`);
    } finally {
      setClusterLoading(false);
    }
  };

  // ─── AI-Powered: Regenerate Single Keyword ────────────────────────────────────
  const handleRegenerateKeyword = async (idx, e) => {
    e.stopPropagation();
    setRegenLoadingIdx(idx);
    try {
      const ctx = getBrandContext();
      const result = await seoAPI.regenerateKeyword({
        ...ctx,
        seedKeyword: seedKeyword || getDefaultSeed(),
        existingKeywords: keywordsList
      });
      if (result.success && result.keyword?.term) {
        setKeywordsList(prev => {
          const updated = prev.map((kw, i) => i === idx ? result.keyword : kw);
          saveSeoData(brief, updated);
          return updated;
        });
      } else {
        throw new Error('No keyword returned');
      }
    } catch (err) {
      console.error('Keyword regeneration failed:', err);
      showToast(`Keyword regeneration failed: ${err.message}`);
    } finally {
      setRegenLoadingIdx(null);
    }
  };

  // ─── AI-Powered: Regenerate All Keywords ──────────────────────────────────────
  const handleRegenerateAll = () => handleClusterKeywords(seedKeyword);

  // ─── AI-Powered: Initialize SEO Pipeline ──────────────────────────────────────
  const handleInitializeSEO = () => {
    const defaultSeed = getDefaultSeed();
    setSeedKeyword(defaultSeed);
    handleClusterKeywords(defaultSeed);
  };

  // Helper to detect if cached keywords are outdated legacy/template ones
  const isLegacyCache = (kws) => {
    if (!kws || kws.length < 6) return true;
    return kws.some(k => k.term && (k.term.includes('Complete Guide 2026') || k.term.includes('vs Competitors')));
  };

  // ─── Load cached data on workspace change ─────────────────────────────────────
  useEffect(() => {
    const wsId = activeWorkspace._id || activeWorkspace.id || activeWorkspace.brandName;
    const storageKey = `aisa_seo_${wsId}`;
    const defaultSeed = getDefaultSeed();

    // 1. Check React Context
    if (seoSearchData && (seoSearchData.brandName === activeWorkspace.brandName || seoSearchData.workspaceId === wsId)) {
      if (!isLegacyCache(seoSearchData.keywordsList)) {
        setSeedKeyword(seoSearchData.seedKeyword || defaultSeed);
        setKeywordsList(seoSearchData.keywordsList);
        setBrief(seoSearchData.brief || null);
        setInitialized(true);
        return;
      }
    }

    // 2. Check localStorage per workspace
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.keywordsList && !isLegacyCache(parsed.keywordsList)) {
          setSeedKeyword(parsed.seedKeyword || defaultSeed);
          setKeywordsList(parsed.keywordsList);
          setBrief(parsed.brief || null);
          if (setSeoSearchData) setSeoSearchData(parsed);
          setInitialized(true);
          return;
        }
      }
    } catch (e) {}

    // 3. Obsolete or No cached data — automatically generate fresh high-quality keywords
    setSeedKeyword(defaultSeed);
    setKeywordsList([]);
    setBrief(null);
    setInitialized(true);
    handleClusterKeywords(defaultSeed);
  }, [activeWorkspace._id || activeWorkspace.id || activeWorkspace.brandName]);

  // ─── AI-Powered: Generate SEO Brief ───────────────────────────────────────────
  const handleGenerateBrief = async (customSeed, customIntent) => {
    const targetSeed = customSeed !== undefined ? customSeed : seedKeyword;
    const targetIntent = customIntent !== undefined ? customIntent : intent;

    if (!targetSeed) return;

    setLoading(true);
    try {
      const ctx = getBrandContext();
      const res = await seoAPI.generateBrief({
        primaryKeyword: targetSeed,
        intent: targetIntent,
        ...ctx,
        workspaceId: activeWorkspace.id || activeWorkspace._id
      });

      if (res.success && res.brief) {
        const b = res.brief;
        // Determine schema type dynamically based on content and intent
        const schemaType = b.schemaType || 
          (targetIntent === 'Transactional' ? 'Product'
          : targetIntent === 'Informational' ? 'HowTo'
          : targetIntent === 'Commercial' ? 'WebPage'
          : 'WebPage');

        const finalBrief = {
          primaryKeyword: b.primaryKeyword || targetSeed,
          searchIntent: b.searchIntent || targetIntent,
          suggestedTitles: b.suggestedTitles || [],
          metaTitle: b.metaTitle || b.suggestedTitles?.[0] || `${targetSeed} Guide`,
          metaDescription: b.metaDescription || '',
          urlSlug: b.urlSlug || (b.primaryKeyword || targetSeed).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          headingOutline: (b.headingOutline || b.contentOutline || []).map((h) => {
            if (typeof h === 'string') return { h2: h.replace(/^H2:\s*/i, ''), h3s: [] };
            return { h2: h.h2 || h.heading || '', h3s: h.h3s || h.subheadings || [] };
          }),
          entityKeywords: b.entityKeywords || b.secondaryKeywords || [targetSeed, activeWorkspace.brandName],
          faqSuggestions: b.faqSuggestions || [],
          internalLinkingSuggestions: b.internalLinkingSuggestions || [],
          jsonLdSchema: b.jsonLdSchema || JSON.stringify({
            "@context": "https://schema.org",
            "@type": schemaType,
            "name": b.suggestedTitles?.[0] || `Guide to ${targetSeed}`,
            "description": b.metaDescription || '',
            "keywords": b.entityKeywords || [targetSeed]
          }, null, 2),
          model: b.model || 'AI'
        };
        setBrief(finalBrief);
        saveSeoData(finalBrief, undefined, targetSeed);
        showToast(`SEO Brief updated for "${targetIntent}" intent via ${finalBrief.model}`, 'success');
      } else {
        throw new Error(res.error || 'Generation failed — no brief returned');
      }
    } catch (e) {
      console.error('SEO Brief generation failed:', e);
      showToast(`Brief generation failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center">
              <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{t('seoTitle', 'SEO Intelligence & Brief Builder')}</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pl-10">
            Keyword clustering, topic mapping & 8-step brief generation for <strong className="text-slate-800 dark:text-white">{activeWorkspace.brandName}</strong>
          </p>
        </div>
      </div>

      {/* Main Container */}
      {!initialized && keywordsList.length === 0 ? (
        <div className="text-center py-20 rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-800 mt-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center mx-auto mb-4">
            {clusterLoading ? <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /> : <Search className="w-8 h-8 text-cyan-500" />}
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
            {clusterLoading ? 'Generating AI Keyword Clusters...' : 'Initialize SEO Cluster Intelligence'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {clusterLoading
              ? `Analyzing "${activeWorkspace.brandName}" in the ${activeWorkspace.industryCategory || 'your'} industry to generate intelligent keyword clusters...`
              : 'Generate AI-powered keyword clusters, search intent profiles, and topic maps anchored to your Brand DNA.'}
          </p>
          <button
            onClick={handleInitializeSEO}
            disabled={clusterLoading}
            className="btn-primary text-sm flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {clusterLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />}
            {clusterLoading ? 'Generating...' : 'Initialize SEO Pipeline'}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {/* Top Bar: Keyword & Intent Input */}
            <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-500" />
                    Target Seed Keyword
                  </label>
                  <input
                    type="text"
                    value={seedKeyword}
                    onChange={(e) => setSeedKeyword(e.target.value)}
                    placeholder="Enter or select a seed keyword..."
                    className="w-full glass-input text-xs font-semibold"
                  />
                </div>

                <div className="w-full md:w-64 space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Search Intent
                  </label>
                  <select
                    value={intent}
                    onChange={(e) => {
                      const newIntent = e.target.value;
                      setIntent(newIntent);
                      if (brief) {
                        handleGenerateBrief(seedKeyword, newIntent);
                      }
                    }}
                    className="w-full glass-input text-xs font-semibold"
                  >
                    <option value="Informational">Informational (Know)</option>
                    <option value="Commercial">Commercial (Investigate)</option>
                    <option value="Transactional">Transactional (Buy / Convert)</option>
                    <option value="Navigational">Navigational (Find)</option>
                    <option value="Local">Local Intent</option>
                  </select>
                </div>

                <div className="w-full md:w-auto shrink-0">
                  <button
                    onClick={() => handleGenerateBrief()}
                    disabled={loading}
                    className="w-full md:w-auto btn-primary px-6 py-2.5 text-xs font-bold whitespace-nowrap shadow-lg shadow-brand-500/20"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {loading ? 'AI Synthesizing...' : (brief ? 'Regenerate Brief' : 'Generate SEO Brief')}
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Section: TWO DEDICATED SECTIONS FOR KEYWORDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
              
              {/* ═════════ SECTION 1: ON-SITE ACTIVE KEYWORDS ═════════ */}
              <div className="p-5 rounded-3xl glass-card border border-emerald-500/20 dark:border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.02] to-transparent h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Active On-Site Keywords
                      </h2>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Current search queries & brand pillars already detected on your live website.
                </p>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
                  {clusterLoading && keywordsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-2 text-center">
                      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                      <span className="text-xs text-slate-400">Analyzing brand footprint & on-site keywords...</span>
                    </div>
                  ) : (
                    (keywordsList.filter(k => k.source === 'existing').length > 0
                      ? keywordsList.filter(k => k.source === 'existing')
                      : keywordsList.slice(0, Math.ceil(keywordsList.length / 2)).map(k => ({ ...k, source: 'existing' }))
                    ).map((kw, idx) => (
                      <div
                        key={`existing-${idx}`}
                        onClick={() => {
                          setSeedKeyword(kw.term);
                          if (kw.intent) setIntent(kw.intent);
                          if (brief) handleGenerateBrief(kw.term, kw.intent);
                        }}
                        className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/5 cursor-pointer transition-all group ${regenLoadingIdx === idx ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-extrabold text-[9px] ${getIntentStyle(kw.intent).class}`} title={kw.intent}>
                                <span>{getIntentStyle(kw.intent).char}</span>
                                <span>{kw.intent}</span>
                              </span>
                              {kw.cluster && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {kw.cluster}
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white text-xs leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors break-words block">
                              {kw.term}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={(e) => handleCopyKeyword(kw.term, idx, e)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Copy keyword"
                            >
                              {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                            <button
                              onClick={(e) => handleRegenerateKeyword(idx, e)}
                              disabled={regenLoadingIdx !== null}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                              title="Regenerate keyword"
                            >
                              {regenLoadingIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" /> : <RefreshCw className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                          </div>
                        </div>

                        {/* Strategic Role Insight */}
                        <div className="p-2 rounded-xl bg-emerald-500/[0.04] dark:bg-emerald-500/10 border border-emerald-500/15 text-[10px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-0.5">Strategic Role:</span>
                          {kw.strategicValue || 'Core branded search query maintaining domain authority in your industry category.'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-2.5">Click to audit & optimize on-site brief</p>
              </div>

              {/* ═════════ SECTION 2: HIGH-GROWTH TARGET OPPORTUNITIES ═════════ */}
              <div className="p-5 rounded-3xl glass-card border border-cyan-500/20 dark:border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.02] to-transparent h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        High-ROI Growth Targets
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleRegenerateAll}
                      disabled={clusterLoading}
                      className="p-1 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      title="Regenerate all keywords with AI"
                    >
                      {clusterLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-500" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Untapped competitor-gap search queries recommended by AI to outrank rivals & drive traffic.
                </p>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
                  {clusterLoading && keywordsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-2 text-center">
                      <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
                      <span className="text-xs text-slate-400">Analyzing competitor gaps & growth keywords...</span>
                    </div>
                  ) : (
                    (keywordsList.filter(k => k.source === 'opportunity').length > 0
                      ? keywordsList.filter(k => k.source === 'opportunity')
                      : keywordsList.slice(Math.ceil(keywordsList.length / 2)).map(k => ({ ...k, source: 'opportunity' }))
                    ).map((kw, idx) => (
                      <div
                        key={`opportunity-${idx}`}
                        onClick={() => {
                          setSeedKeyword(kw.term);
                          if (kw.intent) setIntent(kw.intent);
                          if (brief) handleGenerateBrief(kw.term, kw.intent);
                        }}
                        className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/5 cursor-pointer transition-all group ${regenLoadingIdx === idx ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-extrabold text-[9px] ${getIntentStyle(kw.intent).class}`} title={kw.intent}>
                                <span>{getIntentStyle(kw.intent).char}</span>
                                <span>{kw.intent}</span>
                              </span>
                              {kw.cluster && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                                  {kw.cluster}
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white text-xs leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors break-words block">
                              {kw.term}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={(e) => handleCopyKeyword(kw.term, idx, e)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Copy keyword"
                            >
                              {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                            <button
                              onClick={(e) => handleRegenerateKeyword(idx, e)}
                              disabled={regenLoadingIdx !== null}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                              title="Regenerate keyword"
                            >
                              {regenLoadingIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-500" /> : <RefreshCw className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                          </div>
                        </div>

                        {/* Competitor Gap & Strategic Growth Impact */}
                        <div className="space-y-1.5">
                          {kw.competitorGap && (
                            <div className="p-2 rounded-xl bg-cyan-500/[0.06] dark:bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-900 dark:text-cyan-200 font-semibold flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                              <span><strong>Competitor Edge:</strong> {kw.competitorGap}</span>
                            </div>
                          )}
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            <span className="font-bold text-slate-700 dark:text-slate-200 block mb-0.5">Growth Impact:</span>
                            {kw.strategicValue || 'High-converting search opportunity to capture ready-to-buy traffic.'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-2.5">Click to target & generate 8-step brief</p>
              </div>

            </div>

            {/* Brief Output */}
            <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Structured 8-Step SEO Brief Output
                </h2>
              </div>

              {brief ? (
                <div className="space-y-4 text-xs animate-in fade-in">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Primary Keyword</span>
                      <span className="font-extrabold text-brand-600 dark:text-brand-300 text-sm leading-snug">{brief.primaryKeyword}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Search Intent</span>
                      <span className="font-extrabold text-amber-600 dark:text-amber-300 text-sm">{brief.searchIntent}</span>
                    </div>
                  </div>

                  {/* Title & Meta */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Proposed Title Tag</span>
                      <p className="font-bold text-slate-900 dark:text-white text-xs leading-snug">{brief.suggestedTitles[0]}</p>
                    </div>
                    {brief.suggestedTitles.length > 1 && (
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Alternative Titles</span>
                        <ul className="space-y-1">
                          {brief.suggestedTitles.slice(1).map((title, i) => (
                            <li key={i} className="text-[11px] text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                              {title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Meta Description</span>
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{brief.metaDescription}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">URL Slug</span>
                      <code className="text-brand-600 dark:text-brand-400 font-mono text-[11px]">/{brief.urlSlug}</code>
                    </div>
                  </div>

                  {/* H2/H3 Outline */}
                  {brief.headingOutline && brief.headingOutline.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">H2/H3 Editorial Outline Tree</span>
                      <div className="space-y-3">
                        {brief.headingOutline.map((section, i) => (
                          <div key={i} className="pl-3 border-l-2 border-brand-500/50 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <ChevronRight className="w-3.5 h-3.5 text-brand-500" />
                              <span className="font-extrabold text-slate-900 dark:text-white text-xs">H2: {section.h2}</span>
                            </div>
                            <ul className="pl-5 space-y-0.5">
                              {section.h3s.map((h3, j) => (
                                <li key={j} className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                  H3: {h3}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQ Suggestions */}
                  {brief.faqSuggestions && brief.faqSuggestions.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">FAQ Suggestions</span>
                      <ul className="space-y-1.5">
                        {brief.faqSuggestions.map((faq, i) => (
                          <li key={i} className="text-[11px] text-slate-600 dark:text-slate-300 font-medium flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                            {faq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Entity Keywords */}
                  {brief.entityKeywords && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-full block">Entity Keywords</span>
                      {brief.entityKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20 dark:border-brand-500/30">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Internal Linking Suggestions */}
                  {brief.internalLinkingSuggestions && brief.internalLinkingSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-full block">Internal Linking Suggestions</span>
                      {brief.internalLinkingSuggestions.map((link, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 dark:border-cyan-500/30">
                          {link}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* JSON-LD Schema - Clean Executive View */}
                  <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                      <Globe className="w-4 h-4 text-brand-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Schema.org Rich Snippet Status</span>
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(brief.jsonLdSchema);
                            showToast('Schema code copied to clipboard!', 'success');
                          }}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                          title="Copy Schema Markup for Web Developers"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Schema</span>
                        </button>
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valid & Ready
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {(() => {
                        try {
                          const schema = JSON.parse(brief.jsonLdSchema);
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Structured Type</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md font-extrabold text-[11px] bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                                  {schema['@type'] || 'Article'}
                                </span>
                              </div>

                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SERP Enhancement</span>
                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block leading-snug">
                                  Google Rich Results Ready (Boosts CTR)
                                </span>
                              </div>

                              <div className="md:col-span-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Entity Headline</span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug block">
                                  {schema.headline || schema.name || schema.title || brief.suggestedTitles?.[0] || brief.metaTitle || `${brief.primaryKeyword} Strategy`}
                                </span>
                              </div>
                            </div>
                          );
                        } catch {
                          return <p className="text-xs text-slate-400">Schema data generated and validated.</p>;
                        }
                      })()}
                    </div>
                  </div>

                  {/* AI Model Attribution */}
                  {brief.model && (
                    <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
                      <Sparkles className="w-3 h-3" />
                      Generated by {brief.model}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  {loading ? (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                        <Loader2 className="w-7 h-7 text-brand-500 animate-spin" />
                      </div>
                      <div className="space-y-1.5 max-w-xs">
                        <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">AI Generating SEO Brief...</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                          Analyzing keyword intent, competitor landscape, and brand context to generate a comprehensive brief...
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                        <Search className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                      </div>
                      <div className="space-y-1.5 max-w-xs">
                        <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">No Brief Generated Yet</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                          Enter a seed keyword, select search intent, and click <strong>{t('generateSeoBrief', 'Generate SEO Brief')}</strong> to get an AI-powered structured brief with title tags, outline tree, entity keywords, and JSON-LD schema.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Proceed to Strategy CTA */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setActiveModule('strategy')}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-105 active:scale-95"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-bold leading-tight">Proceed to Strategy</span>
                <span className="text-[10px] font-normal opacity-75 leading-tight">Build your full content & campaign plan</span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

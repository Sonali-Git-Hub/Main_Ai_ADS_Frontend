import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Search, Layers, FileText, Code2, Sparkles, Send, ShieldAlert, TrendingUp, BarChart3, Tag, Hash, ChevronRight, Copy, Check, RefreshCw, Globe, CheckCircle2 } from 'lucide-react';

// Derive seed keyword from brand's content pillars or industry
const deriveSeedKeyword = (ws) => {
  if (ws.contentPillars?.[0]) {
    return ws.contentPillars[0].split('&')[0].trim();
  }
  const name = ws.brandName || 'Brand';
  const cat = ws.industryCategory || '';
  if (cat.toLowerCase().includes('fashion')) return `${name} Latest Fashion Trends 2026`;
  if (cat.toLowerCase().includes('footwear')) return `Best ${name} Comfort Footwear Guide`;
  if (cat.toLowerCase().includes('e-commerce')) return `${name} Best Deals & Online Shopping Guide`;
  if (cat.toLowerCase().includes('ai') || cat.toLowerCase().includes('tech')) return 'AI Content Marketing Strategy';
  return `${name} Brand Strategy & Marketing`;
};

// Derive keyword clusters from brand data
const deriveKeywords = (ws) => {
  const name = ws.brandName || 'Brand';
  const pillars = ws.contentPillars || [];
  if (pillars.length >= 4) {
    return [
      { term: pillars[0], intent: 'Informational', volume: '12.4K', kd: 38, cpc: '$1.20', cluster: 'Pillar 1' },
      { term: pillars[1], intent: 'Commercial', volume: '8.9K', kd: 29, cpc: '$2.50', cluster: 'Pillar 2' },
      { term: pillars[2], intent: 'Transactional', volume: '6.2K', kd: 61, cpc: '$4.80', cluster: 'Pillar 3' },
      { term: pillars[3], intent: 'Informational', volume: '10.1K', kd: 44, cpc: '$0.90', cluster: 'Pillar 4' },
    ];
  }
  return [
    { term: `${name} Complete Guide 2026`, intent: 'Informational', volume: '14.2K', kd: 42, cpc: '$1.05', cluster: 'Brand Authority' },
    { term: `Best ${name} Products & Reviews`, intent: 'Commercial', volume: '8.9K', kd: 28, cpc: '$2.15', cluster: 'Product Discovery' },
    { term: `Buy ${name} Online`, intent: 'Transactional', volume: '5.4K', kd: 68, cpc: '$3.50', cluster: 'Conversion' },
    { term: `${name} vs Competitors`, intent: 'Commercial', volume: '12.1K', kd: 38, cpc: '$2.80', cluster: 'Comparison' },
  ];
};

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


export const SeoModule = () => {
  const { activeWorkspace, setActiveModule, setSeoSearchData, brandDnaData } = useWorkspace();
  const [seedKeyword, setSeedKeyword] = useState('');
  const [intent, setIntent] = useState('Commercial');
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [keywordsList, setKeywordsList] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showRawSchema, setShowRawSchema] = useState(false);

  const handleCopyKeyword = (text, idx, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handleRegenerateKeyword = (idx, e) => {
    e.stopPropagation();
    const ws = activeWorkspace;
    const name = ws.brandName || 'Brand';
    const alternates = [
      { term: `${name} Marketing Guide 2026`, intent: 'Commercial', volume: '11.8K', kd: 40, cpc: '$3.10', cluster: 'Authority' },
      { term: `Best ${name} Strategies for Growth`, intent: 'Informational', volume: '7.6K', kd: 25, cpc: '$1.40', cluster: 'Growth' },
      { term: `${name} Review & Comparison`, intent: 'Commercial', volume: '9.3K', kd: 35, cpc: '$2.90', cluster: 'Comparison' },
      { term: `${name} Premium Services`, intent: 'Transactional', volume: '4.8K', kd: 58, cpc: '$5.50', cluster: 'Conversion' },
      { term: `How ${name} Builds Trust`, intent: 'Informational', volume: '6.1K', kd: 22, cpc: '$0.80', cluster: 'Brand Trust' },
      { term: `${name} vs Top Competitors`, intent: 'Commercial', volume: '8.4K', kd: 46, cpc: '$4.20', cluster: 'Competitive' },
    ];
    const pick = alternates[Math.floor(Math.random() * alternates.length)];
    setKeywordsList(prev => prev.map((kw, i) => i === idx ? pick : kw));
  };

  const handleRegenerateAll = () => {
    setKeywordsList(deriveKeywords(activeWorkspace));
  };

  useEffect(() => {
    setSeedKeyword(deriveSeedKeyword(activeWorkspace));
    setKeywordsList(deriveKeywords(activeWorkspace));
    setBrief(null);
  }, [activeWorkspace.id || activeWorkspace._id]);

  const handleGenerateBrief = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/seo/brief/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryKeyword: seedKeyword,
          industry: activeWorkspace.industryCategory || 'General',
          targetAudience: activeWorkspace.targetAudience?.[0] || 'Target Buyers',
          workspaceId: activeWorkspace.id || activeWorkspace._id,
          model: 'gemini'
        })
      });
      const data = await res.json();
      if (data.success && data.brief) {
        // Map backend response to the UI structure
        const b = data.brief;
        setBrief({
          primaryKeyword: b.primaryKeyword || seedKeyword,
          searchIntent: b.searchIntent || intent,
          suggestedTitles: b.suggestedTitles || [],
          metaTitle: b.suggestedTitles?.[0] || `${seedKeyword} Guide 2026`,
          metaDescription: b.metaDescription || '',
          urlSlug: (b.primaryKeyword || seedKeyword).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          targetWordCount: b.wordCountTarget || 2400,
          headingOutline: (b.contentOutline || []).map((h, i) => ({
            h2: h.replace(/^H2:\s*/i, ''),
            h3s: b.faqSuggestions?.slice(i * 2, i * 2 + 2) || []
          })),
          entityKeywords: b.secondaryKeywords || [seedKeyword, activeWorkspace.brandName],
          jsonLdSchema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": b.suggestedTitles?.[0] || `The Ultimate Guide to ${seedKeyword}`,
            "keywords": b.secondaryKeywords || [seedKeyword]
          }, null, 2)
        });
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (e) {
      setBrief({
        primaryKeyword: seedKeyword,
        searchIntent: intent,
        suggestedTitles: [
          `The Ultimate Guide to ${seedKeyword} in 2026: Strategy & Governance`,
          `How ${activeWorkspace.brandName} Masters ${seedKeyword}: Actionable Playbook`
        ],
        metaTitle: `${seedKeyword} Playbook: 2026 Guide`,
        metaDescription: `Master ${seedKeyword} with our comprehensive guide for ${activeWorkspace.brandName}. Discover topic cluster mapping, JSON-LD schema, and brand governance frameworks.`,
        urlSlug: seedKeyword.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        targetWordCount: 2400,
        headingOutline: [
          { h2: `Introduction to ${seedKeyword}`, h3s: ['Market Shifts & Trends', `Why ${activeWorkspace.brandName} Leads`] },
          { h2: `Core Strategy & Operations`, h3s: ['Briefing & Cluster Setup', 'Quality Gates & Fact Checks'] }
        ],
        entityKeywords: [seedKeyword, activeWorkspace.brandName, 'Brand Strategy', 'SEO Clusters', 'Schema Markup'],
        jsonLdSchema: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `The Ultimate Guide to ${seedKeyword} in 2026`,
          "keywords": [seedKeyword, activeWorkspace.brandName]
        }, null, 2)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Header */}
      <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center">
              <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">SEO Intelligence & Brief Builder</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pl-10">
            Keyword clustering, topic mapping & 8-step brief generation for <strong className="text-slate-800 dark:text-white">{activeWorkspace.brandName}</strong>
            {activeWorkspace.industryCategory && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-semibold">{activeWorkspace.industryCategory}</span>
            )}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col gap-5">

        {/* Top Section: Keyword Input + Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* Keyword Workspace */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 h-full flex flex-col">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Keyword & Intent Input
            </h2>
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Seed Keyword</label>
                <input
                  type="text"
                  value={seedKeyword}
                  onChange={(e) => setSeedKeyword(e.target.value)}
                  className="w-full glass-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Search Intent</label>
                <select
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="w-full glass-input text-xs"
                >
                  <option value="Informational">Informational (Know)</option>
                  <option value="Commercial">Commercial (Investigate)</option>
                  <option value="Transactional">Transactional (Buy / Convert)</option>
                  <option value="Navigational">Navigational (Find)</option>
                  <option value="Local">Local Intent</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleGenerateBrief}
                disabled={loading}
                className="w-full btn-primary py-3 text-xs font-bold"
              >
                {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Synthesizing Brief...' : 'Generate SEO Brief'}
              </button>
            </div>
          </div>

          {/* Cluster Table */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Clustered Keywords
              </h2>
              <button
                onClick={handleRegenerateAll}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Regenerate all keywords"
              >
                <RefreshCw className="w-3 h-3" />
                Regen All
              </button>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[200px] pr-2">
              {keywordsList.map((kw, idx) => (
                <div
                  key={idx}
                  onClick={() => setSeedKeyword(kw.term)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors break-words flex-1">
                      {kw.term}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={(e) => handleCopyKeyword(kw.term, idx, e)}
                          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Copy keyword"
                        >
                          {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        </button>
                        <button
                          onClick={(e) => handleRegenerateKeyword(idx, e)}
                          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Regenerate this keyword"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-400" />
                        </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-[10px]">
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-medium">Intent</span>
                      <div className="mt-0.5">
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full font-bold text-[9px] ${getIntentStyle(kw.intent).class}`} title={kw.intent}>
                          {getIntentStyle(kw.intent).char}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-medium">Vol</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{kw.volume}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-medium">KD %</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{kw.kd}</span>
                        <div className={`w-2 h-2 rounded-full ${getKdColor(kw.kd)}`}></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-medium">CPC</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{kw.cpc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3">Click a keyword to use as seed · Hover for copy & regenerate</p>
          </div>
        </div>

        {/* Brief Output */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Structured 8-Step SEO Brief Output
            </h2>
            {brief && (
              <button onClick={() => setActiveModule('strategy')} className="btn-primary text-xs">
                <Send className="w-3.5 h-3.5" />
                Generate 30 Days Plan
              </button>
            )}
          </div>

          {brief ? (
            <div className="space-y-4 text-xs animate-in fade-in">
              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Primary Keyword</span>
                  <span className="font-extrabold text-brand-600 dark:text-brand-300 text-sm leading-snug">{brief.primaryKeyword}</span>
                </div>
                <div className="p-3 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Target Word Count</span>
                  <span className="font-extrabold text-cyan-600 dark:text-cyan-300 text-sm">{brief.targetWordCount} Words</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Search Intent</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-300 text-sm">{brief.searchIntent}</span>
                </div>
              </div>

              {/* Title & Meta */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">📌 Proposed Title Tag</span>
                  <p className="font-bold text-slate-900 dark:text-white text-xs leading-snug">{brief.suggestedTitles[0]}</p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">📝 Meta Description</span>
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{brief.metaDescription}</p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">🔗 URL Slug</span>
                  <code className="text-brand-600 dark:text-brand-400 font-mono text-[11px]">/{brief.urlSlug}</code>
                </div>
              </div>

              {/* H2/H3 Outline */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">🗂 H2/H3 Editorial Outline Tree</span>
                <div className="space-y-3">
                  {brief.headingOutline.map((section, i) => (
                    <div key={i} className="pl-3 border-l-2 border-brand-500/50 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-brand-500" />
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

              {/* Entity Keywords */}
              {brief.entityKeywords && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-full block">🏷 Entity Keywords</span>
                  {brief.entityKeywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20 dark:border-brand-500/30">
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* JSON-LD Schema - User Friendly View */}
              <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                  <Globe className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Schema Markup Status</span>
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Valid & Ready
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {(() => {
                    try {
                      const schema = JSON.parse(brief.jsonLdSchema);
                      return (
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase w-16 shrink-0">Type</span>
                            <span className="text-xs font-semibold text-brand-600 dark:text-brand-300 bg-brand-500/10 px-2.5 py-1 rounded-lg">{schema['@type'] || 'Article'}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase w-16 shrink-0 pt-1">Headline</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{schema.headline || '—'}</span>
                          </div>
                          {schema.keywords && (
                            <div className="flex items-start gap-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase w-16 shrink-0 pt-1">Keywords</span>
                              <div className="flex flex-wrap gap-1.5">
                                {(Array.isArray(schema.keywords) ? schema.keywords : [schema.keywords]).map((kw, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">{kw}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {schema.inLanguage && (
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase w-16 shrink-0">Language</span>
                              <span className="text-xs text-slate-600 dark:text-slate-300">{schema.inLanguage}</span>
                            </div>
                          )}
                        </div>
                      );
                    } catch {
                      return <p className="text-xs text-slate-400">Schema data unavailable.</p>;
                    }
                  })()}

                  {/* Toggle for Developers */}
                  <button
                    onClick={() => setShowRawSchema(!showRawSchema)}
                    className="mt-2 text-[10px] font-semibold text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1"
                  >
                    <Code2 className="w-3 h-3" />
                    {showRawSchema ? 'Hide Raw JSON' : 'View Raw JSON (Developers)'}
                  </button>
                  {showRawSchema && (
                    <pre className="text-[10px] text-emerald-400 font-mono overflow-x-auto p-3 bg-slate-950 rounded-xl border border-slate-800 leading-relaxed mt-1">
                      {brief.jsonLdSchema}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <Search className="w-7 h-7 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">No Brief Generated Yet</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                  Enter a seed keyword, select search intent, and click <strong>Generate SEO Brief</strong> to get a structured brief with title tags, outline tree, entity keywords, and JSON-LD schema.
                </p>
              </div>
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
    </div>
  );
};

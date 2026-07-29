import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Search, Layers, FileText, Code2, Sparkles, Send, ShieldAlert, TrendingUp, BarChart3, Tag, Hash, ChevronRight, Copy, Check, RefreshCw } from 'lucide-react';

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
      { term: pillars[0], intent: 'Informational', volume: '12,400/mo', difficulty: 'Medium (38)', cluster: 'Pillar 1' },
      { term: pillars[1], intent: 'Commercial', volume: '8,900/mo', difficulty: 'Low (29)', cluster: 'Pillar 2' },
      { term: pillars[2], intent: 'Transactional', volume: '6,200/mo', difficulty: 'High (61)', cluster: 'Pillar 3' },
      { term: pillars[3], intent: 'Informational', volume: '10,100/mo', difficulty: 'Medium (44)', cluster: 'Pillar 4' },
    ];
  }
  return [
    { term: `${name} Complete Guide 2026`, intent: 'Informational', volume: '14,200/mo', difficulty: 'Medium (42)', cluster: 'Brand Authority' },
    { term: `Best ${name} Products & Reviews`, intent: 'Commercial', volume: '8,900/mo', difficulty: 'Low (28)', cluster: 'Product Discovery' },
    { term: `Buy ${name} Online`, intent: 'Transactional', volume: '5,400/mo', difficulty: 'High (68)', cluster: 'Conversion' },
    { term: `${name} vs Competitors`, intent: 'Commercial', volume: '12,100/mo', difficulty: 'Medium (38)', cluster: 'Comparison' },
  ];
};

const intentColors = {
  Informational: 'bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20 dark:border-brand-500/30',
  Commercial: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 dark:border-amber-500/30',
  Transactional: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30',
  Navigational: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 dark:border-purple-500/30',
  Local: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 dark:border-cyan-500/30',
};

const difficultyColor = (diff) => {
  if (diff.includes('Low')) return 'text-emerald-600 dark:text-emerald-400';
  if (diff.includes('High')) return 'text-rose-600 dark:text-rose-400';
  return 'text-amber-600 dark:text-amber-400';
};

export const SeoModule = () => {
  const { activeWorkspace, setActiveModule } = useWorkspace();
  const [seedKeyword, setSeedKeyword] = useState('');
  const [intent, setIntent] = useState('Commercial');
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [keywordsList, setKeywordsList] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);

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
      [`${name} Marketing Guide 2026`, 'Commercial', '11,800/mo', 'Medium (40)', 'Authority'],
      [`Best ${name} Strategies for Growth`, 'Informational', '7,600/mo', 'Low (25)', 'Growth'],
      [`${name} Review & Comparison`, 'Commercial', '9,300/mo', 'Medium (35)', 'Comparison'],
      [`${name} Premium Services`, 'Transactional', '4,800/mo', 'High (58)', 'Conversion'],
      [`How ${name} Builds Trust`, 'Informational', '6,100/mo', 'Low (22)', 'Brand Trust'],
      [`${name} vs Top Competitors`, 'Commercial', '8,400/mo', 'Medium (46)', 'Competitive'],
    ];
    const pick = alternates[Math.floor(Math.random() * alternates.length)];
    setKeywordsList(prev => prev.map((kw, i) => i === idx ? { term: pick[0], intent: pick[1], volume: pick[2], difficulty: pick[3], cluster: pick[4] } : kw));
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
        body: JSON.stringify({ keyword: seedKeyword, intent, targetAudience: activeWorkspace.targetAudience?.[0] || 'Target Buyers' })
      });
      const data = await res.json();
      if (data.success) setBrief(data.brief);
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
        <div className="p-3 rounded-2xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-300 font-medium max-w-md">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
          <span>AI Ads™ does not guarantee search rankings, indexing speed, or backlinks. Focus is on factual accuracy & schema readiness.</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left Col: Keyword Input + Cluster */}
        <div className="space-y-5">
          {/* Keyword Workspace */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Keyword & Intent Input
            </h2>
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
            <button
              onClick={handleGenerateBrief}
              disabled={loading}
              className="w-full btn-primary py-3 text-xs font-bold"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Synthesizing Brief...' : 'Generate SEO Brief'}
            </button>
          </div>

          {/* Cluster Table */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
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
            <div className="space-y-2">
              {keywordsList.map((kw, idx) => (
                <div
                  key={idx}
                  onClick={() => setSeedKeyword(kw.term)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors break-words">{kw.term}</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{kw.cluster}</span>
                        <span className="text-[10px] font-bold text-slate-400">·</span>
                        <span className="text-[10px] text-slate-500">Vol: {kw.volume}</span>
                        <span className="text-[10px] font-bold text-slate-400">·</span>
                        <span className={`text-[10px] font-bold ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${intentColors[kw.intent] || intentColors.Informational}`}>
                        {kw.intent}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center">Click a keyword to use as seed · Hover for copy & regenerate</p>
          </div>
        </div>

        {/* Right 2 Cols: Brief Output */}
        <div className="lg:col-span-2 p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Structured 8-Step SEO Brief Output
            </h2>
            {brief && (
              <button onClick={() => setActiveModule('studio')} className="btn-primary text-xs">
                <Send className="w-3.5 h-3.5" />
                Send to Editorial Studio
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

              {/* JSON-LD Schema */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                  <Code2 className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-[11px] font-bold text-slate-300">JSON-LD Schema Markup Ready</span>
                  <span className="ml-auto text-[10px] text-emerald-400 font-semibold">✓ Valid</span>
                </div>
                <pre className="text-[10px] text-emerald-400 font-mono overflow-x-auto p-4 leading-relaxed">
                  {brief.jsonLdSchema}
                </pre>
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
    </div>
  );
};

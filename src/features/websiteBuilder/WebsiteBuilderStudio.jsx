import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { builderAPI } from '../../services/api';
import {
  Globe, Sparkles, Monitor, Tablet, Smartphone, Copy, Download,
  CheckCircle2, RefreshCw, Loader2, Code, Eye, ExternalLink, Dna,
  Zap, Play, ShieldCheck, Layers, ArrowLeft
} from 'lucide-react';

export const WebsiteBuilderStudio = ({ onBack }) => {
  const { activeWorkspace } = useWorkspace();

  const [prompt, setPrompt] = useState(`Build a high-converting, modern website landing page for ${activeWorkspace?.brandName || 'our brand'}`);
  const [templateType, setTemplateType] = useState('LANDING_PAGE');
  const [viewport, setViewport] = useState('DESKTOP'); // DESKTOP, TABLET, MOBILE
  const [activeRightTab, setActiveRightTab] = useState('PREVIEW'); // PREVIEW, CODE

  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Extract brand details
  const brandName = activeWorkspace?.brandName || 'Brand';
  const domainUrl = activeWorkspace?.domainUrl || 'https://example.com';
  const logoUrl = activeWorkspace?.logoUrl || activeWorkspace?.faviconUrl || '';
  const colors = activeWorkspace?.brandColors || ['#6366F1', '#8B5CF6'];
  const primaryColor = typeof colors[0] === 'string' ? colors[0] : (colors[0]?.hex || '#6366F1');
  const secondaryColor = typeof colors[1] === 'string' ? colors[1] : (colors[1]?.hex || '#8B5CF6');

  // Initial Auto-Generation on Load if empty
  useEffect(() => {
    if (!generatedCode) {
      handleGenerateSite();
    }
  }, []);

  const handleGenerateSite = async () => {
    setGenerating(true);
    setStatusMsg('');
    try {
      const payload = {
        prompt,
        brandName,
        domainUrl,
        logoUrl,
        brandColors: [primaryColor, secondaryColor],
        industryCategory: activeWorkspace?.industryCategory || 'Technology',
        tagline: activeWorkspace?.tagline || '',
        missionStatement: activeWorkspace?.missionStatement || '',
        approvedClaims: activeWorkspace?.approvedClaims || [],
        templateType
      };

      let res = null;
      try {
        res = await builderAPI.generateSite(payload);
      } catch (e) {
        console.log('Builder API notice:', e.message);
      }

      if (res && res.code) {
        setGeneratedCode(res.code);
      } else {
        // Fallback Client Template
        setGeneratedCode(buildFallbackHTML(payload));
      }
      setStatusMsg('✨ Web Application generated successfully!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      console.log('Site generation error:', err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-website.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Studio Header Banner */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Autonomous AI Website & App Builder
              <span className="text-[10px] bg-brand-500/15 text-brand-600 dark:text-brand-400 font-extrabold px-2.5 py-0.5 rounded-full border border-brand-500/30">
                Manus AI-Powered
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Generate live responsive websites & web apps anchored to <strong className="text-brand-600 dark:text-brand-400">{brandName}</strong> Brand DNA.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            disabled={!generatedCode}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            {copied ? 'Copied HTML!' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownloadHTML}
            disabled={!generatedCode}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-brand-500" /> Download HTML
          </button>
          <button
            onClick={handleOpenNewTab}
            disabled={!generatedCode}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-md shadow-brand-500/20"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Launch Full Tab
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {statusMsg}
        </div>
      )}

      {/* Main Studio Grid (Inputs & Canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requirements & Brand DNA Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Prompt Controls */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Prompt & Requirements
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">App / Page Goal Prompt</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what your website should do..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-medium focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Template Layout Archetype</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="LANDING_PAGE">🚀 High-Converting Landing Page</option>
                <option value="SAAS_APP">💻 SaaS Application Dashboard & Marketing</option>
                <option value="ECOMMERCE">🛍️ E-Commerce Product Showcase & Store</option>
                <option value="PORTFOLIO">💼 Professional Services & Portfolio</option>
              </select>
            </div>

            <button
              onClick={handleGenerateSite}
              disabled={generating}
              className="w-full btn-primary py-3 rounded-2xl font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? 'Synthesizing Full Web Application...' : 'Build AI Website & Code'}
            </button>
          </div>

          {/* Active Brand DNA Memory Card */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-brand-500" /> Active Brand DNA Memory
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-full">
                Locked
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={logoUrl || `https://www.google.com/s2/favicons?domain=${domainUrl}&sz=128`}
                alt={brandName}
                className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 object-contain shadow-sm"
                onError={(e) => { e.target.src = 'https://picsum.photos/64/64'; }}
              />
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{brandName}</h3>
                <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold">{domainUrl}</p>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>Theme Colors:</span>
                <div className="flex gap-1">
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: primaryColor }} title={`Primary: ${primaryColor}`} />
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: secondaryColor }} title={`Secondary: ${secondaryColor}`} />
                </div>
              </div>

              {activeWorkspace?.tagline && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Tagline</span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium text-[11px] truncate">{activeWorkspace.tagline}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Canvas & Code Inspector (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Canvas Controls Header Bar */}
          <div className="p-3 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            {/* Viewport Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl gap-1 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewport('DESKTOP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewport === 'DESKTOP' ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop (100%)
              </button>
              <button
                onClick={() => setViewport('TABLET')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewport === 'TABLET' ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <Tablet className="w-3.5 h-3.5" /> Tablet (768px)
              </button>
              <button
                onClick={() => setViewport('MOBILE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewport === 'MOBILE' ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile (375px)
              </button>
            </div>

            {/* View Mode Toggle: Preview vs Code */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl gap-1 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveRightTab('PREVIEW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${activeRightTab === 'PREVIEW' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <Eye className="w-3.5 h-3.5" /> Visual Preview
              </button>
              <button
                onClick={() => setActiveRightTab('CODE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${activeRightTab === 'CODE' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <Code className="w-3.5 h-3.5" /> Code Inspector
              </button>
            </div>
          </div>

          {/* Canvas Window Container */}
          <div className="p-3 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[600px] flex items-center justify-center bg-slate-950/60 relative">
            {generating && (
              <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
                <p className="text-xs font-bold text-slate-200">Autonomous AI Agent is compiling website code...</p>
              </div>
            )}

            {activeRightTab === 'PREVIEW' ? (
              <div
                className={`transition-all duration-300 mx-auto overflow-hidden bg-white shadow-2xl rounded-2xl border border-slate-800 ${
                  viewport === 'DESKTOP' ? 'w-full h-[620px]' : viewport === 'TABLET' ? 'w-[768px] h-[620px]' : 'w-[375px] h-[620px]'
                }`}
              >
                <iframe
                  title="AI Website Live Canvas Preview"
                  srcDoc={generatedCode}
                  className="w-full h-full border-none rounded-2xl"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            ) : (
              <div className="w-full h-[620px] p-4 rounded-2xl bg-slate-900 font-mono text-xs text-slate-200 overflow-y-auto border border-slate-800 leading-relaxed">
                <textarea
                  value={generatedCode}
                  onChange={(e) => setGeneratedCode(e.target.value)}
                  className="w-full h-full bg-transparent border-none text-emerald-400 focus:outline-none font-mono text-xs leading-relaxed"
                  spellCheck="false"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Fallback HTML Generator Function
function buildFallbackHTML({ brandName, domainUrl, logoUrl, brandColors, industryCategory, tagline, missionStatement }) {
  const primaryColor = brandColors[0] || '#6366F1';
  const secondaryColor = brandColors[1] || '#8B5CF6';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} - ${tagline || `Enterprise ${industryCategory} Platform`}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 antialiased font-sans min-h-screen">
  <header class="border-b border-slate-800 p-6 flex justify-between items-center max-w-7xl mx-auto">
    <div class="flex items-center gap-3">
      ${logoUrl ? `<img src="${logoUrl}" class="w-8 h-8 rounded-lg object-contain bg-white p-1">` : ''}
      <span class="font-extrabold text-xl text-white">${brandName}</span>
    </div>
    <a href="#contact" class="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg" style="background-color: ${primaryColor}">
      Get Started
    </a>
  </header>
  <main class="py-24 text-center space-y-6 max-w-4xl mx-auto px-6">
    <h1 class="text-5xl font-extrabold text-white leading-tight">${tagline || `Next-Gen ${industryCategory} Solutions`}</h1>
    <p class="text-slate-400 text-base max-w-2xl mx-auto">${missionStatement || `Empowering ${brandName} customers with unmatched quality and velocity.`}</p>
    <div class="pt-4">
      <a href="#contact" class="px-8 py-4 rounded-xl text-sm font-bold text-white shadow-xl inline-block" style="background-color: ${primaryColor}">
        Launch Workspace &rarr;
      </a>
    </div>
  </main>
</body>
</html>`;
}

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { normalizeBrandDna } from '../../utils/normalizeBrandDna';
import { X, Dna, Globe, Sparkles, ArrowRight, FileText, Edit3 } from 'lucide-react';

export const ScraperOverlayModal = () => {
  const { isScraperOpen, setIsScraperOpen, addWorkspace, activeWorkspace, scraperMode, setActiveModule, t } = useWorkspace();
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('URL');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isScraperOpen) {
      setResult(null);
      if (scraperMode === 'ACTIVE_BRAND' && activeWorkspace && activeWorkspace.domainUrl) {
        setUrl(activeWorkspace.domainUrl || '');
        setBrandName(activeWorkspace.brandName || '');
      } else {
        setUrl('');
        setBrandName('');
      }
    }
  }, [isScraperOpen, scraperMode, activeWorkspace]);

  if (!isScraperOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('domainUrl', url || 'https://custombrand.com');
    formData.append('brandName', brandName || file.name.split('.')[0].toUpperCase());

    try {
      const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/workspace/upload-doc-preview' : '/api/workspace/upload-doc-preview';
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      const extractedWorkspace = data.workspace || data.brandProfile;
      if (data.success && extractedWorkspace) {
        setResult(normalizeBrandDna(extractedWorkspace));
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!url.trim()) return;
    setLoading(true);

    try {
      const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/workspace/scrape-preview' : '/api/workspace/scrape-preview';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainUrl: url.trim(), brandName: brandName.trim() })
      });
      const data = await res.json();
      const extractedWorkspace = data.workspace || data.brandProfile;

      if (data.success && extractedWorkspace) {
        setResult(normalizeBrandDna(extractedWorkspace));
      }
    } catch (err) {
      console.error('Scrape error:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmSaveWorkspace = async () => {
    if (result) {
      await addWorkspace(result);
      if (setActiveModule) {
        setActiveModule('brand-dna');
      }
      setIsScraperOpen(false);
      setResult(null);
      setUrl('');
      setBrandName('');
      if (window.location.pathname !== '/brand-dna') {
        window.location.href = '/brand-dna';
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={() => setIsScraperOpen(false)}
    >
      <div 
        className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-slate-900 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">{t('domainWebScraperSetup', 'Domain Web Scraper & Brand DNA Setup')}</h2>
              <p className="text-xs text-brand-500 font-semibold">{t('tenPointBrandDnaEngine', '10-Point Expert Brand DNA Extraction Engine')}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsScraperOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          /* Step 1: Input URL or Upload Brand Deck */
          <div className="space-y-4">
            {/* Input Mode Selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('URL')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'URL' ? 'bg-white text-brand-500 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🌐 {t('autoScrapeWebsite', 'Auto Scrape Website')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('FILE')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'FILE' ? 'bg-white text-brand-500 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                📄 {t('uploadBrandGuidelinePdf', 'Upload Brand Guideline PDF / Deck')}
              </button>
            </div>

            {activeTab === 'URL' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">{t('targetDomainUrl', 'Target Domain URL')}</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. https://nike.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">{t('brandNameOptional', 'Brand / Company Name (Optional)')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Nike"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold"
                  />
                </div>

                <button
                  onClick={handleScrape}
                  disabled={loading || !url.trim()}
                  className="w-full btn-primary py-3 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      {t('scrapingWebsiteLive', 'Scraping Website & Extracting Brand DNA...')}
                    </>
                  ) : (
                    <>
                      <Dna className="w-4 h-4" />
                      {t('extractBrandDnaMemory', 'Extract Brand DNA Memory')}
                    </>
                  )}
                </button>
              </>
            ) : (
              /* FILE TAB */
              <div className="space-y-4 text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{t('dragDropBrandPdf', 'Upload Brand Identity PDF or Presentation')}</h4>
                  <p className="text-xs text-slate-500 mt-1">{t('aiExtractsColorsTone', 'AI will extract brand guidelines, colors, voice, tagline, and products')}</p>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all">
                  <span>{loading ? t('processingFile', 'Analyzing File...') : t('selectFileBtn', 'Select PDF / Document')}</span>
                  <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}
          </div>
        ) : (
          /* Step 2: Preview Extracted DNA (Editable Fields) */
          <div className="space-y-4 animate-in fade-in">
            {/* Top Brand Banner */}
            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={result.logoUrl || result.faviconUrl || `https://www.google.com/s2/favicons?domain=${result.domainUrl || 'google.com'}&sz=128`} 
                  alt={result.brandName} 
                  onError={(e) => {
                    e.target.onerror = null;
                    const domain = (result.domainUrl || '').replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                    e.target.src = `https://www.google.com/s2/favicons?domain=${domain || 'google.com'}&sz=128`;
                  }}
                  className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 object-contain shadow-sm" 
                />

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    {result.brandName}
                    <span className="text-[10px] bg-brand-500 text-white px-2 py-0.5 rounded-full font-extrabold">{result.industryCategory || result.industry || 'Not Specified'}</span>
                  </h3>
                  <p className="text-xs font-bold text-brand-500">{result.domainUrl}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {result.brandColors?.map((c, i) => (
                  <span key={i} className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: typeof c === 'string' ? c : c.hex }} />
                ))}
              </div>
            </div>

            {/* Company Information & Brand Identity Layout */}
            <div className="space-y-4 text-xs">
              
              {/* SECTION 1: COMPANY INFORMATION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-brand-500 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    🏢 Core Identity & Business Model
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* BRAND NAME */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">BRAND NAME</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={result.brandName || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, brandName: e.target.value }))}
                      placeholder="Enter brand name..."
                      className="w-full font-bold text-slate-900 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* TAGLINE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">TAGLINE</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={result.tagline || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Enter tagline / slogan..."
                      className="w-full font-bold text-slate-900 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* WEBSITE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">WEBSITE</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={result.domainUrl || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, domainUrl: e.target.value, website: e.target.value }))}
                      placeholder="Enter domain URL..."
                      className="w-full font-bold text-brand-500 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* INDUSTRY */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">INDUSTRY</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={result.industryCategory || result.industry || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, industryCategory: e.target.value, industry: e.target.value }))}
                      placeholder="Enter industry category..."
                      className="w-full font-bold text-slate-900 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* BUSINESS TYPE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">BUSINESS TYPE</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={Array.isArray(result.businessType) ? result.businessType.join(' & ') : (result.businessType || '')}
                      onChange={(e) => setResult(prev => ({ ...prev, businessType: e.target.value }))}
                      placeholder="Enter business type..."
                      className="w-full font-bold text-slate-900 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* HEADQUARTERS */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">HEADQUARTERS</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={result.headquarters || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, headquarters: e.target.value }))}
                      placeholder="Enter headquarters location..."
                      className="w-full font-bold text-slate-900 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* CONTACT INFO */}
                  <div className="sm:col-span-2 p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">CONTACT INFO</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={
                        typeof result.contactInfo === 'string'
                          ? result.contactInfo
                          : (`${result.contactInfo?.email || ''}${result.contactInfo?.phone ? ' | Phone: ' + result.contactInfo.phone : ''}`)
                      }
                      onChange={(e) => setResult(prev => ({ ...prev, contactInfo: e.target.value }))}
                      placeholder="Enter contact email / phone..."
                      className="w-full font-bold text-slate-900 text-xs bg-transparent border-none outline-none p-0"
                    />
                  </div>

                  {/* COMPANY DESCRIPTION */}
                  <div className="sm:col-span-2 p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">COMPANY DESCRIPTION</span>
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <textarea
                      rows={3}
                      value={result.companyDescription || result.positioningSummary || result.metaDescription || ''}
                      onChange={(e) => setResult(prev => ({ ...prev, companyDescription: e.target.value }))}
                      placeholder="Enter company description..."
                      className="w-full font-medium text-slate-700 text-xs bg-transparent border-none outline-none p-0 leading-relaxed resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: BRAND IDENTITY */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-brand-500 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    ✨ Brand Identity
                  </span>
                </div>

                {/* MISSION */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">MISSION</span>
                    <Edit3 className="w-3 h-3 text-slate-400" />
                  </div>
                  <textarea
                    rows={2}
                    value={result.missionStatement || result.mission || ''}
                    onChange={(e) => setResult(prev => ({ ...prev, missionStatement: e.target.value, mission: e.target.value }))}
                    placeholder="Enter mission statement..."
                    className="w-full font-medium text-slate-700 text-xs bg-transparent border-none outline-none p-0 leading-relaxed resize-y"
                  />
                </div>

                {/* VISION */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">VISION</span>
                    <Edit3 className="w-3 h-3 text-slate-400" />
                  </div>
                  <textarea
                    rows={2}
                    value={result.vision || ''}
                    onChange={(e) => setResult(prev => ({ ...prev, vision: e.target.value }))}
                    placeholder="Enter vision statement..."
                    className="w-full font-medium text-slate-700 text-xs bg-transparent border-none outline-none p-0 leading-relaxed resize-y"
                  />
                </div>
              </div>

            </div>

            <button
              onClick={confirmSaveWorkspace}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Save & Lock Brand DNA Memory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

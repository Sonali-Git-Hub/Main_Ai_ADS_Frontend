import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Dna, Globe, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, Target, Users, Share2, Mail, Phone, MapPin, Award, FileText } from 'lucide-react';

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
        setResult(extractedWorkspace);
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
        setResult(extractedWorkspace);
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
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.flipkart.com/"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs pl-10 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">{t('brandNameOptional', 'Brand Name (Optional)')}</label>
                  <input 
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Flipkart"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs font-medium"
                  />
                </div>
              </>
            ) : (
              <div className="p-6 rounded-2xl border-2 border-dashed border-brand-500/40 bg-brand-500/5 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto font-bold text-lg">
                  📄
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">{t('uploadBrandDeckGuide', 'Upload Official Brand Guideline PDF / PPT Deck')}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{t('supportsFileTypes', 'Supports .pdf, .pptx, .docx, .xlsx files up to 25MB')}</p>
                </div>
                <label className="inline-block px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-brand-600 transition-colors shadow-md">
                  {t('browseBrandFile', 'Browse Brand File')}
                  <input type="file" onChange={handleFileUpload} accept=".pdf,.pptx,.docx,.xlsx" className="hidden" />
                </label>
                {selectedFile && (
                  <p className="text-xs font-bold text-brand-500 pt-1">{t('selected', 'Selected')}: {selectedFile.name}</p>
                )}
              </div>
            )}


            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-brand-500">{t('tenBrandDnaPointsTitle', '10 Specific Brand DNA Data Points Extracted:')}</p>
              <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 font-semibold pt-1">
                <li>{t('dnaPoint1', '1. Target Personas (3-5)')}</li>
                <li>{t('dnaPoint2', '2. Voice & Tone (1-5 Score)')}</li>
                <li>{t('dnaPoint3', '3. Competitors Landscape')}</li>
                <li>{t('dnaPoint4', '4. Content Pillars (3-4)')}</li>
                <li>{t('dnaPoint5', '5. Social Media Presence')}</li>
                <li>{t('dnaPoint6', '6. Favicon / OG Logo URL')}</li>
                <li>{t('dnaPoint7', '7. Contact Info (Email, Phone)')}</li>
                <li>{t('dnaPoint8', '8. Industry Category')}</li>
                <li>{t('dnaPoint9', '9. Mission Statement')}</li>
                <li>{t('dnaPoint10', '10. Tagline / Main Slogan')}</li>
              </ul>
            </div>

            <button
              onClick={handleScrape}
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/30"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? t('analyzingHtml', 'Analyzing HTML & Extracting 10 Brand DNA Points...') : t('autoScrapeButton', 'Auto Scrape Domain & Extract 10 Brand DNA Points')}
            </button>
          </div>
        ) : (
          /* Step 2: Display Extracted 10 Brand DNA Data Points */
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
                    <span className="text-[10px] bg-brand-500 text-white px-2 py-0.5 rounded-full font-extrabold">{result.industryCategory || result.industry || 'Not Specified in Evidence'}</span>
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
                    🏢 Company Information
                  </span>
                  <span className="text-[10px] bg-brand-500/10 text-brand-600 font-extrabold px-2 py-0.5 rounded-full border border-brand-500/20">
                    Provenance-First Audited
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* BRAND NAME */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">BRAND NAME</span>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified Website DOM</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.brandName}</p>
                  </div>

                  {/* TAGLINE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">TAGLINE</span>
                      {(() => {
                        const src = result.taglineProvenance?.sourceType || result.fieldSources?.tagline;
                        if (src === 'WEBSITE_DOM' || src === 'WEBSITE_SCHEMA') {
                          return <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified Website DOM</span>;
                        } else if (src === 'AI_INFERENCE') {
                          return <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded border border-indigo-200/80">✨ AI Inferred</span>;
                        } else {
                          return <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200">⚠️ Unverified</span>;
                        }
                      })()}
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.tagline || <span className="text-slate-400 font-normal italic">Not Specified in Evidence</span>}</p>
                  </div>

                  {/* WEBSITE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">WEBSITE</span>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified Website DOM</span>
                    </div>
                    <p className="font-bold text-brand-500 text-xs mt-0.5 truncate">{result.domainUrl}</p>
                  </div>

                  {/* INDUSTRY */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">INDUSTRY</span>
                      {(() => {
                        const src = result.industryProvenance?.sourceType || result.fieldSources?.industryCategory;
                        if (src === 'WEBSITE_DOM' || src === 'WEBSITE_SCHEMA') {
                          return <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified Website DOM</span>;
                        } else if (src === 'REGISTRY') {
                          return <span className="text-[8px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded border border-blue-200/80">✓ Verified Registry</span>;
                        } else if (src === 'AI_INFERENCE') {
                          return <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded border border-indigo-200/80">✨ AI Inferred</span>;
                        } else {
                          return <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200">⚠️ Unverified</span>;
                        }
                      })()}
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.industryCategory || result.industry || <span className="text-slate-400 font-normal italic">Not Specified in Evidence</span>}</p>
                  </div>

                  {/* BUSINESS TYPE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">BUSINESS TYPE</span>
                      {(() => {
                        const src = result.businessTypeProvenance?.sourceType || result.fieldSources?.businessType;
                        if (src === 'WEBSITE_DOM' || src === 'WEBSITE_SCHEMA') {
                          return <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified Scraped</span>;
                        } else if (src === 'AI_INFERENCE') {
                          return <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded border border-indigo-200/80">✨ AI Inferred</span>;
                        } else {
                          return <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200">⚠️ Unverified</span>;
                        }
                      })()}
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{Array.isArray(result.businessType) ? result.businessType.join(' & ') : (result.businessType || <span className="text-slate-400 font-normal italic">Not Specified in Evidence</span>)}</p>
                  </div>

                  {/* HEADQUARTERS */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">HEADQUARTERS</span>
                      {(() => {
                        const src = result.headquartersProvenance?.sourceType || result.fieldSources?.headquarters;
                        if (src === 'REGISTRY') {
                          return <span className="text-[8px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded border border-blue-200/80">✓ Verified Registry</span>;
                        } else if (src === 'WEBSITE_DOM' || src === 'WEBSITE_SCHEMA' || src === 'WEBSITE_SUBPAGE') {
                          return <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified DOM</span>;
                        } else if (src === 'AI_INFERENCE') {
                          return <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded border border-indigo-200/80">✨ AI Inferred</span>;
                        } else {
                          return <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200">⚠️ Unverified</span>;
                        }
                      })()}
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.headquarters || <span className="text-slate-400 font-normal italic">Address Not Found</span>}</p>
                  </div>

                  {/* CONTACT INFO */}
                  <div className="sm:col-span-2 p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">CONTACT INFO</span>
                      {result.contactInfo?.email || result.contactInfo?.phone ? (
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified Scraped</span>
                      ) : (
                        <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200">⚠️ Unverified</span>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">
                      {(() => {
                        const email = result.contactInfo?.email;
                        const phone = result.contactInfo?.phone;
                        if (!email && !phone) return <span className="text-slate-400 font-normal italic">No Contact Info Specified in Evidence</span>;
                        return `${email || 'Email Not Specified'}${phone ? ' | Phone: ' + phone : ''}`;
                      })()}
                    </p>
                  </div>

                  {/* COMPANY DESCRIPTION */}
                  <div className="sm:col-span-2 p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">COMPANY DESCRIPTION</span>
                      {(() => {
                        const src = result.companyDescriptionProvenance?.sourceType || result.fieldSources?.companyDescription;
                        if (src === 'WEBSITE_DOM' || src === 'WEBSITE_META' || src === 'WEBSITE_SCHEMA') {
                          return <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified Meta Description</span>;
                        } else if (src === 'AI_INFERENCE') {
                          return <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded border border-indigo-200/80">✨ AI Inferred</span>;
                        } else {
                          return <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200">⚠️ Unverified</span>;
                        }
                      })()}
                    </div>
                    <p className="font-medium text-slate-700 text-xs mt-1 leading-relaxed">{result.companyDescription || result.positioningSummary || result.metaDescription || <span className="text-slate-400 font-normal italic">Not Specified in Evidence</span>}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BRAND IDENTITY */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-brand-500 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    ✨ Brand Identity
                  </span>
                  <span className="text-[10px] bg-brand-500/10 text-brand-600 font-extrabold px-2 py-0.5 rounded-full border border-brand-500/20">
                    Provenance-First Audited
                  </span>
                </div>

                {/* MISSION */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">MISSION</span>
                    {(() => {
                      const src = result.missionStatementProvenance?.sourceType || result.fieldSources?.missionStatement;
                      if (src === 'WEBSITE_DOM' || src === 'WEBSITE_SCHEMA' || src === 'WEBSITE_SUBPAGE') {
                        return <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified Website DOM</span>;
                      } else if (src === 'AI_INFERENCE') {
                        return <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded border border-indigo-200/80">✨ AI Inferred</span>;
                      } else {
                        return <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200">⚠️ Unverified</span>;
                      }
                    })()}
                  </div>
                  <p className="font-medium text-slate-700 text-xs mt-1 leading-relaxed">{result.missionStatement || result.mission || <span className="text-slate-400 font-normal italic">Not Specified in Evidence</span>}</p>
                </div>

                {/* VISION */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">VISION</span>
                    {(() => {
                      const src = result.visionProvenance?.sourceType || result.fieldSources?.vision;
                      if (src === 'WEBSITE_DOM' || src === 'WEBSITE_SCHEMA' || src === 'WEBSITE_SUBPAGE') {
                        return <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/80">✓ Verified Website DOM</span>;
                      } else if (src === 'AI_INFERENCE') {
                        return <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded border border-indigo-200/80">✨ AI Inferred</span>;
                      } else {
                        return <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200">⚠️ Unverified</span>;
                      }
                    })()}
                  </div>
                  <p className="font-medium text-slate-700 text-xs mt-1 leading-relaxed">{result.vision || <span className="text-slate-400 font-normal italic">Not Specified in Evidence</span>}</p>
                </div>

              </div>

            </div>

            <button
              onClick={confirmSaveWorkspace}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/30"
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

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Dna, Globe, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, Target, Users, Share2, Mail, Phone, MapPin, Award, FileText } from 'lucide-react';

export const ScraperOverlayModal = () => {
  const { isScraperOpen, setIsScraperOpen, addWorkspace, activeWorkspace, scraperMode, setActiveModule } = useWorkspace();
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
      const res = await fetch('http://localhost:5000/api/workspace/upload-doc', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.workspace);
      }
    } catch (e) {
      console.log('File upload error fallback:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!url.trim()) return;
    setLoading(true);


    try {
      const res = await fetch('http://localhost:5000/api/workspace/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainUrl: url, brandName })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.workspace);
      } else {
        console.log('Scraper API Note:', data.error);
      }
    } catch (e) {
      console.log('Scraper fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };


  const confirmSaveWorkspace = () => {
    if (result) {
      addWorkspace(result);
      if (setActiveModule) {
        setActiveModule('brands');
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6B5AED] to-[#7B61FF] flex items-center justify-center text-white shadow-lg shadow-[#7B61FF]/30">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Domain Web Scraper & Brand DNA Setup</h2>
              <p className="text-xs text-[#7B61FF] font-semibold">10-Point Expert Brand DNA Extraction Engine</p>
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
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'URL' ? 'bg-white text-[#7B61FF] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                🌐 Auto Scrape Website
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('FILE')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'FILE' ? 'bg-white text-[#7B61FF] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                📄 Upload Brand Guideline PDF / Deck
              </button>
            </div>

            {activeTab === 'URL' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Target Domain URL</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.flipkart.com/"
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF] rounded-xl px-4 py-2.5 text-xs pl-10 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Brand Name (Optional)</label>
                  <input 
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Flipkart"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF] rounded-xl px-4 py-2.5 text-xs font-medium"
                  />
                </div>
              </>
            ) : (
              <div className="p-6 rounded-2xl border-2 border-dashed border-[#7B61FF]/40 bg-[#7B61FF]/5 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#7B61FF]/10 text-[#7B61FF] flex items-center justify-center mx-auto font-bold text-lg">
                  📄
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Upload Official Brand Guideline PDF / PPT Deck</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Supports .pdf, .pptx, .docx, .xlsx files up to 25MB</p>
                </div>
                <label className="inline-block px-4 py-2 bg-[#7B61FF] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#6B5AED] transition-colors shadow-md">
                  Browse Brand File
                  <input type="file" onChange={handleFileUpload} accept=".pdf,.pptx,.docx,.xlsx" className="hidden" />
                </label>
                {selectedFile && (
                  <p className="text-xs font-bold text-[#7B61FF] pt-1">Selected: {selectedFile.name}</p>
                )}
              </div>
            )}


            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-[#7B61FF]">10 Specific Brand DNA Data Points Extracted:</p>
              <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 font-semibold pt-1">
                <li>1. Target Personas (3-5)</li>
                <li>2. Voice & Tone (1-5 Score)</li>
                <li>3. Competitors Landscape</li>
                <li>4. Content Pillars (3-4)</li>
                <li>5. Social Media Presence</li>
                <li>6. Favicon / OG Logo URL</li>
                <li>7. Contact Info (Email, Phone)</li>
                <li>8. Industry Category</li>
                <li>9. Mission Statement</li>
                <li>10. Tagline / Main Slogan</li>
              </ul>
            </div>

            <button
              onClick={handleScrape}
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs shadow-lg shadow-[#7B61FF]/30"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Analyzing HTML & Extracting 10 Brand DNA Points...' : 'Auto Scrape Domain & Extract 10 Brand DNA Points'}
            </button>
          </div>
        ) : (
          /* Step 2: Display Extracted 10 Brand DNA Data Points */
          <div className="space-y-4 animate-in fade-in">
            {/* Top Brand Banner */}
            <div className="p-4 rounded-2xl bg-[#7B61FF]/10 border border-[#7B61FF]/30 flex items-center justify-between">
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
                    <span className="text-[10px] bg-[#7B61FF] text-white px-2 py-0.5 rounded-full font-extrabold">{result.industryCategory || 'Retail & Tech'}</span>
                  </h3>
                  <p className="text-xs font-bold text-[#7B61FF]">{result.domainUrl}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {result.brandColors?.map((c, i) => (
                  <span key={i} className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* Company Information & Brand Identity Layout (Matching User Design Specification) */}
            <div className="space-y-4 text-xs">
              
              {/* SECTION 1: COMPANY INFORMATION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-[#7B61FF] uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    🏢 Company Information
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20">
                    85% AI Synthesized
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* BRAND NAME */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">BRAND NAME</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.brandName}</p>
                  </div>

                  {/* TAGLINE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">TAGLINE</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.tagline || ''}</p>
                  </div>

                  {/* WEBSITE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">WEBSITE</span>
                    <p className="font-bold text-[#7B61FF] text-xs mt-0.5 truncate">{result.domainUrl}</p>
                  </div>

                  {/* INDUSTRY */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">INDUSTRY</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.industryCategory || ''}</p>
                  </div>

                  {/* SUB INDUSTRY */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">SUB INDUSTRY</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.subIndustry || ''}</p>
                  </div>

                  {/* BUSINESS TYPE */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">BUSINESS TYPE</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.businessType || ''}</p>
                  </div>

                  {/* FOUNDED YEAR */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">FOUNDED YEAR</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.foundedYear || ''}</p>
                  </div>

                  {/* HEADQUARTERS */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">HEADQUARTERS</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">{result.headquarters || result.contactInfo?.location || ''}</p>
                  </div>


                  {/* CONTACT INFO */}
                  <div className="sm:col-span-2 p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">CONTACT INFO</span>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">
                      {result.contactInfo?.email || result.contactInfo?.phone ? `${result.contactInfo?.email || ''} ${result.contactInfo?.phone ? '| Phone: ' + result.contactInfo?.phone : ''}`.trim() : 'N/A'}
                    </p>
                  </div>

                  {/* COMPANY DESCRIPTION */}
                  <div className="sm:col-span-2 p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">COMPANY DESCRIPTION</span>
                    <p className="font-medium text-slate-700 text-xs mt-1 leading-relaxed">{result.companyDescription || result.positioningSummary || result.metaDescription}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: BRAND IDENTITY */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-[#7B61FF] uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    ✨ Brand Identity
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20">
                    86% AI Synthesized
                  </span>
                </div>

                {/* MISSION */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">MISSION</span>
                  <p className="font-medium text-slate-700 text-xs mt-1 leading-relaxed">{result.missionStatement || result.mission || 'N/A'}</p>
                </div>

                {/* VISION */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">VISION</span>
                  <p className="font-medium text-slate-700 text-xs mt-1 leading-relaxed">{result.vision || ''}</p>
                </div>

              </div>

            </div>


            <button
              onClick={confirmSaveWorkspace}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs shadow-lg shadow-[#7B61FF]/30"
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

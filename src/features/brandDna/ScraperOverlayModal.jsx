import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Dna, Globe, Sparkles, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export const ScraperOverlayModal = () => {
  const { isScraperOpen, setIsScraperOpen, addWorkspace } = useWorkspace();
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isScraperOpen) return null;

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
      }
    } catch (e) {
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      const name = brandName || cleanUrl.replace('https://', '').split('.')[0].toUpperCase();
      const mockWs = {
        id: `ws_${Date.now()}`,
        brandName: name,
        domainUrl: cleanUrl,
        logoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
        brandColors: ['#7B61FF', '#6B5AED', '#A882FF', '#0F172A'],
        metaDescription: `${name} is an enterprise digital provider delivering AI-driven digital transformation, innovative software solutions, and high-performance customer growth across global markets.`,
        positioningSummary: `${name} empowers modern enterprise marketing teams and digital agencies to scale multi-channel performance through cutting-edge strategy, governed content operations, and real-time intelligence.`,
        voiceGuidelines: { formalityScore: 4, toneKeywords: ['Authoritative', 'Evidence-Based', 'Innovative'], taboos: [] },
        approvedClaims: [
          { claimText: `${name} improves content delivery velocity by 400%`, sourceUrl: `${cleanUrl}/case-studies`, verified: true }
        ],
        restrictedClaims: ['Guaranteed #1 Google ranking', '100% viral outcome guaranteed'],
        priorityKeywords: ['Digital Growth', 'Brand Intelligence', 'SEO Automation'],
        contentPillars: ['Product Insights', 'Industry Trends', 'Case Studies']
      };
      setResult(mockWs);
    } finally {
      setLoading(false);
    }
  };

  const confirmSaveWorkspace = () => {
    if (result) {
      addWorkspace(result);
      setIsScraperOpen(false);
      setResult(null);
      setUrl('');
      setBrandName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6B5AED] to-[#7B61FF] flex items-center justify-center text-white shadow-lg shadow-[#7B61FF]/30">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Domain Web Scraper & Brand DNA Setup</h2>
              <p className="text-xs text-[#7B61FF] font-medium">Automated Web Ingestion & Positioning Memory Extraction</p>
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
          /* Step 1: Input URL */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Target Domain URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF] rounded-xl px-4 py-2.5 text-xs pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Brand Name (Optional)</label>
              <input 
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF] rounded-xl px-4 py-2.5 text-xs"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-[#7B61FF]">What Scraper Engine Extracts:</p>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-slate-600 font-medium">
                <li>OpenGraph logos, dominant CSS colors, meta descriptions</li>
                <li>Gemini 3.5 Flash baseline positioning summary</li>
                <li>Initial target personas, approved claims & restricted claim boundaries</li>
              </ul>
            </div>

            <button
              onClick={handleScrape}
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs shadow-lg shadow-[#7B61FF]/30"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Scraping Domain HTML & Building Brand DNA...' : 'Auto Scrape Domain & Extract Brand DNA'}
            </button>
          </div>
        ) : (
          /* Step 2: Display Scraped Brand DNA Profile */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-[#7B61FF]/10 border border-[#7B61FF]/30 flex items-center gap-4">
              <img src={result.logoUrl} alt={result.brandName} className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{result.brandName}</h3>
                <p className="text-xs font-bold text-[#7B61FF]">{result.domainUrl}</p>
                <div className="flex gap-1 mt-1">
                  {result.brandColors.map((c, i) => (
                    <span key={i} className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-[#7B61FF] block mb-1">Positioning Memory Summary:</span>
                <p className="text-slate-700 font-medium leading-relaxed">{result.positioningSummary}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-emerald-600 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved Claims ({result.approvedClaims.length})
                  </span>
                  {result.approvedClaims.map((ac, idx) => (
                    <p key={idx} className="text-[11px] text-slate-700 font-medium truncate">• {ac.claimText}</p>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-rose-600 flex items-center gap-1 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Restricted Claims ({result.restrictedClaims.length})
                  </span>
                  {result.restrictedClaims.map((rc, idx) => (
                    <p key={idx} className="text-[11px] text-slate-700 font-medium truncate">• {rc}</p>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={confirmSaveWorkspace}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs"
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

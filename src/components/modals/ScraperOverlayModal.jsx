import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Dna, Globe, Sparkles, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export const ScraperOverlayModal = () => {
  const { isScraperOpen, setIsScraperOpen, addWorkspace, setActiveModule } = useWorkspace();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center text-white shadow-glow">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Domain Web Scraper & Brand DNA Setup</h2>
              <p className="text-xs text-slate-400">Automated Web Ingestion & Positioning Memory Extraction</p>
            </div>
          </div>
          <button 
            onClick={() => setIsScraperOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          /* Step 1: Input URL */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Domain URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full glass-input text-xs pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand Name (Optional)</label>
              <input 
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full glass-input text-xs"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-200">What Scraper Engine Extracts:</p>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                <li>OpenGraph logos, dominant CSS colors, meta descriptions</li>
                <li>Gemini 3.5 Flash baseline positioning summary</li>
                <li>Initial target personas, approved claims & restricted claim boundaries</li>
              </ul>
            </div>

            <button
              onClick={handleScrape}
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Scraping Domain HTML & Building Brand DNA...' : 'Auto Scrape Domain & Extract Brand DNA'}
            </button>
          </div>
        ) : (
          /* Step 2: Display Scraped Brand DNA Profile */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center gap-4">
              <img src={result.logoUrl} alt={result.brandName} className="w-12 h-12 rounded-xl bg-slate-800 p-1 border border-slate-700" />
              <div>
                <h3 className="font-bold text-white text-base">{result.brandName}</h3>
                <p className="text-xs text-brand-300">{result.domainUrl}</p>
                <div className="flex gap-1 mt-1">
                  {result.brandColors.map((c, i) => (
                    <span key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-slate-300 block mb-1">Positioning Memory Summary:</span>
                <p className="text-slate-400">{result.positioningSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved Claims ({result.approvedClaims.length})
                  </span>
                  {result.approvedClaims.map((ac, idx) => (
                    <p key={idx} className="text-[11px] text-slate-300 truncate">• {ac.claimText}</p>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-bold text-rose-400 flex items-center gap-1 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Restricted Claims ({result.restrictedClaims.length})
                  </span>
                  {result.restrictedClaims.map((rc, idx) => (
                    <p key={idx} className="text-[11px] text-slate-300 truncate">• {rc}</p>
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

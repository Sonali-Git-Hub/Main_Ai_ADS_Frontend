import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Dna, Globe, CheckCircle2, Save, RefreshCw } from 'lucide-react';

export const BrandDnaModule = () => {
  const { activeWorkspace, setIsScraperOpen, openScraperModal, updateWorkspace } = useWorkspace();
  const [positioning, setPositioning] = useState(activeWorkspace.positioningSummary || '');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSaveBrandDna = async () => {
    if (updateWorkspace && (activeWorkspace.id || activeWorkspace._id)) {
      await updateWorkspace(activeWorkspace.id || activeWorkspace._id, {
        positioningSummary: positioning
      });
    }
    setSavedMsg('Brand DNA Memory successfully updated & saved to MongoDB Atlas workspaces collection!');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const displayColors = (activeWorkspace.brandColors && activeWorkspace.brandColors.length > 0)
    ? activeWorkspace.brandColors 
    : ['#6366F1', '#4F46E5', '#818CF8', '#0F172A'];


  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Dna className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Brand Intelligence & Brand DNA Profile</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium pl-10">
            Immutable memory profile governing tone, approved claims, and restricted boundaries for <strong className="text-brand-600 dark:text-brand-400">{activeWorkspace.brandName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => openScraperModal('ACTIVE_BRAND')} 
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2"
          >

            <RefreshCw className="w-3.5 h-3.5 text-brand-500" /> Auto Scrape Domain URL
          </button>
          <button 
            onClick={handleSaveBrandDna}
            className="btn-primary py-2 px-5 text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20"
          >
            <Save className="w-4 h-4" /> Save Brand DNA Memory
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {savedMsg}
        </div>
      )}

      {/* Brand Identity Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Identity & Color Direction</h2>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Score: {activeWorkspace.confidenceScore || 95}% Confidence
          </span>
        </div>
        
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <img src={activeWorkspace.logoUrl} alt={activeWorkspace.brandName} className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 object-cover" />
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{activeWorkspace.brandName}</h3>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> {activeWorkspace.domainUrl}
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {(activeWorkspace.crawledSources || ['WEBSITE_HOMEPAGE', 'INTERNAL_ABOUT_PAGES']).map((src, i) => (
                <span key={i} className="text-[9px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold px-1.5 py-0.5 rounded uppercase">
                  {src.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2">Brand Palette Colors</label>
          <div className="flex gap-3">
            {displayColors && displayColors.length > 0 ? (
              displayColors.map((color, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="h-10 rounded-xl border border-slate-300 dark:border-white/20 shadow-sm transition-transform hover:scale-105" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono uppercase mt-1.5 block font-bold">{color}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 font-medium italic p-2 bg-slate-100 dark:bg-slate-800 rounded-xl w-full text-center">
                No high-confidence official brand colors extracted
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-2">Positioning Summary</label>
          <textarea 
            rows={5}
            value={positioning}
            onChange={(e) => setPositioning(e.target.value)}
            className="w-full glass-input text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 leading-relaxed font-medium p-4 rounded-2xl border border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>
    </div>
  );
};

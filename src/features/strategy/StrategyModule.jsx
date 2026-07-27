import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Target, Layers, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const StrategyModule = () => {
  const { activeWorkspace, setActiveModule } = useWorkspace();
  const [businessGoal, setBusinessGoal] = useState('Scale Enterprise Organic Lead Pipeline by 250% in Q3');
  const [leadMagnet, setLeadMagnet] = useState('The 2026 Enterprise Content Operations Playbook (PDF)');
  const [generatedDoc, setGeneratedDoc] = useState(false);

  const handleGenerateStrategy = () => {
    setGeneratedDoc(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Marketing Strategy & Funnel Architecture</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Define objectives, buyer personas, TOFU/MOFU/BOFU funnel mapping, and offer hierarchy for <strong className="text-slate-900 dark:text-white">{activeWorkspace.brandName}</strong>.
          </p>
        </div>

        <button 
          onClick={handleGenerateStrategy}
          className="btn-primary text-xs"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          Generate Master Strategy Document
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Objectives & Offer Hierarchy */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Objectives & Conversion Path</h2>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Primary Business Goal</label>
            <input 
              type="text"
              value={businessGoal}
              onChange={(e) => setBusinessGoal(e.target.value)}
              className="w-full glass-input text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Lead Magnet / Conversion Offer</label>
            <input 
              type="text"
              value={leadMagnet}
              onChange={(e) => setLeadMagnet(e.target.value)}
              className="w-full glass-input text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Primary CTA</label>
            <input 
              type="text"
              defaultValue="Book Your Enterprise Strategy Demo Today"
              className="w-full glass-input text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 block">Publishing Channel Mix:</span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium"><span>SEO Blogs (Long-Form)</span><span className="font-bold">40%</span></div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium"><span>LinkedIn & Founder Copy</span><span className="font-bold">30%</span></div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium"><span>Email Newsletters</span><span className="font-bold">20%</span></div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium"><span>Instagram & Reels Copy</span><span className="font-bold">10%</span></div>
            </div>
          </div>
        </div>

        {/* Col 2 & 3: Funnel Stages & Personas */}
        <div className="lg:col-span-2 space-y-6">
          {/* TOFU / MOFU / BOFU Mapping */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Funnel Stage Content Mapping
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-brand-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">TOFU (Awareness)</span>
                  <span className="text-[10px] bg-brand-500/20 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded font-bold">50% Mix</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">Educational blogs, industry stats, keyword cluster pillar articles, reel scripts.</p>
                <span className="text-[10px] text-slate-500 block">Goal: Organic Traffic & Reach</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">MOFU (Consideration)</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold">30% Mix</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">How-to guides, comparative listicles, lead magnet offers, carousel breakdown posts.</p>
                <span className="text-[10px] text-slate-500 block">Goal: Lead Captures</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">BOFU (Decision)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">20% Mix</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">Case studies, verified ROI claims, product landing pages, sales email sequences.</p>
                <span className="text-[10px] text-slate-500 block">Goal: Conversions</span>
              </div>
            </div>
          </div>

          {/* Generated Master Strategy Card */}
          {generatedDoc && (
            <div className="p-6 rounded-3xl bg-brand-500/5 dark:bg-brand-950/40 border border-brand-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Master Marketing Strategy Document Ready
                </h3>
                <button 
                  onClick={() => setActiveModule('seo')}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  Auto-Feed into SEO Workspace <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Strategic blueprint generated for <strong className="text-slate-900 dark:text-white">{activeWorkspace.brandName}</strong>. Standardized positioning, lead magnet offers, and funnel stages are ready to feed into SEO topic clustering and campaign operations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

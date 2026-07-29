import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Target, Layers, Zap, CheckCircle2, ArrowRight, TrendingUp, Users, BarChart3, Globe, Mail, Instagram, Linkedin } from 'lucide-react';

// Helper: derive a brand-specific business goal from workspace data
const deriveGoal = (ws) => {
  const name = ws.brandName || 'Brand';
  const category = ws.industryCategory || '';
  if (category.toLowerCase().includes('fashion') || category.toLowerCase().includes('lifestyle'))
    return `Scale ${name}'s Organic Fashion Traffic by 300% & Drive Seasonal Revenue Growth`;
  if (category.toLowerCase().includes('e-commerce') || category.toLowerCase().includes('retail'))
    return `Grow ${name}'s Organic Buyer Traffic by 250% & Maximize Conversion Rate Across All Categories`;
  if (category.toLowerCase().includes('footwear'))
    return `Drive ${name}'s Brand Awareness in Comfort Footwear Segment & Grow DTC Revenue by 40%`;
  if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('tech'))
    return `Scale ${name}'s Enterprise Pipeline by 250% Through Governed AI Content Operations`;
  return `Scale ${name}'s Organic Lead Pipeline by 200% & Strengthen Market Positioning`;
};

// Helper: derive a brand-specific lead magnet
const deriveLeadMagnet = (ws) => {
  const name = ws.brandName || 'Brand';
  const category = ws.industryCategory || '';
  if (category.toLowerCase().includes('fashion'))
    return `${name}'s Ultimate 2026 Style & Trend Forecast Report`;
  if (category.toLowerCase().includes('e-commerce') || category.toLowerCase().includes('retail'))
    return `The ${name} Smart Shopper's Guide: Best Deals & Product Selection Playbook`;
  if (category.toLowerCase().includes('footwear'))
    return `${name} Comfort Footwear Buyer's Guide: Finding Your Perfect Pair`;
  if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('tech'))
    return `The 2026 Enterprise AI Content Operations Playbook (PDF)`;
  return `${name}'s Expert Guide to Maximum Value & Brand Experience`;
};

// Helper: derive a brand-specific primary CTA
const deriveCta = (ws) => {
  const category = ws.industryCategory || '';
  if (category.toLowerCase().includes('fashion') || category.toLowerCase().includes('lifestyle'))
    return `Shop the Latest Collection & Get 20% Off Your First Order`;
  if (category.toLowerCase().includes('e-commerce') || category.toLowerCase().includes('retail'))
    return `Explore Best Deals & Shop Now for Unbeatable Prices`;
  if (category.toLowerCase().includes('footwear'))
    return `Find Your Perfect Pair — Free Shipping on Orders Over ₹999`;
  if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('tech'))
    return `Book Your Enterprise Strategy Demo Today`;
  return `Get Started Free — No Credit Card Required`;
};

export const StrategyModule = () => {
  const { activeWorkspace, setActiveModule } = useWorkspace();
  const [businessGoal, setBusinessGoal] = useState('');
  const [leadMagnet, setLeadMagnet] = useState('');
  const [primaryCta, setPrimaryCta] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState(false);

  // Reset all content whenever the active brand changes
  useEffect(() => {
    setBusinessGoal(deriveGoal(activeWorkspace));
    setLeadMagnet(deriveLeadMagnet(activeWorkspace));
    setPrimaryCta(deriveCta(activeWorkspace));
    setGeneratedDoc(false);
  }, [activeWorkspace.id || activeWorkspace._id]);

  // Derive channel mix from socialMediaPresence if available
  const rawSocial = activeWorkspace.socialMediaPresence || [];
  const hasLinkedin = rawSocial.some(s => s.toLowerCase().includes('linkedin'));
  const hasInstagram = rawSocial.some(s => s.toLowerCase().includes('instagram'));
  const hasYoutube = rawSocial.some(s => s.toLowerCase().includes('youtube'));

  const channelMix = [
    { label: 'SEO Blogs (Long-Form)', pct: 40, icon: Globe, color: 'bg-brand-500' },
    { label: hasLinkedin ? 'LinkedIn & Founder Copy' : 'Facebook & Community Posts', pct: 30, icon: Linkedin, color: 'bg-blue-500' },
    { label: 'Email Newsletters', pct: hasYoutube ? 15 : 20, icon: Mail, color: 'bg-amber-500' },
    { label: hasInstagram ? 'Instagram & Reels Copy' : 'Twitter/X & Short-Form', pct: hasYoutube ? 15 : 10, icon: Instagram, color: 'bg-rose-500' },
  ];

  const funnelStages = [
    {
      label: 'Brand Awareness',
      mix: '50%',
      desc: activeWorkspace.contentPillars?.[0]
        ? `${activeWorkspace.contentPillars[0]}: Educational content, keyword pillar articles, and reel scripts to capture top-of-funnel reach.`
        : 'Educational blogs, industry stats, keyword cluster pillar articles, reel scripts.',
      goal: 'Organic Traffic & Reach',
      borderClass: 'border-brand-500/40',
      bgClass: 'bg-brand-500/5 dark:bg-brand-500/10',
      badgeBg: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
      textClass: 'text-brand-600 dark:text-brand-400',
      barWidth: 'w-[50%]',
      barColor: 'bg-brand-500',
    },
    {
      label: 'Lead Nurturing',
      mix: '30%',
      desc: activeWorkspace.contentPillars?.[1]
        ? `${activeWorkspace.contentPillars[1]}: How-to guides, comparison content, lead magnet downloads, and carousel breakdown posts.`
        : 'How-to guides, comparative listicles, lead magnet offers, carousel breakdown posts.',
      goal: 'Lead Captures',
      borderClass: 'border-purple-500/40',
      bgClass: 'bg-purple-500/5 dark:bg-purple-500/10',
      badgeBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
      textClass: 'text-purple-600 dark:text-purple-400',
      barWidth: 'w-[30%]',
      barColor: 'bg-purple-500',
    },
    {
      label: 'Customer Conversion',
      mix: '20%',
      desc: activeWorkspace.contentPillars?.[2]
        ? `${activeWorkspace.contentPillars[2]}: Case studies, verified claims, product landing pages, and sales email sequences.`
        : 'Case studies, verified ROI claims, product landing pages, sales email sequences.',
      goal: 'Conversions',
      borderClass: 'border-emerald-500/40',
      bgClass: 'bg-emerald-500/5 dark:bg-emerald-500/10',
      badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
      textClass: 'text-emerald-600 dark:text-emerald-400',
      barWidth: 'w-[20%]',
      barColor: 'bg-emerald-500',
    },
  ];

  const personas = (activeWorkspace.targetAudience || ['Decision Makers', 'Content Teams', 'SEO Specialists', 'Agency Leaders']).slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Marketing Strategy & Funnel Architecture</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pl-10">
            Funnel mapping & offer hierarchy for <strong className="text-slate-800 dark:text-white">{activeWorkspace.brandName}</strong>
            {activeWorkspace.industryCategory && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-semibold">
                {activeWorkspace.industryCategory}
              </span>
            )}
          </p>
        </div>
        <button onClick={() => setGeneratedDoc(true)} className="btn-primary text-xs shrink-0">
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          Generate Master Strategy
        </button>
      </div>

      {/* Row 1: Objectives + Channel Mix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Objectives & Conversion Path
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Primary Business Goal</label>
              <input type="text" value={businessGoal} onChange={(e) => setBusinessGoal(e.target.value)} className="w-full glass-input text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Lead Magnet / Conversion Offer</label>
              <input type="text" value={leadMagnet} onChange={(e) => setLeadMagnet(e.target.value)} className="w-full glass-input text-xs" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Primary CTA</label>
              <input type="text" value={primaryCta} onChange={(e) => setPrimaryCta(e.target.value)} className="w-full glass-input text-xs" />
            </div>
          </div>
        </div>

        {/* Channel Mix */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Publishing Channel Mix
          </h2>
          <div className="space-y-3.5">
            {channelMix.map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      {ch.label}
                    </span>
                    <span className="font-extrabold text-slate-800 dark:text-white">{ch.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${ch.color} transition-all duration-700`} style={{ width: `${ch.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Funnel Stages */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Funnel Stage Content Mapping
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">Auto-mapped from {activeWorkspace.brandName} content pillars</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {funnelStages.map((stage, i) => (
            <div key={stage.label} className={`p-5 rounded-2xl border ${stage.borderClass} ${stage.bgClass} space-y-3 relative overflow-hidden`}>
              <span className="absolute top-3 right-4 text-[40px] font-extrabold leading-none text-slate-200 dark:text-slate-800/60 select-none">{i + 1}</span>
              <div className="relative space-y-1.5">
                <span className={`text-xs font-extrabold ${stage.textClass} block`}>{stage.label}</span>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.badgeBg}`}>{stage.mix} Content Mix</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed relative">{stage.desc}</p>
              <div className="space-y-1">
                <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${stage.barColor} ${stage.barWidth}`} />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Goal: {stage.goal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Buyer Personas */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Target Buyer Personas — <span className="text-brand-500 normal-case">{activeWorkspace.brandName}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {personas.map((persona, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-extrabold shrink-0">{i + 1}</div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{persona}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Doc Banner */}
      {generatedDoc && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-500/10 via-purple-500/5 to-emerald-500/10 dark:from-brand-500/20 dark:via-purple-500/10 dark:to-emerald-500/20 border border-brand-500/30 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Master Marketing Strategy Document Ready — {activeWorkspace.brandName}
            </h3>
            <button onClick={() => setActiveModule('seo')} className="btn-primary text-xs">
              Auto-Feed into SEO Workspace <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Strategic blueprint generated for <strong className="text-slate-900 dark:text-white">{activeWorkspace.brandName}</strong>. Standardized positioning, lead magnet offers ({leadMagnet}), and funnel stages are ready to feed into SEO topic clustering and campaign operations.
          </p>
        </div>
      )}
    </div>
  );
};

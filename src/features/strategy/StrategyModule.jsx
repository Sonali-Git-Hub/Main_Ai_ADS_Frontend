import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Target, Layers, Zap, CheckCircle2, ArrowRight, TrendingUp, Users, BarChart3, Globe, Mail, Instagram, Linkedin, Loader2, Save, Crosshair, Gift, MousePointerClick, Edit3, Sparkles, PieChart } from 'lucide-react';

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

// Channel icon color mapping
const channelColors = {
  Globe: { gradient: 'from-violet-500 to-indigo-600', bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', bar: 'from-violet-500 to-indigo-500', ring: 'ring-violet-500/20' },
  Linkedin: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', bar: 'from-blue-500 to-cyan-500', ring: 'ring-blue-500/20' },
  Mail: { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', bar: 'from-amber-500 to-orange-500', ring: 'ring-amber-500/20' },
  Instagram: { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', bar: 'from-pink-500 to-rose-500', ring: 'ring-pink-500/20' },
};

export const StrategyModule = () => {
  const { activeWorkspace, setActiveModule, updateWorkspace } = useWorkspace();
  const [businessGoal, setBusinessGoal] = useState('');
  const [leadMagnet, setLeadMagnet] = useState('');
  const [primaryCta, setPrimaryCta] = useState('');
  const [channelMix, setChannelMix] = useState([]);
  const [generatedDoc, setGeneratedDoc] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingField, setEditingField] = useState(null);

  // Initialize fields from workspace currentStrategy
  useEffect(() => {
    const strat = activeWorkspace.currentStrategy || {};
    setBusinessGoal(strat.businessGoal || deriveGoal(activeWorkspace));
    setLeadMagnet(strat.leadMagnet || deriveLeadMagnet(activeWorkspace));
    setPrimaryCta(strat.primaryCta || deriveCta(activeWorkspace));
    
    if (strat.channelMix && strat.channelMix.length > 0) {
      setChannelMix(strat.channelMix);
    } else {
      const rawSocial = activeWorkspace.socialMediaPresence || [];
      const hasLinkedin = rawSocial.some(s => s.toLowerCase().includes('linkedin'));
      const hasInstagram = rawSocial.some(s => s.toLowerCase().includes('instagram'));
      const hasYoutube = rawSocial.some(s => s.toLowerCase().includes('youtube'));
      
      setChannelMix([
        { label: 'SEO Blogs (Long-Form)', pct: 40, icon: 'Globe', color: 'bg-brand-500' },
        { label: hasLinkedin ? 'LinkedIn & Founder Copy' : 'Facebook & Community Posts', pct: 30, icon: 'Linkedin', color: 'bg-blue-500' },
        { label: 'Email Newsletters', pct: hasYoutube ? 15 : 20, icon: 'Mail', color: 'bg-amber-500' },
        { label: hasInstagram ? 'Instagram & Reels Copy' : 'Twitter/X & Short-Form', pct: hasYoutube ? 15 : 10, icon: 'Instagram', color: 'bg-rose-500' },
      ]);
    }
    setGeneratedDoc(false);
  }, [activeWorkspace.id || activeWorkspace._id, activeWorkspace.currentStrategy]);

  // Handle Save
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const updatedStrategy = {
        ...(activeWorkspace.currentStrategy || {}),
        businessGoal,
        leadMagnet,
        primaryCta,
        channelMix
    };
    await updateWorkspace(activeWorkspace.id || activeWorkspace._id, { currentStrategy: updatedStrategy });
    setIsSaving(false);
    setEditingField(null);
  }, [activeWorkspace, businessGoal, leadMagnet, primaryCta, channelMix, updateWorkspace]);

  // Handle Generate API Call
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
        const id = activeWorkspace.id || activeWorkspace._id;
        const res = await fetch(`/api/workspace/${id}/generate-strategy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.success && data.strategy) {
            setBusinessGoal(data.strategy.businessGoal || '');
            setLeadMagnet(data.strategy.leadMagnet || '');
            setPrimaryCta(data.strategy.primaryCta || '');
            if (data.strategy.channelMix) {
                setChannelMix(data.strategy.channelMix);
            }
            await updateWorkspace(id, { currentStrategy: data.strategy });
            setGeneratedDoc(true);
        } else {
            alert('Generation failed: ' + (data.message || data.error));
        }
    } catch(err) {
        alert('Generation failed: ' + err.message);
    }
    setIsGenerating(false);
  };

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

  // Objective card config
  const objectiveCards = [
    {
      key: 'businessGoal',
      label: 'Primary Business Goal',
      sublabel: 'The north-star metric driving all content strategy',
      value: businessGoal,
      setter: setBusinessGoal,
      icon: Crosshair,
      gradient: 'from-violet-500 to-indigo-600',
      lightBg: 'bg-violet-50 dark:bg-violet-500/5',
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600',
      borderAccent: 'border-l-violet-500',
      tag: 'GOAL',
      tagColor: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    },
    {
      key: 'leadMagnet',
      label: 'Lead Magnet / Conversion Offer',
      sublabel: 'High-value asset to capture qualified leads',
      value: leadMagnet,
      setter: setLeadMagnet,
      icon: Gift,
      gradient: 'from-amber-500 to-orange-500',
      lightBg: 'bg-amber-50 dark:bg-amber-500/5',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      borderAccent: 'border-l-amber-500',
      tag: 'OFFER',
      tagColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    },
    {
      key: 'primaryCta',
      label: 'Primary CTA',
      sublabel: 'Main call-to-action across all touchpoints',
      value: primaryCta,
      setter: setPrimaryCta,
      icon: MousePointerClick,
      gradient: 'from-emerald-500 to-teal-500',
      lightBg: 'bg-emerald-50 dark:bg-emerald-500/5',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
      borderAccent: 'border-l-emerald-500',
      tag: 'CTA',
      tagColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    },
  ];

  // Total for channel mix percentage
  const totalPct = channelMix.reduce((sum, ch) => sum + ch.pct, 0);

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
        <div className="flex items-center gap-2">
          {isSaving && <span className="text-xs text-slate-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Saving...</span>}
          <button onClick={handleSave} className="btn-secondary text-xs shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Save className="w-4 h-4" /> Save
          </button>
          <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary text-xs shrink-0 disabled:opacity-50">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> : <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />}
            {isGenerating ? 'Generating...' : 'Generate Master Strategy'}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ROW 1: OBJECTIVES & CONVERSION PATH — Redesigned Premium Cards */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: 3 Objective Cards — takes 3/5 */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              Objectives & Conversion Path
            </h2>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Click any card to edit
            </span>
          </div>

          <div className="space-y-3">
            {objectiveCards.map((card) => {
              const IconComp = card.icon;
              const isEditing = editingField === card.key;
              return (
                <div
                  key={card.key}
                  className="group relative p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 flex flex-col sm:flex-row sm:items-start gap-4"
                >
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  
                  {/* Icon Container - Clean & modern */}
                  <div className={`shrink-0 w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shadow-md shadow-${card.borderAccent.replace('border-l-', '')}/20 ring-4 ring-slate-50 dark:ring-slate-900`}>
                    <IconComp className="w-4 h-4 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${card.tagColor}`}>
                        {card.tag}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                        {card.label}
                      </span>
                    </div>
                    
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={card.value}
                          onChange={(e) => card.setter(e.target.value)}
                          onBlur={() => { handleSave(); setEditingField(null); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') { handleSave(); setEditingField(null); } }}
                          autoFocus
                          className="flex-1 glass-input text-sm font-semibold py-2.5 w-full"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => setEditingField(card.key)}
                        className="cursor-pointer group/text flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors -ml-3"
                      >
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-white leading-relaxed flex-1">
                          {card.value}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-400 font-medium hidden sm:block opacity-0 group-hover/text:opacity-100 transition-opacity">Click to edit</span>
                          <Edit3 className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover/text:text-brand-500 transition-all duration-200" />
                        </div>
                      </div>
                    )}
                    
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium pl-3 border-l-2 border-slate-100 dark:border-slate-800">{card.sublabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Publishing Channel Mix — takes 2/5 */}
        <div className="lg:col-span-2">
          <div className="h-full p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <PieChart className="w-3.5 h-3.5 text-white" />
                </div>
                Publishing Channel Mix
              </h2>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full">
                {totalPct}% Total
              </span>
            </div>

            {/* Visual Donut Ring */}
            <div className="flex justify-center mb-5">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {(() => {
                    let offset = 0;
                    const radius = 48;
                    const circumference = 2 * Math.PI * radius;
                    const gradientColors = [
                      ['#8B5CF6', '#6366F1'],
                      ['#3B82F6', '#06B6D4'],
                      ['#F59E0B', '#F97316'],
                      ['#EC4899', '#F43F5E'],
                    ];
                    return channelMix.map((ch, i) => {
                      const pct = ch.pct / totalPct;
                      const dashLength = pct * circumference;
                      const gap = circumference - dashLength;
                      const currentOffset = offset;
                      offset += pct * circumference;
                      const gradId = `grad-${i}`;
                      return (
                        <React.Fragment key={ch.label}>
                          <defs>
                            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={gradientColors[i]?.[0] || '#6366F1'} />
                              <stop offset="100%" stopColor={gradientColors[i]?.[1] || '#8B5CF6'} />
                            </linearGradient>
                          </defs>
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke={`url(#${gradId})`}
                            strokeWidth="12"
                            strokeDasharray={`${dashLength} ${gap}`}
                            strokeDashoffset={-currentOffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                          />
                        </React.Fragment>
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{channelMix.length}</span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Channels</span>
                </div>
              </div>
            </div>

            {/* Channel List */}
            <div className="flex-1 space-y-3">
              {channelMix.map((ch, idx) => {
                let Icon = Globe;
                if (ch.icon === 'Linkedin' || ch.icon?.type?.displayName === 'Linkedin') Icon = Linkedin;
                if (ch.icon === 'Mail' || ch.icon?.type?.displayName === 'Mail') Icon = Mail;
                if (ch.icon === 'Instagram' || ch.icon?.type?.displayName === 'Instagram') Icon = Instagram;
                const colors = channelColors[ch.icon] || channelColors.Globe;
                return (
                  <div key={ch.label} className={`group relative flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-default`}>
                    {/* Icon */}
                    <div className={`shrink-0 w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center ring-2 ${colors.ring} transition-transform duration-200 group-hover:scale-105`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    
                    {/* Label + Bar */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{ch.label}</span>
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white ml-2">{ch.pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-1000 ease-out`}
                          style={{ width: `${ch.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ROW 2: FUNNEL STAGE CONTENT MAPPING                          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Content Strategy Flow
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ROW 3: BUYER PERSONAS                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Target Audience — <span className="text-brand-500 normal-case">{activeWorkspace.brandName}</span>
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

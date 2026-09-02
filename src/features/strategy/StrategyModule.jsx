import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { strategyAPI } from '../../services/api';
import { resolveBrandVisualAsset } from '../../services/brandVisualResolver';
import {
  Target, Layers, Zap, CheckCircle2, ArrowRight, TrendingUp, Users, BarChart3,
  Globe, Mail, Instagram, Linkedin, Loader2, Save, Crosshair, Gift,
  MousePointerClick, Edit3, Sparkles, PieChart, Calendar, DollarSign,
  Megaphone, BookOpen, Clock, ChevronRight, Star, Lightbulb, Rocket,
  Hash, Video, FileText, MessageSquare, Filter, Play, Award, BarChart2,
  ArrowUpRight, Flame, X
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// Channel icon/color mapping
const channelColors = {
  Globe:     { gradient: 'from-violet-500 to-indigo-600', bg: 'bg-violet-500/10', text: 'text-brand-600 dark:text-violet-400', bar: 'from-violet-500 to-indigo-500', ring: 'ring-violet-500/20' },
  Linkedin:  { gradient: 'from-blue-500 to-cyan-500',     bg: 'bg-blue-500/10',   text: 'text-blue-600 dark:text-blue-400',    bar: 'from-blue-500 to-cyan-500',   ring: 'ring-blue-500/20' },
  Mail:      { gradient: 'from-amber-500 to-orange-500',  bg: 'bg-amber-500/10',  text: 'text-amber-600 dark:text-amber-400',  bar: 'from-amber-500 to-orange-500', ring: 'ring-amber-500/20' },
  Instagram: { gradient: 'from-pink-500 to-rose-500',     bg: 'bg-pink-500/10',   text: 'text-pink-600 dark:text-pink-400',   bar: 'from-pink-500 to-rose-500',    ring: 'ring-pink-500/20' },
};

// Platform icon helper
const getPlatformIcon = (platform = '') => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return Linkedin;
  if (p.includes('instagram') || p.includes('reels')) return Instagram;
  if (p.includes('email') || p.includes('newsletter')) return Mail;
  if (p.includes('blog') || p.includes('seo') || p.includes('article')) return FileText;
  if (p.includes('twitter') || p.includes('x.com')) return MessageSquare;
  if (p.includes('youtube') || p.includes('video')) return Video;
  return Globe;
};

const getPlatformColor = (platform = '') => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/20';
  if (p.includes('instagram') || p.includes('reels')) return 'bg-pink-500/15 text-pink-600 dark:text-pink-400 ring-pink-500/20';
  if (p.includes('email') || p.includes('newsletter')) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20';
  if (p.includes('blog') || p.includes('seo')) return 'bg-violet-500/15 text-brand-600 dark:text-violet-400 ring-violet-500/20';
  if (p.includes('twitter') || p.includes('x.com')) return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 ring-sky-500/20';
  if (p.includes('youtube') || p.includes('video')) return 'bg-red-500/15 text-red-600 dark:text-red-400 ring-red-500/20';
  return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 ring-slate-500/20';
};

// Week label helper
const getWeekLabel = (day) => {
  if (day <= 7)  return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const StrategyModule = () => {
  const {
    activeWorkspace,
    setActiveModule,
    updateWorkspace,
    bulkAddCalendarEvents,
    calendarEvents,
    setGeneratedStrategy,
    setStudioTarget,
    setGeneratedContent,
    t
  } = useWorkspace();


  // Core strategy fields
  const [businessGoal,      setBusinessGoal]      = useState('');
  const [leadMagnet,        setLeadMagnet]         = useState('');
  const [primaryCta,        setPrimaryCta]         = useState('');
  const [channelMix,        setChannelMix]         = useState([]);
  const [postingFrequency,  setPostingFrequency]   = useState('Daily');
  const [budgetSuggestions, setBudgetSuggestions]  = useState('');
  const [bestPlatforms,     setBestPlatforms]      = useState([]);
  const [contentPillars,    setContentPillars]     = useState([]);
  const [campaignIdeas,     setCampaignIdeas]      = useState([]);
  const [thirtyDayPlan,     setThirtyDayPlan]      = useState([]);
  const [funnel,            setFunnel]             = useState({ awareness: '', nurturing: '', conversion: '' });
  const [audience,          setAudience]           = useState([]);

  // UI state
  const [selectedWeek,  setSelectedWeek]  = useState('ALL');
  const [generatedDoc,  setGeneratedDoc]  = useState(false);
  const [isGenerating,  setIsGenerating]  = useState(false);
  const [isSaving,      setIsSaving]      = useState(false);
  const [editingField,  setEditingField]  = useState(null);
  const [activeTab,     setActiveTab]     = useState('overview'); // overview | plan | campaigns
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isSavedState,  setIsSavedState]  = useState(false);

  // Build Campaign Modal State
  const [buildCampaignModal, setBuildCampaignModal] = useState(false);
  const [selectedCampaignIdea, setSelectedCampaignIdea] = useState(null);
  const [campaignDuration, setCampaignDuration] = useState('30');

  // Schedule Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDays, setScheduleDays] = useState('30');

  const isLegacyStrategy = (strat) => {
    if (!strat || !strat.thirtyDayPlan || strat.thirtyDayPlan.length < 10) return true;
    if (strat.campaignIdeas && strat.campaignIdeas.some(c => c.title === 'The Authority Series' || c.title === 'DNA Lead Magnet Launch')) return true;
    if (strat.thirtyDayPlan.some(d => d.title && (d.title.includes('Key Insights for') || d.title.includes('Day 1: Pillar')))) return true;
    return false;
  };

  // ─── Init from workspace ─────────────────────────────────────────────────
  useEffect(() => {
    const strat = activeWorkspace.currentStrategy;
    
    if (strat && !isLegacyStrategy(strat)) {
      setBusinessGoal(strat.businessGoal || '');
      setLeadMagnet(strat.leadMagnet || '');
      setPrimaryCta(strat.primaryCta || '');
      setPostingFrequency(strat.postingFrequency || 'Daily');
      setBudgetSuggestions(strat.budgetSuggestions || '');
      setBestPlatforms(strat.bestPlatforms || []);
      setContentPillars(strat.contentPillars || activeWorkspace.contentPillars || []);
      setCampaignIdeas(strat.campaignIdeas || []);
      setThirtyDayPlan(strat.thirtyDayPlan || []);
      setFunnel(strat.funnel || { awareness: '', nurturing: '', conversion: '' });
      setAudience(strat.audience || (activeWorkspace.targetAudience || []).slice(0, 4));
      if (strat.channelMix && strat.channelMix.length > 0) setChannelMix(strat.channelMix);
      setGeneratedDoc(true);
      return;
    }

    // Otherwise automatically trigger fresh AI Strategy generation
    if (activeWorkspace.id || activeWorkspace._id) {
      handleGenerate();
    }
  }, [activeWorkspace.id || activeWorkspace._id]);

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const updatedStrategy = {
      ...(activeWorkspace.currentStrategy || {}),
      businessGoal, leadMagnet, primaryCta, channelMix,
      postingFrequency, budgetSuggestions, bestPlatforms,
      contentPillars, campaignIdeas, thirtyDayPlan, funnel, audience,
    };
    await updateWorkspace(activeWorkspace.id || activeWorkspace._id, { currentStrategy: updatedStrategy });
    setIsSaving(false);
    setEditingField(null);
    setIsSavedState(true);
    setShowSaveToast(true);
    setTimeout(() => {
      setIsSavedState(false);
      setShowSaveToast(false);
    }, 3000);
  }, [activeWorkspace, businessGoal, leadMagnet, primaryCta, channelMix,
      postingFrequency, budgetSuggestions, bestPlatforms, contentPillars,
      campaignIdeas, thirtyDayPlan, funnel, audience, updateWorkspace]);

  // ─── Generate AI Strategy ─────────────────────────────────────────────────
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const id = activeWorkspace.id || activeWorkspace._id || 'default_ws';
      let strategy = null;
      try {
        const data = await strategyAPI.generate(id);
        if (data && data.strategy) {
          strategy = data.strategy.data || (typeof data.strategy === 'object' && !data.strategy.data ? data.strategy : null);
        }
      } catch (apiErr) {
        console.log('Strategy API notice:', apiErr.message);
      }

      if (!strategy) {
        const brandName = activeWorkspace.brandName || 'Brand';
        const industry = activeWorkspace.industryCategory || activeWorkspace.industry || 'Consumer Products';
        const topics = (activeWorkspace.contentPillars && activeWorkspace.contentPillars.length > 0)
          ? activeWorkspace.contentPillars
          : [`${brandName} Product Value`, `Industry Trends in ${industry}`, `Customer Proof & Reviews`, `How-to Guides`];
        const platforms = ['SEO Blog', 'LinkedIn', 'Instagram', 'Email Newsletter'];

        const fallbackPlan = Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const pillar = topics[i % topics.length];
          const platform = platforms[i % platforms.length];
          return {
            day,
            title: `Day ${day}: ${pillar} - Key Insights for ${brandName}`,
            topic: `${pillar} Focus: Essential Strategies & Tips`,
            platform,
            pillar,
            status: 'PLANNED',
            action: `Publish ${platform} content highlighting ${brandName}'s core value in ${industry}.`
          };
        });

        strategy = {
          businessGoal: deriveGoal(activeWorkspace),
          leadMagnet: deriveLeadMagnet(activeWorkspace),
          primaryCta: deriveCta(activeWorkspace),
          postingFrequency: 'Daily',
          budgetSuggestions: '60% Organic content marketing & SEO / 40% Paid micro-targeting & retargeting.',
          bestPlatforms: ['LinkedIn', 'Google SEO Blog', 'Email Newsletter', 'Instagram & Reels'],
          contentPillars: topics,
          campaignIdeas: [
            { title: `${brandName} Authority Series`, desc: `Long-form thought leadership posts demonstrating domain mastery.` },
            { title: `Lead Magnet Opt-In Push`, desc: `Direct-response opt-in push using landing page & email funnel.` },
            { title: `Social Proof Sprint`, desc: `Customer testimonials & case-study carousel posts for trust.` }
          ],
          thirtyDayPlan: fallbackPlan,
          funnel: {
            awareness: `Pillar-driven content, SEO optimization, and educational hooks to drive top-of-funnel reach for ${brandName}.`,
            nurturing: `Interactive guides, how-to value-bombs, and lead magnet resources to capture email subscribers.`,
            conversion: `Direct sales copy, verified client testimonials, case studies, and primary product benefit pushes.`
          },
          audience: Array.isArray(activeWorkspace.targetAudience) ? activeWorkspace.targetAudience : [activeWorkspace.targetAudience || `Target consumers in ${industry}`]
        };
      }

      setBusinessGoal(strategy.businessGoal || '');
      setLeadMagnet(strategy.leadMagnet || '');
      setPrimaryCta(strategy.primaryCta || '');
      setPostingFrequency(strategy.postingFrequency || 'Daily');
      setBudgetSuggestions(strategy.budgetSuggestions || '');
      setBestPlatforms(strategy.bestPlatforms || []);
      setContentPillars(strategy.contentPillars || []);
      setCampaignIdeas(strategy.campaignIdeas || []);
      setThirtyDayPlan(strategy.thirtyDayPlan || []);
      setFunnel(strategy.funnel || { awareness: '', nurturing: '', conversion: '' });
      setAudience(strategy.audience || []);
      if (strategy.channelMix) setChannelMix(strategy.channelMix);

      if (updateWorkspace && id) {
        await updateWorkspace(id, { currentStrategy: strategy });
      }
      if (setGeneratedStrategy) setGeneratedStrategy(strategy);
      setGeneratedDoc(true);
      setActiveTab('plan');
    } catch (err) {
      console.log('Strategy generation error:', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Generate Strategy for Campaign Duration ─────────────────────────────
  const handleGenerateForCampaign = async (numDays, campaignGoal) => {
    setIsGenerating(true);
    try {
      const days = Number(numDays) || 30;
      const brandName = activeWorkspace.brandName || 'Brand';
      const industry = activeWorkspace.industryCategory || activeWorkspace.industry || 'Consumer Products';
      const topics = (activeWorkspace.contentPillars && activeWorkspace.contentPillars.length > 0)
        ? activeWorkspace.contentPillars
        : [`${brandName} Product Value`, `Industry Trends in ${industry}`, `Customer Proof & Reviews`, `How-to Guides`];
      const platforms = ['SEO Blog', 'LinkedIn', 'Instagram', 'Email Newsletter'];

      const generatedPlan = Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        const pillar = topics[i % topics.length];
        const platform = platforms[i % platforms.length];
        return {
          day,
          title: `Day ${day}: ${pillar} - ${campaignGoal || `Key Insights for ${brandName}`}`,
          topic: `${pillar} Focus: ${campaignGoal || 'Essential Strategies & Tips'}`,
          platform,
          pillar,
          status: 'PLANNED',
          action: `Publish ${platform} content highlighting ${brandName}'s core value in ${industry}.`
        };
      });

      setThirtyDayPlan(generatedPlan);
      setGeneratedDoc(true);
      setActiveTab('plan');
    } catch (err) {
      console.log('Campaign strategy generation error:', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ─── Generate Calendar Events ─────────────────────────────────────────────
  const handleGenerateCalendar = () => {
    if (!thirtyDayPlan || thirtyDayPlan.length === 0) {
      alert("No Plan generated yet.");
      return;
    }
    setScheduleDays(String(Math.min(30, thirtyDayPlan.length)));
    setShowScheduleModal(true);
  };

  const [isCreatingCalendarCampaign, setIsCreatingCalendarCampaign] = useState(false);

  const confirmGenerateCalendar = async (numDays) => {
    const daysToGen = Math.min(Number(numDays) || 30, Math.max(30, thirtyDayPlan.length || 30));
    localStorage.setItem('aisa_selected_schedule_days', String(daysToGen));
    setIsCreatingCalendarCampaign(true);

    try {
      const today = new Date();
      const end = new Date(today);
      end.setDate(today.getDate() + (daysToGen - 1));

      // Filter plan to only generate up to daysToGen
      const planToUse = (thirtyDayPlan.length >= daysToGen)
        ? thirtyDayPlan.filter(item => item.day <= daysToGen)
        : Array.from({ length: daysToGen }, (_, i) => {
            const day = i + 1;
            const existing = thirtyDayPlan.find(d => d.day === day);
            if (existing) return existing;
            const pillar = contentPillars[i % (contentPillars.length || 1)] || 'Product Value';
            return {
              day,
              platform: bestPlatforms[i % (bestPlatforms.length || 1)] || 'Instagram',
              topic: `Day ${day}: Strategic ${pillar} for ${activeWorkspace?.brandName || 'Brand'}`,
              pillar,
              actionItem: `Publish content showcasing ${pillar} benefits and drive engagement.`
            };
          });

      const brandName = activeWorkspace?.brandName || 'Brand';
      const wsId = activeWorkspace?.id || activeWorkspace?._id || 'ws_001';

      // Extract unique platforms
      const platformsToUse = [...new Set(planToUse.map(d => {
        const raw = (d.platform || '').toLowerCase();
        if (raw.includes('linkedin')) return 'LinkedIn';
        if (raw.includes('instagram') || raw.includes('reels')) return 'Instagram';
        if (raw.includes('email') || raw.includes('newsletter')) return 'Email';
        if (raw.includes('youtube') || raw.includes('video')) return 'YouTube';
        if (raw.includes('blog') || raw.includes('seo')) return 'Blog';
        return 'Instagram';
      }))];

      const payload = {
        workspaceId: wsId,
        campaignName: `${brandName} ${daysToGen}-Day Strategy Campaign`,
        campaignGoal: businessGoal || activeWorkspace?.currentStrategy?.businessGoal || 'Comprehensive Growth Roadmap',
        startDate: today.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        postingFrequency: postingFrequency || 'Daily',
        platforms: platformsToUse.length > 0 ? platformsToUse : ['Instagram', 'LinkedIn', 'YouTube'],
      };

      const res = await campaignAPI.create(payload);
      if (res.success && res.campaign) {
        await campaignAPI.generatePlan(res.campaign._id, { strategyPlan: planToUse });
        localStorage.setItem('aisa_selected_campaign_id', res.campaign._id);
      }

      const eventsToCreate = planToUse.map(item => {
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + (item.day - 1));
        
        return {
          title: item.topic || `Day ${item.day} Content`,
          date: eventDate.toISOString().split('T')[0],
          platform: item.platform || 'Blog',
          pillar: activeWorkspace?.brandName || 'Brand Strategy',
          status: 'SCHEDULED',
          owner: 'Content Strategist'
        };
      });

      bulkAddCalendarEvents(eventsToCreate);
    } catch (e) {
      console.warn('Calendar campaign generation notice:', e.message);
    } finally {
      setIsCreatingCalendarCampaign(false);
      setShowScheduleModal(false);
      setActiveModule('calendar'); // Transition to calendar view
    }
  };

  // ─── Derived data ─────────────────────────────────────────────────────────
  const totalPct = channelMix.reduce((s, c) => s + c.pct, 0);

  const filteredPlan = selectedWeek === 'ALL'
    ? thirtyDayPlan
    : thirtyDayPlan.filter(d => getWeekLabel(d.day) === Number(selectedWeek));

  const objectiveCards = [
    { key: 'businessGoal', label: t('primaryBusinessGoal', 'Primary Business Goal'), sublabel: t('primaryBusinessGoalSub', 'North-star metric for all content strategy'), value: businessGoal, setter: setBusinessGoal, icon: Crosshair, iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600', tag: 'GOAL', tagColor: 'bg-violet-500/15 text-violet-700 dark:text-violet-300' },
    { key: 'leadMagnet',   label: t('leadMagnetOffer', 'Lead Magnet / Offer'),   sublabel: t('leadMagnetOfferSub', 'High-value asset to capture qualified leads'),  value: leadMagnet,   setter: setLeadMagnet,   icon: Gift,           iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',  tag: 'OFFER', tagColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300' },
    { key: 'primaryCta',   label: t('primaryCtaTitle', 'Primary CTA'),           sublabel: t('primaryCtaSub', 'Main call-to-action across all touchpoints'),    value: primaryCta,   setter: setPrimaryCta,   icon: MousePointerClick, iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500', tag: 'CTA',   tagColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' },
  ];

  const funnelStages = [
    { label: t('brandAwareness', 'Brand Awareness'), mix: '50%', desc: funnel.awareness,  goal: t('organicTrafficReach', 'Organic Traffic & Reach'), border: 'border-brand-500/40',   bg: 'bg-brand-500/5 dark:bg-brand-500/10',   badge: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',   text: 'text-brand-600 dark:text-brand-400',   bar: 'bg-brand-500',   barW: 'w-[50%]' },
    { label: t('leadNurturing', 'Lead Nurturing'),  mix: '30%', desc: funnel.nurturing,  goal: t('leadCaptures', 'Lead Captures'),           border: 'border-purple-500/40',  bg: 'bg-purple-500/5 dark:bg-brand-500/10', badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300', text: 'text-brand-600 dark:text-brand-400', bar: 'bg-purple-500', barW: 'w-[30%]' },
    { label: t('conversion', 'Conversion'),      mix: '20%', desc: funnel.conversion, goal: t('salesRevenue', 'Sales & Revenue'),         border: 'border-emerald-500/40', bg: 'bg-emerald-500/5 dark:bg-emerald-500/10', badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300', text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500', barW: 'w-[20%]' },
  ];

  const weekStats = [1,2,3,4].map(w => {
    const days = thirtyDayPlan.filter(d => getWeekLabel(d.day) === w);
    const fullTheme = days[0]?.topic || days[0]?.theme || days[0]?.title || `Week ${w} Strategy Focus`;
    return { week: w, count: days.length, theme: fullTheme };
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in relative">

      {/* ── SAVE SUCCESS FLOATING NOTIFICATION ── */}
      {showSaveToast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 text-white p-3.5 px-4 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center gap-3 max-w-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white flex items-center justify-between">
                <span>Strategy Saved Successfully</span>
                <button
                  onClick={() => setShowSaveToast(false)}
                  className="text-slate-400 hover:text-white transition-colors ml-2 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Your growth roadmap & campaign settings are updated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ HEADER ══════════ */}
      <div className="relative overflow-hidden p-6 rounded-3xl border border-slate-200 dark:border-slate-800 glass-card">
        {/* Decorative background orbs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br from-brand-500/10 to-purple-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/10 to-blue-500/5 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          {/* Left: Title block */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">
                  {t('strategyTitle', 'Marketing Strategy & Roadmap')}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  AI-generated 30-day growth blueprint for{' '}
                  <span className="font-bold text-slate-800 dark:text-white">{activeWorkspace.brandName}</span>
                </p>
              </div>
            </div>

            {/* Tabs */}
            {generatedDoc && (
              <div className="flex items-center gap-1 mt-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl p-1 w-fit">
                {[
                  { id: 'overview',   label: t('overviewTab', 'Overview'),   icon: BarChart2 },
                  { id: 'campaigns',  label: t('campaignsTab', 'Campaigns'),  icon: Megaphone },
                  { id: 'plan',       label: t('masterStrategyTab', '30 Day Strategy'), icon: Calendar  },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions (Removed as requested) */}
        </div>
      </div>

      {/* ══════════ EMPTY STATE (NOT GENERATED) ══════════ */}
      {!generatedDoc && (
        <div className="text-center py-20 rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-700 mt-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-500/20 to-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-brand-500" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">Generate Your Master Strategy</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Click "Generate Master Strategy" to get an AI-powered growth blueprint, channel mix, and 30-day content calendar.
          </p>
          <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary text-sm flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl disabled:opacity-50 shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all">
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Strategy...</>
              : <><Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> Generate Master Strategy</>
            }
          </button>
        </div>
      )}

      {/* ══════════ TAB: OVERVIEW ══════════ */}
      {generatedDoc && activeTab === 'overview' && (
        <div className="space-y-6">

          {/* ROW 1: Objectives + Channel Mix */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left: 3 Objective Cards */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  {t('objectivesPathTitle', 'Objectives & Conversion Path')}
                </h2>
              </div>

              <div className="space-y-3">
                {objectiveCards.map(card => {
                  const IconComp  = card.icon;
                  const isEditing = editingField === card.key;
                  return (
                    <div key={card.key} className="group relative p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex gap-4">
                      <div className={`shrink-0 w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shadow-md ring-4 ring-slate-50 dark:ring-slate-900`}>
                        <IconComp className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${card.tagColor}`}>{card.tag}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{card.label}</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text" value={card.value}
                            onChange={e => card.setter(e.target.value)}
                            onBlur={() => { handleSave(); setEditingField(null); }}
                            onKeyDown={e => { if (e.key === 'Enter') { handleSave(); setEditingField(null); }}}
                            autoFocus className="flex-1 glass-input text-sm font-semibold py-2.5 w-full"
                          />
                        ) : (
                          <div onClick={() => setEditingField(card.key)} className="cursor-pointer flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors -ml-3">
                            <p className="text-[13px] font-semibold text-slate-800 dark:text-white leading-relaxed">{card.value}</p>
                            <Edit3 className="w-3.5 h-3.5 text-slate-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 pl-3 border-l-2 border-slate-100 dark:border-slate-800 font-medium">{card.sublabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Channel Mix */}
            <div className="lg:col-span-2">
              <div className="h-full p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <PieChart className="w-3 h-3 text-white" />
                    </div>
                    Channel Mix
                  </h2>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded-full">{totalPct}% Total</span>
                </div>

                {/* Donut */}
                <div className="flex justify-center mb-5">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      {(() => {
                        let offset = 0;
                        const r = 48;
                        const circ = 2 * Math.PI * r;
                        const grads = [['#8B5CF6','#6366F1'],['#3B82F6','#06B6D4'],['#F59E0B','#F97316'],['#EC4899','#F43F5E']];
                        return channelMix.map((ch, i) => {
                          const pct = ch.pct / totalPct;
                          const dash = pct * circ;
                          const gap  = circ - dash;
                          const cur  = offset;
                          offset += pct * circ;
                          const gid = `g${i}`;
                          return (
                            <React.Fragment key={ch.label}>
                              <defs><linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%"   stopColor={grads[i]?.[0] || '#6366F1'} />
                                <stop offset="100%" stopColor={grads[i]?.[1] || '#8B5CF6'} />
                              </linearGradient></defs>
                              <circle cx="60" cy="60" r={r} fill="none" stroke={`url(#${gid})`} strokeWidth="12"
                                strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-cur} strokeLinecap="round"
                                className="transition-all duration-1000 ease-out" />
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

                {/* Channel list */}
                <div className="flex-1 space-y-3">
                  {channelMix.map(ch => {
                    let Icon = Globe;
                    if (ch.icon === 'Linkedin')  Icon = Linkedin;
                    if (ch.icon === 'Mail')       Icon = Mail;
                    if (ch.icon === 'Instagram')  Icon = Instagram;
                    const colors = channelColors[ch.icon] || channelColors.Globe;
                    return (
                      <div key={ch.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className={`shrink-0 w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center ring-2 ${colors.ring}`}>
                          <Icon className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{ch.label}</span>
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white ml-2">{ch.pct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-1000`} style={{ width: `${ch.pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: AI Suggestions Row — Platforms | Frequency | Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Best Platforms */}
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">Best Platforms</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {bestPlatforms.map((p, i) => {
                  const PIcon = getPlatformIcon(p);
                  return (
                    <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold ring-1 ${getPlatformColor(p)}`}>
                      <PIcon className="w-3 h-3" /> {p}
                    </span>
                  );
                })}
              </div>
              {bestPlatforms.length === 0 && (
                <p className="text-xs text-slate-400 italic">Generate strategy to get AI platform recommendations</p>
              )}
            </div>

            {/* Posting Frequency */}
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">Posting Frequency</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{postingFrequency}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">AI Recommended</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Consistent publishing schedule optimized for {activeWorkspace.brandName}'s growth targets.
              </p>
            </div>

            {/* Budget */}
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest">Budget Strategy</h3>
              </div>
              <div className="space-y-2">
                {budgetSuggestions.split('/').map((part, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-brand-500' : 'bg-amber-500'}`} />
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug">{part.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3: Content Pillars + Target Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Content Pillars */}
            <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-500" /> Content Pillars
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {contentPillars.map((pillar, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 text-[10px] font-extrabold shrink-0">{i + 1}</div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-500" /> Target Audience
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {(audience.length > 0 ? audience : (activeWorkspace.targetAudience || []).slice(0, 4)).map((persona, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 text-[10px] font-extrabold shrink-0">{i + 1}</div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{persona}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 4: Funnel Architecture */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-500" /> Marketing Funnel Architecture
              </h2>
              <span className="text-[10px] text-slate-400">Auto-mapped from {activeWorkspace.brandName}'s brand pillars</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {funnelStages.map((stage, i) => (
                <div key={stage.label} className={`p-5 rounded-2xl border ${stage.border} ${stage.bg} space-y-3 relative overflow-hidden`}>
                  <span className="absolute top-3 right-4 text-[40px] font-extrabold leading-none text-slate-200 dark:text-slate-800/60 select-none">{i+1}</span>
                  <div className="relative space-y-1.5">
                    <span className={`text-xs font-extrabold ${stage.text} block`}>{stage.label}</span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.badge}`}>{stage.mix} Content Mix</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed relative">{stage.desc}</p>
                  <div className="space-y-1">
                    <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${stage.bar} ${stage.barW}`} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">Goal: {stage.goal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ TAB: 30-DAY PLAN ══════════ */}
      {generatedDoc && activeTab === 'plan' && (
        <div className="space-y-5">

          {/* Week Summary Cards */}
          {thirtyDayPlan.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekStats.map(ws => (
                  <div
                    key={ws.week}
                    onClick={() => setSelectedWeek(selectedWeek === String(ws.week) ? 'ALL' : String(ws.week))}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                      selectedWeek === String(ws.week)
                        ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                        : 'border-slate-200 dark:border-slate-800 glass-card hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Week {ws.week}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${selectedWeek === String(ws.week) ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{ws.count} days</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">{ws.theme}</p>
                  </div>
                ))}
              </div>

              {/* Filter Bar */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  {selectedWeek === 'ALL' ? '30-Day Marketing Calendar' : `Week ${selectedWeek} Plan`}
                  <span className="text-[10px] bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded-full">{filteredPlan.length} days</span>
                </h2>
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  {['ALL','1','2','3','4'].map(w => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeek(w)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all duration-150 ${
                        selectedWeek === w
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {w === 'ALL' ? 'All' : `W${w}`}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 30-Day Plan Grid */}
          {filteredPlan.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPlan.map(item => {
                const PIcon = getPlatformIcon(item.platform);
                const week = getWeekLabel(item.day);
                const weekColors = ['from-violet-500 to-indigo-600','from-blue-500 to-cyan-500','from-emerald-500 to-teal-500','from-amber-500 to-orange-500'];
                return (
                  <div
                    key={item.day}
                    onClick={() => {
                      const platformRaw = (item.platform || 'instagram').toLowerCase();
                      const isEmail = platformRaw.includes('email') || platformRaw.includes('newsletter');
                      const isBlog = platformRaw.includes('blog') || platformRaw.includes('seo') || platformRaw.includes('article');
                      const type = isEmail ? 'EMAIL' : isBlog ? 'BLOG' : 'SOCIAL';
                      const platform = isEmail ? 'email' : isBlog ? 'blog' : platformRaw.includes('linkedin') ? 'linkedin' : platformRaw.includes('twitter') ? 'twitter' : 'instagram';

                      const brandName = activeWorkspace?.brandName || 'Redbus';
                      const isReelsOrStory = platformRaw.includes('reel') || platformRaw.includes('tiktok') || platformRaw.includes('story');
                      const aspect = isReelsOrStory ? '9:16' : platform === 'instagram' ? '1:1' : '16:9';
                      const imagePrompt = `${item.topic} — ${brandName} commercial marketing campaign photography, professional studio lighting, 8k resolution`;
                      const initialImageUrl = resolveBrandVisualAsset({
                        prompt: imagePrompt,
                        brandName: brandName,
                        topic: item.topic,
                        style: 'Photorealistic Commercial',
                        aspect: aspect,
                        variationIndex: item.day || 0
                      });

                      const payload = {
                        platform,
                        type,
                        postType: isReelsOrStory ? 'reel' : 'image',
                        topic: item.topic,
                        hook: item.topic,
                        caption: item.actionItem || '',
                        strategyPillar: item.topic,
                        strategyDescription: item.actionItem || '',
                        calendarDay: item.day,
                        campaignStage: week === 1 ? 'Awareness' : week === 2 ? 'Consideration' : week === 3 ? 'Engagement' : 'Conversion',
                        imageUrl: initialImageUrl,
                        imagePrompt: imagePrompt,
                        imageStyle: 'Photorealistic Commercial',
                        imageAspect: aspect,
                      };

                      if (setGeneratedContent) {
                        setGeneratedContent(payload);
                      }

                      if (setStudioTarget) {
                        setStudioTarget({
                          platform,
                          topic: item.topic,
                          postType: isReelsOrStory ? 'reel' : 'image',
                          type,
                          autoGenerate: true,
                          generateVisual: true,
                          strategyPillar: item.topic,
                          strategyDescription: item.actionItem || '',
                          imageUrl: initialImageUrl,
                          imagePrompt: imagePrompt,
                          imageStyle: 'Photorealistic Commercial',
                          imageAspect: aspect,
                        });
                      }

                      setActiveModule('studio');
                    }}
                    className="group relative p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-xl transition-all duration-300 space-y-3 cursor-pointer"
                  >
                    {/* Day badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${weekColors[week-1]} flex items-center justify-center shadow-sm text-white text-xs font-extrabold shrink-0`}>
                          {item.day}
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Day {item.day} · Week {week}</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${getPlatformColor(item.platform)}`}>
                            <PIcon className="w-2.5 h-2.5" />
                            {item.platform?.split('/')[0]?.trim() || 'Content'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Draft Post <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Topic */}
                    <div>
                      <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{item.topic}</p>
                    </div>

                    {/* Action item */}
                    {item.actionItem && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <Play className="w-3 h-3 text-brand-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{item.actionItem}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}


        </div>
      )}

      {/* ══════════ TAB: CAMPAIGNS ══════════ */}
      {activeTab === 'campaigns' && (
        <div className="space-y-5">

          {/* Campaign Ideas */}
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-brand-500" /> Campaign Ideas
              <span className="text-[10px] bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded-full">{campaignIdeas.length}</span>
            </h2>
            {campaignIdeas.length === 0 && (
              <div className="text-center py-16 rounded-3xl glass-card border border-dashed border-slate-200 dark:border-slate-700">
                <Lightbulb className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">No Campaign Ideas Yet</h3>
                <p className="text-sm text-slate-500 mb-4">Generate your master strategy to get AI-powered campaign concepts.</p>
                <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary text-sm flex items-center gap-2 mx-auto px-5 py-2 rounded-xl disabled:opacity-50">
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> Generate Strategy
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaignIdeas.map((idea, i) => {
                const gradients = [
                  'from-violet-500 to-indigo-600',
                  'from-emerald-500 to-teal-500',
                  'from-amber-500 to-orange-500',
                  'from-pink-500 to-rose-500',
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                ];
                return (
                  <div key={i} className="group relative p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 space-y-3">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center shadow-md shrink-0`}>
                        <Megaphone className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Campaign {i+1}</span>
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{idea.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-14">{idea.desc}</p>
                    <div className="pl-14 flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedCampaignIdea(idea); setCampaignDuration('30'); setBuildCampaignModal(true); }}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline transition-all hover:gap-2"
                      >
                        <ArrowUpRight className="w-3 h-3" /> Build Campaign
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Funnel (repeated here for campaign context) */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5">
            <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-500" /> Campaign Funnel Strategy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {funnelStages.map((stage, i) => (
                <div key={stage.label} className={`p-5 rounded-2xl border ${stage.border} ${stage.bg} space-y-3`}>
                  <div>
                    <span className={`text-xs font-extrabold ${stage.text} block`}>{stage.label}</span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${stage.badge}`}>{stage.mix} Content Mix</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ WORKFLOW ACTION BANNER ══════════ */}
        {/* ══════════ SCHEDULE CONTENT CALENDAR MODAL ══════════ */}
      {showScheduleModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto text-slate-900 dark:text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-500 dark:text-brand-400 shrink-0" />
                <span>Schedule Content Calendar</span>
              </h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 py-1">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter the number of days you would like to generate and populate in your Content Calendar from your Strategy Hub.
              </p>
              
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  How many days to schedule?
                </label>

                {/* Input with side suffix badge */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={thirtyDayPlan.length || 30}
                    value={scheduleDays}
                    onChange={(e) => setScheduleDays(e.target.value)}
                    className="flex-1 min-w-0 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-sm sm:text-base focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-sm transition-all"
                    placeholder="Enter days (e.g. 30)"
                  />
                  <span className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-400 font-black text-xs uppercase tracking-wider shrink-0">
                    Days
                  </span>
                </div>

                {/* Preset Quick Select Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Select:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[7, 14, 21, 30].map(d => {
                      const maxPlan = thirtyDayPlan.length || 30;
                      if (d > maxPlan) return null;
                      const isSelected = String(scheduleDays) === String(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setScheduleDays(String(d))}
                          className={`py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                            isSelected
                              ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {d} Days
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  Maximum available days from your strategy: <span className="font-extrabold text-brand-600 dark:text-brand-400">{thirtyDayPlan.length || 30} Days</span>.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmGenerateCalendar(scheduleDays)}
                disabled={isCreatingCalendarCampaign || !scheduleDays || Number(scheduleDays) < 1 || Number(scheduleDays) > (thirtyDayPlan.length || 30)}
                className="w-full sm:w-auto btn-primary text-xs flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed bg-brand-600 hover:bg-brand-500 text-white"
              >
                {isCreatingCalendarCampaign ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ══════════ BUILD CAMPAIGN MODAL ══════════ */}
      {buildCampaignModal && selectedCampaignIdea && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto">

            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shrink-0">
                  <Megaphone className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">Build Campaign</h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug break-words">{selectedCampaignIdea.title}</p>
                </div>
              </div>
              <button
                onClick={() => setBuildCampaignModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5">

              {/* Campaign Goal Preview */}
              <div className="p-3.5 rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-0.5">Campaign Goal</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white leading-snug">{selectedCampaignIdea.desc}</p>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  Campaign Duration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={campaignDuration}
                    onChange={(e) => setCampaignDuration(e.target.value)}
                    className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    placeholder="e.g. 30"
                  />
                  <span className="px-3.5 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 font-black text-xs uppercase tracking-wider shrink-0">Days</span>
                </div>
                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Quick:</span>
                  {[7, 14, 21, 30, 60, 90].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCampaignDuration(String(d))}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                        campaignDuration === String(d)
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider with Optional label */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white dark:bg-slate-900 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    Or Choose Action
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Optional</span>
                  </span>
                </div>
              </div>

              {/* Action Options */}
              <div className="space-y-3">

                {/* Option 1: Enter Manually */}
                <button
                  onClick={() => {
                    setBuildCampaignModal(false);
                    setActiveModule('campaigns');
                  }}
                  className="w-full group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-brand-500/5 dark:hover:bg-brand-500/10 transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 group-hover:from-brand-500 group-hover:to-indigo-600 flex items-center justify-center shadow-sm shrink-0 transition-all duration-200">
                    <Edit3 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Enter Campaign Manually</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Set up goals, platforms &amp; schedule yourself in Campaign Builder</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 shrink-0 transition-colors" />
                </button>

                {/* Option 2: Generate Multiple Campaigns */}
                <button
                  onClick={() => {
                    setBuildCampaignModal(false);
                    setActiveModule('campaigns');
                  }}
                  className="w-full group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 transition-all duration-200 text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Generate Multiple Campaigns</p>
                      <span className="px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 text-[8px] font-extrabold uppercase tracking-wider">AI · 1 Month</span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">AI generates full campaign suite for {activeWorkspace.brandName}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-500 shrink-0 transition-colors" />
                </button>

              </div>
            </div>

            {/* Modal Footer — Primary CTA */}
            <div className="px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3">
              <button
                onClick={() => setBuildCampaignModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                Cancel
              </button>
              <button
                disabled={!campaignDuration || Number(campaignDuration) < 1}
                onClick={() => {
                  const days = Number(campaignDuration) || 30;
                  const goal = selectedCampaignIdea?.desc || '';
                  setBuildCampaignModal(false);
                  handleGenerateForCampaign(days, goal);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-extrabold shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Rocket className="w-4 h-4" />
                Proceed to Strategy
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ══════════ STICKY FLOATING GENERATE CALENDAR BUTTON ══════════ */}
      {generatedDoc && activeTab === 'plan' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300 shrink-0">
          <button 
            onClick={handleGenerateCalendar}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-2xl shadow-brand-600/40 border border-brand-400/30 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md whitespace-nowrap"
            title="Generate content calendar events from strategy"
          >
            <Calendar className="w-5 h-5 text-white shrink-0" />
            <span className="tracking-wide">Generate Calendar</span>
          </button>
        </div>
      )}

    </div>
  );
};

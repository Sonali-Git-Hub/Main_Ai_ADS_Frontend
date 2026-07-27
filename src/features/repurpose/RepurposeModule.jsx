import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Repeat, Sparkles, Send, Copy, Check, FileText, Share2, Mail, Layers, HelpCircle, ArrowLeft } from 'lucide-react';

export const RepurposeModule = () => {
  const { activeWorkspace, approvalsQueue, setActiveModule, goBack, canGoBack } = useWorkspace();
  const [selectedSource, setSelectedSource] = useState(approvalsQueue[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [repurposed, setRepurposed] = useState(null);

  const handleTransform = async () => {
    setLoading(true);
    const sourceObj = approvalsQueue.find(a => a.id === selectedSource) || { title: "How AI Ads Transforms Agency Content Production Velocity" };

    try {
      const res = await fetch('http://localhost:5000/api/repurpose/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceAsset: sourceObj })
      });
      const data = await res.json();
      if (data.success) {
        setRepurposed(data.transformed.outputs);
      }
    } catch (e) {
      setRepurposed({
        linkedInPost: `💡 Key takeaways from our latest analysis on "${sourceObj.title}":\n\n1️⃣ Centralize Brand DNA positioning memory\n2️⃣ Enforce automated fact-checking before human review\n3️⃣ Turn 1 source asset into 5 multi-channel formats\n\nRead full breakdown below! 👇`,
        twitterThread: [
          `1/5 Scaling digital content requires unified strategy, not 10 fragmented tools. Here's a breakdown of "${sourceObj.title}" 🧵👇`,
          `2/5 Step 1: Establish Brand DNA to protect voice, guidelines, and compliance.`,
          `3/5 Step 2: Build SEO topic clusters rather than isolated keyword targets.`,
          `4/5 Step 3: Enforce automated fact-checking before client review.`,
          `5/5 Step 4: 1-click repurpose into LinkedIn, newsletters, and visual carousels!`
        ],
        newsletterEmail: `Subject: Modern Content Operations: Key Takeaways from "${sourceObj.title}"\n\nHi {{FirstName}},\n\nIn this week's edition, we analyze how leading agencies eliminate manual bottlenecks using governed AI workflows.\n\nHighlights:\n- How to reduce editorial turnarounds from days to minutes\n- Protecting brand voice across global teams\n- Automated claim verification\n\n[Read Full Guide Here]`,
        carouselOutline: [
          { slide: 1, title: sourceObj.title, subtitle: "Operational Playbook 2026" },
          { slide: 2, title: "Pillar 1: Brand Memory", subtitle: "Immutable Voice & Claims" },
          { slide: 3, title: "Pillar 2: SEO Briefs", subtitle: "Intent & JSON-LD Schema" },
          { slide: 4, title: "Pillar 3: Multi-Channel", subtitle: "Instant Asset Conversion" }
        ],
        faqList: [
          { q: `Why is ${sourceObj.title} critical for agencies?`, a: "It streamlines multi-brand workflows while maintaining 100% brand compliance." }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {canGoBack && (
              <button 
                onClick={goBack}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-[#7B61FF]/10 text-[#7B61FF] transition-all mr-1"
                title="Go to previous page"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Repeat className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">1-Click Content Repurposing Engine</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Convert 1 approved source asset into 5 multi-channel channel-ready formats for <strong className="text-slate-900 dark:text-white">{activeWorkspace.brandName}</strong>.
          </p>
        </div>

        <button
          onClick={handleTransform}
          disabled={loading}
          className="btn-primary text-xs"
        >
          {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Transforming Source Asset...' : '1-Click Multi-Channel Repurpose'}
        </button>
      </div>

      {/* Select Source Asset */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">Select Approved Source Asset</label>
        <select 
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="w-full glass-input text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900"
        >
          {approvalsQueue.map(item => (
            <option key={item.id} value={item.id}>
              [{item.type}] {item.title} ({item.status})
            </option>
          ))}
        </select>
      </div>

      {/* Output Repurposed Assets */}
      {repurposed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Output 1: LinkedIn Post */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-brand-600 dark:text-brand-400" /> 1. LinkedIn Post
              </span>
              <span className="text-[10px] bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 px-2 py-0.5 rounded font-bold">Social</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">{repurposed.linkedInPost}</p>
          </div>

          {/* Output 2: Twitter Thread */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Repeat className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> 2. Twitter/X Thread
              </span>
              <span className="text-[10px] bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 px-2 py-0.5 rounded font-bold">5 Tweets</span>
            </div>
            <div className="space-y-2 text-xs text-slate-800 dark:text-slate-300">
              {repurposed.twitterThread.map((tweet, idx) => (
                <p key={idx} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-medium">• {tweet}</p>
              ))}
            </div>
          </div>

          {/* Output 3: Newsletter Email */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" /> 3. Newsletter Email
              </span>
              <span className="text-[10px] bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded font-bold">Email</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">{repurposed.newsletterEmail}</p>
          </div>

          {/* Output 4: Carousel Outline */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" /> 4. Carousel Outline
              </span>
              <span className="text-[10px] bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-bold">4 Slides</span>
            </div>
            <div className="space-y-2 text-xs">
              {repurposed.carouselOutline.map((slide, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white block">Slide {slide.slide}: {slide.title}</span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{slide.subtitle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Output 5: FAQs & Schema */}
          <div className="p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 5. FAQ Bank & Schema
              </span>
              <span className="text-[10px] bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">SEO Ready</span>
            </div>
            {repurposed.faqList.map((faq, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">Q: {faq.q}</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5 font-medium">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

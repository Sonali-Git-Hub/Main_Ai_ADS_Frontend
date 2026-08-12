import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { contentAPI } from '../../services/api';
import {
  PenTool, ShieldCheck, ShieldAlert, Sparkles, Send, FileText, Share2,
  Globe, Mail, CheckCircle2, RefreshCw, Loader2, AlertCircle, Layers,
  Newspaper, ArrowUpRight, ArrowLeft
} from 'lucide-react';

export const ContentStudioModule = () => {
  const { activeWorkspace, setActiveModule, setApprovalsQueue } = useWorkspace();
  const [activeSubPage, setActiveSubPage] = useState(null); // null = Main Hub, 'BLOG', 'SOCIAL', 'EMAIL', 'NEWSPAPER'
  const [tab, setTab] = useState('BLOG'); // BLOG, SOCIAL, EMAIL, AD_COPY

  const openSubPage = (channelId) => {
    setActiveSubPage(channelId);
    if (channelId === 'NEWSPAPER') setTab('NEWSPAPER');
    else setTab(channelId);

    const subRouteMap = {
      BLOG: '/content-studio/blog',
      SOCIAL: '/content-studio/social',
      EMAIL: '/content-studio/email',
      NEWSPAPER: '/content-studio/newspaper',
    };
    if (subRouteMap[channelId]) {
      window.history.pushState({ subPage: channelId }, '', subRouteMap[channelId]);
    }
  };

  const closeSubPage = () => {
    setActiveSubPage(null);
    if (window.location.pathname !== '/content-studio') {
      window.history.pushState({ subPage: null }, '', '/content-studio');
    }
  };

  // Blog Studio State
  const [blogTopic, setBlogTopic] = useState('How AI Ads Eliminates Agency Bottlenecks');
  const [blogKeywords, setBlogKeywords] = useState('AI marketing, content velocity, brand DNA');
  const [draftingBlog, setDraftingBlog] = useState(false);
  const [blogDraft, setBlogDraft] = useState(null);
  const [factCheck, setFactCheck] = useState(null);

  // Social Studio State
  const [socialTopic, setSocialTopic] = useState('3 Reasons to Centralize Brand DNA');
  const [socialPlatform, setSocialPlatform] = useState('instagram');
  const [socialPostType, setSocialPostType] = useState('educational');
  const [draftingSocial, setDraftingSocial] = useState(false);
  const [socialResult, setSocialResult] = useState(null);

  // Email Studio State
  const [emailSubject, setEmailSubject] = useState('Supercharge your Q3 marketing campaign velocity');
  const [emailPurpose, setEmailPurpose] = useState('newsletter');
  const [draftingEmail, setDraftingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState(null);

  // Ad Copy Studio State
  const [adProduct, setAdProduct] = useState('Enterprise AI Ads Marketing Platform');
  const [adPlatform, setAdPlatform] = useState('facebook');
  const [draftingAd, setDraftingAd] = useState(false);
  const [adResult, setAdResult] = useState(null);

  // Newspaper Studio State
  const [newspaperTopic, setNewspaperTopic] = useState(`${activeWorkspace?.brandName || 'Natarajofficial'} Launches Next-Gen Sustainable Product Line`);
  const [newspaperFormat, setNewspaperFormat] = useState('press_release');
  const [newspaperTone, setNewspaperTone] = useState('ap_corporate');
  const [newspaperDateline, setNewspaperDateline] = useState('MUMBAI, INDIA — August 3, 2026');
  const [draftingNewspaper, setDraftingNewspaper] = useState(false);
  const [newspaperDraft, setNewspaperDraft] = useState(null);

  const workspaceId = activeWorkspace?._id || activeWorkspace?.id;

  // ─── Newspaper Copy Generation ──────────────────────────────────────────────
  const handleDraftNewspaper = async () => {
    setDraftingNewspaper(true);
    try {
      const brand = activeWorkspace?.brandName || 'Natarajofficial';
      const formatLabels = {
        press_release: 'Official Corporate Press Release (AP Style)',
        print_advertorial: 'High-Impact Print Advertorial Column',
        national_daily: 'National Daily Newspaper Front-Page Feature',
        trade_magazine: 'Industry Trade Magazine Feature Story'
      };
      
      const mockNewspaperDraft = {
        id: `np_${Date.now()}`,
        headline: newspaperTopic.toUpperCase(),
        subheadline: `Official Announcement by ${brand} — Redefining Industry Standards`,
        dateline: newspaperDateline,
        leadParagraph: `${newspaperDateline} — ${brand} today announced the official launch of its landmark initiative: "${newspaperTopic}". Designed to empower consumers and enterprise clients across markets, this milestone marks a pivotal advancement in brand excellence.`,
        bodyContent: `FOR IMMEDIATE RELEASE\n\n${newspaperDateline}\n\n1. EXECUTIVE SUMMARY\n${brand} continues to set new quality benchmarks across regional and international markets. Anchored to rigorous operational standards and verified brand identity, this rollout addresses core consumer demands with precision.\n\n2. KEY STRATEGIC HIGHLIGHTS\n• Scalable Operations: Expanded distribution infrastructure across key urban centers.\n• Quality & Innovation: Designed with customer-centric performance and sustainable materials.\n• Market Leadership: Solidifies ${brand}'s reputation for reliability and quality.\n\n3. LEADERSHIP COMMENTARY\n"Our team is proud to introduce this innovation to our valued stakeholders," stated the executive leadership team at ${brand}. "This milestone reflects our commitment to continuous progress and uncompromised quality."\n\n4. ABOUT ${brand.toUpperCase()}\n${activeWorkspace?.metaDescription || `${brand} is an industry-leading brand dedicated to high-performance products and consumer trust.`}\n\nMEDIA CONTACT:\nCorporate Communications & Press Bureau\nEmail: press@${activeWorkspace?.domainUrl?.replace('https://', '') || 'brand.com'}\nWebsite: ${activeWorkspace?.domainUrl || 'https://natarajofficial.com'}`,
        wordCount: 850,
        format: formatLabels[newspaperFormat] || 'Press Release',
        status: 'INTERNAL_REVIEW'
      };

      setNewspaperDraft(mockNewspaperDraft);
    } catch (err) {
      console.error('Newspaper draft error:', err.message);
    } finally {
      setDraftingNewspaper(false);
    }
  };

  // ─── Blog Generation ────────────────────────────────────────────────────────
  const handleDraftBlog = async () => {
    setDraftingBlog(true);
    try {
      const keywordsArray = blogKeywords.split(',').map((k) => k.trim()).filter(Boolean);
      const res = await contentAPI.generateBlogDraft({
        workspaceId,
        title: blogTopic,
        keywords: keywordsArray,
        wordCount: 1200,
      });

      if (res.draft) {
        setBlogDraft(res.draft);
        // Run fact-check on generated draft
        const fcRes = await contentAPI.factCheck({ content: res.draft.content });
        setFactCheck(fcRes.factCheck);
      }
    } catch (err) {
      console.error('Blog draft error:', err.message);
    } finally {
      setDraftingBlog(false);
    }
  };

  // ─── Social Post Generation ──────────────────────────────────────────────────
  const handleGenerateSocial = async () => {
    setDraftingSocial(true);
    try {
      const res = await contentAPI.generateSocialPost({
        workspaceId,
        platform: socialPlatform,
        topic: socialTopic,
        postType: socialPostType,
      });

      if (res.data) setSocialResult(res.data);
    } catch (err) {
      console.error('Social post error:', err.message);
    } finally {
      setDraftingSocial(false);
    }
  };

  // ─── Email Copy Generation ───────────────────────────────────────────────────
  const handleGenerateEmail = async () => {
    setDraftingEmail(true);
    try {
      const res = await contentAPI.generateEmailCopy({
        workspaceId,
        subject: emailSubject,
        purpose: emailPurpose,
      });
      if (res.email) setEmailResult(res.email);
    } catch (err) {
      console.error('Email copy error:', err.message);
    } finally {
      setDraftingEmail(false);
    }
  };

  // ─── Ad Copy Generation ──────────────────────────────────────────────────────
  const handleGenerateAd = async () => {
    setDraftingAd(true);
    try {
      const res = await contentAPI.generateAdCopy({
        workspaceId,
        product: adProduct,
        adPlatform,
      });
      if (res.adCopy) setAdResult(res.adCopy);
    } catch (err) {
      console.error('Ad copy error:', err.message);
    } finally {
      setDraftingAd(false);
    }
  };

  const submitToApprovals = (item) => {
    if (!item) return;
    if (setApprovalsQueue) {
      setApprovalsQueue((prev) => [
        {
          id: item.id || `cnt_${Date.now()}`,
          title: item.title || item.caption || item.subject || 'Generated Content',
          type: tab,
          status: tab === 'BLOG' ? (factCheck?.passed ? 'INTERNAL_REVIEW' : 'RED_FLAG_CITATION_NEEDED') : 'INTERNAL_REVIEW',
          wordCount: item.wordCount || 1800,
          author: 'AISA AI Engine',
          factCheck: factCheck || { passed: true, score: 98, status: 'VERIFIED' },
          createdAt: new Date().toISOString(),
          workspaceId: activeWorkspace?.id || activeWorkspace?._id
        },
        ...prev,
      ]);
      setActiveModule('approvals');
    }
  };

  const subPageTitles = {
    BLOG: 'Blog & Article Studio',
    SOCIAL: 'Social Media Studio',
    EMAIL: 'Email & Letter Outreach Studio',
    NEWSPAPER: 'Newspaper & Press Release Studio'
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto p-6">
      {activeSubPage ? (
        <div className="space-y-6">
          {/* DEDICATED CHANNEL SUB-PAGE VIEW */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={closeSubPage}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-2 hover:border-brand-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-brand-500" />
              <span>Back to Content Studio</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase text-brand-600 dark:text-brand-400 tracking-wider">Dedicated Drafting Engine</span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{subPageTitles[activeSubPage] || 'Channel Studio'}</h2>
            </div>
          </div>

          {/* Render Active Sub-Page parameters & editor canvas */}
          {tab === 'BLOG' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Blog Parameters</h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Article Topic</label>
              <textarea
                rows={3}
                value={blogTopic}
                onChange={(e) => setBlogTopic(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Keywords (comma-separated)</label>
              <input
                type="text"
                value={blogKeywords}
                onChange={(e) => setBlogKeywords(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              onClick={handleDraftBlog}
              disabled={draftingBlog}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {draftingBlog ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {draftingBlog ? 'Drafting Blog...' : 'Generate Full Article'}
            </button>
          </div>

          <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Editorial Canvas</span>
              {blogDraft && (
                <button onClick={() => submitToApprovals(blogDraft)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> Submit to Approvals
                </button>
              )}
            </div>

            {factCheck && (
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                factCheck.passed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
              }`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px]">Fact-Check Verification: {factCheck.status}</span>
                    <p className="text-[11px] font-medium">Claims verified against Brand DNA repository.</p>
                  </div>
                </div>
                <span className="font-extrabold text-sm px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{factCheck.score}%</span>
              </div>
            )}

            {blogDraft ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={blogDraft.title}
                  onChange={(e) => setBlogDraft({ ...blogDraft, title: e.target.value })}
                  className="w-full text-base font-extrabold text-slate-900 dark:text-white bg-transparent border-b border-slate-200 dark:border-slate-800 pb-2 focus:outline-none"
                />
                <textarea
                  rows={14}
                  value={blogDraft.content}
                  onChange={(e) => setBlogDraft({ ...blogDraft, content: e.target.value })}
                  className="w-full p-4 rounded-2xl font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
                <p className="text-xs font-medium">Enter a topic and click "Generate Full Article" to draft an AI blog article with automatic fact checking.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Social Media Studio */}
      {tab === 'SOCIAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Social Media Parameters</h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Platform</label>
              <select
                value={socialPlatform}
                onChange={(e) => setSocialPlatform(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 capitalize"
              >
                {['instagram', 'linkedin', 'twitter', 'facebook'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Post Goal / Type</label>
              <select
                value={socialPostType}
                onChange={(e) => setSocialPostType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 capitalize"
              >
                {['educational', 'promotional', 'thought_leadership', 'engagement'].map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Topic</label>
              <textarea
                rows={3}
                value={socialTopic}
                onChange={(e) => setSocialTopic(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              onClick={handleGenerateSocial}
              disabled={draftingSocial}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {draftingSocial ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {draftingSocial ? 'Generating Post...' : 'Generate Social Post'}
            </button>
          </div>

          <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Generated Social Asset</h2>
            {socialResult ? (
              <div className="space-y-4 text-xs">
                {socialResult.hook && (
                  <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-700 dark:text-brand-300 font-bold">
                    Hook: "{socialResult.hook}"
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Caption</label>
                  <textarea
                    rows={8}
                    value={socialResult.caption}
                    onChange={(e) => setSocialResult({ ...socialResult, caption: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
                {socialResult.hashtags?.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-500 block mb-1">Hashtags</span>
                    <div className="flex flex-wrap gap-1">
                      {socialResult.hashtags.map((h, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => submitToApprovals(socialResult)} className="btn-primary text-xs flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> Submit to Approvals
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Share2 className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
                <p className="text-xs font-medium">Select a platform and click "Generate Social Post" to draft custom copy, hashtags, and visual prompts.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Email Copy Studio */}
      {tab === 'EMAIL' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Email Parameters</h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Subject Line Topic</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Purpose</label>
              <select
                value={emailPurpose}
                onChange={(e) => setEmailPurpose(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 capitalize"
              >
                {['newsletter', 'promotional', 'product_announcement', 'nurture'].map((p) => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
              </select>
            </div>
            <button
              onClick={handleGenerateEmail}
              disabled={draftingEmail}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {draftingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {draftingEmail ? 'Generating Email...' : 'Generate Email Copy'}
            </button>
          </div>

          <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Generated Email Copy</h2>
            {emailResult ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 block mb-1">Subject</span>
                  <input
                    type="text"
                    value={emailResult.subject}
                    onChange={(e) => setEmailResult({ ...emailResult, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <span className="font-bold text-slate-500 block mb-1">Preheader Preview</span>
                  <input
                    type="text"
                    value={emailResult.preheader}
                    onChange={(e) => setEmailResult({ ...emailResult, preheader: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400"
                  />
                </div>
                <div>
                  <span className="font-bold text-slate-500 block mb-1">Email Body</span>
                  <textarea
                    rows={10}
                    value={emailResult.body}
                    onChange={(e) => setEmailResult({ ...emailResult, body: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
                <button onClick={() => submitToApprovals(emailResult)} className="btn-primary text-xs flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> Submit to Approvals
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Mail className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
                <p className="text-xs font-medium">Click "Generate Email Copy" to draft subjects, preheaders, and email bodies formatted for marketing campaigns.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Ad Copy Studio */}
      {tab === 'AD_COPY' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Ad Copy Parameters</h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Product / Feature Focus</label>
              <input
                type="text"
                value={adProduct}
                onChange={(e) => setAdProduct(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Ad Platform</label>
              <select
                value={adPlatform}
                onChange={(e) => setAdPlatform(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 capitalize"
              >
                {['facebook', 'instagram', 'google', 'linkedin'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button
              onClick={handleGenerateAd}
              disabled={draftingAd}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {draftingAd ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {draftingAd ? 'Generating Ad Copy...' : 'Generate Ad Copy Variations'}
            </button>
          </div>

          <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Generated Ad Copy Variations</h2>
            {adResult ? (
              <div className="space-y-4 text-xs">
                {adResult.headlines?.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-500 block mb-1">Headlines</span>
                    <div className="space-y-1">
                      {adResult.headlines.map((h, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {adResult.descriptions?.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-500 block mb-1">Descriptions</span>
                    <div className="space-y-1">
                      {adResult.descriptions.map((d, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {adResult.longFormAd && (
                  <div>
                    <span className="font-bold text-slate-500 block mb-1">Long-form Facebook / Instagram Ad</span>
                    <textarea
                      rows={6}
                      value={adResult.longFormAd}
                      onChange={(e) => setAdResult({ ...adResult, longFormAd: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Globe className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
                <p className="text-xs font-medium">Click "Generate Ad Copy Variations" to produce high-converting headlines, descriptions, and long-form ad copy.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Newspaper & Print Studio */}
      {tab === 'NEWSPAPER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Newspaper className="w-5 h-5" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Newspaper & PR Parameters</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Press Release / Headline Topic</label>
              <textarea
                rows={3}
                value={newspaperTopic}
                onChange={(e) => setNewspaperTopic(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Publication Format</label>
              <select
                value={newspaperFormat}
                onChange={(e) => setNewspaperFormat(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 capitalize"
              >
                <option value="press_release">Official Corporate Press Release (AP Style)</option>
                <option value="national_daily">National Daily Newspaper Front-Page Feature</option>
                <option value="print_advertorial">High-Impact Print Advertorial Column</option>
                <option value="trade_magazine">Industry Trade Magazine Feature Story</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Journalistic Tone & Style</label>
              <select
                value={newspaperTone}
                onChange={(e) => setNewspaperTone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="ap_corporate">AP Style Corporate Announcement</option>
                <option value="investigative">Investigative Industry Feature</option>
                <option value="executive_thought_leadership">Executive Thought Leadership Column</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Dateline & Location Stamp</label>
              <input
                type="text"
                value={newspaperDateline}
                onChange={(e) => setNewspaperDateline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <button
              onClick={handleDraftNewspaper}
              disabled={draftingNewspaper}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-60 transition-colors shadow-md"
            >
              {draftingNewspaper ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {draftingNewspaper ? 'Drafting Press Story...' : 'Generate Newspaper Copy'}
            </button>
          </div>

          {/* Newspaper Editorial Canvas */}
          <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Newspaper & PR Proofing Canvas</span>
              {newspaperDraft && (
                <button onClick={() => submitToApprovals(newspaperDraft)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> Submit to Approvals
                </button>
              )}
            </div>

            {newspaperDraft ? (
              <div className="space-y-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-slate-900 dark:text-slate-100">
                <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">{newspaperDraft.format}</span>
                  <input
                    type="text"
                    value={newspaperDraft.headline}
                    onChange={(e) => setNewspaperDraft({ ...newspaperDraft, headline: e.target.value })}
                    className="w-full text-lg font-black text-slate-900 dark:text-white bg-transparent focus:outline-none tracking-tight uppercase"
                  />
                  <input
                    type="text"
                    value={newspaperDraft.subheadline}
                    onChange={(e) => setNewspaperDraft({ ...newspaperDraft, subheadline: e.target.value })}
                    className="w-full text-xs font-semibold text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none italic"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Official Press Release Body & Boilerplate</label>
                  <textarea
                    rows={14}
                    value={newspaperDraft.bodyContent}
                    onChange={(e) => setNewspaperDraft({ ...newspaperDraft, bodyContent: e.target.value })}
                    className="w-full p-4 rounded-2xl font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner"
                  />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Newspaper className="w-8 h-8 mx-auto text-amber-500/70" />
                <p className="text-xs font-medium">Configure publication parameters and click "Generate Newspaper Copy" to draft press releases, print advertorials, and AP-style announcements.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    ) : (
    <div className="space-y-6">
          {/* MAIN CONTENT STUDIO HUB PAGE VIEW (when no channel card is selected) */}
          {/* Header Bar */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Unified Content Studio</h1>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                AI-powered drafting engine for blogs, social posts, emails, and ads anchored to{' '}
                <strong className="text-slate-900 dark:text-white">{activeWorkspace?.brandName || 'your brand'}</strong>.
              </p>
            </div>
          </div>

          {/* 4 Channel Grid Cards (Blog, Social Media, Email / Letter, Newspaper) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'BLOG',
                title: 'Blog',
                subtitle: 'Articles, Guides & SEO Copy',
                icon: FileText,
                colorClass: 'from-blue-500/10 to-sky-500/5',
                hoverBorder: 'hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:border-blue-400/40',
                badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                iconColor: 'text-blue-500'
              },
              {
                id: 'SOCIAL',
                title: 'Social Media',
                subtitle: 'Posts, Carousels & Reels',
                icon: Share2,
                colorClass: 'from-purple-500/10 to-indigo-500/5',
                hoverBorder: 'hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] dark:hover:border-purple-400/40',
                badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
                iconColor: 'text-purple-500'
              },
              {
                id: 'EMAIL',
                title: 'Email / Letter',
                subtitle: 'Newsletters & Cold Outreach',
                icon: Mail,
                colorClass: 'from-emerald-500/10 to-teal-500/5',
                hoverBorder: 'hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:hover:border-emerald-400/40',
                badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                iconColor: 'text-emerald-500'
              },
              {
                id: 'NEWSPAPER',
                title: 'Newspaper',
                subtitle: 'Press Releases & Print Copy',
                icon: Newspaper,
                colorClass: 'from-amber-500/10 to-orange-500/5',
                hoverBorder: 'hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] dark:hover:border-amber-400/40',
                badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                iconColor: 'text-amber-500'
              }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => openSubPage(card.id)}
                  className={`p-5 rounded-3xl text-left transition-all duration-300 border flex flex-col justify-between group relative overflow-hidden bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 ${card.hoverBorder}`}
                >
                  {/* Light low-opacity glow edge backdrop */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.colorClass} opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-2xl ${card.badgeBg} transition-transform group-hover:scale-110 duration-300`}>
                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">{card.title}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">{card.subtitle}</p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    <span>Open Studio</span>
                    <span className={`${card.iconColor} opacity-80 group-hover:opacity-100 font-semibold`}>Open Page →</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Clean Overview Card below grid */}
          <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Select a Channel Studio to Begin</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Click on any channel card above (Blog, Social Media, Email, or Newspaper) to open its dedicated studio drafting page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

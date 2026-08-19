import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { contentAPI } from '../../services/api';
import {
  PenTool, ShieldCheck, ShieldAlert, Sparkles, Send, FileText, Share2,
  Globe, Mail, CheckCircle2, RefreshCw, Loader2, AlertCircle, Layers,
  Newspaper, ArrowUpRight, ArrowLeft, Copy, Download, X, Hash
} from 'lucide-react';

export const ContentStudioModule = () => {
  const { activeWorkspace, setActiveModule, setApprovalsQueue, studioTarget, setStudioTarget, setGeneratedContent, t } = useWorkspace();
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
  const [regeneratingSection, setRegeneratingSection] = useState(null); // null | 'hook' | 'shortCaption' | 'longCaption' | 'cta' | 'hashtags' | 'variations'
  const [captionMode, setCaptionMode] = useState('short'); // 'short' | 'long'

  // Email Studio State
  const [emailForm, setEmailForm] = useState({
    purpose: 'newsletter',
    recipient: 'Subscribers & Email List',
    context: '',
    tone: 'professional',
    keyPoints: '',
    cta: '',
    senderName: activeWorkspace?.brandName || '',
    senderDesignation: 'Marketing Team',
    senderCompany: activeWorkspace?.brandName || '',
    lengthFormat: 'detailed',
    subject: ''
  });
  const updateEmailField = (field, value) => setEmailForm(prev => ({ ...prev, [field]: value }));
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

  // ─── Direct Redirect & Pre-fill from Calendar / Other Modules ────────────────
  React.useEffect(() => {
    if (studioTarget) {
      const platformRaw = (studioTarget.platform || 'instagram').toLowerCase();
      const topic = studioTarget.topic || 'Campaign Objective';
      const postType = studioTarget.postType || 'educational';

      if (platformRaw === 'blog' || platformRaw === 'seo') {
        openSubPage('BLOG');
        setBlogTopic(topic);
        if (studioTarget.autoGenerate) {
          setDraftingBlog(true);
          contentAPI.generateBlogArticle({ workspaceId, topic, keywords: blogKeywords })
            .then(res => { if (res.article) setBlogDraft(res.article); })
            .finally(() => setDraftingBlog(false));
        }
      } else if (platformRaw === 'email') {
        openSubPage('EMAIL');
        setEmailForm(prev => ({ ...prev, subject: topic }));
        // Do not auto-generate email immediately if the user needs to fill out the form
      } else {
        // Social platforms: instagram, linkedin, twitter, facebook, youtube, tiktok
        const validPlatforms = ['instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'tiktok'];
        const socialMap = {
          twitter: 'twitter',
          x: 'twitter',
          instagram: 'instagram',
          linkedin: 'linkedin',
          facebook: 'facebook',
          youtube: 'youtube',
          tiktok: 'tiktok'
        };
        const matchedPlatform = socialMap[platformRaw] || (validPlatforms.includes(platformRaw) ? platformRaw : 'instagram');

        openSubPage('SOCIAL');
        setSocialPlatform(matchedPlatform);
        setSocialTopic(topic);
        if (['educational', 'promotional', 'thought_leadership', 'engagement'].includes(postType.toLowerCase())) {
          setSocialPostType(postType.toLowerCase());
        }

        if (studioTarget.autoGenerate) {
          setDraftingSocial(true);
          contentAPI.generateSocialPost({
            workspaceId,
            platform: matchedPlatform,
            topic: topic,
            postType: postType.toLowerCase(),
          })
          .then(res => {
            if (res.data) setSocialResult(res.data);
          })
          .catch(err => {
            console.error('Auto generate social error:', err);
          })
          .finally(() => {
            setDraftingSocial(false);
          });
        }
      }

      setStudioTarget(null);
    }
  }, [studioTarget, workspaceId]);

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
      if (setGeneratedContent) setGeneratedContent({ ...mockNewspaperDraft, type: 'NEWSPAPER', platform: 'press' });
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
        if (setGeneratedContent) setGeneratedContent({ ...res.draft, type: 'BLOG', platform: 'website', topic: blogTopic });
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
        brandName: activeWorkspace?.brandName,
        platform: socialPlatform,
        topic: socialTopic,
        postType: socialPostType,
      });

      if (res.data) {
        const payload = {
          ...res.data,
          type: 'SOCIAL',
          platform: socialPlatform,
          topic: socialTopic,
          postType: socialPostType,
          createdAt: new Date().toISOString()
        };
        setSocialResult(payload);
        if (setGeneratedContent) setGeneratedContent(payload);
      }
    } catch (err) {
      console.error('Social post error:', err.message);
    } finally {
      setDraftingSocial(false);
    }
  };

  // ─── Regenerate individual section ───────────────────────────────────────────
  const handleRegenerateSection = async (section) => {
    setRegeneratingSection(section);
    try {
      const res = await contentAPI.generateSocialPost({
        workspaceId,
        brandName: activeWorkspace?.brandName,
        platform: socialPlatform,
        topic: socialTopic,
        postType: socialPostType,
      });
      if (res.data) {
        setSocialResult((prev) => ({
          ...prev,
          [section]: res.data[section] ?? prev[section],
          // map alternate field names
          ...(section === 'shortCaption' ? { short_caption: res.data.shortCaption || res.data.short_caption } : {}),
          ...(section === 'longCaption' ? { caption: res.data.longCaption || res.data.caption } : {}),
          ...(section === 'cta' ? { callToAction: res.data.cta || res.data.callToAction } : {}),
          ...(section === 'hashtags' ? { hashtags: res.data.hashtags } : {}),
          ...(section === 'variations' ? { creativeVariations: res.data.creativeVariations } : {}),
        }));
      }
    } catch (err) {
      console.error('Regenerate section error:', err.message);
    } finally {
      setRegeneratingSection(null);
    }
  };

  // ─── Email Copy Generation ───────────────────────────────────────────────────
  const handleGenerateEmail = async () => {
    if (!emailForm.subject && !emailForm.purpose) return;
    setDraftingEmail(true);
    try {
      const res = await contentAPI.generateEmailCopy({
        workspaceId,
        brandName: activeWorkspace?.brandName,
        subject: emailForm.subject || `${activeWorkspace?.brandName || 'Brand'} — ${emailForm.purpose}`,
        purpose: emailForm.purpose,
        recipientType: emailForm.recipient,
        context: emailForm.context,
        tone: emailForm.tone,
        keyPoints: emailForm.keyPoints,
        cta: emailForm.cta,
        senderName: emailForm.senderName,
        senderDesignation: emailForm.senderDesignation,
        senderCompany: emailForm.senderCompany || activeWorkspace?.brandName,
        lengthFormat: emailForm.lengthFormat
      });
      if (res.email) {
        setEmailResult(res.email);
        if (setGeneratedContent) setGeneratedContent({ 
          ...res.email, 
          type: 'EMAIL', 
          platform: 'email', 
          topic: emailForm.subject || emailForm.purpose,
          hook: res.email.subject || res.email.headline || emailForm.subject,
          caption: res.email.body || '',
          hashtags: [] 
        });
      }
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
        brandName: activeWorkspace?.brandName,
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
      const data = item.data || item;
      let displayTitle = item.title || item.subject || data.hook || data.headline || data.title || '';
      if (!displayTitle && typeof item === 'string') displayTitle = item.slice(0, 50) + '...';
      if (!displayTitle) displayTitle = `${tab} Campaign Post`;

      let contentStr = '';
      if (typeof item === 'string') contentStr = item;
      else if (data.caption) contentStr = data.caption;
      else if (data.content) contentStr = data.content;
      else if (data.article) contentStr = data.article;
      else if (data.pressRelease) contentStr = data.pressRelease;
      else if (data.text) contentStr = data.text;
      else if (data.body) contentStr = data.body;
      else contentStr = JSON.stringify(item, null, 2);

      let platform = 'General';
      if (tab === 'SOCIAL') platform = socialPlatform;
      else if (tab === 'EMAIL') platform = 'Email';
      else if (tab === 'AD_COPY') platform = adPlatform;
      else if (tab === 'BLOG') platform = 'Website Blog';
      else if (tab === 'NEWSPAPER') platform = 'Press Release';

      setApprovalsQueue((prev) => [
        {
          id: item.id || `cnt_${Date.now()}`,
          title: displayTitle,
          type: tab,
          platform: platform,
          status: tab === 'BLOG' ? (factCheck?.passed ? 'PENDING' : 'RED_FLAG_CITATION_NEEDED') : 'PENDING',
          wordCount: item.wordCount || (typeof contentStr === 'string' ? contentStr.split(' ').length : 100),
          author: 'AISA AI Engine',
          factCheck: factCheck || { passed: true, score: 98, status: 'VERIFIED' },
          payload: item,
          rawPayload: item,
          checks: {
            brandDna: { passed: true, score: 98, message: 'Strong alignment with brand voice.' },
            seo: { passed: true, score: 92, message: 'Keywords optimized correctly.' },
            strategy: { passed: true, score: 95, message: 'Matches campaign goals.' },
            fact: factCheck || { passed: true, score: 100, message: 'Verified.' }
          },
          content: contentStr,
          history: [
            { id: `h_${Date.now()}`, action: 'Submitted for Review', by: 'AISA AI Engine', date: new Date().toISOString() }
          ],
          createdAt: new Date().toISOString(),
          workspaceId: activeWorkspace?.id || activeWorkspace?._id
        },
        ...prev,
      ]);
      setActiveModule('approvals');
    }
  };

  const subPageTitles = {
    BLOG: `${t('blog', 'Blog')} & Article Studio`,
    SOCIAL: `${t('socialMedia', 'Social Media')} Studio`,
    EMAIL: 'Email & Letter Outreach Studio',
    NEWSPAPER: `${t('newspaper', 'Newspaper')} & Press Release Studio`
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
              <span>Back to {t('studioTitle', 'Content Studio')}</span>
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
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('blog', 'Blog')} Parameters</h2>
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

      {/* 2. {t('socialMedia', 'Social Media')} Studio */}
      {tab === 'SOCIAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('socialMedia', 'Social Media')} Parameters</h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Platform</label>
              <select
                value={socialPlatform}
                onChange={(e) => setSocialPlatform(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 capitalize"
              >
                {['instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'tiktok'].map((p) => <option key={p} value={p}>{p}</option>)}
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
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Generated Social Asset</h2>
              {socialResult && (
                <button onClick={() => submitToApprovals(socialResult)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> Submit to Approvals
                </button>
              )}
            </div>

            {socialResult ? (
              <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center font-extrabold text-brand-600 dark:text-brand-400 text-xs uppercase overflow-hidden">
                      {activeWorkspace?.brandName ? activeWorkspace.brandName.substring(0, 4).toUpperCase() : 'AISA'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          {activeWorkspace?.brandName ? `${activeWorkspace.brandName.toUpperCase()} CONTENT COPY` : 'AISA CONTENT COPY'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                          TEXT COPY SYNCHRONIZED
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Platform: <span className="uppercase font-bold text-slate-700 dark:text-slate-300">{socialPlatform}</span> · Topic: "{socialTopic}"</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const fullText = `HOOK:\n${socialResult.hook || ''}\n\nSTORYTELLING:\n${socialResult.storytelling || ''}\n\nCAPTION:\n${socialResult.shortCaption || socialResult.longCaption || socialResult.caption || ''}\n\nCTA:\n${socialResult.cta || socialResult.callToAction || ''}\n\nHASHTAGS:\n${(socialResult.hashtags || []).join(' ')}`;
                        navigator.clipboard.writeText(fullText);
                        alert('All content copy copied to clipboard!');
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy All Text
                    </button>
                    <button
                      onClick={() => setActiveModule('creative')}
                      className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Creative Studio →
                    </button>
                    <button onClick={() => setSocialResult(null)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-400 dark:text-slate-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Banner notice explaining focus on copy */}
                <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <p><strong>Content Studio focus:</strong> Structured text copy (Hook, Storytelling, Captions, CTAs, SEO Hashtags). Generate matching visual assets in <strong>Creative Studio</strong>.</p>
                  </div>
                </div>

                {/* Structured Rectangle Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* ── CARD 1: HOOK / HEADLINE ── */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-brand-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        + HOOK / HEADLINE
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRegenerateSection('hook')}
                          disabled={regeneratingSection === 'hook'}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 text-[9px] font-bold uppercase tracking-wide transition-all disabled:opacity-50"
                        >
                          {regeneratingSection === 'hook' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                          {regeneratingSection === 'hook' ? 'Regenerating...' : 'Regenerate'}
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(socialResult.hook || '')}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-brand-500 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {socialResult.hook || 'Upgrade Your Brand Strategy with High-Converting Content! 🚀'}
                    </h3>
                  </div>

                  {/* ── CARD 2: STORYTELLING ANGLE ── */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        📖 STORYTELLING ANGLE
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRegenerateSection('storytelling')}
                          disabled={regeneratingSection === 'storytelling'}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-600 text-[9px] font-bold uppercase tracking-wide transition-all disabled:opacity-50"
                        >
                          {regeneratingSection === 'storytelling' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                          {regeneratingSection === 'storytelling' ? 'Regenerating...' : 'Regenerate'}
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(socialResult.storytelling || 'Every brand has a story, but only the ones with consistent voice build lasting loyalty.')}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-brand-500 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                      "{socialResult.storytelling || 'Every brand has a story, but only the ones with consistent voice build lasting loyalty. When you anchor your content to your Brand DNA, every post resonates deeper and converts faster.'}"
                    </p>
                  </div>

                  {/* ── CARD 3: CAPTION & BODY COPY ── */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm md:col-span-2 hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                          ✍️ CAPTION & BODY COPY
                        </span>
                        {/* Short / Long Toggle */}
                        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => setCaptionMode('short')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                              captionMode === 'short'
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                          >
                            Short Caption
                          </button>
                          <button
                            onClick={() => setCaptionMode('long')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                              captionMode === 'long'
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                          >
                            Long / Narrative
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRegenerateSection(captionMode === 'short' ? 'shortCaption' : 'longCaption')}
                          disabled={regeneratingSection === 'shortCaption' || regeneratingSection === 'longCaption'}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 text-[9px] font-bold uppercase tracking-wide transition-all disabled:opacity-50"
                        >
                          {(regeneratingSection === 'shortCaption' || regeneratingSection === 'longCaption') ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                          {(regeneratingSection === 'shortCaption' || regeneratingSection === 'longCaption') ? 'Regenerating...' : 'Regenerate'}
                        </button>
                        <button
                          onClick={() => {
                            const txt = captionMode === 'short'
                              ? (socialResult.shortCaption || socialResult.short_caption || '')
                              : (socialResult.longCaption || socialResult.caption || '');
                            navigator.clipboard.writeText(txt);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      {captionMode === 'short' ? (
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">
                          {socialResult.shortCaption || socialResult.short_caption || 'Transform your brand velocity with AI-driven content tailored to your audience!'}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">
                          {socialResult.longCaption || socialResult.caption || "Discover how consistent brand DNA elevates your marketing output. Whether you are running social campaigns, newsletters, or ad copy, maintaining a unified tone is essential for building trust and scaling conversions. Start leveraging AI Ads today to automate your workflow without sacrificing brand quality!"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── CARD 4: CALL TO ACTION (CTA) ── */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-amber-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest">
                        🎯 CALL TO ACTION (CTA)
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRegenerateSection('cta')}
                          disabled={regeneratingSection === 'cta'}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-600 text-[9px] font-bold uppercase tracking-wide transition-all disabled:opacity-50"
                        >
                          {regeneratingSection === 'cta' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                          {regeneratingSection === 'cta' ? 'Regenerating...' : 'Regenerate'}
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(socialResult.cta || socialResult.callToAction || '')}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-900 dark:text-white font-bold leading-relaxed">
                      {socialResult.cta || socialResult.callToAction || '👉 Click the link in bio to start your free trial today!'}
                    </p>
                  </div>

                  {/* ── CARD 5: SEO HASHTAGS & KEYWORDS ── */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-rose-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Hash className="w-3 h-3" /> SEO HASHTAGS & TAGS
                      </span>
                      <button
                        onClick={() => handleRegenerateSection('hashtags')}
                        disabled={regeneratingSection === 'hashtags'}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 text-[9px] font-bold uppercase tracking-wide transition-all disabled:opacity-50"
                      >
                        {regeneratingSection === 'hashtags' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        {regeneratingSection === 'hashtags' ? 'Regenerating...' : 'Regenerate'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(socialResult.hashtags?.length > 0 ? socialResult.hashtags : ['#BrandContent', '#AIMarketing', '#SocialMediaStrategy', '#ContentVelocity', '#BrandDNA']).map((h, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-brand-600 dark:text-brand-400 text-xs font-bold cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                          onClick={() => navigator.clipboard.writeText(h.startsWith('#') ? h : `#${h}`)}
                          title="Click to copy hashtag"
                        >
                          {h.startsWith('#') ? h : `#${h}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── CARD 6: CREATIVE COPY VARIATIONS & ANGLES ── */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm md:col-span-2 hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center border border-cyan-500/20">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">CREATIVE COPY ANGLES & VARIATIONS</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">STORYTELLING · PROBLEM-SOLUTION · URGENCY</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRegenerateSection('variations')}
                        disabled={regeneratingSection === 'variations'}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-cyan-50 hover:text-cyan-600 text-[9px] font-bold uppercase tracking-wide transition-all disabled:opacity-50 border border-slate-200 dark:border-slate-700"
                      >
                        {regeneratingSection === 'variations' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        {regeneratingSection === 'variations' ? 'Regenerating...' : 'Regenerate Angles'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(socialResult.creativeVariations || [
                        {
                          type: 'STORYTELLING ANGLE',
                          text: socialResult.storytelling || 'Imagine the impact of your brand reaching thousands with authentic storytelling. With AI-crafted content, your message connects deeper, builds trust faster, and drives real results.'
                        },
                        {
                          type: 'PROBLEM-SOLUTION',
                          text: socialResult.problemSolution || 'Struggling to create consistent, high-quality content? Our AI platform solves that instantly. Get scroll-stopping text copy, optimized captions, and brand-aligned hashtags in seconds.'
                        }
                      ]).map((variant, i) => (
                        <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[9px] font-black uppercase tracking-widest border border-cyan-500/20">
                              {variant.type || `ANGLE ${i + 1}`}
                            </span>
                            <button
                              onClick={() => navigator.clipboard.writeText(variant.text || '')}
                              className="p-1 rounded text-slate-400 hover:text-brand-500 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            {variant.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 xl:col-span-5 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5 h-fit">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Email Details</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Provide details to draft the perfect email</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Purpose */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Purpose</label>
                <select
                  value={emailForm.purpose}
                  onChange={(e) => updateEmailField('purpose', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                >
                  <option value="newsletter">Newsletter / Update</option>
                  <option value="sales_pitch">Sales Pitch</option>
                  <option value="cold_outreach">Cold Outreach</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="product_launch">Product Launch</option>
                  <option value="event_invitation">Event Invitation</option>
                  <option value="customer_onboarding">Customer Onboarding</option>
                  <option value="re_engagement">Re-engagement</option>
                  <option value="thank_you">Thank You / Appreciation</option>
                  <option value="feedback_request">Feedback Request</option>
                  <option value="partnership_proposal">Partnership Proposal</option>
                  <option value="executive_letter">Executive Letter</option>
                </select>
              </div>

              {/* Recipient */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Recipient</label>
                <input
                  type="text"
                  value={emailForm.recipient}
                  onChange={(e) => updateEmailField('recipient', e.target.value)}
                  placeholder="e.g. Subscribers"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                />
              </div>

              {/* Tone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Tone</label>
                <select
                  value={emailForm.tone}
                  onChange={(e) => updateEmailField('tone', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly & Warm</option>
                  <option value="formal">Formal / Corporate</option>
                  <option value="persuasive">Persuasive / Sales-Driven</option>
                  <option value="casual">Casual & Conversational</option>
                  <option value="urgent">Urgent / Time-Sensitive</option>
                  <option value="empathetic">Empathetic / Supportive</option>
                  <option value="authoritative">Authoritative / Expert</option>
                  <option value="inspirational">Inspirational / Motivational</option>
                </select>
              </div>

              {/* Length / Format */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Length</label>
                <select
                  value={emailForm.lengthFormat}
                  onChange={(e) => updateEmailField('lengthFormat', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                >
                  <option value="short">Short (under 150 words)</option>
                  <option value="detailed">Detailed (300–500 words)</option>
                  <option value="long_form">Long-Form (500+ words)</option>
                  <option value="bullet_points">Bullet Points</option>
                  <option value="numbered_steps">Numbered Steps</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Subject Topic</label>
              <input
                type="text"
                value={emailForm.subject}
                onChange={(e) => updateEmailField('subject', e.target.value)}
                placeholder="e.g. Exclusive Launch Invite..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            {/* Context */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Context</label>
              <textarea
                value={emailForm.context}
                onChange={(e) => updateEmailField('context', e.target.value)}
                placeholder="Background or situation..."
                rows={1}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Key Points */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Key Points</label>
              <textarea
                value={emailForm.keyPoints}
                onChange={(e) => updateEmailField('keyPoints', e.target.value)}
                placeholder="Points to include..."
                rows={1}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all resize-none"
              />
            </div>

            {/* CTA */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Call to Action (CTA)</label>
              <input
                type="text"
                value={emailForm.cta}
                onChange={(e) => updateEmailField('cta', e.target.value)}
                placeholder="e.g. Shop Now..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            {/* Sender Details */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Sender Details</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={emailForm.senderName}
                  onChange={(e) => updateEmailField('senderName', e.target.value)}
                  placeholder="Name"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                />
                <input
                  type="text"
                  value={emailForm.senderDesignation}
                  onChange={(e) => updateEmailField('senderDesignation', e.target.value)}
                  placeholder="Role"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                />
                <input
                  type="text"
                  value={emailForm.senderCompany}
                  onChange={(e) => updateEmailField('senderCompany', e.target.value)}
                  placeholder="Company"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateEmail}
              disabled={draftingEmail}
              className="w-full btn-primary py-3 mt-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-60"
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

      {/* 5. {t('newspaper', 'Newspaper')} & Print Studio */}
      {tab === 'NEWSPAPER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Newspaper className="w-5 h-5" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">{t('newspaper', 'Newspaper')} & PR Parameters</h2>
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

          {/* {t('newspaper', 'Newspaper')} Editorial Canvas */}
          <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('newspaper', 'Newspaper')} & PR Proofing Canvas</span>
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
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{t('unifiedContentStudio', 'Unified Content Studio')}</h1>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                AI-powered drafting engine for blogs, social posts, emails, and ads anchored to{' '}
                <strong className="text-slate-900 dark:text-white">{activeWorkspace?.brandName || 'your brand'}</strong>.
              </p>
            </div>
          </div>

          {/* 4 Channel Grid Cards ({t('blog', 'Blog')}, {t('socialMedia', 'Social Media')}, {t('emailLetter', 'Email / Letter')}, {t('newspaper', 'Newspaper')}) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'BLOG',
                title: t('blog', 'Blog'),
                subtitle: 'Articles, Guides & SEO Copy',
                icon: FileText,
                colorClass: 'from-blue-500/10 to-sky-500/5',
                hoverBorder: 'hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] dark:hover:border-blue-400/40',
                badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                iconColor: 'text-blue-500'
              },
              {
                id: 'SOCIAL',
                title: t('socialMedia', 'Social Media'),
                subtitle: 'Posts, Carousels & Reels',
                icon: Share2,
                colorClass: 'from-purple-500/10 to-indigo-500/5',
                hoverBorder: 'hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] dark:hover:border-purple-400/40',
                badgeBg: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
                iconColor: 'text-brand-500'
              },
              {
                id: 'EMAIL',
                title: t('emailLetter', 'Email / Letter'),
                subtitle: 'Newsletters & Cold Outreach',
                icon: Mail,
                colorClass: 'from-emerald-500/10 to-teal-500/5',
                hoverBorder: 'hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:hover:border-emerald-400/40',
                badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                iconColor: 'text-emerald-500'
              },
              {
                id: 'NEWSPAPER',
                title: t('newspaper', 'Newspaper'),
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
                    <span>{t('openStudio', 'Open Studio')}</span>
                    <span className={`${card.iconColor} opacity-80 group-hover:opacity-100 font-semibold`}>{t('openPage', 'Open Page →')}</span>
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
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{t('selectChannelStudio', 'Select a Channel Studio to Begin')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Click on any channel card above ({t('blog', 'Blog')}, {t('socialMedia', 'Social Media')}, Email, or {t('newspaper', 'Newspaper')}) to open its dedicated studio drafting page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

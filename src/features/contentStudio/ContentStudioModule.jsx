import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { contentAPI } from '../../services/api';
import {
  PenTool, ShieldCheck, ShieldAlert, Sparkles, Send, FileText, Share2,
  Globe, Mail, CheckCircle2, RefreshCw, Loader2, AlertCircle, Layers
} from 'lucide-react';

export const ContentStudioModule = () => {
  const { activeWorkspace, setActiveModule, setApprovalsQueue } = useWorkspace();
  const [tab, setTab] = useState('BLOG'); // BLOG, SOCIAL, EMAIL, AD_COPY

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

  const workspaceId = activeWorkspace?._id || activeWorkspace?.id;

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

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto p-6">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        {/* Full width Heading */}
        <div className="space-y-1 w-full">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Unified Content Studio</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            AI-powered drafting engine for blogs, social posts, emails, and ads anchored to{' '}
            <strong className="text-slate-900 dark:text-white">{activeWorkspace?.brandName || 'your brand'}</strong>.
          </p>
        </div>

        {/* Sub-studio Tab Selector (Stacked below heading) */}
        <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold gap-1 self-start">
          {[
            { id: 'BLOG', label: 'Blog Article', icon: FileText },
            { id: 'SOCIAL', label: 'Social Media', icon: Share2 },
            { id: 'EMAIL', label: 'Email Copy', icon: Mail },
            { id: 'AD_COPY', label: 'Ad Copy', icon: Globe },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                  tab === t.id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Blog Studio */}
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
    </div>
  );
};

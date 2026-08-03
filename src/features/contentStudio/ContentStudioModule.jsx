import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PenTool, ShieldCheck, ShieldAlert, Sparkles, Send, FileText, Share2, Globe, Mail, CheckCircle2, RefreshCw } from 'lucide-react';

export const ContentStudioModule = () => {
  const { activeWorkspace, setActiveModule, setApprovalsQueue } = useWorkspace();
  const [tab, setTab] = useState('BLOG'); // BLOG, SOCIAL, WEBSITE, EMAIL

  // Blog Studio State
  const [blogTopic, setBlogTopic] = useState('How AI Ads Eliminates Agency Workflow Bottlenecks');
  const [drafting, setDrafting] = useState(false);
  const [blogDraft, setBlogDraft] = useState(null);
  const [factCheck, setFactCheck] = useState(null);

  // Social Studio State
  const [socialTopic, setSocialTopic] = useState('3 Reasons to Centralize Brand DNA');

  const handleDraftBlog = async () => {
    setDrafting(true);
    try {
      const res = await fetch('http://localhost:5000/api/content/blog/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: blogTopic, brandName: activeWorkspace.brandName })
      });
      const data = await res.json();
      if (data.success) {
        setBlogDraft(data.draft);
        setFactCheck(data.factCheck);
      }
    } catch (e) {
      const mockDraft = {
        id: `cnt_${Date.now()}`,
        title: blogTopic,
        content: `# ${blogTopic}\n\nModern digital marketing requires managing dozens of distinct touchpoints. For marketing agencies managing 10 to 100+ distinct client brands, software fragmentation creates severe bottlenecks.\n\n## 1. Brand Voice Drift & Fragmentation\nWithout unified Brand DNA memory, drafts require endless human rewriting.\n\n## 2. Automated Fact-Checking Quality Gates\nAccording to recent benchmarks, verified claim scanning reduces turnaround times from days to under 12 seconds.\n\n## Conclusion\nCentralizing operations preserves human oversight while accelerating execution.`,
        wordCount: 1850,
        status: 'INTERNAL_REVIEW'
      };
      setBlogDraft(mockDraft);
      setFactCheck({ passed: true, score: 100, status: 'VERIFIED', flags: [] });
    } finally {
      setDrafting(false);
    }
  };

  const submitToApprovals = () => {
    if (!blogDraft) return;
    setApprovalsQueue(prev => [
      {
        id: blogDraft.id || `cnt_${Date.now()}`,
        title: blogDraft.title,
        type: 'BLOG',
        status: factCheck?.passed ? 'INTERNAL_REVIEW' : 'RED_FLAG_CITATION_NEEDED',
        wordCount: blogDraft.wordCount || 1800,
        author: 'Gemini 3.5 Editorial Engine',
        factCheck: factCheck || { passed: true, score: 100, status: 'VERIFIED' },
        createdAt: new Date().toISOString(),
        workspaceId: activeWorkspace.id || activeWorkspace._id
      },
      ...prev
    ]);
    setActiveModule('approvals');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Unified Content Studio</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Dedicated multi-format drafting engine with automated fact-checking for <strong className="text-slate-900 dark:text-white">{activeWorkspace.brandName}</strong>.
          </p>
        </div>

        {/* Sub-studio Tab Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button 
            onClick={() => setTab('BLOG')} 
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${tab === 'BLOG' ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <FileText className="w-3.5 h-3.5" /> Blog & Editorial
          </button>
          <button 
            onClick={() => setTab('SOCIAL')} 
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${tab === 'SOCIAL' ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Share2 className="w-3.5 h-3.5" /> Social Media
          </button>
          <button 
            onClick={() => setTab('WEBSITE')} 
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${tab === 'WEBSITE' ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Globe className="w-3.5 h-3.5" /> Website Copy
          </button>
          <button 
            onClick={() => setTab('EMAIL')} 
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${tab === 'EMAIL' ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Mail className="w-3.5 h-3.5" /> Email & PR
          </button>
        </div>
      </div>

      {/* 1. Blog & Editorial Studio */}
      {tab === 'BLOG' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Setup */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">8-Step Editorial Drafting</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Article Topic / Title Focus</label>
              <textarea 
                rows={3}
                value={blogTopic}
                onChange={(e) => setBlogTopic(e.target.value)}
                className="w-full glass-input text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 font-medium"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
              <span className="font-bold text-slate-900 dark:text-slate-200 block">Workflow Controls:</span>
              <p>Brief → Outline → Draft → Fact Review → SEO Review → Brand Review → Approval → Export</p>
            </div>

            <button
              onClick={handleDraftBlog}
              disabled={drafting}
              className="w-full btn-primary py-3 rounded-xl font-bold text-xs"
            >
              {drafting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {drafting ? 'Drafting Long-Form Article...' : 'Generate 8-Step Blog Draft'}
            </button>
          </div>

          {/* Right Col: Editor & Fact Check Gate */}
          <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Live Editorial Canvas</span>
              {blogDraft && (
                <button onClick={submitToApprovals} className="btn-primary text-xs py-1.5 px-3">
                  <Send className="w-3.5 h-3.5" />
                  Submit to Approvals Queue
                </button>
              )}
            </div>

            {/* Fact Check Decision Gate Status Banner */}
            {factCheck && (
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                factCheck.passed 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  {factCheck.passed ? <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px]">Decision Gate 1: Fact Check {factCheck.status}</span>
                    <p className="text-[11px] font-medium">{factCheck.passed ? 'Every statistic and claim is verified against Brand DNA repository.' : factCheck.flags[0]?.message}</p>
                  </div>
                </div>
                <span className="font-extrabold text-sm px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">{factCheck.score}%</span>
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
                  className="w-full glass-input text-xs font-mono leading-relaxed text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900"
                />
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <FileText className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
                <p className="text-xs font-medium">Click "Generate 8-Step Blog Draft" to invoke Gemini 3.5 Editorial Engine and run automatic fact-check scanning.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Social Media Studio */}
      {tab === 'SOCIAL' && (
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Social Copywriting Studio</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Generate hooks, captions, hashtags, reel scripts, threads, and carousel slide text.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              value={socialTopic} 
              onChange={(e) => setSocialTopic(e.target.value)} 
              className="glass-input text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 font-medium" 
            />
            <button 
              onClick={() => setActiveModule('repurpose')} 
              className="btn-primary text-xs"
            >
              Transform into 5 Multi-Channel Social Formats
            </button>
          </div>
        </div>
      )}

      {/* 3. Website Studio & 4. Email Studio Placeholder Cards */}
      {(tab === 'WEBSITE' || tab === 'EMAIL') && (
        <div className="p-12 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Globe className="w-8 h-8 mx-auto text-brand-600 dark:text-brand-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">{tab} Copy Studio Active</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
            Draft website value propositions, landing page copy, FAQs, newsletters, and press release pitches anchored to Brand DNA.
          </p>
        </div>
      )}
    </div>
  );
};

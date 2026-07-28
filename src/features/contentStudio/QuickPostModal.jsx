import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Zap, Sparkles, Copy, Check, Send } from 'lucide-react';

export const QuickPostModal = () => {
  const { isQuickPostOpen, setIsQuickPostOpen, activeWorkspace, setActiveModule } = useWorkspace();
  const [platform, setPlatform] = useState('LinkedIn');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Authoritative & Professional');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isQuickPostOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/content/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, brandName: activeWorkspace.brandName })
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.data);
      }
    } catch (e) {
      setOutput({
        platform,
        hook: `🚀 How ${activeWorkspace.brandName} scaled content operations without losing brand voice.`,
        caption: `Managing multi-channel marketing required 10 separate tools—until now.\n\nUnified Brand DNA + instant repurposing solves production bottlenecks.`,
        hashtags: [`#${activeWorkspace.brandName.replace(/\s+/g, '')}`, '#ContentStrategy', '#MarketingOps'],
        cta: 'Book your strategy demo at link in bio!'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    const text = `${output.hook}\n\n${output.caption}\n\n${output.hashtags.join(' ')}\n\n${output.cta}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={() => setIsQuickPostOpen(false)}
    >
      <div 
        className="w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-slate-900 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6B5AED] to-[#7B61FF] flex items-center justify-center text-white shadow-lg shadow-[#7B61FF]/30">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Quick Social Post Generator</h2>
              <p className="text-xs text-[#7B61FF] font-medium">Anchored to {activeWorkspace.brandName} Brand DNA</p>
            </div>
          </div>
          <button 
            onClick={() => setIsQuickPostOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Target Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['LinkedIn', 'X/Twitter', 'Instagram', 'Facebook'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    platform === p 
                      ? 'bg-[#7B61FF]/15 text-[#7B61FF] border-[#7B61FF] shadow-sm' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Post Topic / Focus</label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 Reasons to Automate SEO Topic Clustering in 2026"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF] rounded-xl px-4 py-2.5 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Voice Tone</label>
            <select 
              value={tone} 
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF] rounded-xl px-4 py-2.5 text-xs"
            >
              <option value="Authoritative & Professional">Authoritative & Professional</option>
              <option value="Conversational & Friendly">Conversational & Friendly</option>
              <option value="Thought Leadership">Thought Leadership / Founder Voice</option>
              <option value="Educational & Direct">Educational & Direct</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl font-bold text-xs"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Synthesizing Social Post...' : 'Generate Quick Post'}
          </button>
        </div>

        {/* Output Preview */}
        {output && (
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{output.platform} Draft Preview</span>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[#7B61FF] hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Post'}
              </button>
            </div>
            
            <div className="space-y-2 text-xs text-slate-900">
              <p className="font-extrabold text-[#7B61FF] text-sm">{output.hook}</p>
              <p className="whitespace-pre-wrap font-medium leading-relaxed">{output.caption}</p>
              <p className="text-[#7B61FF] font-semibold">{output.hashtags.join(' ')}</p>
              <p className="font-bold text-slate-700">{output.cta}</p>
            </div>

            <div className="pt-2 flex gap-2">
              <button 
                onClick={() => {
                  setIsQuickPostOpen(false);
                  setActiveModule('studio');
                }}
                className="w-full btn-secondary text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Open in Full Content Studio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

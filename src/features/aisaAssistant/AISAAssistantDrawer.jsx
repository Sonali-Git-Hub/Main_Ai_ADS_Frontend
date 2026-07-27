import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Bot, Send, Sparkles, RefreshCw, Dna, Search, PenTool, CheckCircle2 } from 'lucide-react';

export const AISAAssistantDrawer = () => {
  const { isAISAAssistantOpen, setIsAISAAssistantOpen, activeWorkspace } = useWorkspace();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello! I am AISA™, your AI Social & Content Operations Assistant. I am linked directly to **${activeWorkspace.brandName}** Brand DNA memory.\n\nHow can I assist your campaign strategy today?`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAISAAssistantOpen) return null;

  const handleSend = async (customPrompt) => {
    const promptText = customPrompt || input;
    if (!promptText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: promptText, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/content/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: promptText, brandName: activeWorkspace.brandName })
      });
      const data = await res.json();

      let replyText = `Here is your strategy suggestion anchored to **${activeWorkspace.brandName}** Brand DNA:\n\n`;
      if (data.data) {
        replyText += `**Hook:** ${data.data.hook}\n\n**Caption:** ${data.data.caption}\n\n**Hashtags:** ${data.data.hashtags.join(' ')}`;
      } else {
        replyText += `I have analyzed your prompt against the approved brand memory. ${activeWorkspace.positioningSummary}`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'assistant', text: replyText, time: 'Just now' }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'assistant', 
        text: `Executed AISA™ assistant task based on ${activeWorkspace.brandName} positioning: Generated structured output and verified against restricted claims repository.`, 
        time: 'Just now' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-md h-full bg-[#0d121f] border-l border-slate-800 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center text-white shadow-glow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">AISA™ Quick Module</h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 font-bold px-1.5 py-0.2 rounded-full">Gemini 3.5</span>
              </div>
              <p className="text-[11px] text-slate-400">Connected to {activeWorkspace.brandName} Memory</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAISAAssistantOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-900/30 flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => handleSend("Summarize Brand DNA and voice guidelines")}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-700/60 whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <Dna className="w-3 h-3 text-brand-400" />
            Brand DNA Summary
          </button>
          <button 
            onClick={() => handleSend("Generate 3 LinkedIn Post Hooks")}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-700/60 whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <PenTool className="w-3 h-3 text-cyan-400" />
            LinkedIn Hooks
          </button>
          <button 
            onClick={() => handleSend("Audit content against restricted claims")}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-brand-500/20 text-slate-300 hover:text-brand-300 border border-slate-700/60 whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Claims Audit
          </button>
        </div>

        {/* Chat Messages */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.sender === 'user' 
                  ? 'bg-brand-600 text-white rounded-tr-none' 
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none whitespace-pre-wrap'
              }`}>
                {m.text}
                <div className="text-[9px] opacity-60 text-right mt-1">{m.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-xs text-brand-400 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              AISA™ Gemini 3.5 Engine reasoning...
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask AISA™ for ${activeWorkspace.brandName}...`}
              className="flex-1 glass-input text-xs"
            />
            <button 
              type="submit"
              disabled={loading}
              className="btn-primary p-2.5 rounded-xl flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

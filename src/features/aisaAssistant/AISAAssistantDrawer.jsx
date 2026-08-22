import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Send, Dna, PenTool, CheckCircle2 } from 'lucide-react';
import { chatAPI } from '../../services/api';

const MODELS = [
  { id: 'gemini-3.5-pro', label: '⚡ AI Ads™ Pro Engine' },
  { id: 'gemini-3.5-flash', label: '🚀 AI Ads™ Fast Engine' },
  { id: 'gpt-4o', label: '🎯 AI Ads™ Ultra Creative' },
  { id: 'groq', label: '⚡ AI Ads™ Realtime Neural' },
];

export const AISAAssistantDrawer = () => {
  const { isAISAAssistantOpen, setIsAISAAssistantOpen, activeWorkspace } = useWorkspace();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello! I am AI Ads™ Assistant, your strategic advertising and content intelligence assistant. I am connected to ${activeWorkspace?.brandName || 'your brand'} brand memory.\n\nAsk me to generate high-converting ad copy, social posts, strategic briefs, or analyze your marketing campaigns.`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-pro');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isAISAAssistantOpen) return null;

  const renderFormattedText = (text) => {
    if (!text) return null;

    // Completely strip out all asterisks and angular symbols
    const cleanedText = text
      .replace(/\*/g, '')
      .replace(/<|>/g, '')
      .replace(/AISA\\u2122/g, 'AI Ads™')
      .replace(/\\u2122/g, '™')
      .replace(/\\u26a0\\ufe0f/g, '⚠️');

    const lines = cleanedText.split('\n');
    const elements = [];
    let listItems = [];

    const flushList = (keyPrefix) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`${keyPrefix}-ul`} className="my-2 space-y-1.5 pl-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div>{item}</div>
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList(index);
        return;
      }

      if (trimmed === '---') {
        flushList(index);
        elements.push(
          <hr key={index} className="my-3 border-slate-200 dark:border-slate-800" />
        );
        return;
      }

      if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
        flushList(index);
        const title = trimmed.replace(/^#+\s*/, '');
        elements.push(
          <h3 key={index} className="text-sm font-black text-slate-900 dark:text-white mt-3 mb-1.5 tracking-tight">
            {title}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
        flushList(index);
        const title = trimmed.replace(/^#+\s*/, '');
        elements.push(
          <h4 key={index} className="text-xs font-extrabold text-brand-600 dark:text-brand-400 mt-2.5 mb-1 tracking-wide uppercase">
            {title}
          </h4>
        );
        return;
      }

      if (/^[\-\•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
        const itemContent = trimmed.replace(/^([\-\•]|\d+\.)\s+/, '');
        listItems.push(itemContent);
        return;
      }

      flushList(index);
      elements.push(
        <p key={index} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
          {trimmed}
        </p>
      );
    });

    flushList('final');

    return <div className="space-y-1">{elements}</div>;
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async (customPrompt) => {
    const promptText = customPrompt || input;
    if (!promptText.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: promptText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);

    const history = messages.slice(-10).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      content: m.text,
    }));
    history.push({ role: 'user', content: promptText });

    try {
      const result = await chatAPI.sendMessage({
        message: promptText,
        sessionId,
        model: selectedModel,
        history,
        workspaceId: activeWorkspace?._id || activeWorkspace?.id,
        brandContext: activeWorkspace?.brandVoiceTone || activeWorkspace?.positioningSummary || '',
        systemInstruction: `You are AI Ads™ Assistant, the official AI copilot embedded inside the AI Ads™ Platform for ${activeWorkspace?.brandName || 'the brand'}.

MANDATORY PLATFORM DIRECTIVE:
Whenever users ask how to generate content, create Instagram/social posts, build websites, create ads, or run marketing tasks, ALWAYS direct them to the corresponding built-in AI Ads™ platform modules FIRST (e.g. Content Studio for Instagram/social posts, Creative Studio for AI ad images, AI Website Builder for websites, Brand DNA for brand identity, Strategy for campaign playbooks, or click + Quick Post in the top bar). DO NOT recommend third-party external tools like Canva, Midjourney, or CapCut.

MANDATORY CONCISENESS RULE:
Keep your response short, concise, and to the point. DO NOT give long detailed responses unless the user explicitly asks for 'in detail' or 'long form'. Respond in plain text with short headings and concise bullet points. DO NOT use any asterisks (*), hashtags (#), or angular brackets (< >) in your text.`,
      });

      if (result.sessionId && !sessionId) setSessionId(result.sessionId);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: result.response || 'I processed your request.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: `⚠️ Could not connect to backend service. Please check that backend server is active.\n\nError: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-full sm:max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 text-slate-900 dark:text-white">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 p-1 flex items-center justify-center shadow-sm shrink-0">
              <img src="/logo.png" alt="AI Ads™ Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">AI Ads™ Assistant</h3>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="text-[10px] bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded-full border border-brand-500/20 outline-none cursor-pointer"
                >
                  {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Connected to {activeWorkspace?.brandName || 'Brand'} Memory</p>
            </div>
          </div>
          <button
            onClick={() => setIsAISAAssistantOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => handleSend("Summarize Brand DNA and voice guidelines")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-brand-500/10 text-slate-700 dark:text-slate-200 hover:text-brand-500 border border-slate-200 dark:border-slate-700 shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <Dna className="w-3 h-3 text-brand-500" />
            Brand DNA Summary
          </button>
          <button 
            onClick={() => handleSend("Generate 3 LinkedIn Post Hooks")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-brand-500/10 text-slate-700 dark:text-slate-200 hover:text-brand-500 border border-slate-200 dark:border-slate-700 shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <PenTool className="w-3 h-3 text-brand-500" />
            LinkedIn Hooks
          </button>
          <button 
            onClick={() => handleSend("Audit content against restricted claims")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-brand-500/10 text-slate-700 dark:text-slate-200 hover:text-brand-500 border border-slate-200 dark:border-slate-700 shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Claims Audit
          </button>
        </div>

        {/* Chat Messages */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-950/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 p-1 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <img src="/logo.png" alt="AI Ads™ Logo" className="w-full h-full object-contain rounded-lg" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed font-medium ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-tr-none shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-tl-none shadow-sm'
              }`}>
                {m.sender === 'assistant' ? renderFormattedText(m.text) : m.text}
                <div className="text-[9px] opacity-60 text-right mt-1.5">{m.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5 items-center text-xs text-brand-600 dark:text-brand-400 font-bold p-2.5 bg-brand-500/10 rounded-xl border border-brand-500/20 max-w-[85%] animate-in fade-in">
              <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
                <img src="/logo.png" alt="AI Ads™ Logo" className="w-5 h-5 object-contain rounded-md" />
              </div>
              <span>AI Ads™ Intelligence Engine analyzing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box (Auto-Expanding Multi-Row Textarea) */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Ask AI Ads™ for ${activeWorkspace?.brandName || 'Brand'}...`}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-3.5 py-2.5 text-xs resize-none max-h-32 min-h-[40px] leading-relaxed scrollbar-thin font-medium"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary px-4 py-2.5 h-[40px] rounded-xl flex-shrink-0 flex items-center justify-center gap-1.5 font-extrabold text-xs tracking-wide shadow-md transition-all active:scale-95 disabled:opacity-50"
              title="Send Message (Enter)"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enter</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

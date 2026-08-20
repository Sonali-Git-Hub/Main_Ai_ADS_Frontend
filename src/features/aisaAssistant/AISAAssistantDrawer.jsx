import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Bot, Send, Sparkles, RefreshCw, Dna, Search, PenTool, CheckCircle2, ChevronDown } from 'lucide-react';
import { chatAPI } from '../../services/api';

const MODELS = [
  { id: 'gemini-3.5-flash', label: '✨ Gemini 3.5 Flash' },
  { id: 'gemini-3.5-pro', label: '⚡ Gemini 3.5 Pro' },
  { id: 'gpt-4o', label: '🤖 OpenAI GPT-4o' },
  { id: 'groq', label: '⚡ Groq Llama 3' },
];

export const AISAAssistantDrawer = () => {
  const { isAISAAssistantOpen, setIsAISAAssistantOpen, activeWorkspace } = useWorkspace();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello! I am AISA\u2122, your AI Advertising & Content Strategy Assistant. I'm connected to **${activeWorkspace?.brandName || 'your brand'}** brand memory.\n\nAsk me to generate social posts, write ad copy, plan campaigns, or analyze your brand strategy.`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-pro');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isAISAAssistantOpen) return null;

  const handleSend = async (customPrompt) => {
    const promptText = customPrompt || input;
    if (!promptText.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: promptText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Build conversation history for AI
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
        systemInstruction: `You are AISA\u2122, an AI Advertising & Brand Strategy expert assistant. Help with campaigns, content strategy, brand analysis, and ad copy for ${activeWorkspace?.brandName || 'the brand'}.`,
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
          text: `\u26a0\ufe0f Could not connect to AI service. Please check that the backend is running on port 5000.\n\nError: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-full sm:max-w-md h-full bg-white border-l border-slate-200 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 text-slate-900">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">AISA\u2122 Assistant</h3>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="text-[10px] bg-brand-500/15 text-brand-500 font-bold px-1.5 py-0.5 rounded-full border-0 outline-none cursor-pointer"
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
        <div className="px-4 py-2 border-b border-slate-200 bg-slate-50/50 flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => handleSend("Summarize Brand DNA and voice guidelines")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white hover:bg-brand-500/10 text-slate-700 hover:text-brand-500 border border-slate-200 shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <Dna className="w-3 h-3 text-brand-500" />
            Brand DNA Summary
          </button>
          <button 
            onClick={() => handleSend("Generate 3 LinkedIn Post Hooks")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white hover:bg-brand-500/10 text-slate-700 hover:text-brand-500 border border-slate-200 shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <PenTool className="w-3 h-3 text-brand-500" />
            LinkedIn Hooks
          </button>
          <button 
            onClick={() => handleSend("Audit content against restricted claims")}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white hover:bg-brand-500/10 text-slate-700 hover:text-brand-500 border border-slate-200 shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
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
                <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed font-medium ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-tr-none shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none whitespace-pre-wrap shadow-sm'
              }`}>
                {m.text}
                <div className="text-[9px] opacity-60 text-right mt-1">{m.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-xs text-brand-500 font-bold">
              <div className="flex gap-1">
                {[0,1,2].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
              </div>
              AISA\u2122 {MODELS.find(m => m.id === selectedModel)?.label} thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask AISA™ for ${activeWorkspace.brandName}...`}
              className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2 text-xs"
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

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ConversationalChatDrawer = ({ onSendChatEdit, isUpdating, messages = [] }) => {
  const [chatInput, setChatInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput || !chatInput.trim() || isUpdating) return;
    const msg = chatInput.trim();
    setChatInput('');
    onSendChatEdit(msg);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800 rounded-3xl p-4 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">AISA Conversational Assistant</h4>
            <p className="text-[10px] text-slate-400">Ask AISA to modify your live application.</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Edit Active
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs scrollbar-thin">
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1">
          <div className="flex items-center gap-1.5 text-brand-400 font-extrabold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> AISA AI
          </div>
          <p className="text-slate-300">
            Your website is live! What changes would you like to make? Try asking:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {[
              'Make the navbar smaller',
              'Change colors to black and ivory',
              'Make hero minimal',
              'Add a contact form'
            ].map((suggestion, sIdx) => (
              <button
                key={sIdx}
                onClick={() => !isUpdating && onSendChatEdit(suggestion)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-700/80 hover:bg-brand-600 text-slate-200 hover:text-white font-bold transition-all border border-slate-600/50"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border space-y-1 ${
              m.sender === 'user'
                ? 'bg-brand-600/20 border-brand-500/40 text-brand-100 ml-6'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 mr-6'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400">
              <span className="flex items-center gap-1">
                {m.sender === 'user' ? <User className="w-3 h-3 text-brand-400" /> : <Bot className="w-3 h-3 text-emerald-400" />}
                {m.sender === 'user' ? 'You' : 'AISA AI'}
              </span>
              <span>{m.timestamp || ''}</span>
            </div>
            <p className="text-xs">{m.text}</p>
            {m.modifiedFiles && m.modifiedFiles.length > 0 && (
              <div className="pt-1 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Modified: {m.modifiedFiles.join(', ')}
              </div>
            )}
          </div>
        ))}

        {isUpdating && (
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-2 animate-pulse">
            <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
            <span className="text-xs font-extrabold">Updating source files & rebuilding application...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a request (e.g. Make navbar smaller...)"
          disabled={isUpdating}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-medium"
        />
        <button
          type="submit"
          disabled={!chatInput.trim() || isUpdating}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-30 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md"
        >
          <Send className="w-3.5 h-3.5" /> Send
        </button>
      </form>
    </div>
  );
};

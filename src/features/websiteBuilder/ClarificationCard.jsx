import React, { useState } from 'react';
import { HelpCircle, ArrowRight, SkipForward, Check } from 'lucide-react';

export const ClarificationCard = ({ questions = [], onComplete, onSkip }) => {
  const [answers, setAnswers] = useState({});

  const handleSelectOption = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleFinish = () => {
    onComplete(answers);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-3xl bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 shadow-2xl space-y-6 text-white animate-in fade-in zoom-in-95">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Got it. Before I start building...</h3>
            <p className="text-xs text-slate-400 font-medium">AI Ads™ has a few quick questions to personalize your design.</p>
          </div>
        </div>
        <button
          onClick={onSkip}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs flex items-center gap-1.5 transition-all"
        >
          <SkipForward className="w-3.5 h-3.5" /> Skip Questions
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id || idx} className="space-y-3">
            <label className="text-xs font-extrabold text-slate-200 block">
              {idx + 1}. {q.question}
            </label>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt, oIdx) => {
                const isSelected = answers[q.id] === opt;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(q.id, opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-2 ${
                      isSelected
                        ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-500/20'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">You can skip at any time and let AI choose defaults.</span>
        <div className="flex items-center gap-3">
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
          >
            Skip & Build
          </button>
          <button
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
          >
            Start Building <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

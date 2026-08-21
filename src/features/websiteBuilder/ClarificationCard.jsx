import React, { useState } from 'react';
import { HelpCircle, ArrowRight, SkipForward, Check } from 'lucide-react';

export const ClarificationCard = ({ questions = [], onComplete, onSkip }) => {
  const [answers, setAnswers] = useState({});

  const handleSelectOption = (qKey, option) => {
    setAnswers(prev => ({ ...prev, [qKey]: option }));
  };

  const handleFinish = () => {
    onComplete(answers);
  };

  const answeredCount = Object.keys(answers).filter(k => Boolean(answers[k])).length;

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-3xl bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800 shadow-2xl space-y-6 text-white animate-in fade-in zoom-in-95 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center shadow-inner">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Got it. Before I start building...</h3>
            <p className="text-xs text-slate-400 font-medium">AI Ads™ has a few quick questions to personalize your design.</p>
          </div>
        </div>
        <button
          onClick={onSkip}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-slate-700"
        >
          <SkipForward className="w-3.5 h-3.5" /> Skip Questions
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const qKey = q.id || q.question || `q_${idx}`;
          const currentAnswer = answers[qKey];

          return (
            <div key={qKey} className="space-y-3">
              <label className="text-xs font-extrabold text-slate-200 block">
                {idx + 1}. {q.question}
              </label>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = currentAnswer === opt;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(qKey, opt)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-2 active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 border-brand-400 text-white shadow-lg shadow-brand-500/30 scale-[1.02]'
                          : 'bg-slate-800/90 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[11px] text-slate-400 font-medium">You can skip at any time and let AI choose defaults.</span>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            Skip &amp; Build
          </button>
          <button
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>Start Building {answeredCount > 0 ? `(${answeredCount}/${questions.length})` : ''}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Settings, CreditCard, Key, Sparkles, Check, ShieldCheck, Globe, Zap } from 'lucide-react';

export const SettingsBillingModule = () => {
  const { credits, setIsCreditModalOpen } = useWorkspace();
  const [activeTier, setActiveTier] = useState(credits.tier || 'Agency');
  const [apiKey, setApiKey] = useState('aisa_live_pk_9948271038571029481');
  const [copiedKey, setCopiedKey] = useState(false);

  const tiers = [
    { name: 'Base', price: '$99/mo', desc: 'Text intelligence, calendar & captions, basic SEO, limited blogs. No visual credits.', credits: '0 Visual Credits' },
    { name: 'Professional', price: '$299/mo', desc: 'More brands, SEO clusters, approval workflows, repurposing engine.', credits: '50 Credits/mo' },
    { name: 'Agency', price: '$799/mo', desc: 'Multi-client workspace, team roles, client portal, high text usage.', credits: '250 Credits/mo', current: true },
    { name: 'Enterprise', price: 'Custom', desc: 'Multiple departments, advanced permissions, governance API & custom SLAs.', credits: 'Custom Credits' }
  ];

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Platform Settings, Monetization & API Keys</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Subscription tier controls, Razorpay payment verification, and AISA Connect™ API integrations.
          </p>
        </div>

        <button onClick={() => setIsCreditModalOpen(true)} className="btn-primary text-xs">
          <Sparkles className="w-4 h-4" /> Top Up Visual Credits
        </button>
      </div>

      {/* Subscription Tiers Grid */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Subscription Tiers & Monetization Logic
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map(t => (
            <div 
              key={t.name}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 relative ${
                activeTier === t.name 
                  ? 'bg-brand-500/10 dark:bg-brand-500/20 border-brand-500 shadow-glow' 
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              {activeTier === t.name && (
                <span className="absolute -top-2.5 right-3 bg-brand-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active Tier
                </span>
              )}
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{t.name} Plan</h3>
                <div className="text-xl font-extrabold text-brand-600 dark:text-brand-400 my-1">{t.price}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{t.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">{t.credits}</span>
                <button 
                  onClick={() => setActiveTier(t.name)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTier === t.name 
                      ? 'bg-brand-500 text-white shadow-glow' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {activeTier === t.name ? 'Active Plan' : 'Switch Tier'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys & Integrations Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          AISA Connect™ API Keys & Webhooks
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Production Secret Key</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={apiKey} 
                className="flex-1 glass-input text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900" 
              />
              <button onClick={copyKey} className="btn-secondary text-xs px-4">
                {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : 'Copy Key'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">WordPress / Webflow Webhook Integration</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Directly push approved articles to CMS endpoints.</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

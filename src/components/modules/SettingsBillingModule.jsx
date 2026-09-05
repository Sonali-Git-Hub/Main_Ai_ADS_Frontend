import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { plansAPI } from '../../services/api';
import { Settings, CreditCard, Key, Sparkles, Check, ShieldCheck, Globe, Zap, Loader2, DollarSign, Layers } from 'lucide-react';

export const SettingsBillingModule = () => {
  const { activeWorkspace, updateWorkspace, credits, setIsCreditModalOpen } = useWorkspace();
  const [plans, setPlans] = useState([]);
  const [topups, setTopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'INR'
  const [activePlanId, setActivePlanId] = useState(() => {
    const current = (activeWorkspace?.subscriptionTier || credits?.tier || '').toLowerCase();
    if (current.includes('starter') || current.includes('base')) return 'starter';
    if (current.includes('pro') || current.includes('growth')) return 'pro';
    if (current.includes('enterprise')) return 'enterprise';
    return 'agency';
  });

  const [apiKey, setApiKey] = useState('aisa_live_pk_9948271038571029481');
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchDatabasePlans = async () => {
      setLoading(true);
      try {
        const [plansRes, topupsRes] = await Promise.all([
          plansAPI.getPlans(),
          plansAPI.getTopups()
        ]);
        if (mounted) {
          if (plansRes && plansRes.plans) setPlans(plansRes.plans);
          if (topupsRes && topupsRes.topups) setTopups(topupsRes.topups);
        }
      } catch (err) {
        console.error('Failed to fetch pricing plans from database:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDatabasePlans();
    return () => { mounted = false; };
  }, []);

  const handleSubscribePlan = async (plan) => {
    setSubscribingId(plan.planId);
    try {
      const wsId = activeWorkspace?.id || activeWorkspace?._id || 'default_ws';
      const res = await plansAPI.subscribe({ workspaceId: wsId, planId: plan.planId });
      if (res && res.success) {
        setActivePlanId(plan.planId);
        if (updateWorkspace) {
          updateWorkspace(wsId, {
            subscriptionTier: plan.name,
            visualCredits: plan.imageCredits
          });
        }
      }
    } catch (err) {
      console.error('Failed to update plan in database:', err);
    } finally {
      setSubscribingId(null);
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Platform Settings & Pricing Plans</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Database-driven subscription plans, credit allocations, and API keys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                currency === 'INR'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              INR (₹)
            </button>
          </div>

          <button onClick={() => setIsCreditModalOpen(true)} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold">
            <Sparkles className="w-4 h-4" /> Top Up Credits
          </button>
        </div>
      </div>

      {/* Subscription Tiers Grid (Database-Driven) */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-500" />
              Database Subscription Plans
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Live subscription plans fetched directly from MongoDB database.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Database Connected</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Loading subscription plans from database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map(plan => {
              const isActive = activePlanId === plan.planId;
              const isSubscribing = subscribingId === plan.planId;
              const displayPrice = currency === 'USD' ? `$${plan.priceUSD}` : `₹${plan.priceINR.toLocaleString('en-IN')}`;

              return (
                <div
                  key={plan.planId || plan._id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 relative transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/10 dark:bg-brand-500/15 border-brand-500 ring-2 ring-brand-500/20 shadow-lg'
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <span className={`absolute -top-2.5 right-3 font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border ${
                      plan.isPopular || plan.badge === 'Most Popular'
                        ? 'bg-amber-500 text-white border-amber-400'
                        : isActive
                        ? 'bg-brand-600 text-white border-brand-500'
                        : 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}>
                      {isActive ? 'Active Plan' : plan.badge}
                    </span>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 my-1.5">
                        <span className="text-2xl font-black text-brand-600 dark:text-brand-400">{displayPrice}</span>
                        <span className="text-xs text-slate-400 font-medium">/{plan.billingCycle || 'month'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{plan.description}</p>
                    </div>

                    {/* Key Metrics Badges */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image Credits:</span>
                        <span className="font-extrabold text-brand-600 dark:text-brand-400">{plan.imageCredits} / mo</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Text Copy:</span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-300">{plan.textGenerations}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    {plan.features && plan.features.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Included Features:</span>
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-tight text-[11px]">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      disabled={isActive || isSubscribing}
                      onClick={() => handleSubscribePlan(plan)}
                      className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-sm cursor-default'
                          : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-brand-600 dark:hover:bg-brand-600'
                      }`}
                    >
                      {isSubscribing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active Plan</span>
                        </>
                      ) : (
                        <span>Subscribe Plan</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* API Keys & Webhooks Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-brand-500" />
          AISA Connect™ Production API Keys
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Production Secret Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
              />
              <button onClick={copyKey} className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shrink-0">
                {copiedKey ? <Check className="w-4 h-4 text-white" /> : 'Copy Key'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-brand-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">CMS Webhook Integration</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Directly publish approved articles and social posts to external endpoints.</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

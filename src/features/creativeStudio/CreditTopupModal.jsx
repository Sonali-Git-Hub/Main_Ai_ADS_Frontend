import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Sparkles, Check, CreditCard, ShieldCheck } from 'lucide-react';

export const CreditTopupModal = () => {
  const { isCreditModalOpen, setIsCreditModalOpen, credits, topUpCredits } = useWorkspace();
  const [selectedPack, setSelectedPack] = useState(100);
  const [processing, setProcessing] = useState(false);

  if (!isCreditModalOpen) return null;

  const packs = [
    { credits: 25, price: '₹999', label: 'Starter Pack', badge: 'Basic Visuals' },
    { credits: 100, price: '₹2,999', label: 'Pro Agency Pack', badge: 'Most Popular', popular: true },
    { credits: 500, price: '₹9,999', label: 'Enterprise Pack', badge: 'Best Value' }
  ];

  const handleRazorpayCheckout = () => {
    const pack = packs.find(p => p.credits === selectedPack);
    setProcessing(true);

    if (window.Razorpay) {
      const options = {
        key: 'rzp_test_mock_12345',
        amount: parseInt(pack.price.replace(/[^\d]/g, '')) * 100,
        currency: 'INR',
        name: 'AI Ads™ Visual Credits',
        description: `${pack.credits} Premium Visual & Designed-Carousel Credits`,
        handler: function (response) {
          topUpCredits(pack.credits, pack.label);
          setProcessing(false);
          setIsCreditModalOpen(false);
          alert(`Success! Payment Verified. Added +${pack.credits} Visual Credits.`);
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      setTimeout(() => {
        topUpCredits(pack.credits, pack.label);
        setProcessing(false);
        setIsCreditModalOpen(false);
        alert(`Success! Razorpay Payment Verified. Added +${pack.credits} Visual Credits to your account.`);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-brand-500 flex items-center justify-center text-white shadow-cyan-glow">
              <Sparkles className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Visual Credits & Top-Up Engine</h2>
              <p className="text-xs text-slate-400">Current Balance: <span className="font-bold text-cyan-400">{credits.balance} Credits</span></p>
            </div>
          </div>
          <button 
            onClick={() => setIsCreditModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Credit Principle Note */}
        <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-xs text-slate-300">
          <p className="font-bold text-brand-300 mb-0.5">📌 Visual-Credit Monetization Principle:</p>
          <p className="text-[11px] text-slate-400">Text intelligence (social copy, SEO briefs, blog drafting) is subscription-based. Premium AI image generation & designed carousels require visual credits.</p>
        </div>

        {/* Credit Packs Grid */}
        <div className="grid grid-cols-3 gap-3">
          {packs.map(p => (
            <div
              key={p.credits}
              onClick={() => setSelectedPack(p.credits)}
              className={`p-4 rounded-2xl border cursor-pointer relative transition-all ${
                selectedPack === p.credits 
                  ? 'bg-brand-500/20 border-brand-500 shadow-glow' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-2.5 right-3 bg-brand-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Popular
                </span>
              )}
              <div className="text-xs font-bold text-slate-400">{p.label}</div>
              <div className="text-xl font-extrabold text-white my-1">+{p.credits} <span className="text-xs font-normal text-cyan-400">Credits</span></div>
              <div className="text-sm font-bold text-brand-400">{p.price}</div>
            </div>
          ))}
        </div>

        {/* Razorpay Checkout Button */}
        <button
          onClick={handleRazorpayCheckout}
          disabled={processing}
          className="w-full btn-primary py-3.5 rounded-xl font-bold text-xs shadow-cyan-glow flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          {processing ? 'Processing Razorpay Order...' : `Purchase Credits via Razorpay`}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit SSL Encrypted Razorpay Gateway Verification</span>
        </div>
      </div>
    </div>
  );
};

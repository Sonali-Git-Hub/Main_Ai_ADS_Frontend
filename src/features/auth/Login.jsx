import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        const cleanEmail = (data.user?.email || email).toLowerCase().trim();
        localStorage.setItem('aisa_token', data.token);
        localStorage.setItem('aisa_user_email', cleanEmail);
        
        setTimeout(() => {
          onLoginSuccess(data.user || { email: cleanEmail, role: 'AgencyAdmin' });
        }, 800);
      } else {
        setError(data.error || 'Login failed.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Please ensure backend is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#05050f]">

      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] rounded-full bg-gradient-to-tr from-brand-600/30 to-transparent blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-cyan-600/20 to-transparent blur-[140px] animate-pulse" />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)'
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">

        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 shadow-lg shadow-brand-500/30 mb-5">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI Ads<span className="text-brand-400">™</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="bg-[#0b0c18]/80 backdrop-blur-2xl border border-slate-800/60 rounded-2xl p-8 shadow-2xl shadow-black/60">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3 bg-red-950/30 border border-red-800/40 text-red-300 rounded-xl text-xs flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@company.com"
                  className="w-full bg-slate-900/40 border border-slate-800/70 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/40 border border-slate-800/70 rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                success
                  ? 'bg-emerald-500 text-white'
                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25 active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Welcome!</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Badge */}
          <div className="mt-6 pt-5 border-t border-slate-800/60 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">Admin Access Only</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-600 mt-6">© 2026 AI Ads™ (AISA) · All rights reserved</p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Check, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Login = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleTabChange = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess(false);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Input Validation
    if (!email || !email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      if (!confirmPassword) {
        setError('Please confirm your password.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please check and try again.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = mode === 'register' 
        ? 'http://localhost:5000/api/auth/register' 
        : 'http://localhost:5000/api/auth/login';

      const bodyPayload = mode === 'register'
        ? { email, password, confirmPassword }
        : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
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
        setError(data.error || (mode === 'register' ? 'Registration failed.' : 'Login failed.'));
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to backend server. Please ensure port 5000 is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 py-12">

      {/* Soft Ambient Light Glow Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-gradient-to-tr from-brand-500/15 via-indigo-400/15 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-purple-400/15 via-pink-400/15 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[15%] w-[35%] h-[35%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />

      {/* Subtle Pattern Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-4">

        {/* Brand Header */}
        <div className="text-center mb-7 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl p-1 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/60 mb-3.5 overflow-hidden flex items-center justify-center">
            <img src="/logo.png" alt="AI Ads™ Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            AI Ads<span className="text-brand-600">™</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">
            {mode === 'login' ? 'Sign in to your workspace' : 'Create your enterprise workspace account'}
          </p>
        </div>

        {/* Premium Light Card */}
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-slate-200/60">

          {/* Mode Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 mb-6">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`relative flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all rounded-xl ${
                mode === 'login' ? 'text-brand-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mode === 'login' && (
                <motion.div
                  layoutId="activeAuthTabLight"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/60"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`relative flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all rounded-xl ${
                mode === 'register' ? 'text-brand-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mode === 'register' && (
                <motion.div
                  layoutId="activeAuthTabLight"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/60"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                Create Account
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error Banner */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@company.com"
                  className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl py-3.5 pl-10 pr-4 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {/* PASSWORD / CREATE PASSWORD FIELD */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                  {mode === 'register' ? 'Create Password' : 'Password'}
                </label>
                {mode === 'login' && (
                  <a href="#" className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">Forgot?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl py-3.5 pl-10 pr-10 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD FIELD (ONLY IN CREATE ACCOUNT MODE) */}
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-1"
              >
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl py-3.5 pl-10 pr-10 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* SUBMIT CTA BUTTON */}
            <button
              type="submit"
              disabled={isLoading || success}
              className={`w-full py-3.5 mt-3 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                success
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/25 active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'register' ? 'Creating Account...' : 'Signing in...'}</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{mode === 'register' ? 'Account Created!' : 'Welcome!'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'register' ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500 font-medium">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="font-bold text-brand-600 hover:text-brand-700 hover:underline transition-all"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="font-bold text-brand-600 hover:text-brand-700 hover:underline transition-all"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-emerald-800 font-bold">Enterprise Security Governed</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6 font-medium">© 2026 AI Ads™ (AISA) · All rights reserved</p>
      </div>
    </div>
  );
};

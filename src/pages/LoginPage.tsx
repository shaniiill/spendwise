import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Phone,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, signup, loginAsDemo } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const res = login(phone, password);
      if (!res.success) {
        setError(res.error || 'Login failed');
      }
    } else {
      const res = signup(name, phone, password);
      if (!res.success) {
        setError(res.error || 'Registration failed');
      }
    }
  };

  const handleQuickDemo = () => {
    loginAsDemo();
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 select-none relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-[#111827] rounded-3xl border border-slate-800/90 shadow-2xl p-6 sm:p-8 relative z-10 animate-slide-up">
        {/* Brand header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/25">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            SpendWise
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              PRO
            </span>
          </h1>
          <p className="text-xs text-slate-400">Know Your Money. Own Your Future.</p>
        </div>

        {/* Tab Switcher: Log In / Sign Up */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Verma"
                  className="w-full bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-white rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          )}

          {/* Phone Number Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Phone Number *
            </label>
            <div className="relative flex rounded-xl border border-slate-800 overflow-hidden focus-within:border-emerald-500 transition-colors">
              <span className="bg-slate-900 px-3 py-2.5 text-xs font-semibold text-slate-400 border-r border-slate-800 flex items-center gap-1.5 shrink-0">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91</span>
              </span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-slate-900 px-3 py-2.5 text-sm text-white focus:outline-none font-medium tracking-wide"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password *
              </label>
              {mode === 'login' && (
                <span className="text-[11px] text-slate-400">Default: password123</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 pl-10 pr-10 py-2.5 text-sm text-white rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 mt-2"
          >
            <span>{mode === 'login' ? 'Log In to SpendWise' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-[#111827] text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Quick College Demo Access
          </span>
        </div>

        {/* Demo Fast Login Button */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="block font-semibold text-white">Login as Arjun Verma (Demo)</span>
              <span className="block text-[10px] text-slate-400">+91 9876543210</span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            Instant →
          </span>
        </button>

        {/* Security footnote */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Local persistent session stored in browser</span>
        </div>
      </div>
    </div>
  );
};

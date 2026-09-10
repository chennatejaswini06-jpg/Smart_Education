import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

export default function LoginPage({ onLoginSuccess, onGoToLanding, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email, password);
      localStorage.setItem('edusmart_token', res.token);
      localStorage.setItem('edusmart_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = () => {
    setEmail('demo@edusmart.ai');
    setPassword('Demo@123');
    setTimeout(() => {
      api.login('demo@edusmart.ai', 'Demo@123')
        .then(res => {
          localStorage.setItem('edusmart_token', res.token);
          localStorage.setItem('edusmart_user', JSON.stringify(res.user));
          onLoginSuccess(res.user);
        })
        .catch(err => setError(err.message));
    }, 100);
  };

  const handleDemoAdmin = () => {
    setEmail('admin@edusmart.ai');
    setPassword('Admin@123');
    setTimeout(() => {
      api.login('admin@edusmart.ai', 'Admin@123')
        .then(res => {
          localStorage.setItem('edusmart_token', res.token);
          localStorage.setItem('edusmart_user', JSON.stringify(res.user));
          onLoginSuccess(res.user);
        })
        .catch(err => setError(err.message));
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button 
          onClick={onGoToLanding}
          className="inline-flex items-center gap-2.5 mb-2 hover:scale-105 transition-transform"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            EduSmart AI
          </span>
        </button>
        <h2 className="text-xl font-bold text-slate-900">
          Sign In to Your Personal Learning Platform
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Smart India Hackathon 2026 Prototype • AICTE Theme
        </p>
      </div>

      {/* Main Form Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
          
          {/* 1-Click Instant Demo Access Box */}
          <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-2xl border border-indigo-200/70">
            <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Instant Hackathon Evaluation Access:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoStudent}
                className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Demo Student
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="py-2 px-3 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Demo Admin
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              Pre-loaded with 34 questions, analytics, weak topics (Recursion), and study tasks.
            </p>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
              <span className="bg-white px-2">Or enter credentials</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@edusmart.ai"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Demo Password is: Demo@123")}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-xs text-slate-500">Don't have an account? </span>
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Register as New Student
            </button>
          </div>

        </div>

        {/* AICTE Hackathon Prototype Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center mt-6">
          *Note: This platform is an educational technology prototype built for Smart India Hackathon 2026 (AICTE Problem Statement). Not officially affiliated with AICTE.
        </p>
      </div>

    </div>
  );
}

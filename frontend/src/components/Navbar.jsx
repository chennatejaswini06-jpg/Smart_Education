import React, { useState } from 'react';
import { 
  Bell, Search, Sparkles, BookOpen, Shield, Flame, 
  User, LogOut, ChevronDown, CheckCircle2, AlertTriangle, ExternalLink
} from 'lucide-react';

export default function Navbar({ user, onLogout, currentView, setCurrentView, notifications = [] }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Brand / Search */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  EduSmart AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  SIH 2026 Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                AICTE Smart Education Platform
              </p>
            </div>
          </button>

          {/* Quick Search */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-3.5 py-1.5 w-64 lg:w-80 text-sm text-slate-500 transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search topics, skills, or questions..." 
              className="bg-transparent border-none outline-none w-full text-slate-800 placeholder:text-slate-400 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setCurrentView('study-material');
                }
              }}
            />
            <kbd className="hidden lg:inline text-[10px] bg-white border border-slate-300 px-1.5 py-0.5 rounded text-slate-400 font-mono">
              /
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Learning Streak Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{user?.streak_days || 7} Day Streak</span>
          </div>

          {/* XP Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/80 text-indigo-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <span className="text-indigo-500">⚡</span>
            <span>{user?.xp_points || 1450} XP</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200/60 hover:text-indigo-600 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900">Smart Alerts & Notifications</span>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {notifications.length} New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        setShowNotifs(false);
                        if (n.link.includes('topic=10')) setCurrentView('quiz');
                        else if (n.link.includes('revision')) setCurrentView('revision');
                        else if (n.link.includes('study-planner')) setCurrentView('study-planner');
                        else if (n.link.includes('analytics')) setCurrentView('analytics');
                      }}
                      className="p-3.5 hover:bg-slate-50 cursor-pointer flex gap-3 items-start transition-colors"
                    >
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.type === 'warning' ? 'bg-amber-500' : (n.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500')}`} />
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Role Dropdown */}
          <div className="relative">
            <button 
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
              className="flex items-center gap-2 p-1.5 sm:px-3 rounded-xl border border-slate-200/80 hover:bg-slate-100/80 transition-all"
            >
              <img 
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=DemoStudent"} 
                alt="Avatar" 
                className="w-8 h-8 rounded-lg bg-indigo-100 object-cover border border-indigo-200"
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.name || "Demo Student"}
                </div>
                <div className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">
                  {user?.role === 'admin' ? 'Academic Admin' : 'Level 4 Student'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.email || 'demo@edusmart.ai'}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setCurrentView('profile'); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Student Profile
                  </button>
                  <button
                    onClick={() => { setCurrentView(user?.role === 'admin' ? 'dashboard' : 'admin'); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-indigo-600 hover:bg-indigo-50 flex items-center gap-2.5 font-medium"
                  >
                    <Shield className="w-4 h-4 text-indigo-500" />
                    {user?.role === 'admin' ? 'Switch to Student View' : 'Switch to Admin Portal'}
                  </button>
                  <button
                    onClick={() => { setCurrentView('impact'); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    SIH 2026 Impact Blueprint
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

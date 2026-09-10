import React from 'react';
import { 
  LayoutDashboard, Bot, Sparkles, Calendar, BarChart3, 
  Compass, RotateCcw, BookOpen, Award, User, Shield, 
  ChevronRight, Lightbulb, Zap, Info
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, user, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'ai-tutor', label: 'AI Personal Tutor', icon: Bot, badge: 'Smart AI' },
    { id: 'quiz', label: 'Adaptive Quiz', icon: Sparkles, badge: 'Adaptive' },
    { id: 'study-planner', label: 'Smart Study Planner', icon: Calendar, badge: null },
    { id: 'analytics', label: 'Learning Analytics', icon: BarChart3, badge: null },
    { id: 'skill-gap', label: 'Skill Gap Analyzer', icon: Compass, badge: 'Career' },
    { id: 'revision', label: 'Smart Revision', icon: RotateCcw, badge: 'Spaced' },
    { id: 'study-material', label: 'Topic Explorer', icon: BookOpen, badge: null },
    { id: 'achievements', label: 'Badges & XP', icon: Award, badge: null },
    { id: 'impact', label: 'SIH 2026 Impact', icon: Info, badge: 'AICTE' },
    { id: 'profile', label: 'Student Profile', icon: User, badge: null },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Dashboard', icon: Shield, badge: 'Admin' });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[65px] h-screen lg:h-[calc(100vh-65px)] w-64 
        bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Navigation Items */}
        <div className="p-4 space-y-1 overflow-y-auto">
          
          <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Learning Navigation
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  if (setIsOpen) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom AICTE Prototype Callout Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">Smart Education</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Targeting AICTE SIH 2026: Continuous learning diagnosis & adaptive growth.
            </p>
            <button 
              onClick={() => setCurrentView('impact')}
              className="mt-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View Impact Blueprint <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

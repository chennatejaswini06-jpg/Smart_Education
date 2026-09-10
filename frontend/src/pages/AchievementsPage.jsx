import React, { useState, useEffect } from 'react';
import { Award, Sparkles, Flame, CheckCircle2, Lock, Shield, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function AchievementsPage({ user, onNavigate }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile()
      .then(res => setProfileData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const badges = profileData?.badges || [];
  const profile = profileData?.profile || {};

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Top Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider">
              Educational Gamification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Badges, XP & Academic Milestones
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl">
            Designed to motivate consistency, spaced retention, and systematic mastery over distractions.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
          <div>
            <div className="text-2xl font-extrabold">{profile?.xp_points || 1450}</div>
            <div className="text-[10px] uppercase font-bold text-orange-100">Total XP Points</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="text-2xl font-extrabold">Level {profile?.level || 4}</div>
            <div className="text-[10px] uppercase font-bold text-orange-100">Code Crafter</div>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Earned Badges & Progress</h2>
          <p className="text-xs text-slate-500">Milestones unlocked through continuous assessment and study</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                b.is_unlocked 
                  ? 'bg-gradient-to-br from-indigo-50/50 via-white to-white border-indigo-200/80 shadow-xs' 
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                b.is_unlocked ? 'bg-indigo-100 border border-indigo-200' : 'bg-slate-200 text-slate-400'
              }`}>
                {b.is_unlocked ? b.icon : <Lock className="w-5 h-5 text-slate-400" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{b.title}</h3>
                  {b.is_unlocked && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {b.description}
                </p>
                <div className="text-[10px] font-bold text-indigo-600 pt-1">
                  +{b.xp_reward} XP Reward
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Flame, BookOpen, Clock, Award, CheckCircle2, 
  ArrowRight, Bot, Target, AlertTriangle, Play, ChevronRight, BarChart2
} from 'lucide-react';
import DoubtAlertBanner from '../components/DoubtAlertBanner';
import { SubjectMasteryBars } from '../components/Charts';
import { api } from '../api';

export default function DashboardPage({ user, onNavigate }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleTask = async (task) => {
    try {
      await api.updateTask(task.id, { is_completed: !task.is_completed });
      fetchDashboard();
    } catch (err) {
      console.error("Task toggle failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your smart learning space...</p>
        </div>
      </div>
    );
  }

  const student = dashboard?.student || user;
  const stats = dashboard?.stats || {};
  const todayPlan = dashboard?.today_plan || [];
  const doubtAlert = dashboard?.doubt_alerts?.[0];
  const recommendations = dashboard?.recommendations || [];
  const subjectMastery = dashboard?.subject_mastery || [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-indigo-100">
                🎯 Target: {student?.learning_goal || "Software Developer"}
              </span>
              <span className="text-indigo-200 text-xs hidden sm:inline">•</span>
              <span className="text-indigo-200 text-xs hidden sm:inline">
                {student?.college || "National Institute of Technology"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {student?.name || "Demo Student"} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl leading-relaxed">
              Your AI tutor identified <span className="font-bold underline text-amber-300">Recursion</span> as today's highest-leverage improvement opportunity. You're 74% towards your Software Developer career benchmark!
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('quiz')}
              className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Take Adaptive Quiz
            </button>
            <button
              onClick={() => onNavigate('ai-tutor')}
              className="px-5 py-2.5 bg-indigo-500/30 hover:bg-indigo-500/40 text-white border border-white/20 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              Ask AI Tutor
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overall Progress</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{stats.overall_progress_pct || 74.2}%</div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">↑ +4.5% this week</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{stats.streak_days || 7} Days</div>
          <p className="text-[10px] text-amber-600 font-semibold mt-1">🔥 Consistent habit</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Topics Mastered</span>
            <BookOpen className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{stats.topics_completed || 5} / {stats.total_topics || 19}</div>
          <p className="text-[10px] text-slate-500 mt-1">14 in progress</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Quiz Score</span>
            <Sparkles className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{stats.avg_quiz_score || 78}%</div>
          <p className="text-[10px] text-indigo-600 font-semibold mt-1">Adaptive accuracy</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Study Hours</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{stats.study_hours || 34.5} hrs</div>
          <p className="text-[10px] text-slate-500 mt-1">3.0 hrs / day goal</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current Level</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-indigo-600">Level 4</div>
          <p className="text-[10px] text-slate-500 mt-1">Code Crafter</p>
        </div>

      </div>

      {/* 3. Doubt Detection Alert Banner */}
      {doubtAlert && (
        <DoubtAlertBanner 
          alert={doubtAlert}
          onLearn={() => onNavigate('study-material')}
          onAskAI={() => onNavigate('ai-tutor')}
          onPractice={() => onNavigate('quiz')}
        />
      )}

      {/* 4. Main Two Column Section: Today's Learning Plan + Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Learning Plan */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">TODAY'S LEARNING PLAN</h2>
                <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                  AI Generated
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted schedule tailored to close your DSA and SQL gaps
              </p>
            </div>
            <button
              onClick={() => onNavigate('study-planner')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Full Schedule <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayPlan.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  task.is_completed 
                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                    : 'bg-white hover:bg-indigo-50/30 border-slate-200/90 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      task.is_completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-slate-300 hover:border-indigo-500'
                    }`}
                  >
                    {task.is_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <h4 className={`text-xs font-bold text-slate-800 ${task.is_completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {task.subject_name} • {task.duration_minutes} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                    {task.day_of_week}
                  </span>
                  {!task.is_completed && (
                    <button
                      onClick={() => {
                        if (task.title.toLowerCase().includes('quiz')) onNavigate('quiz');
                        else if (task.title.toLowerCase().includes('recursion')) onNavigate('ai-tutor');
                        else onNavigate('study-material');
                      }}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-indigo-700" /> Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('study-material')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Continue Learning
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              Start Quiz
            </button>
            <button
              onClick={() => onNavigate('ai-tutor')}
              className="px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl text-xs font-bold transition-colors"
            >
              Ask AI Tutor
            </button>
          </div>
        </div>

        {/* Right 1 Col: Subject Mastery Overview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subject Mastery</h3>
              <p className="text-[11px] text-slate-500">Live academic assessment</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Details
            </button>
          </div>

          <SubjectMasteryBars subjects={subjectMastery.slice(0, 6)} />

          <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100/70 text-xs text-indigo-900">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Diagnostic Insight:
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              "You are performing well in Java (82%) and Cybersecurity (81%), but DSA (54%) requires additional practice to reach your Software Developer goal."
            </p>
          </div>
        </div>

      </div>

      {/* 5. Priority AI Recommendations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Personalized Next Actions</h3>
            <p className="text-xs text-slate-500">
              Curated by EduSmart AI Recommendation Engine based on recent performance
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {recommendations.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/70 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    rec.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                    rec.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{rec.type}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {rec.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              <button
                onClick={() => {
                  if (rec.action_link?.includes('ai-tutor')) onNavigate('ai-tutor');
                  else if (rec.action_link?.includes('quiz')) onNavigate('quiz');
                  else if (rec.action_link?.includes('revision')) onNavigate('revision');
                  else onNavigate('study-material');
                }}
                className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
              >
                Execute Action <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

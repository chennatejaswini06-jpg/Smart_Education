import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, 
  Award, Clock, Calendar, ArrowRight
} from 'lucide-react';
import { WeeklyStudyBarChart, QuizScoreLineChart, SubjectMasteryBars } from '../components/Charts';
import { api } from '../api';

export default function LearningAnalyticsPage({ user, onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const weeklyStudy = data?.weekly_study_data || [];
  const quizTrend = data?.quiz_trend || [];
  const subjects = data?.subjects || [];
  const strongTopics = data?.strong_topics || [];
  const weakTopics = data?.weak_topics || [];
  const aiInsight = data?.ai_insight || "";

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
            Cognitive Diagnostics
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Intelligent Learning Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
          Multi-dimensional metrics tracking your retention decay, topic accuracy, study endurance, and adaptive difficulty trajectory.
        </p>
      </div>

      {/* AI Holistic Diagnostic Insight */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl shadow-xl shadow-indigo-950/10 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Pedagogical Diagnosis</span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-50 leading-relaxed max-w-3xl">
            "{aiInsight}"
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onNavigate('quiz')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              Start Diagnostic Quiz <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('ai-tutor')}
              className="px-4 py-2 bg-white/15 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Consult AI Tutor
            </button>
          </div>
        </div>
      </div>

      {/* 2 Grid Charts: Weekly Study Hours & Quiz Score Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Study Hours */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Study Effort (Hours)</h3>
              <p className="text-[11px] text-slate-500">Recorded study minutes over the last 7 days</p>
            </div>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <WeeklyStudyBarChart data={weeklyStudy} />
        </div>

        {/* Quiz Scores Progression */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Adaptive Quiz Performance Trend</h3>
              <p className="text-[11px] text-slate-500">Score percentage across recent assessments</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <QuizScoreLineChart attempts={quizTrend} />
        </div>

      </div>

      {/* 2 Columns: Subject Mastery Breakdown + Strong vs Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subject Mastery */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Subject Mastery Accuracy</h3>
            <p className="text-[11px] text-slate-500">Aggregate topic competency across curriculum</p>
          </div>
          <SubjectMasteryBars subjects={subjects} />
        </div>

        {/* Strong vs Weak Topics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Strong vs Weak Topic Identification</h3>
            <p className="text-[11px] text-slate-500">Automated classification driving recommendations</p>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider block mb-2">
                ⚠ Identified Weak Topics (Action Required)
              </span>
              <div className="space-y-2">
                {weakTopics.map((wt, idx) => (
                  <div key={idx} className="p-3 bg-rose-50/50 rounded-2xl border border-rose-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{wt.topic_name}</div>
                      <div className="text-[10px] text-slate-500">{wt.subject_name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-rose-600">{wt.mastery_score}%</span>
                      <button
                        onClick={() => onNavigate('quiz')}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        Revise
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block mb-2">
                ✓ Mastered Topics (Strong Foundation)
              </span>
              <div className="space-y-2">
                {strongTopics.slice(0, 3).map((st, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{st.topic_name}</div>
                      <div className="text-[10px] text-slate-500">{st.subject_name}</div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700">{st.mastery_score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

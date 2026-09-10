import React, { useState, useEffect } from 'react';
import { 
  Compass, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  Briefcase, ChevronRight, BarChart2
} from 'lucide-react';
import { ReadinessGauge } from '../components/Charts';
import { api } from '../api';

export default function SkillGapPage({ user, onNavigate }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('Software Developer');
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRoles().then(r => setRoles(r)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getSkillGap(selectedRole)
      .then(res => setGapData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedRole]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
              Industry Alignment
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            "Where Am I Weak?" — Skill Gap Analyzer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Benchmarks your current student mastery directly against corporate hiring requirements.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <Briefcase className="w-4 h-4 text-indigo-600 ml-2" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer pr-2"
          >
            {roles.map(r => (
              <option key={r.name} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Top Readiness & Critical Topics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 1 Col: Readiness Gauge */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Industry Job Readiness
              </h3>
              <ReadinessGauge score={gapData?.overall_readiness_percentage || 74} />
              <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                Benchmark evaluation for <strong>{selectedRole}</strong>. Closing your DSA deficit will propel readiness past 85%.
              </p>
            </div>

            {/* Right 2 Cols: Detailed Comparison Table / Bars */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Required Skill Competency vs Your Current Level
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Standard: Tier-1 Tech Bar
                </span>
              </div>

              <div className="space-y-3.5">
                {gapData?.skill_comparison?.map((s, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{s.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.status === 'Strong' ? 'bg-emerald-50 text-emerald-700' :
                          s.status === 'Almost Ready' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {s.status}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Current: <strong>{s.current_mastery}%</strong> / Req: <strong>{s.required_mastery}%</strong>
                        </span>
                      </div>
                    </div>

                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          s.status === 'Strong' ? 'bg-emerald-500' :
                          s.status === 'Almost Ready' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, s.current_mastery)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 4-Step Personalized Career Bridge Roadmap */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Personalized AI Career Gap Bridge Roadmap
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Step-by-step sequence recommended by EduSmart AI to qualify for {selectedRole} roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gapData?.roadmap?.map((step) => (
                <div 
                  key={step.step}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-3 relative group hover:border-indigo-300 hover:bg-white transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                        {step.step}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {step.duration}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {step.title}
                    </h4>

                    <div className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                      Focus: {step.focus}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {step.action}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (step.step === 1) onNavigate('ai-tutor');
                      else if (step.step === 2) onNavigate('quiz');
                      else onNavigate('study-planner');
                    }}
                    className="pt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    Start Step {step.step} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}

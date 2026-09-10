import React from 'react';
import { 
  Sparkles, Users, School, Building2, Landmark, CheckCircle2, 
  ArrowRight, ShieldCheck, HeartHandshake, Zap
} from 'lucide-react';

export default function ImpactPage({ onNavigate }) {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/15">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider">
            Smart India Hackathon 2026 Presentation Blueprint
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Real-World Impact & AICTE Problem Statement Alignment
        </h1>
        <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-2xl leading-relaxed">
          Problem: "Student Innovation – Smart Education: A concept that describes learning in the digital age. It enables learners to learn more effectively, efficiently, flexibly and comfortably."
        </p>
      </div>

      {/* 4 Tiers of Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tier 1: Students */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Impact on Students</h2>
              <p className="text-xs text-slate-500">Autonomous & personalized mastery</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 pt-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Hyper-Personalized Pacing:</strong> Students no longer struggle with content that is too easy or impossibly hard; quizzes adapt dynamically.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Eliminates Blind Spots:</strong> Instant early doubt detection flags conceptual errors in real-time (e.g. Recursion base cases).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Career Benchmark Clarity:</strong> Bridges the gap between academic syllabus and corporate job requirements.</span>
            </li>
          </ul>
        </div>

        {/* Tier 2: Teachers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Impact on Teachers & Faculty</h2>
              <p className="text-xs text-slate-500">Data-driven classroom instruction</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 pt-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Cohort Difficulty Heatmaps:</strong> Teachers instantly identify which topics confuse the class (e.g. DP at 42% average).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Automated Remedial Support:</strong> The AI tutor handles 24/7 repetitive questions, freeing educators for high-touch mentoring.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Early Warning System:</strong> Identifies at-risk students weeks before semester end, reducing dropouts and failure rates.</span>
            </li>
          </ul>
        </div>

        {/* Tier 3: Institutions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Impact on Universities & Colleges</h2>
              <p className="text-xs text-slate-500">Institutional quality & placements</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 pt-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Enhanced Placement Rates:</strong> Direct skill-gap alignment produces industry-ready engineering graduates.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Accreditation Compliance:</strong> Measurable outcome-based education (OBE) metrics ready for NAAC/NBA auditing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Cost-Effective Scalability:</strong> Cloud-native, database-agnostic architecture requiring no costly proprietary licenses.</span>
            </li>
          </ul>
        </div>

        {/* Tier 4: Government & Ecosystem */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">4. Impact on National Education Ecosystem</h2>
              <p className="text-xs text-slate-500">Democratic access to quality smart education</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 pt-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Democratizes Elite Tutoring:</strong> Provides Tier-2, Tier-3 and rural college students with elite 1-on-1 AI pedagogy.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Aligns with NEP 2020:</strong> Direct embodiment of adaptive digital assessments and continuous diagnostic learning.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Open Standard Architecture:</strong> Easily pluggable into SWAYAM, DIKSHA, and state university portals.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Prototype Notice */}
      <div className="p-4 bg-slate-100 rounded-2xl text-[11px] text-slate-500 text-center">
        *Disclaimer: Developed exclusively as an independent technological solution for Smart India Hackathon 2026 under the AICTE Smart Education Theme. No official affiliation or endorsement by AICTE is claimed.
      </div>

    </div>
  );
}

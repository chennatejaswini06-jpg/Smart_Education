import React from 'react';
import { 
  Sparkles, ArrowRight, Bot, Target, Brain, Calendar, 
  BarChart3, Compass, RotateCcw, AlertTriangle, ShieldCheck, 
  CheckCircle2, Users, Building2, School, Landmark, ChevronRight
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onLogin, onRegister }) {
  const features = [
    {
      title: "AI Personal Tutor",
      desc: "Conversational intelligent tutor that adapts explanations, gives code examples, real-world analogies, and traces algorithms step-by-step.",
      icon: Bot,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Personalized Learning Path",
      desc: "Dynamically analyzes academic level, strong vs weak topics, and career aspirations to construct a customized curriculum.",
      icon: Target,
      color: "from-indigo-600 to-violet-600"
    },
    {
      title: "Adaptive Quizzes",
      desc: "Questions dynamically adjust between Easy, Medium, and Hard based on your real-time response accuracy and topic mastery score.",
      icon: Sparkles,
      color: "from-violet-600 to-purple-600"
    },
    {
      title: "Smart Study Planner",
      desc: "Automatically drafts a balanced weekly timetable scheduling weak areas early and ensuring consistent preparation.",
      icon: Calendar,
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Learning Analytics",
      desc: "Deep visual metrics: weekly study hours, quiz progression, topic mastery breakdown, and natural language AI diagnostic insights.",
      icon: BarChart3,
      color: "from-pink-600 to-rose-600"
    },
    {
      title: "Skill Gap Detection",
      desc: "Benchmarks your current skills against industry roles (Software Developer, Data Scientist) and creates targeted bridge roadmaps.",
      icon: Compass,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "AI Doubt Detection",
      desc: "Automatically detects repeated incorrect answers in a topic and triggers instant 1-click intervention before you fall behind.",
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Smart Revision",
      desc: "Implements spaced-repetition retention models to identify decaying topics and schedules quick 5-minute reviews.",
      icon: RotateCcw,
      color: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              EduSmart AI
            </span>
            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/50 uppercase">
              SIH 2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Student Login
          </button>
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
          >
            Get Started Free <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-indigo-50/50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AICTE Smart India Hackathon 2026 Prototype</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Your Personal <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">AI-Powered</span> Learning Companion
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform the way you learn with personalized study paths, adaptive assessments, AI-powered doubt solving and intelligent progress analytics.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              Explore Demo Platform <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl text-sm border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              Quick Demo Login
            </button>
          </div>

          {/* Tagline banner */}
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mt-6">
            "Learn Smarter. Improve Faster. Succeed Better."
          </p>

          {/* Interactive Flow Visual: Student → Learning Data → AI Analysis → Personalized Plan → Better Learning Outcome */}
          <div className="mt-16 p-6 sm:p-8 bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-200/80 max-w-4xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 text-left">
              The Smart Learning Pipeline
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div className="text-2xl mb-1">👨‍🎓</div>
                <div className="text-xs font-bold text-slate-800">Student</div>
                <div className="text-[10px] text-slate-500">Learner Activity</div>
              </div>

              <div className="hidden sm:flex justify-center text-indigo-400 font-bold">➔</div>

              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-xs font-bold text-indigo-900">Learning Data</div>
                <div className="text-[10px] text-indigo-600">Quizzes & Habits</div>
              </div>

              <div className="hidden sm:flex justify-center text-indigo-400 font-bold">➔</div>

              <div className="p-4 bg-violet-50/80 rounded-2xl border border-violet-200 text-center">
                <div className="text-2xl mb-1">🤖</div>
                <div className="text-xs font-bold text-violet-900">AI Analysis</div>
                <div className="text-[10px] text-violet-600">Gaps Detected</div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center mt-3">
              
              <div className="sm:col-start-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <div className="text-2xl mb-1">📋</div>
                <div className="text-xs font-bold text-emerald-900">Personalized Plan</div>
                <div className="text-[10px] text-emerald-600">Dynamic Timetable</div>
              </div>

              <div className="hidden sm:flex justify-center text-emerald-500 font-bold">➔</div>

              <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-md text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xs font-bold">Better Outcomes</div>
                <div className="text-[10px] text-emerald-100">+25% Mastery</div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Educational Paradigm Shift
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              Traditional E-Learning vs EduSmart AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Why static LMS models fail 21st century engineering students and how smart data-driven tutoring fixes it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Old Problem */}
            <div className="bg-white p-7 rounded-3xl border border-rose-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
                  ✕
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">The Traditional LMS Problem</h3>
                  <p className="text-xs text-slate-500">One-size-fits-all digital classrooms</p>
                </div>
              </div>

              <ul className="space-y-3 pt-2">
                {[
                  "Same static learning material forced onto every student regardless of background",
                  "Students remain blind to specific micro-level weak areas (e.g. recursion call stacks)",
                  "Zero personalized guidance outside scheduled faculty hours",
                  "Difficulty maintaining realistic, balanced study schedules alone",
                  "Delayed identification of critical learning gaps until end-of-semester exam failure"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EduSmart Solution */}
            <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">The EduSmart AI Solution</h3>
                  <p className="text-xs text-slate-500">Continuous adaptive smart education</p>
                </div>
              </div>

              <ul className="space-y-3 pt-2">
                {[
                  "Dynamically generated study paths tailored to academic level & career goals",
                  "Immediate early doubt detection flagging repeated errors in real-time",
                  "Personal AI Tutor on demand with analogies, code walkthroughs, and practice sets",
                  "Smart study planner automatically scheduling weak topics and tracking completion",
                  "Skill-gap analyzer benchmarking student readiness against industry job standards"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 8 Feature Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Full Spectrum Platform
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              8 Intelligent Pillars of EduSmart AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Engineered to meet all 7 dimensions of Smart Education: Personalized, Effective, Efficient, Flexible, Comfortable, Accessible, and Data-driven.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${f.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real-World Impact Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              Transformative Impact
            </span>
            <h2 className="text-3xl font-extrabold mt-3">
              Impact Across the Higher Education Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Empowering every stakeholder with actionable intelligence and automated pedagogical support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">For Students</h3>
              <ul className="text-xs text-slate-300 space-y-2 mt-3">
                <li>• Self-paced individualized learning</li>
                <li>• Rapid elimination of blind spots</li>
                <li>• Realistic placement interview readiness</li>
                <li>• Gamified streak retention</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4 font-bold">
                <School className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">For Teachers</h3>
              <ul className="text-xs text-slate-300 space-y-2 mt-3">
                <li>• Identify struggling students early</li>
                <li>• Topic-level difficulty heatmaps</li>
                <li>• Automate repetitive doubt answering</li>
                <li>• Data-backed remedial interventions</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4 font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">For Institutions</h3>
              <ul className="text-xs text-slate-300 space-y-2 mt-3">
                <li>• Cohort engagement monitoring</li>
                <li>• Real-time institutional accreditation metrics</li>
                <li>• Enhanced placement conversion rate</li>
                <li>• Scalable digital education infrastructure</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">For Government & AICTE</h3>
              <ul className="text-xs text-slate-300 space-y-2 mt-3">
                <li>• Aligns with NEP 2020 digital directives</li>
                <li>• Bridges Tier-2/3 technical skill deficits</li>
                <li>• Measurable learning outcome tracking</li>
                <li>• Open standard plug-and-play architecture</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Experience the Future of Smart Education?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            Log in with our pre-loaded demo account to witness adaptive learning, intelligent doubt detection, and career skill analysis in action.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLogin}
              className="px-8 py-3.5 bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl transition-all"
            >
              Launch Demo Student (Demo@123)
            </button>
            <button
              onClick={onRegister}
              className="px-8 py-3.5 bg-indigo-900/60 hover:bg-indigo-900 text-white border border-indigo-300/30 font-bold rounded-2xl text-xs sm:text-sm transition-all"
            >
              Create New Account
            </button>
          </div>

          <div className="mt-8 text-[11px] text-indigo-200/80 max-w-xl mx-auto">
            Disclaimer: EduSmart AI is an independent prototype developed in response to the AICTE problem statement for Smart India Hackathon 2026. No official endorsement or AICTE affiliation is claimed.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-slate-500 text-center text-xs border-t border-slate-800">
        <p>© 2026 EduSmart AI. Built for Smart India Hackathon 2026 • Student Innovation – Smart Education.</p>
      </footer>

    </div>
  );
}

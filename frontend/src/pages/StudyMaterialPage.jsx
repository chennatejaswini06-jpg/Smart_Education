import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Code2, AlertTriangle, HelpCircle, 
  Layers, CheckCircle2, Bot, ArrowRight
} from 'lucide-react';
import { api } from '../api';

export default function StudyMaterialPage({ user, onNavigate }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(10); // Recursion
  const [materialData, setMaterialData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, concepts, code, visual, mistakes, quiz
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTopics().then(t => setTopics(t)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getTopicMaterial(selectedTopicId)
      .then(res => setMaterialData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTopicId]);

  const tabs = [
    { id: 'overview', label: '📖 Overview' },
    { id: 'concepts', label: '💡 Key Concepts' },
    { id: 'code', label: '💻 Code Examples' },
    { id: 'visual', label: '📊 Visualization' },
    { id: 'mistakes', label: '⚠️ Common Pitfalls' },
    { id: 'quiz', label: '🎯 Mini Quiz' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Top Selector Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
              Curriculum Knowledge Base
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            AI-Generated Study Material & Concept Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synthesized explanations, runnable code snippets, mental models, and self-checks.
          </p>
        </div>

        {/* Topic Picker */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <BookOpen className="w-4 h-4 text-indigo-600 ml-2" />
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(parseInt(e.target.value))}
            className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer pr-2"
          >
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.subject_name} ➔ {t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Tabs Bar */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200/80 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8 min-h-[350px]">
            
            {activeTab === 'overview' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-slate-900">
                  Concept Definition: {materialData?.topic?.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {materialData?.material?.overview || "Comprehensive conceptual guide covering theoretical mechanics and algorithmic logic."}
                </p>
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-900 mb-1">💡 Real-World Relevance</h4>
                  <p className="text-xs text-indigo-950">
                    Crucial for technical interviews, database performance optimization, and scalable distributed system design.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'concepts' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-slate-900">Core Principles & Foundations</h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-loose whitespace-pre-line">
                  {materialData?.material?.key_concepts || "1. Base Conditions\n2. Invariant properties\n3. Memory frame management"}
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Runnable Implementation</h3>
                  <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                    {materialData?.material?.code_language || 'Java'}
                  </span>
                </div>
                <pre className="p-5 bg-slate-950 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  {materialData?.material?.code_example || "// Code sample"}
                </pre>
              </div>
            )}

            {activeTab === 'visual' && (
              <div className="space-y-4 text-center max-w-2xl mx-auto py-6">
                <h3 className="text-lg font-bold text-slate-900">Visual Call-Tree / State Diagram</h3>
                <div className="p-8 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl border border-indigo-200 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    Root(n)
                  </div>
                  <div className="w-0.5 h-6 bg-indigo-300" />
                  <div className="flex gap-8">
                    <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-xs text-xs font-bold text-indigo-900">
                      Step(n - 1)
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-indigo-200 shadow-xs text-xs font-bold text-indigo-900">
                      Step(n - 2)
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-indigo-300" />
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs border border-emerald-300">
                    Base Case: n &lt;= 1 (Return 1)
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Each level generates stack frames in execution order until terminating condition unwinds.
                </p>
              </div>
            )}

            {activeTab === 'mistakes' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-slate-900">Common Traps & Anti-Patterns</h3>
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs text-rose-950 leading-relaxed whitespace-pre-line">
                  {materialData?.material?.common_mistakes || "1. Off-by-one errors\n2. Missing base case recursion\n3. Mutating external shared state"}
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-slate-900">Quick Concept Verification</h3>
                <div className="space-y-3">
                  {materialData?.mini_questions?.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <div className="font-bold text-slate-900">Q{idx + 1}. {q.question_text}</div>
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        <div className="p-2 bg-white rounded-lg border border-slate-100">A: {q.option_a}</div>
                        <div className="p-2 bg-white rounded-lg border border-slate-100">B: {q.option_b}</div>
                      </div>
                      <details className="text-[11px] text-indigo-600 font-semibold cursor-pointer pt-1">
                        <summary>View Correct Answer & Explanation</summary>
                        <p className="mt-1 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 font-normal">
                          <strong>Option {q.correct_option}:</strong> {q.explanation}
                        </p>
                      </details>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Take Full Adaptive Quiz
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

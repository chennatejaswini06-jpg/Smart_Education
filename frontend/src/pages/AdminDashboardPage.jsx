import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, BookOpen, Sparkles, Plus, CheckCircle2, 
  BarChart3, Search, AlertTriangle, ArrowRight
} from 'lucide-react';
import { api } from '../api';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState({
    subject_id: 1,
    topic_id: 1,
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    difficulty: 'Medium',
    explanation: ''
  });

  const fetchData = async () => {
    try {
      const [anRes, stRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminStudents()
      ]);
      setAnalytics(anRes);
      setStudents(stRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.addAdminQuestion(newQuestion);
      alert("Question successfully added to database!");
      setShowAddModal(false);
      setNewQuestion({
        subject_id: 1,
        topic_id: 1,
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        difficulty: 'Medium',
        explanation: ''
      });
      fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700">
              Institutional Admin Portal
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Academic & Cohort Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor college-wide student engagement, identify cohort learning barriers, and manage assessment items.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Assessment Question
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Enrolled Students</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{analytics?.total_students || 245}</div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">Active institutional cohort</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Active Students Today</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{analytics?.active_students_today || 89}</div>
          <p className="text-[10px] text-indigo-600 font-semibold mt-1">Daily engagement rate: 84%</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Cohort Average Score</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{analytics?.avg_cohort_score || 72.4}%</div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Across all adaptive quizzes</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Quizzes Evaluated</div>
          <div className="text-2xl font-extrabold text-violet-600 mt-1">{analytics?.total_quizzes_attempted || 1425}</div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">AI automated corrections</p>
        </div>
      </div>

      {/* Cohort Difficult Topics & Students Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Most Difficult Topics Heatmap */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Cohort Stumbling Blocks</h3>
            <p className="text-[11px] text-slate-500">Topics where students struggle most</p>
          </div>

          <div className="space-y-3">
            {analytics?.difficult_topics?.map((dt, idx) => (
              <div key={idx} className="p-3 bg-rose-50/60 border border-rose-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{dt.topic_name}</div>
                  <div className="text-[10px] text-slate-500">{dt.subject_name}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-rose-600">{dt.avg_mastery}%</span>
                  <div className="text-[10px] text-slate-400">Cohort Avg</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Management Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registered Students</h3>
              <p className="text-[11px] text-slate-500">Individual progress and academic level</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {students.length} Visible
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-2">Student</th>
                  <th className="pb-2">Course / College</th>
                  <th className="pb-2">Goal</th>
                  <th className="pb-2 text-right">Avg Mastery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80">
                    <td className="py-3 flex items-center gap-2.5 font-bold text-slate-900">
                      <img src={st.avatar} alt="avatar" className="w-7 h-7 rounded-lg border border-slate-200" />
                      <div>
                        <div>{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{st.email}</div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">
                      <div>{st.course}</div>
                      <div className="text-[10px] text-slate-400">{st.college}</div>
                    </td>
                    <td className="py-3 text-indigo-600 font-semibold">{st.learning_goal}</td>
                    <td className="py-3 text-right font-extrabold text-slate-900">{st.avg_mastery || 72}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl animate-fade-in space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Question to Question Bank</h3>
            <form onSubmit={handleAddQuestion} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Question Text</label>
                <textarea
                  required
                  rows="2"
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
                  className="w-full mt-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  placeholder="Option A"
                  value={newQuestion.option_a}
                  onChange={(e) => setNewQuestion({...newQuestion, option_a: e.target.value})}
                  className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <input
                  required
                  placeholder="Option B"
                  value={newQuestion.option_b}
                  onChange={(e) => setNewQuestion({...newQuestion, option_b: e.target.value})}
                  className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <input
                  required
                  placeholder="Option C"
                  value={newQuestion.option_c}
                  onChange={(e) => setNewQuestion({...newQuestion, option_c: e.target.value})}
                  className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <input
                  required
                  placeholder="Option D"
                  value={newQuestion.option_d}
                  onChange={(e) => setNewQuestion({...newQuestion, option_d: e.target.value})}
                  className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Correct Option</label>
                  <select
                    value={newQuestion.correct_option}
                    onChange={(e) => setNewQuestion({...newQuestion, correct_option: e.target.value})}
                    className="w-full mt-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                    className="w-full mt-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Explanation</label>
                <input
                  type="text"
                  placeholder="Detailed rationale for student feedback..."
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                  className="w-full mt-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

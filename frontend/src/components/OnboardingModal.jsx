import React, { useState } from 'react';
import { Sparkles, Target, Clock, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('Prepare for placements');
  const [level, setLevel] = useState('Intermediate');
  const [hours, setHours] = useState(3.0);
  const [style, setStyle] = useState('Hands-on / Practical');
  const [targetDate, setTargetDate] = useState('2026-11-15');
  const [weakSubjects, setWeakSubjects] = useState(['Data Structures & Algorithms']);
  const [strongSubjects, setStrongSubjects] = useState(['Python', 'Java Programming']);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const goalOptions = [
    'Improve academic performance',
    'Prepare for placements',
    'Learn programming',
    'Prepare for competitive exams',
    'Improve weak subjects',
    'Build technical skills'
  ];

  const styleOptions = [
    'Hands-on / Practical',
    'Visual & Diagrams',
    'Conceptual Deep-Dive',
    'Reading & Documentation'
  ];

  const subjectsList = [
    'Data Structures & Algorithms',
    'Java Programming',
    'Python',
    'SQL & Databases',
    'Cybersecurity',
    'Web Development',
    'Computer Networks'
  ];

  const handleFinish = async () => {
    setLoading(true);
    try {
      await api.submitOnboarding({
        learning_goal: goal,
        academic_level: level,
        daily_study_hours: hours,
        preferred_learning_style: style,
        target_date: targetDate,
        weak_subjects: weakSubjects,
        strong_subjects: strongSubjects
      });
      onComplete();
    } catch (err) {
      console.error(err);
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/20">
            <Sparkles className="w-6 h-6 text-indigo-200" />
          </div>
          <h2 className="text-xl font-bold">Personalize Your Smart Journey</h2>
          <p className="text-xs text-indigo-100 mt-1">
            Step {step} of 3: AI Learner Profile Setup
          </p>

          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-white' : 'w-2.5 bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  What do you want to achieve?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {goalOptions.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoal(g)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                        goal === g 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Your Current Academic Level
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        level === lvl 
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Available Study Time per Day</span>
                  <span className="text-indigo-600 font-bold">{hours} Hours</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="6" 
                  step="0.5" 
                  value={hours} 
                  onChange={(e) => setHours(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 hr (Light)</span>
                  <span>3 hrs (Standard)</span>
                  <span>6 hrs (Intensive)</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Preferred Learning Style
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {styleOptions.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStyle(st)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                        style === st 
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-2 ring-indigo-500/20'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Target Exam / Placement Date
                </label>
                <input 
                  type="date" 
                  value={targetDate} 
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                  <span>Weak Subjects (Needs More AI Focus)</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {subjectsList.map((s) => {
                    const isSelected = weakSubjects.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setWeakSubjects(isSelected ? weakSubjects.filter(item => item !== s) : [...weakSubjects, s]);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isSelected 
                            ? 'bg-rose-50 border-rose-400 text-rose-700 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? '✕ ' : '+ '}{s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <span>Strong Subjects</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {subjectsList.map((s) => {
                    const isSelected = strongSubjects.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setStrongSubjects(isSelected ? strongSubjects.filter(item => item !== s) : [...strongSubjects, s]);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              {loading ? 'Building Plan...' : 'Generate Learning Path ✨'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

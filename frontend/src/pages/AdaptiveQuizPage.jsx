import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Clock, CheckCircle2, AlertCircle, Award, 
  RotateCcw, ArrowRight, Bot, BookOpen, ChevronRight
} from 'lucide-react';
import { api } from '../api';

export default function AdaptiveQuizPage({ user, onNavigate }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('10'); // Default to Recursion (demo weak topic)
  const [questions, setQuestions] = useState([]);
  const [quizState, setQuizState] = useState('idle'); // idle, running, finished
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getTopics().then(data => setTopics(data)).catch(console.error);
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (quizState === 'running' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (quizState === 'running' && timeLeft === 0) {
      handleFinishQuiz();
    }
    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const data = await api.getQuizQuestions({ topic_id: selectedTopic, limit: 5, mode: 'adaptive' });
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setUserAnswers({});
      setTimeLeft(180);
      setQuizState('running');
    } catch (err) {
      alert("Error loading quiz questions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (opt) => {
    setUserAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: opt
    }));
  };

  const handleFinishQuiz = async () => {
    setLoading(true);
    const answersPayload = questions.map(q => ({
      question_id: q.id,
      selected_option: userAnswers[q.id] || ''
    }));

    try {
      const res = await api.submitQuiz({
        subject_id: questions[0]?.subject_id || 6,
        topic_id: parseInt(selectedTopic),
        answers: answersPayload,
        time_taken_seconds: 180 - timeLeft
      });
      setResult(res);
      setQuizState('finished');
    } catch (err) {
      alert("Error submitting quiz: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* 1. Launcher State */}
      {quizState === 'idle' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/20">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              Adaptive Engine v2.0
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Personalized Adaptive Assessment
            </h1>
            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Questions adjust dynamically based on your mastery. High accuracy advances difficulty; lower accuracy triggers intelligent diagnostic revision.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Assessment Module
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
            >
              {topics.map(t => (
                <option key={t.id} value={t.id}>
                  {t.subject_name} ➔ {t.name} ({t.difficulty_level})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg font-medium">
              💡 Recommended for you: <strong>Recursion & Backtracking</strong> (Detected current mastery: 48%)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Questions</span>
              <span className="font-extrabold text-slate-800 text-sm">5 MCQs</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Time Allotted</span>
              <span className="font-extrabold text-slate-800 text-sm">3 Minutes</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">XP Reward</span>
              <span className="font-extrabold text-indigo-600 text-sm">+80 XP</span>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Preparing Questions...' : 'Start Adaptive Quiz Now'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Running Quiz State */}
      {quizState === 'running' && questions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-3xl mx-auto space-y-6">
          
          {/* Header & Timer */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {questions[currentIndex]?.subject_name} • Question {currentIndex + 1} of {questions.length}
              </span>
              <span className={`ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                questions[currentIndex]?.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700' :
                questions[currentIndex]?.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {questions[currentIndex]?.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {questions[currentIndex]?.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const optionText = questions[currentIndex][`option_${opt.toLowerCase()}`];
              const isSelected = userAnswers[questions[currentIndex].id] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium flex items-center gap-3 transition-all ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {opt}
                  </span>
                  <span>{optionText}</span>
                </button>
              );
            })}
          </div>

          {/* Progress dots & Navigation */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex gap-1.5">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                    currentIndex === idx 
                      ? 'bg-indigo-600 text-white' 
                      : (userAnswers[q.id] ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-400')
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {loading ? 'Evaluating...' : 'Submit Assessment'}
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 3. Post-Quiz Result Diagnostic Screen */}
      {quizState === 'finished' && result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-3xl mx-auto space-y-6">
          
          <div className="text-center space-y-2 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/20">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Assessment Completed!
            </h2>
            <p className="text-xs text-slate-500">
              Your topic mastery and adaptive difficulty have been dynamically updated in the database.
            </p>

            <div className="flex items-center justify-center gap-6 pt-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                <span className="text-3xl font-extrabold text-indigo-600">{result.score_percentage}%</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
                <span className="text-2xl font-extrabold text-slate-800">{result.correct_answers} / {result.total_questions}</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">XP Earned</span>
                <span className="text-2xl font-extrabold text-amber-500">+{result.xp_earned} XP</span>
              </div>
            </div>
          </div>

          {/* Adaptive Engine Feedback */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-900">Adaptive Engine Diagnostics</span>
            </div>
            <p className="text-xs text-indigo-950 font-medium">{result.feedback}</p>
          </div>

          {/* Strong vs Weak Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                ✓ Strong Areas
              </span>
              {result.strong_areas?.length > 0 ? (
                result.strong_areas.map((sa, idx) => (
                  <div key={idx} className="text-xs font-semibold text-emerald-950 flex items-center justify-between">
                    <span>{sa.topic_name}</span>
                    <span>{sa.mastery}%</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Focus needed on foundational concepts</p>
              )}
            </div>

            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block mb-2">
                ⚠ Needs Improvement
              </span>
              {result.weak_areas?.length > 0 ? (
                result.weak_areas.map((wa, idx) => (
                  <div key={idx} className="text-xs font-semibold text-rose-950 flex items-center justify-between">
                    <span>{wa.topic_name}</span>
                    <span className="text-rose-600">{wa.mastery}%</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Great work! No critical gaps detected</p>
              )}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detailed Question Analysis & Explanations
            </h3>
            {result.detailed_results?.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  item.is_correct ? 'bg-emerald-50/30 border-emerald-200' : 'bg-rose-50/30 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900">Q{idx + 1}. {item.question_text}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    item.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.is_correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Your Answer: <strong className={item.is_correct ? 'text-emerald-700' : 'text-rose-700'}>{item.selected_option || 'None'}</strong> | Correct: <strong className="text-emerald-700">{item.correct_option}</strong>
                </div>
                <p className="text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-100">
                  💡 <strong>Explanation:</strong> {item.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Next Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('ai-tutor')}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Bot className="w-4 h-4" />
              Ask AI Tutor About Mistakes
            </button>
            <button
              onClick={() => { setQuizState('idle'); }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Take Another Assessment
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

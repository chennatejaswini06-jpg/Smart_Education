import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Sparkles, Clock, CheckCircle2, AlertTriangle, 
  BookOpen, ArrowRight, Brain, Zap
} from 'lucide-react';
import { api } from '../api';

export default function SmartRevisionPage({ user, onNavigate }) {
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchQueue = async () => {
    try {
      const data = await api.getRevisionQueue();
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleCompleteRevision = async (topicId) => {
    try {
      const res = await api.completeRevision(topicId);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchQueue();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const flashcards = [
    {
      topic: "Recursion",
      question: "What is the consequence of omitting a base case in a recursive function?",
      answer: "The call stack continuously allocates stack frames for each call without unwinding, leading to a fatal StackOverflowError when system memory limit is exceeded."
    },
    {
      topic: "Binary Search",
      question: "Why should midpoint be computed with `low + (high - low) / 2` instead of `(low + high) / 2`?",
      answer: "In languages with fixed 32-bit signed integers (like Java or C++), `low + high` can exceed 2,147,483,647, wrapping around to a negative number and throwing an IndexOutOfBoundsException."
    },
    {
      topic: "SQL Joins",
      question: "What is the operational difference between INNER JOIN and LEFT JOIN?",
      answer: "INNER JOIN outputs only matching rows where join predicates equate. LEFT JOIN retains ALL rows from the left table, filling non-matching right columns with NULL."
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
              Spaced Repetition Algorithm
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Smart Spaced-Repetition Revision
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Combines forgetting curve retention decay with quiz mistakes to calculate optimal review intervals.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-200">
          <Brain className="w-5 h-5 text-indigo-600" />
          <div className="text-left">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Scheduled Reviews</div>
            <div className="text-xs font-bold text-indigo-950">
              {queue?.total_to_revise || 4} Topics Queue
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Interactive 5-Min Flashcard Widget */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-950/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Interactive Active Recall Flashcard #{flashcardIndex + 1}</span>
          </div>
          <span className="text-[11px] font-bold bg-white/10 px-2.5 py-0.5 rounded-full">
            {flashcards[flashcardIndex].topic}
          </span>
        </div>

        <div className="py-4">
          <p className="text-sm sm:text-base font-bold text-indigo-50">
            "{flashcards[flashcardIndex].question}"
          </p>

          {showAnswer ? (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs text-indigo-100 animate-fade-in leading-relaxed">
              💡 <strong>Recall Answer:</strong> {flashcards[flashcardIndex].answer}
            </div>
          ) : (
            <button
              onClick={() => setShowAnswer(true)}
              className="mt-4 px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-all"
            >
              Reveal Correct Answer
            </button>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/10">
          <button
            onClick={() => {
              setShowAnswer(false);
              setFlashcardIndex((flashcardIndex + 1) % flashcards.length);
            }}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
          >
            Next Concept Flashcard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Overdue For Revision Cards */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Overdue for Revision</h3>
            <p className="text-xs text-slate-500">Low retention threshold (&lt;60%) detected by engine</p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
            High Priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {queue?.overdue?.map((item) => (
            <div
              key={item.topic_id}
              className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase">
                    Retention: {item.estimated_retention}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.subject_name}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.topic_name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mastery: <strong>{item.mastery_score}%</strong> • Last studied: recently
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleCompleteRevision(item.topic_id)}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Reviewed (+5%)
                </button>
                <button
                  onClick={() => onNavigate('ai-tutor')}
                  className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 rounded-xl"
                  title="Ask AI Tutor"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

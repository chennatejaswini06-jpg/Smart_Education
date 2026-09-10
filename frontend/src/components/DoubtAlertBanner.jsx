import React from 'react';
import { AlertTriangle, BookOpen, Bot, Sparkles, ArrowRight } from 'lucide-react';

export default function DoubtAlertBanner({ alert, onLearn, onAskAI, onPractice }) {
  if (!alert) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Early Doubt Detection
              </span>
              <span className="text-xs text-slate-500">
                AI Intervention Triggered
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              💡 We noticed you may be struggling with <span className="text-rose-600">{alert.topic_name || "Recursion & Backtracking"}</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Based on {alert.mistake_count || 3} recent errors and low mastery (48%), our adaptive engine identified a concept barrier in call stack unwinding.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onLearn(alert)}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            Learn Concept
          </button>
          <button
            onClick={() => onAskAI(alert)}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            Ask AI Tutor
          </button>
          <button
            onClick={() => onPractice(alert)}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Practice Easy
          </button>
        </div>

      </div>
    </div>
  );
}

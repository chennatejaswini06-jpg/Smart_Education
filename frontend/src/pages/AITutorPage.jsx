import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, BookOpen, Lightbulb, Code2, 
  HelpCircle, ListOrdered, FileText, Trash2, Cpu
} from 'lucide-react';
import { api } from '../api';

export default function AITutorPage({ user }) {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [topicContext, setTopicContext] = useState('DSA');
  const [loading, setLoading] = useState(false);
  const [academicLevel, setAcademicLevel] = useState(user?.academic_level || 'Intermediate');
  const chatEndRef = useRef(null);

  const topicsList = [
    'DSA', 'Recursion', 'Binary Search', 'Java', 'Polymorphism', 
    'SQL Joins', 'SQL Injection', 'Pointers', 'Linked Lists', 'Web Dev'
  ];

  const actionChips = [
    { label: '💡 Explain Simply', action: 'explain' },
    { label: '💻 Give Example', action: 'example' },
    { label: '🧩 Give Analogy', action: 'analogy' },
    { label: '📝 Practice Question', action: 'practice' },
    { label: '🪜 Step-by-Step', action: 'step_by_step' },
    { label: '📋 Summarize', action: 'summarize' }
  ];

  const fetchHistory = async () => {
    try {
      const history = await api.getAIHistory();
      if (history.length) {
        setMessages(history.map(h => [
          { role: 'user', content: h.prompt, action: h.action_type, context: h.topic_context },
          { role: 'assistant', content: h.response, action: h.action_type }
        ]).flat());
      } else {
        // Initial friendly greeting
        setMessages([
          {
            role: 'assistant',
            content: `Hello ${user?.name || 'Student'}! 👋 I am your EduSmart Personal AI Tutor.\n\nI adapt explanations directly to your **${academicLevel}** level. You can ask me questions such as:\n- *"What is polymorphism in Java?"*\n- *"Explain binary search in simple terms."*\n- *"What is SQL injection?"*\n- *"Give me an example of recursion."*\n\nClick any helper chip below or type your question!`,
            action: 'explain'
          }
        ]);
      }
    } catch (err) {
      console.error("History error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customPrompt = null, customAction = 'explain') => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', content: textToSend, action: customAction, context: topicContext };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await api.askAITutor({
        prompt: textToSend,
        action_type: customAction,
        topic_context: topicContext
      });
      const aiMsg = { role: 'assistant', content: res.response, action: customAction };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error connecting to AI Tutor: ${err.message}. Please check your connection.`,
        action: 'error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Clear chat conversation history?")) {
      await api.clearAIHistory();
      fetchHistory();
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden animate-fade-in">
      
      {/* Header */}
      <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">EduSmart AI Personal Tutor</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Online & Adapting
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Adapting responses for: <span className="font-bold text-indigo-600">{academicLevel}</span>
            </p>
          </div>
        </div>

        {/* Controls: Context Selector & Clear */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-slate-400 text-[11px]">Topic:</span>
            <select
              value={topicContext}
              onChange={(e) => setTopicContext(e.target.value)}
              className="bg-transparent font-bold text-indigo-600 outline-none cursor-pointer"
            >
              {topicsList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Clear Conversation History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
              m.role === 'user'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-tr-xs shadow-md shadow-indigo-600/10'
                : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs whitespace-pre-wrap'
            }`}>
              {m.role === 'user' && m.action && m.action !== 'explain' && (
                <div className="text-[10px] uppercase font-bold text-indigo-200 mb-1">
                  Mode: {m.action.replace('_', ' ')}
                </div>
              )}
              <div>{m.content}</div>
            </div>

            {m.role === 'user' && (
              <img
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=DemoStudent"}
                alt="Me"
                className="w-8 h-8 rounded-xl border border-slate-200 shrink-0 mt-1"
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>EduSmart AI is crafting a personalized explanation...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Action Helper Chips */}
      <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider shrink-0 mr-1">
          Quick Modes:
        </span>
        {actionChips.map((chip) => (
          <button
            key={chip.action}
            onClick={() => handleSend(prompt || `Explain ${topicContext}`, chip.action)}
            className="px-3 py-1 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 rounded-full text-xs font-semibold whitespace-nowrap shadow-2xs transition-all"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Ask about ${topicContext}, recursion errors, code examples...`}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-600 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>

    </div>
  );
}

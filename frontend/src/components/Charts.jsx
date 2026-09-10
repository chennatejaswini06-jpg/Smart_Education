import React from 'react';

// 1. Weekly Study Hours Bar Chart
export function WeeklyStudyBarChart({ data = [] }) {
  if (!data.length) return <div className="text-xs text-slate-400 py-6 text-center">No data recorded</div>;

  const maxHours = Math.max(...data.map(d => d.hours || 0), 4);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 h-44 pt-6 pb-2 px-2">
        {data.map((item, idx) => {
          const heightPct = Math.round(((item.hours || 0) / maxHours) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
              <div className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.hours}h
              </div>
              <div className="w-full bg-slate-100 rounded-t-lg h-32 flex items-end overflow-hidden p-0.5">
                <div 
                  className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-md transition-all duration-500 group-hover:from-indigo-500 group-hover:to-violet-400 shadow-sm"
                  style={{ height: `${Math.max(8, heightPct)}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                {days[idx % 7]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-2 border-t border-slate-100">
        <span>0 hrs</span>
        <span className="font-semibold text-slate-600">Peak: {maxHours} hrs</span>
      </div>
    </div>
  );
}

// 2. Quiz Score Progression Line Chart
export function QuizScoreLineChart({ attempts = [] }) {
  if (!attempts.length) return <div className="text-xs text-slate-400 py-6 text-center">No quiz history available</div>;

  const width = 500;
  const height = 160;
  const padding = 25;

  const points = attempts.map((att, idx) => {
    const x = padding + (idx / Math.max(1, attempts.length - 1)) * (width - padding * 2);
    const y = height - padding - ((att.score_percentage || 0) / 100) * (height - padding * 2);
    return { x, y, score: att.score_percentage, code: att.subject_code || 'Quiz' };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeDasharray="3 3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#f1f5f9" strokeDasharray="3 3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" />

        {/* Path line */}
        <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle cx={p.x} cy={p.y} r="5" fill="#4f46e5" className="stroke-2 stroke-white group-hover:r-7 transition-all" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4338ca">
              {p.score}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// 3. Horizontal Subject Mastery Bars
export function SubjectMasteryBars({ subjects = [] }) {
  return (
    <div className="space-y-3">
      {subjects.map((s, idx) => {
        const score = s.avg_score || s.mastery_pct || 50;
        const colorClass = score >= 80 ? 'bg-emerald-500' : (score >= 60 ? 'bg-indigo-500' : 'bg-rose-500');
        const badgeColor = score >= 80 ? 'bg-emerald-50 text-emerald-700' : (score >= 60 ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700');
        return (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{s.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {score >= 80 ? 'Mastered' : (score >= 60 ? 'Moderate' : 'Needs Practice')}
                </span>
                <span className="font-bold text-slate-800">{score}%</span>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 4. Job Readiness Radial Gauge
export function ReadinessGauge({ score = 74 }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg className="w-36 h-36 transform -rotate-90">
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="#f1f5f9"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="url(#gauge-grad)"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold text-slate-900">{score}%</span>
        <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Job Ready</span>
      </div>
    </div>
  );
}

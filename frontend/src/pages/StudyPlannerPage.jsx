import React, { useState, useEffect } from 'react';
import { 
  Calendar, Sparkles, CheckCircle2, Clock, Plus, Trash2, 
  Target, ArrowRight, BookOpen, AlertTriangle
} from 'lucide-react';
import { api } from '../api';

export default function StudyPlannerPage({ user }) {
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject_name: 'Data Structures & Algorithms',
    day_of_week: 'Monday',
    duration_minutes: 30
  });

  const fetchPlan = async () => {
    try {
      const data = await api.getStudyPlan();
      setPlan(data.plan);
      setTasks(data.tasks);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleToggleTask = async (task) => {
    try {
      await api.updateTask(task.id, { is_completed: !task.is_completed });
      fetchPlan();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      fetchPlan();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      await api.generateStudyPlan({
        target_date: plan?.target_exam_date || '2026-11-15',
        daily_hours: 3.0,
        priority: 'High'
      });
      fetchPlan();
    } catch (err) {
      alert("Error generating schedule: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await api.addTask(newTask);
      setShowAddModal(false);
      setNewTask({ title: '', subject_name: 'Data Structures & Algorithms', day_of_week: 'Monday', duration_minutes: 30 });
      fetchPlan();
    } catch (err) {
      alert(err.message);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
              Smart Calendar Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Target Date: {plan?.target_exam_date || '2026-11-15'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            {plan?.title || 'Semester & Placement Mastery Schedule'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            AI dynamically prioritizes topics with lowest mastery scores earlier in your week.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
          <button
            onClick={handleGeneratePlan}
            disabled={generating}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Re-optimizing Plan...' : 'Generate AI Study Plan'}
          </button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center font-extrabold text-indigo-600 text-sm">
            {stats.completion_percentage || 0}%
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Weekly Goal Progress</h4>
            <p className="text-[11px] text-slate-500">
              {stats.completed_tasks || 0} of {stats.total_tasks || 0} tasks completed
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${stats.completion_percentage || 0}%` }}
          />
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => {
          const dayTasks = tasks.filter(t => t.day_of_week === day);
          return (
            <div 
              key={day} 
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    {day}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {dayTasks.length} tasks
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  {dayTasks.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic py-4 text-center">
                      Rest or optional self-study
                    </div>
                  ) : (
                    dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          task.is_completed 
                            ? 'bg-slate-50 border-slate-200 opacity-60' 
                            : 'bg-indigo-50/20 border-slate-200/80 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => handleToggleTask(task)}
                              className={`w-4 h-4 rounded-md mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${
                                task.is_completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                              }`}
                            >
                              {task.is_completed && <CheckCircle2 className="w-3 h-3" />}
                            </button>
                            <div>
                              <h5 className={`text-xs font-bold text-slate-900 ${task.is_completed ? 'line-through text-slate-400' : ''}`}>
                                {task.title}
                              </h5>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {task.subject_name} • {task.duration_minutes} min
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 font-medium">
                {dayTasks.reduce((acc, t) => acc + (t.duration_minutes || 0), 0)} mins scheduled
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl animate-fade-in space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Study Task</h3>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Recursion Base Cases"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Subject</label>
                <input
                  type="text"
                  value={newTask.subject_name}
                  onChange={(e) => setNewTask({...newTask, subject_name: e.target.value})}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Day of Week</label>
                  <select
                    value={newTask.day_of_week}
                    onChange={(e) => setNewTask({...newTask, day_of_week: e.target.value})}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Duration (mins)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={newTask.duration_minutes}
                    onChange={(e) => setNewTask({...newTask, duration_minutes: parseInt(e.target.value)})}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { User, Mail, Building, BookOpen, Target, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

export default function ProfilePage({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    course: '',
    year: '',
    learning_goal: '',
    daily_study_hours: 3.0,
    preferred_learning_style: ''
  });

  useEffect(() => {
    api.getProfile().then(res => {
      setProfileData(res);
      const u = res.user || {};
      const p = res.profile || {};
      setFormData({
        name: u.name || '',
        college: p.college || '',
        course: p.course || '',
        year: p.year || '',
        learning_goal: p.learning_goal || '',
        daily_study_hours: p.daily_study_hours || 3.0,
        preferred_learning_style: p.preferred_learning_style || 'Hands-on / Practical'
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto animate-fade-in">
      
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex items-center gap-5">
        <img
          src={profileData?.user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=DemoStudent"}
          alt="Avatar"
          className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200"
        />
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">{profileData?.user?.name || "Demo Student"}</h1>
          <p className="text-xs text-slate-500">{profileData?.user?.email || "demo@edusmart.ai"}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Level {profileData?.profile?.level || 4} Scholar
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {profileData?.profile?.streak_days || 7} Day Streak
            </span>
          </div>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleUpdate} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Student Information & Academic Target
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Student Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">College / University</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({...formData, college: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Course / Major</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({...formData, course: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Academic Year</label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Target Career Goal</label>
            <input
              type="text"
              value={formData.learning_goal}
              onChange={(e) => setFormData({...formData, learning_goal: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Daily Study Hours</label>
            <input
              type="number"
              step="0.5"
              value={formData.daily_study_hours}
              onChange={(e) => setFormData({...formData, daily_study_hours: parseFloat(e.target.value)})}
              className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

    </div>
  );
}

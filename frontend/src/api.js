// Centralized API Client for EduSmart AI
const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('edusmart_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Network request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),

  // Dashboard & Notifications
  getDashboard: () => request('/dashboard'),
  getNotifications: () => request('/dashboard/notifications'),

  // Subjects & Topics
  getSubjects: () => request('/subjects'),
  getTopics: (subjectId) => request(`/topics${subjectId ? `?subject_id=${subjectId}` : ''}`),
  getTopicMaterial: (topicId) => request(`/topics/${topicId}/material`),

  // Adaptive Quiz
  getQuizQuestions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/quiz/questions${qs ? `?${qs}` : ''}`);
  },
  submitQuiz: (payload) => request('/quiz/submit', { method: 'POST', body: JSON.stringify(payload) }),
  getQuizHistory: () => request('/quiz/history'),

  // Smart Study Planner
  getStudyPlan: () => request('/study-plan'),
  generateStudyPlan: (payload) => request('/study-plan/generate', { method: 'POST', body: JSON.stringify(payload) }),
  addTask: (task) => request('/study-plan/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (taskId, updates) => request(`/study-plan/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteTask: (taskId) => request(`/study-plan/tasks/${taskId}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: () => request('/analytics'),
  getProgress: () => request('/analytics/progress'),

  // Skill Gap Analyzer
  getRoles: () => request('/skill-gap/roles'),
  getSkillGap: (role) => request(`/skill-gap?role=${encodeURIComponent(role)}`),

  // Smart Revision
  getRevisionQueue: () => request('/revision'),
  completeRevision: (topicId) => request('/revision/complete', { method: 'POST', body: JSON.stringify({ topic_id: topicId }) }),

  // AI Tutor
  askAITutor: (payload) => request('/ai/chat', { method: 'POST', body: JSON.stringify(payload) }),
  getAIHistory: () => request('/ai/history'),
  clearAIHistory: () => request('/ai/history', { method: 'DELETE' }),

  // Profile & Onboarding
  getProfile: () => request('/profile'),
  updateProfile: (profile) => request('/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  submitOnboarding: (payload) => request('/onboarding', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin
  getAdminAnalytics: () => request('/admin/analytics'),
  getAdminStudents: () => request('/admin/students'),
  addAdminQuestion: (question) => request('/admin/questions', { method: 'POST', body: JSON.stringify(question) }),
};

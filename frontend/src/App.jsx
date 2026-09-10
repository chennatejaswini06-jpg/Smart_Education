import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OnboardingModal from './components/OnboardingModal';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AITutorPage from './pages/AITutorPage';
import AdaptiveQuizPage from './pages/AdaptiveQuizPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import LearningAnalyticsPage from './pages/LearningAnalyticsPage';
import SkillGapPage from './pages/SkillGapPage';
import SmartRevisionPage from './pages/SmartRevisionPage';
import StudyMaterialPage from './pages/StudyMaterialPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ImpactPage from './pages/ImpactPage';

import { api } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // landing, login, register, dashboard, etc.
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize session
  useEffect(() => {
    const savedToken = localStorage.getItem('edusmart_token');
    const savedUser = localStorage.getItem('edusmart_user');
    if (savedToken && savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setCurrentView('dashboard');
      } catch (e) {
        localStorage.removeItem('edusmart_token');
      }
    }
  }, []);

  // Fetch notifications once logged in
  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then(data => setNotifications(data))
        .catch(console.error);
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView(userData.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setShowOnboarding(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('edusmart_token');
    localStorage.removeItem('edusmart_user');
    setUser(null);
    setCurrentView('landing');
  };

  // 1. Landing View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setCurrentView('login')}
        onLogin={() => setCurrentView('login')}
        onRegister={() => setCurrentView('register')}
      />
    );
  }

  // 2. Auth Views
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoToLanding={() => setCurrentView('landing')}
        onGoToRegister={() => setCurrentView('register')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterPage
        onRegisterSuccess={handleRegisterSuccess}
        onGoToLogin={() => setCurrentView('login')}
        onGoToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // 3. Authenticated App Layout (Dashboard, AI Tutor, Quiz, etc.)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
        notifications={notifications}
      />

      <div className="flex flex-1">
        
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && (
            <DashboardPage user={user} onNavigate={setCurrentView} />
          )}

          {currentView === 'ai-tutor' && (
            <AITutorPage user={user} />
          )}

          {currentView === 'quiz' && (
            <AdaptiveQuizPage user={user} onNavigate={setCurrentView} />
          )}

          {currentView === 'study-planner' && (
            <StudyPlannerPage user={user} />
          )}

          {currentView === 'analytics' && (
            <LearningAnalyticsPage user={user} onNavigate={setCurrentView} />
          )}

          {currentView === 'skill-gap' && (
            <SkillGapPage user={user} onNavigate={setCurrentView} />
          )}

          {currentView === 'revision' && (
            <SmartRevisionPage user={user} onNavigate={setCurrentView} />
          )}

          {currentView === 'study-material' && (
            <StudyMaterialPage user={user} onNavigate={setCurrentView} />
          )}

          {currentView === 'achievements' && (
            <AchievementsPage user={user} onNavigate={setCurrentView} />
          )}

          {currentView === 'profile' && (
            <ProfilePage user={user} />
          )}

          {currentView === 'admin' && (
            <AdminDashboardPage user={user} />
          )}

          {currentView === 'impact' && (
            <ImpactPage onNavigate={setCurrentView} />
          )}
        </main>
      </div>

      {/* Onboarding Wizard Modal for new registrations */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          setShowOnboarding(false);
          setCurrentView('dashboard');
        }}
      />

    </div>
  );
}


import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import InterviewCoach from './components/InterviewCoach';
import CompanyResearch from './components/CompanyResearch';
import Pricing from './components/Pricing';
import { View, UserTier, UserProfile } from './types';

const Hero: React.FC<{ onStart: (view: View) => void, userTier: UserTier }> = ({ onStart, userTier }) => (
  <div className="text-center py-20 animate-in fade-in zoom-in duration-1000">
    <div className="inline-block px-4 py-1.5 mb-8 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-bold tracking-wide uppercase">
      The Future of Hiring is Here
    </div>
    <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
      Land Your Next <br />
      <span className="gradient-text">Dream Role</span>
    </h1>
    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
      A comprehensive career catalyst suite powered by Gemini AI. Optimize your resume, master mock interviews, and research companies with real-time grounding.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <button 
        onClick={() => onStart(View.RESUME)}
        className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg shadow-2xl shadow-indigo-600/30 transition-all hover:-translate-y-1"
      >
        Optimize Resume
      </button>
      {userTier === UserTier.FREE && (
        <button 
          onClick={() => onStart(View.PRICING)}
          className="w-full sm:w-auto px-10 py-4 glass border border-amber-500/30 text-amber-400 rounded-full font-bold text-lg hover:bg-amber-500/5 transition-all"
        >
          View Pro Plans
        </button>
      )}
      <button 
        onClick={() => onStart(View.INTERVIEW)}
        className="w-full sm:w-auto px-10 py-4 glass border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/5 transition-all"
      >
        Practice Interviews
      </button>
    </div>

    <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { title: 'Resume Matching', desc: 'Enterprise-grade ATS simulation using Gemini 3 Pro.', icon: '📄' },
        { title: 'Live Coaching', desc: 'Real-time voice feedback with native audio models.', icon: '🎙️' },
        { title: 'Smart Research', desc: 'Grounded web search for the latest company news.', icon: '🔍' }
      ].map((feature, i) => (
        <div key={i} className="glass p-8 rounded-3xl border border-white/10 text-left hover:border-indigo-500/50 transition-all cursor-default group">
          <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
          <h3 className="text-xl font-bold mb-3 text-slate-100">{feature.title}</h3>
          <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    tier: UserTier.FREE,
    credits: 3,
    sessionsUsed: 0
  });

  // Load user profile from local storage for persistence
  useEffect(() => {
    const saved = localStorage.getItem('hirevue_user_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, []);

  const handleUpgrade = (tier: UserTier) => {
    // Simulate payment process
    const newProfile = { ...userProfile, tier };
    setUserProfile(newProfile);
    localStorage.setItem('hirevue_user_profile', JSON.stringify(newProfile));
    setCurrentView(View.HOME);
    alert(`Successfully upgraded to ${tier}! Welcome to the future of hiring.`);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.RESUME:
        return <ResumeAnalyzer userTier={userProfile.tier} />;
      case View.INTERVIEW:
        return <InterviewCoach />;
      case View.RESEARCH:
        return <CompanyResearch />;
      case View.PRICING:
        return <Pricing currentTier={userProfile.tier} onUpgrade={handleUpgrade} />;
      default:
        return <Hero onStart={setCurrentView} userTier={userProfile.tier} />;
    }
  };

  return (
    <Layout activeView={currentView} onNavigate={setCurrentView} userTier={userProfile.tier}>
      {renderContent()}
    </Layout>
  );
};

export default App;

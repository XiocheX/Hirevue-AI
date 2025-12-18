
import React from 'react';
import { View, UserTier } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onNavigate: (view: View) => void;
  userTier: UserTier;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, userTier }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate(View.HOME)}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">H</div>
          <span className="text-xl font-bold tracking-tight">Hire<span className="text-indigo-500">Vue</span> AI</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          {[
            { label: 'Resume Optimizer', view: View.RESUME },
            { label: 'Interview Coach', view: View.INTERVIEW },
            { label: 'Company Research', view: View.RESEARCH },
            { label: 'Pricing', view: View.PRICING }
          ].map(item => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                activeView === item.view ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
            userTier === UserTier.PRO ? 'border-amber-500/50 text-amber-500 bg-amber-500/10' : 'border-slate-500/50 text-slate-400 bg-slate-500/10'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {userTier} Plan
          </div>
          <button 
            onClick={() => onNavigate(userTier === UserTier.PRO ? View.INTERVIEW : View.PRICING)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap"
          >
            {userTier === UserTier.PRO ? 'Dashboard' : 'Go Pro'}
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-white/5 py-12 mt-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">H</div>
              <span className="font-bold">HireVue AI</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Empowering developers with enterprise-grade AI tools to land their dream jobs. Fast, intelligent, and portfolio-ready.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-300">Features</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="cursor-pointer hover:text-indigo-400" onClick={() => onNavigate(View.RESUME)}>AI Resume Analysis</li>
              <li className="cursor-pointer hover:text-indigo-400" onClick={() => onNavigate(View.INTERVIEW)}>Real-time Mock Interviews</li>
              <li className="cursor-pointer hover:text-indigo-400" onClick={() => onNavigate(View.RESEARCH)}>Grounded Market Insights</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-300">Support</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="cursor-pointer hover:text-indigo-400" onClick={() => onNavigate(View.PRICING)}>Pricing Plans</li>
              <li>Contact Us</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-slate-600 text-xs mt-12">
          &copy; {new Date().getFullYear()} HireVue AI. Built for Developers.
        </div>
      </footer>
    </div>
  );
};

export default Layout;

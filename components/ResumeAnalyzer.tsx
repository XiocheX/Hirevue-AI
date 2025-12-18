
import React, { useState } from 'react';
import { analyzeResume } from '../services/geminiService';
import { AnalysisResult, UserTier } from '../types';

interface ResumeAnalyzerProps {
  userTier: UserTier;
}

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ userTier }) => {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!resume || !jobDesc) return;
    setLoading(true);
    try {
      const data = await analyzeResume(resume, jobDesc, userTier);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Resume <span className="gradient-text">Optimizer</span></h2>
        <div className="flex items-center justify-center gap-3">
          <p className="text-slate-400">Match your skills with precision and beat the ATS filters.</p>
          <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            userTier === UserTier.PRO ? 'border-amber-500/50 text-amber-500' : 'border-slate-500/50 text-slate-500'
          }`}>
            USING: {userTier === UserTier.PRO ? 'GEMINI 3 PRO' : 'GEMINI 3 FLASH'}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">Paste your Resume</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full h-64 bg-slate-900 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
            placeholder="Experience, education, skills..."
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">Job Description</label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full h-64 bg-slate-900 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
            placeholder="Paste the target job post here..."
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleAnalyze}
          disabled={loading || !resume || !jobDesc}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Profile...
            </>
          ) : 'Analyze Match'}
        </button>
        {userTier === UserTier.FREE && (
          <p className="text-xs text-slate-500 italic">Upgrade to Pro for higher accuracy with Gemini 3 Pro.</p>
        )}
      </div>

      {result && (
        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="text-center md:text-left">
              <h3 className="text-4xl font-black text-indigo-400 mb-1">{result.score}%</h3>
              <p className="text-slate-400 uppercase tracking-widest text-xs font-bold">Match Score</p>
            </div>
            <div className="flex-1 text-slate-300 text-sm italic">
              "{result.suggestions}"
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Key Strengths
              </h4>
              <ul className="space-y-3">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
              <h4 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Areas for Growth
              </h4>
              <ul className="space-y-3">
                {result.improvements.map((im, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span> {im}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;

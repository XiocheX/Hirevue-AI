
import React, { useState } from 'react';
import { researchCompany } from '../services/geminiService';
import { ResearchResult } from '../types';

const CompanyResearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await researchCompany(query);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Search failed. Ensure you have the Search Grounding tool configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Grounded <span className="gradient-text">Company Research</span></h2>
        <p className="text-slate-400">Get the latest insights, news, and interview intel powered by Google Search.</p>
      </div>

      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter company name (e.g. Google, Airbnb, Stripe)..."
          className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 pr-32 text-lg focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all shadow-xl"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query}
          className="absolute right-3 top-3 bottom-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 rounded-xl font-bold transition-all flex items-center gap-2"
        >
          {loading ? 'Searching...' : 'Deep Dive'}
        </button>
      </div>

      {result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
          <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Intelligence Summary
            </h3>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
              {result.summary.split('\n').map((line, i) => (
                <p key={i} className="mb-4">{line}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Grounding Sources</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {result.sources.length > 0 ? result.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-indigo-500/50 transition-all"
                >
                  <span className="text-sm text-slate-300 font-medium truncate pr-4">{source.title}</span>
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              )) : (
                <p className="text-slate-500 text-sm italic">No sources cited.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyResearch;

import React from 'react';
import { useGame } from '../context/GameContext';
import { CONTENT_ITEMS } from '../data/content';
import { Layers, ArrowRight, ShieldCheck, Zap, Compass, CheckCircle } from 'lucide-react';

export const FeedComparisonView: React.FC = () => {
  const { history, setStage, selectedCharacter } = useGame();

  const engagementPosts = history.filter(h => h.mode === 'engagement');
  const balancedPosts = history.filter(h => h.mode === 'balanced');

  const getItem = (id: string) => CONTENT_ITEMS.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Layers size={16} />
            <span>Feed Outcome Comparison</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Engagement-Driven vs. Balanced Feed
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Compare what {selectedCharacter.name}'s feed looked like under pure engagement ranking vs. multi-objective balanced ranking.
          </p>
        </div>

        {/* Side-by-side Feed Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engagement Feed Column */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-cyan-400" />
                <h3 className="font-bold text-base text-slate-100">Engagement-Focused Feed</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Phase 1
              </span>
            </div>

            <p className="text-xs text-slate-400">
              High predicted watch-time • Topic repetition • Information bubble effect
            </p>

            <div className="space-y-2">
              {engagementPosts.map((h, idx) => {
                const item = getItem(h.contentId);
                if (!item) return null;
                return (
                  <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-200 block">{item.title}</span>
                      <span className="text-[11px] text-cyan-400 font-medium">{item.category} • {item.subcategory}</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-bold shrink-0">{h.engagementPercent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Balanced Feed Column */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-emerald-400" />
                <h3 className="font-bold text-base text-slate-100">Balanced Feed</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Phase 2
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Broader topic range • High credibility • Novelty & serendipity preserved
            </p>

            <div className="space-y-2">
              {balancedPosts.map((h, idx) => {
                const item = getItem(h.contentId);
                if (!item) return null;
                return (
                  <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-200 block">{item.title}</span>
                      <span className="text-[11px] text-emerald-400 font-medium">{item.category} • {item.subcategory}</span>
                    </div>
                    <span className="font-mono text-emerald-300 font-bold shrink-0">{h.engagementPercent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Takeaway Callout */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
          <CheckCircle size={20} className="text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-slate-100 font-bold mb-0.5">Core Educational Insight</strong>
            The algorithm is not inherently "good" or "bad"—it reflects whatever objective it is programmed to optimize for!
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setStage('reflection')}
          className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-base rounded-xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <span>Proceed to Final Reflection</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

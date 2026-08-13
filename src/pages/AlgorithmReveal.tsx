import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, PieChart, ShieldAlert, CheckCircle2, ArrowRight, RefreshCw, HelpCircle, Cpu, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AlgorithmReveal: React.FC = () => {
  const { selectedCharacter, history, setStage } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);

  // Calculate feed category breakdown
  const totalRounds = history.length;
  const categoryCounts: { [cat: string]: number } = {};
  history.forEach(h => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  const dominantCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  const dominantPercent = dominantCategory ? Math.round((dominantCategory[1] / totalRounds) * 100) : 0;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-[#07070b] anime-grid-bg text-white p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-3xl w-full glass-panel border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.2)] space-y-8 font-mono hud-corner-box">
        
        {/* Header Reveal Announcement */}
        <div className="text-center space-y-3 font-mono">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07070b] border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold uppercase tracking-widest">
            <Sparkles size={16} className="text-[#FF0055] animate-pulse" />
            <span>[ SYSTEM MILESTONE: REVEAL ]</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            You Were The <span className="bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] to-[#FF0055] bg-clip-text text-transparent">Recommendation Engine.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-sans leading-relaxed">
            By optimizing purely for predicted engagement, you constructed an automated feedback loop that shaped {selectedCharacter.name}'s digital perception.
          </p>
        </div>

        {/* The Feedback Loop Diagram */}
        <div className="bg-[#07070b] p-6 rounded-2xl border border-white/10 space-y-4 font-mono">
          <h3 className="text-center font-bold text-xs text-[#00F0FF] uppercase tracking-widest">
            // ALGORITHMIC FEEDBACK LOOP GRAPH
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs font-mono">
            <span className="bg-[#0d0e15] border border-white/10 px-3 py-2 rounded-xl text-[#00F0FF]">
              Choice
            </span>
            <span className="text-slate-600">→</span>
            <span className="bg-[#0d0e15] border border-white/10 px-3 py-2 rounded-xl text-[#FFE600]">
              Engagement Signal
            </span>
            <span className="text-slate-600">→</span>
            <span className="bg-[#0d0e15] border border-white/10 px-3 py-2 rounded-xl text-[#FF0055]">
              Weight Matrix Updates
            </span>
            <span className="text-slate-600">→</span>
            <span className="bg-[#0d0e15] border border-white/10 px-3 py-2 rounded-xl text-[#00FF9D]">
              Echo Chamber Concentration
            </span>
          </div>
        </div>

        {/* Filter Bubble Visual Comparison */}
        <div className="space-y-4 font-mono">
          <h3 className="font-bold text-base text-white flex items-center gap-2 font-display">
            <PieChart className="text-[#00F0FF]" size={20} />
            FEED COMPOSITION MATRIX (FILTER BUBBLE RESULT)
          </h3>

          <div className="space-y-2.5">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percent = Math.round((count / totalRounds) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>#{cat}</span>
                    <span className="font-mono text-[#00F0FF]">{percent}% ({count} posts)</span>
                  </div>
                  <div className="w-full bg-[#07070b] rounded-full h-3 overflow-hidden border border-white/10 p-0.5">
                    <div
                      className="bg-gradient-to-r from-[#00F0FF] to-[#FF0055] h-full rounded-full transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#FF0055]/10 border border-[#FF0055]/30 p-4 rounded-xl text-xs text-rose-200 flex items-start gap-3 font-sans">
            <ShieldAlert size={20} className="shrink-0 text-[#FF0055] mt-0.5" />
            <div>
              <strong className="block text-[#FF0055] font-mono font-bold mb-0.5 uppercase tracking-wider">// FILTER BUBBLE CONCENTRATION</strong>
              By maximizing watch time, the feed concentrated on {dominantCategory ? dominantCategory[0] : 'one topic'} ({dominantPercent}% of recommendations), systematically squeezing out diverse topics and alternative perspectives.
            </div>
          </div>
        </div>

        {/* Educational Reflection Quiz Question */}
        <div className="bg-[#07070b] p-6 rounded-2xl border border-white/10 space-y-4 font-mono">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <HelpCircle size={18} className="text-[#00F0FF]" />
            MIL CRITICAL REFLECTION
          </h3>
          <p className="text-xs text-slate-300 font-sans">
            You successfully maximized engagement. But did you construct a healthy, balanced media diet for {selectedCharacter.name}?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
            <button
              onClick={() => {
                setSelectedAnswer('A');
                triggerConfetti();
              }}
              className={`p-4 rounded-xl border text-left text-xs transition-all font-sans ${
                selectedAnswer === 'A'
                  ? 'bg-[#131520] border-[#00F0FF] text-white'
                  : 'bg-[#0d0e15] border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <strong className="block text-[#00F0FF] font-mono mb-1">// OPTION A</strong>
              Yes. The user is consuming content they enjoy and interact with most.
            </button>

            <button
              onClick={() => {
                setSelectedAnswer('B');
                triggerConfetti();
              }}
              className={`p-4 rounded-xl border text-left text-xs transition-all font-sans ${
                selectedAnswer === 'B'
                  ? 'bg-[#131520] border-[#00FF9D] text-white'
                  : 'bg-[#0d0e15] border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <strong className="block text-[#00FF9D] font-mono mb-1">// OPTION B (RECOMMENDED)</strong>
              No. Pure engagement creates echo chambers, locking out diversity, credibility, and serendipitous discovery.
            </button>
          </div>
        </div>

        {/* Next Challenge CTA */}
        <button
          onClick={() => setStage('balanced-challenge')}
          className="w-full py-4 bg-[#00FF9D] hover:bg-[#33ffaa] text-[#07070b] font-black text-sm font-mono rounded-xl shadow-[0_0_30px_rgba(0,255,157,0.3)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] uppercase tracking-wider"
        >
          <span>[ LEVEL 2: RE-ENGINEER A BALANCED ALGORITHM ]</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};


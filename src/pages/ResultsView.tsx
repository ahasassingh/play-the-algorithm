import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { Award, RefreshCw, Sparkles, CheckCircle2, Globe, Cpu } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const ResultsView: React.FC = () => {
  const { selectedCharacter, history, resetGame } = useGame();

  const totalInteractions = history.length;
  const avgEngagement = totalInteractions > 0
    ? Math.round(history.reduce((a, b) => a + b.engagementPercent, 0) / totalInteractions)
    : 85;

  const categories = history.map(h => h.category);
  const uniqueCats = new Set(categories).size;
  const diversityPercent = totalInteractions > 0 ? Math.round((uniqueCats / totalInteractions) * 100) : 34;

  const handlePlayAgain = () => {
    soundFx.play('swipe');
    resetGame();
  };

  return (
    <div className="min-h-screen bg-[#07070b] anime-grid-bg text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background glow halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl glass-panel border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] text-center space-y-6 relative z-10 font-mono hud-corner-box"
      >
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#07070b] border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono font-bold uppercase tracking-widest">
          <Award size={16} className="text-[#FF0055]" />
          <span>[ ALGORITHM ARCHETYPE REPORT ]</span>
        </div>

        {/* Dynamic Algorithm Archetype Card */}
        <div className="bg-[#07070b] rounded-2xl p-6 border border-white/10 space-y-4 font-mono">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            // FINAL SYSTEM DIAGNOSIS
          </span>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] to-[#FF0055] font-display">
            "ENGAGEMENT OPTIMIZER"
          </h2>

          {/* Archetype Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
            <div className="bg-[#0d0e15] p-3 rounded-xl border border-white/10">
              <span className="text-[9px] text-slate-400 font-mono">ENGAGEMENT</span>
              <div className="text-xl font-black text-[#00F0FF] mt-1">{avgEngagement}%</div>
            </div>
            <div className="bg-[#0d0e15] p-3 rounded-xl border border-white/10">
              <span className="text-[9px] text-slate-400 font-mono">DIVERSITY</span>
              <div className="text-xl font-black text-[#FFE600] mt-1">{diversityPercent}%</div>
            </div>
            <div className="bg-[#0d0e15] p-3 rounded-xl border border-white/10">
              <span className="text-[9px] text-slate-400 font-mono">PERSONALIZATION</span>
              <div className="text-xl font-black text-[#FF0055] mt-1">94%</div>
            </div>
          </div>
        </div>

        {/* Educational Punchline */}
        <div className="bg-[#07070b] border border-[#00F0FF]/30 rounded-2xl p-5 text-left space-y-2 font-sans">
          <div className="flex items-center gap-2 text-[#00F0FF] font-mono font-bold text-sm uppercase tracking-wider">
            <Cpu size={18} />
            <span>// YOU WERE THE ALGORITHM</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            You observed {selectedCharacter.name}'s behavior, learned their preferences, and used automated feedback loops to determine their digital reality.
          </p>
          <p className="text-xs font-semibold text-[#00FF9D] pt-1 font-mono">
            Critical MIL Takeaway: Algorithms are optimized for metrics—not human well-being or balanced information.
          </p>
        </div>

        {/* Restart Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePlayAgain}
          className="w-full py-4 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-sm font-mono rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <RefreshCw size={18} />
          <span>[ SIMULATE ANOTHER PERSONA ]</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { useGame } from '../context/GameContext';
import { GameHUD } from '../components/GameHUD';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw, CheckCircle2, ArrowRight, Zap, Cpu } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const BalancedChallenge: React.FC = () => {
  const { selectedCharacter, currentRound, history, learnedPreferences, setStage } = useGame();

  // Compute final scores from Level 1
  const avgEngagement = Math.round(
    history.reduce((acc, item) => acc + item.engagementPercent, 0) / Math.max(history.length, 1)
  );

  const categories = history.map(h => h.category);
  const uniqueCats = new Set(categories).size;
  const diversityScore = Math.round((uniqueCats / Math.max(categories.length, 1)) * 100);

  const handleStartLevel2 = () => {
    soundFx.play('complete');
    setStage('results');
  };

  return (
    <div className="min-h-screen bg-[#07070b] anime-grid-bg text-white flex flex-col relative overflow-x-hidden font-sans">
      <GameHUD />

      <div className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col items-center justify-center my-auto space-y-6">
        
        {/* Mission Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full glass-panel border border-[#FFE600]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,230,0,0.15)] text-center space-y-6 font-mono hud-corner-box"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#07070b] border border-[#FFE600]/40 text-[#FFE600] text-xs font-mono font-bold uppercase tracking-widest">
            <Zap size={14} className="animate-pulse" />
            <span>[ LEVEL 2: BREAK THE BUBBLE ]</span>
          </div>

          <h2 className="text-3xl font-black text-white font-display">
            Level 1 Complete: The Personalization Dilemma
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-sans">
            In Level 1, you optimized purely for engagement. Examine what happened to <strong>{selectedCharacter.name}'s</strong> feed telemetry:
          </p>

          {/* Level 1 Metrics comparison */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto font-mono">
            <div className="bg-[#07070b] p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase font-mono">// AVG ENGAGEMENT</span>
              <div className="text-2xl font-black text-[#00F0FF] mt-1">{avgEngagement}%</div>
              <span className="text-[10px] text-[#00FF9D]">✓ TARGET REACHED</span>
            </div>

            <div className="bg-[#07070b] p-4 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase font-mono">// FEED DIVERSITY</span>
              <div className="text-2xl font-black text-[#FF0055] mt-1">{diversityScore}%</div>
              <span className="text-[10px] text-[#FF0055]">⚠️ BUBBLE DETECTED</span>
            </div>
          </div>

          {/* New Challenge Directive */}
          <div className="bg-[#07070b] rounded-2xl p-4 border border-[#FFE600]/30 text-left space-y-2 font-mono">
            <h4 className="text-xs font-bold text-[#FFE600] uppercase tracking-widest font-mono flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>// LEVEL 2 DIRECTIVE: BALANCED MEDIA LITERACY</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Re-engineer your algorithm target to balance <strong>Engagement AND Diversity</strong>. Re-introduce novel and credible topics to broaden {selectedCharacter.name}'s information diet.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStartLevel2}
            className="w-full py-4 bg-[#FFE600] hover:bg-[#fff066] text-[#07070b] font-black text-sm font-mono rounded-xl shadow-[0_0_25px_rgba(255,230,0,0.3)] flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <span>[ GENERATE ALGORITHM REPORT ]</span>
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};


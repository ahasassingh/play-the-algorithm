import React from 'react';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, Flame, Award, Zap, Sparkles, ShieldCheck, AlertTriangle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundFx } from '../utils/sound';

export const GameHUD: React.FC = () => {
  const { currentRound, selectedCharacter, history, algorithmMode, lastReaction, startTutorial } = useGame();
  const [isMuted, setIsMuted] = React.useState(soundFx.getMuted());

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Calculate cumulative score and streak
  const totalScore = history.reduce((sum, item) => sum + item.engagementPercent, 0);

  let currentStreak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].engagementPercent >= 75) {
      currentStreak++;
    } else {
      break;
    }
  }

  const maxRounds = algorithmMode === 'engagement' ? 5 : 8;

  // Calculate Diversity Index from history
  const recentCategories = history.map(h => h.category);
  const uniqueCats = new Set(recentCategories).size;
  const totalRounds = history.length;
  const diversityPercent = totalRounds > 0 ? Math.round((uniqueCats / Math.max(totalRounds, 1)) * 100) : 100;
  const isBubbleForming = diversityPercent < 45 && totalRounds >= 3;

  return (
    <header className="w-full bg-[#0d1527]/95 backdrop-blur-xl border-b border-slate-800/90 px-4 py-2.5 z-40 sticky top-0 shadow-md select-none font-mono">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left Section: Level Mode & Round Progress */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-inner">
            <Zap size={13} className="text-cyan-400" />
            <span className="tracking-wide text-[11px]">
              {algorithmMode === 'engagement' ? 'LEVEL 1: ENGAGEMENT' : 'LEVEL 2: BREAK THE BUBBLE'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-extrabold bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px]">ROUND</span>
            <span className="text-cyan-400 font-black text-xs">{currentRound}</span>
            <span className="text-slate-500 text-[10px]">/ {maxRounds}</span>
          </div>
        </div>

        {/* Center Section: Merged Competing Algorithmic Targets Tension Bar */}
        <div className="flex-1 max-w-xl w-full bg-slate-950/90 border border-slate-800/90 rounded-xl px-3 py-1.5 space-y-1 shadow-inner">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <div className="flex items-center gap-1.5 text-[#00F0FF]">
              <Sparkles size={12} />
              <span>ENGAGEMENT: <strong className="text-white">{lastReaction ? `${lastReaction.engagementPercent}%` : '80%'}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              {isBubbleForming && (
                <span className="text-[9px] bg-[#FF0055]/10 border border-[#FF0055]/40 text-[#FF0055] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                  <AlertTriangle size={11} /> BUBBLE FORMING
                </span>
              )}
              <span className="text-slate-500 font-normal uppercase tracking-widest">// VS //</span>
            </div>

            <div className={`flex items-center gap-1.5 ${diversityPercent < 45 ? 'text-[#FF0055] animate-pulse' : 'text-[#00FF9D]'}`}>
              <span>DIVERSITY: <strong className="text-white">{diversityPercent}%</strong></span>
              <ShieldCheck size={12} />
            </div>
          </div>

          {/* Dual-Ended Progress Bar Track */}
          <div className="relative w-full h-2 bg-[#0d0e15] rounded-full overflow-hidden border border-white/10 flex items-center shadow-inner">
            {/* Left Side: Cyan Engagement */}
            <motion.div
              animate={{ width: `${lastReaction ? lastReaction.engagementPercent / 2 : 40}%` }}
              className="h-full bg-gradient-to-r from-[#00F0FF] to-blue-600 rounded-l-full shadow-sm"
            />

            {/* Center Balance Divider Pointer */}
            <div className="w-1 h-full bg-white z-10 opacity-60 shrink-0" />

            {/* Right Side: Pink/Green Diversity */}
            <motion.div
              animate={{ width: `${diversityPercent / 2}%` }}
              className={`h-full rounded-r-full shadow-sm ${
                diversityPercent < 45
                  ? 'bg-gradient-to-r from-[#FF0055] to-rose-600'
                  : 'bg-gradient-to-r from-[#00FF9D] to-emerald-600'
              }`}
            />
          </div>
        </div>

        {/* Right Section: Target Avatar, Score, Mute */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Target Character Quick Avatar Badge */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/90 px-2.5 py-1 rounded-xl shadow-inner">
            <div className="relative">
              <img
                src={selectedCharacter.avatar}
                alt={selectedCharacter.name}
                className="w-6 h-6 rounded-full object-cover border border-cyan-400/80 shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
            </div>
            <div className="text-xs">
              <span className="text-slate-400 text-[9px] block uppercase tracking-wider">Target</span>
              <strong className="text-white font-extrabold text-[11px]">{selectedCharacter.name}</strong>
            </div>
          </div>

          {/* Streak indicator */}
          {currentStreak > 1 && (
            <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-xl animate-pulse shadow-md">
              <Flame size={13} className="fill-amber-400" />
              <span>{currentStreak}🔥</span>
            </div>
          )}

          {/* Score Counter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-200 bg-slate-950 border border-slate-800/90 px-3 py-1 rounded-xl shadow-inner">
            <Award size={14} className="text-amber-400" />
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-slate-400 font-bold">SCORE</span>
              <strong className="text-cyan-400 font-black text-xs">{totalScore}</strong>
            </div>
          </div>

          {/* Replay Tutorial Button */}
          <button
            onClick={() => startTutorial()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold transition-all cursor-pointer"
            title="Replay Interactive Tutorial"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">TUTORIAL</span>
          </button>

          {/* Audio Mute toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shadow-sm cursor-pointer"
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

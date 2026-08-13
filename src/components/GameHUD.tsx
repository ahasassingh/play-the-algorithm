import React from 'react';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, Flame, Award, Zap, UserCheck } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const GameHUD: React.FC = () => {
  const { currentRound, selectedCharacter, history, algorithmMode } = useGame();
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

  return (
    <header className="w-full bg-[#0d1527]/95 backdrop-blur-xl border-b border-slate-800/90 px-4 py-3 z-40 sticky top-0 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1 (Left): Level Mode & Round Progress */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold shadow-inner">
            <Zap size={14} className="text-cyan-400" />
            <span className="tracking-wide">
              {algorithmMode === 'engagement' ? 'LEVEL 1: ENGAGEMENT' : 'LEVEL 2: BREAK THE BUBBLE'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-300 font-extrabold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">ROUND</span>
            <span className="text-cyan-400 font-black text-sm">{currentRound}</span>
            <span className="text-slate-500">/ {maxRounds}</span>
          </div>
        </div>

        {/* Zone 2 (Center): Target Character Profile Badge */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800/90 px-3.5 py-1.5 rounded-xl shadow-inner">
          <div className="relative">
            <img
              src={selectedCharacter.avatar}
              alt={selectedCharacter.name}
              className="w-7 h-7 rounded-full object-cover border-2 border-cyan-400/80 shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
          </div>
          <div className="text-xs">
            <span className="text-slate-400 text-[10px] block font-mono uppercase tracking-wider">Simulated Target</span>
            <strong className="text-white font-extrabold">{selectedCharacter.name}</strong>
          </div>
        </div>

        {/* Zone 3 (Right): Score, Streak & Controls */}
        <div className="flex items-center gap-3">
          {/* Streak indicator */}
          {currentStreak > 1 && (
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-950/80 border border-amber-500/40 px-3 py-1.5 rounded-xl animate-pulse shadow-md">
              <Flame size={14} className="fill-amber-400" />
              <span>{currentStreak} STREAK</span>
            </div>
          )}

          {/* Score Counter */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-200 bg-slate-950 border border-slate-800/90 px-3.5 py-1.5 rounded-xl shadow-inner">
            <Award size={15} className="text-amber-400" />
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-slate-400 font-bold">SCORE</span>
              <strong className="text-cyan-400 font-black text-sm">{totalScore}</strong>
            </div>
          </div>

          {/* Audio Mute toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shadow-sm"
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

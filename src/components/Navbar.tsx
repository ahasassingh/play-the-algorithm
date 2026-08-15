import React from 'react';
import { useGame } from '../context/GameContext';
import { HelpCircle, Volume2, VolumeX, Cpu } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const Navbar: React.FC = () => {
  const { stage, resetGame, currentRound } = useGame();
  const [audioMuted, setAudioMuted] = React.useState(soundFx.getMuted());

  const toggleAudio = () => {
    const isMuted = soundFx.toggleMute();
    setAudioMuted(isMuted);
  };

  if (stage === 'landing') return null;

  return (
    <header className="sticky top-0 z-50 bg-[#0a0b10]/90 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <button 
          onClick={resetGame}
          className="flex items-center gap-3 text-left group transition-transform active:scale-95"
        >
          <div className="relative w-8 h-8 rounded bg-[#0d0e15] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] font-black text-xs shadow-[0_0_12px_rgba(0,240,255,0.25)] group-hover:border-[#00F0FF] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
            <span className="tracking-tighter">AL</span>
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#FF0055] rounded-full animate-ping" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-widest uppercase text-white flex items-center gap-1.5">
              Algorithm<span className="text-[#00F0FF]">Lens</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-mono">v2.6</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider">// UNESCO Serious Game</div>
          </div>
        </button>

        {/* Stage Status Telemetry */}
        {stage !== 'intro' && stage !== 'character-select' && (
          <div className="hidden md:flex items-center gap-3 bg-[#0d0e15] px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-slate-300 shadow-inner">
            <Cpu size={14} className="text-[#00F0FF] animate-pulse" />
            <span className="text-slate-500 font-mono text-[11px]">[STAGE]</span>
            <span className="font-semibold text-white font-mono">
              {stage === 'simulation' && `ROUND 0${currentRound}/05 — ENGAGEMENT OPTIMIZER`}
              {stage === 'reveal' && `FEEDBACK LOOP REVEAL — BUBBLE DETECTED`}
              {stage === 'balanced-challenge' && `ROUND 0${currentRound}/08 — DIVERSITY RE-ENGINEERING`}
              {stage === 'feed-comparison' && `FEED COMPARISON MATRIX`}
              {stage === 'reflection' && `CRITICAL MIL REFLECTION`}
              {stage === 'results' && `ALGORITHM INSIGHT REPORT`}
            </span>
          </div>
        )}

        {/* Controls & Sound */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
              audioMuted 
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                : 'bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/20 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
            }`}
            title={audioMuted ? "Unmute Synthesizer Audio" : "Mute Synthesizer Audio"}
          >
            {audioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-mono">
              {audioMuted ? "MUTED" : "SYNTH ON"}
            </span>
          </button>

          <button 
            onClick={() => alert("Algorithm Lens is an interactive serious game developed for UNESCO Youth Hackathon 2026. Step into the role of recommendation algorithms to experience how optimizing for user engagement creates filter bubbles and digital echo chambers.")}
            className="p-2 text-slate-400 hover:text-white rounded-lg border border-white/5 hover:border-white/20 bg-white/5 transition-all"
            title="System Documentation & Help"
          >
            <HelpCircle size={16} />
          </button>
        </div>

      </div>
    </header>
  );
};


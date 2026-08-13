import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, ArrowRight, Activity, Users, ShieldCheck, Terminal, Cpu, Play, Zap } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { animate, stagger } from 'animejs';

export const LandingPage: React.FC = () => {
  const { setStage, setSelectedCharacter } = useGame();
  const svgRef = useRef<SVGSVGElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kinetic SVG path animation inspired by Anime.js homepage showcase
    if (svgRef.current) {
      animate(svgRef.current.querySelectorAll('.anime-path'), {
        strokeDashoffset: [300, 0],
        easing: 'easeInOutSine',
        duration: 2500,
        delay: stagger(200),
        loop: true,
        direction: 'alternate',
      });
    }

    // Floating dot matrix animation
    if (gridRef.current) {
      animate(gridRef.current.querySelectorAll('.matrix-dot'), {
        scale: [
          { value: 0.2, easing: 'easeOutSine', duration: 500 },
          { value: 1.2, easing: 'easeInOutQuad', duration: 1200 },
          { value: 1, easing: 'easeOutSine', duration: 500 }
        ],
        opacity: [0.2, 0.9, 0.3],
        delay: stagger(100),
        loop: true,
        direction: 'alternate'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#07070b] text-white flex flex-col justify-between relative overflow-hidden font-sans anime-grid-bg">
      
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00F0FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#FF0055]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Background Kinetic SVG Geometry Lines */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <svg ref={svgRef} width="1000" height="600" viewBox="0 0 1000 600" fill="none" className="w-full h-full max-w-5xl">
          <circle className="anime-path" cx="500" cy="300" r="220" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="12 12" />
          <circle className="anime-path" cx="500" cy="300" r="140" stroke="#FF0055" strokeWidth="1.5" />
          <polygon className="anime-path" points="500,100 673,400 327,400" stroke="#FFE600" strokeWidth="1.5" />
          <path className="anime-path" d="M 200 300 Q 500 100 800 300 T 200 300" stroke="#00FF9D" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Header Branding */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#0d0e15] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] font-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            AL
          </div>
          <div>
            <span className="font-black text-lg tracking-widest text-white uppercase font-display">
              Algorithm<span className="text-[#00F0FF]">Lens</span>
            </span>
            <span className="block text-[10px] text-slate-400">// UNESCO Hackathon 2026</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#0d0e15] px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono text-[#00F0FF]">
          <Sparkles size={14} className="text-[#FF0055] animate-pulse" />
          <span>[ UNESCO MIL Serious Game ]</span>
        </div>
      </header>

      {/* Main Hero Showcase */}
      <main className="max-w-5xl mx-auto px-6 py-12 text-center flex flex-col items-center z-10">
        
        {/* Technical Code Parameter Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d0e15]/90 border border-white/10 text-slate-300 text-xs font-mono mb-8 shadow-inner">
          <Terminal size={14} className="text-[#00F0FF]" />
          <span>target: <span className="text-[#FFE600]">'user_feed'</span></span>
          <span className="text-slate-600">|</span>
          <span>easing: <span className="text-[#FF0055]">'spring(1, 80, 10, 0)'</span></span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-8 font-display">
          What would you show someone <br />
          <span className="bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] to-[#FF0055] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
            next?
          </span>
        </h1>

        <p className="text-slate-300 text-base sm:text-xl max-w-2xl leading-relaxed mb-10 font-sans">
          Step into the role of a recommendation system. Curate feeds, predict user engagement, observe real-time machine learning feedback loops, and experience how optimizing for watch time constructs <span className="text-[#00F0FF] font-mono font-semibold">filter bubbles</span>.
        </p>

        {/* Interactive CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto font-mono">
          <button
            onClick={() => setStage('intro')}
            className="w-full sm:w-auto px-8 py-4 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-base rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
          >
            <Play size={18} className="fill-[#07070b]" />
            <span className="tracking-wider uppercase">LAUNCH SIMULATION</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => {
              setSelectedCharacter(CHARACTERS[0]);
              setStage('character-profile');
            }}
            className="w-full sm:w-auto px-7 py-4 bg-[#0d0e15] hover:bg-[#131520] border border-white/15 text-slate-200 hover:text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Users size={16} className="text-[#FF0055]" />
            <span className="tracking-wider uppercase">DIRECT PERSONA DECK</span>
          </button>
        </div>

        {/* Anime.js Inspired Technical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          
          <div className="glass-panel p-6 rounded-2xl relative hud-corner-box group hover:border-[#00F0FF]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                <Cpu size={20} />
              </div>
              <span className="font-mono text-xs text-slate-500">[ NODE_01 ]</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-2 font-display">01. Play The Algorithm</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Take direct control of recommendation scoring rules. Balance topic relevance against novelty and credibility signals.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative hud-corner-box group hover:border-[#FF0055]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF0055]/10 border border-[#FF0055]/30 flex items-center justify-center text-[#FF0055]">
                <Activity size={20} />
              </div>
              <span className="font-mono text-xs text-slate-500">[ NODE_02 ]</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-2 font-display">02. Live Weight Matrix</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Watch ML preference weights shift in real-time as user persona engagement signals continuously adjust feed composition.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative hud-corner-box group hover:border-[#FFE600]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FFE600]/10 border border-[#FFE600]/30 flex items-center justify-center text-[#FFE600]">
                <ShieldCheck size={20} />
              </div>
              <span className="font-mono text-xs text-slate-500">[ NODE_03 ]</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-2 font-display">03. Break The Bubble</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Re-engineer recommendation parameters to break out of echo chambers and optimize for balanced media literacy (MIL).
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/10 text-center font-mono text-xs text-slate-500 z-10">
        Algorithm Lens — UNESCO Youth Hackathon 2026 Serious Game Submission
      </footer>
    </div>
  );
};


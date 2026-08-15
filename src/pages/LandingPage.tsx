import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, ArrowRight, Activity, Users, ShieldCheck, Terminal, Cpu, Play, ChevronDown } from 'lucide-react';
import { CHARACTERS } from '../data/characters';
import { Hero3DCard } from '../components/Hero3DCard';
import { HeroAmbientCanvas } from '../components/HeroAmbientCanvas';

export const LandingPage: React.FC = () => {
  const { setStage, setSelectedCharacter } = useGame();

  // Mouse tilt / parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotationY, setRotationY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTriggered = useRef(false);

  // Check reduced motion & window size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Continuous Y-axis card spinning animation loop with custom spring/easing front-back pauses
  useEffect(() => {
    if (reducedMotion) return;

    let animId: number;
    let startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000; // seconds

      // Rotation curve: smooth continuous rotation that slows down around 0deg and 180deg
      // Using a sine-adjusted speed profile:
      // When normalized scroll is 0, spin continuously
      // Cycle period ~8 seconds
      const cycle = (elapsed % 8) / 8; // 0 to 1
      // Slower around front (0) & back (0.5)
      const easeAngle = (cycle * 360) + Math.sin(cycle * Math.PI * 4) * 12;

      // Only apply continuous loop if not scrolling heavily into transition
      if (scrollProgress < 0.25) {
        setRotationY((prev) => {
          // Smooth blend toward easeAngle
          const target = (easeAngle % 360 + 360) % 360;
          const diff = target - (prev % 360);
          return prev + diff * 0.08;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion, scrollProgress]);

  // Mouse move handler for subtle depth parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1; // -1 to 1
    const y = (clientY / innerHeight) * 2 - 1; // -1 to 1
    setMousePos({ x, y });
  };

  // Scroll listener for hero -> character selection transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / 400));
      setScrollProgress(progress);

      // When progress scroll passes 40%, accelerate rotation and align to front face
      if (progress >= 0.25) {
        // Force angle to snap smoothly toward front face (0deg / 360deg) as scale grows
        setRotationY((prev) => {
          const currentModulo = prev % 360;
          const target = currentModulo > 180 ? 360 : 0;
          return prev + (target - currentModulo) * 0.15;
        });
      }

      // Trigger route transition at scroll progress 85%
      if (progress >= 0.85 && !transitionTriggered.current) {
        transitionTriggered.current = true;
        setStage('intro');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setStage]);

  // Computed scroll-driven card scale and position transforms
  const cardScale = 1 + scrollProgress * 0.45;
  const heroOpacity = Math.max(0, 1 - scrollProgress * 1.5);
  const cardCenterTranslateX = isMobile ? 0 : scrollProgress * -120; // Move center as scroll proceeds

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-[160vh] bg-[#07070b] text-white flex flex-col justify-between relative overflow-x-hidden font-sans anime-grid-bg"
    >
      {/* 3D Ambient Canvas Background */}
      <HeroAmbientCanvas mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* Header Branding */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between z-20 font-mono sticky top-0 bg-[#07070b]/60 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#0d0e15] border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] font-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            AL
          </div>
          <div>
            <span className="font-black text-lg tracking-widest text-white uppercase font-display">
              Algorithm<span className="text-[#00F0FF]">Lens</span>
            </span>
            <span className="block text-[10px] text-slate-400">// UNESCO Serious Game</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#0d0e15] px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono text-[#00F0FF]">
          <Sparkles size={14} className="text-[#FF0055] animate-pulse" />
          <span>[ UNESCO MIL Experience ]</span>
        </div>
      </header>

      {/* Hero Content & 3D Interactive Card Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-20 z-10 w-full flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[70vh]">
          
          {/* Left Column: Hero Text Copy */}
          <div
            className="lg:col-span-7 text-left space-y-8 transition-opacity duration-300"
            style={{ opacity: heroOpacity }}
          >
            {/* Code Parameter Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d0e15]/90 border border-white/10 text-slate-300 text-xs font-mono shadow-inner">
              <Terminal size={14} className="text-[#00F0FF]" />
              <span>target: <span className="text-[#FFE600]">'user_feed'</span></span>
              <span className="text-slate-600">|</span>
              <span>mode: <span className="text-[#FF0055]">'interactive_3d'</span></span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-display">
              YOU WERE THE <br />
              <span className="bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] to-[#FF0055] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
                ALGORITHM.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-xl max-w-xl leading-relaxed font-sans">
              Step inside a recommendation system. Make the decisions. See what your choices create.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-mono pt-2">
              <button
                onClick={() => setStage('intro')}
                className="px-8 py-4 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-base rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play size={18} className="fill-[#07070b]" />
                <span className="tracking-wider uppercase">ENTER THE SIMULATION</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => {
                  setSelectedCharacter(CHARACTERS[0]);
                  setStage('character-profile');
                }}
                className="px-7 py-4 bg-[#0d0e15] hover:bg-[#131520] border border-white/15 text-slate-200 hover:text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users size={16} className="text-[#FF0055]" />
                <span className="tracking-wider uppercase">PERSONA DECK</span>
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-6 flex items-center gap-2 text-xs font-mono text-[#00F0FF] animate-bounce">
              <ChevronDown size={16} />
              <span>SCROLL TO BEGIN TRANSITION ↓</span>
            </div>
          </div>

          {/* Right Column: 3D Central Card Showcase */}
          <div
            className="lg:col-span-5 flex items-center justify-center relative transition-transform duration-200"
            style={{
              transform: `translateX(${cardCenterTranslateX}px)`,
            }}
          >
            <Hero3DCard
              rotationY={rotationY}
              tiltX={mousePos.y * -14}
              tiltY={mousePos.x * 14}
              scale={cardScale}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* Anime.js Technical Feature Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left w-full transition-opacity duration-300"
          style={{ opacity: heroOpacity }}
        >
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

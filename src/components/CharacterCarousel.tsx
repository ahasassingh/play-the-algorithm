import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import { motion, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, HelpCircle, Target, Sparkles, Cpu } from 'lucide-react';

interface CharacterCarouselProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
}

export const CharacterCarousel: React.FC<CharacterCarouselProps> = ({
  characters,
  onSelectCharacter,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Drag tracking offset
  const dragX = useMotionValue(0);

  const handleNext = () => {
    if (isSelecting) return;
    setActiveIndex((prev) => (prev + 1) % characters.length);
  };

  const handlePrev = () => {
    if (isSelecting) return;
    setActiveIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };

  const handleSelect = () => {
    if (isSelecting) return;
    setIsSelecting(true);
    setTimeout(() => {
      onSelectCharacter(characters[activeIndex]);
    }, 600);
  };

  // Keyboard arrow listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelecting, characters.length]);

  return (
    <div className="relative w-full min-h-screen bg-[#07070b] anime-grid-bg flex flex-col justify-between items-center overflow-hidden font-sans select-none text-white">
      
      {/* Top Header Control bar */}
      <header className="w-full max-w-6xl mx-auto px-6 pt-6 pb-2 flex justify-between items-center z-30 font-mono text-xs">
        <div className="flex items-center gap-2 bg-[#0d0e15] px-3.5 py-1.5 rounded-full border border-white/10 text-slate-300">
          <Cpu size={14} className="text-[#00F0FF]" />
          <span>PERSONA DECK: <strong className="text-[#00F0FF]">0{activeIndex + 1} / 0{characters.length}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">[ SWIPE OR USE ARROWS ]</span>
        </div>
      </header>

      {/* Main Semicircular Card Deck Container */}
      <main className="relative flex-1 w-full max-w-6xl flex items-center justify-center py-4 px-2">
        
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          disabled={isSelecting}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-[#0d0e15] hover:bg-[#131520] active:scale-95 text-[#00F0FF] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all border border-[#00F0FF]/40 focus:outline-none"
          aria-label="Previous character"
        >
          <ChevronLeft className="w-7 h-7 stroke-[2.5]" />
        </button>

        <button
          onClick={handleNext}
          disabled={isSelecting}
          className="absolute right-4 sm:left-auto sm:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-[#0d0e15] hover:bg-[#131520] active:scale-95 text-[#00F0FF] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all border border-[#00F0FF]/40 focus:outline-none"
          aria-label="Next character"
        >
          <ChevronRight className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Physical Fan Card Deck */}
        <div className="relative w-full h-[540px] sm:h-[580px] flex items-center justify-center perspective-1000">
          {characters.map((char, index) => {
            const n = characters.length;
            let rawDiff = index - activeIndex;
            
            if (rawDiff > n / 2) rawDiff -= n;
            if (rawDiff < -n / 2) rawDiff += n;

            const distance = rawDiff;
            const isCenter = distance === 0;

            const absDist = Math.abs(distance);
            const sign = Math.sign(distance);

            if (absDist > 3) return null;

            let xOffset = 0;
            if (absDist === 1) xOffset = sign * 175;
            else if (absDist === 2) xOffset = sign * 315;
            else if (absDist === 3) xOffset = sign * 435;

            let yOffset = 0;
            if (absDist === 1) yOffset = 22;
            else if (absDist === 2) yOffset = 75;
            else if (absDist === 3) yOffset = 145;

            let rotateDegree = 0;
            if (absDist === 1) rotateDegree = sign * 9.5;
            else if (absDist === 2) rotateDegree = sign * 17;
            else if (absDist === 3) rotateDegree = sign * 24;

            const scale = isCenter ? 1 : Math.max(0.72, 1 - absDist * 0.09);
            const zIndex = 50 - absDist * 10;
            const opacity = absDist > 2 ? 0.35 : 1;

            return (
              <motion.div
                key={char.id}
                style={{
                  zIndex,
                  x: isCenter ? dragX : xOffset,
                }}
                animate={{
                  x: xOffset,
                  y: isSelecting && isCenter ? -20 : yOffset,
                  rotate: rotateDegree,
                  scale: isSelecting && isCenter ? 1.05 : scale,
                  opacity: isSelecting && !isCenter ? 0.15 : opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 26,
                  mass: 0.8,
                }}
                drag={isCenter && !isSelecting ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80 || info.velocity.x < -300) {
                    handleNext();
                  } else if (info.offset.x > 80 || info.velocity.x > 300) {
                    handlePrev();
                  }
                }}
                onClick={() => {
                  if (!isCenter && !isSelecting) {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute w-[290px] sm:w-[330px] h-[470px] sm:h-[500px] glass-panel rounded-[28px] border p-5 flex flex-col justify-between cursor-pointer transition-all hud-corner-box ${
                  isCenter 
                    ? 'border-[#00F0FF] shadow-[0_0_35px_rgba(0,240,255,0.3)] bg-[#0d0e15]' 
                    : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30 bg-[#0d0e15]/80'
                }`}
              >
                {/* Character Avatar Portrait */}
                <div className="w-full bg-[#07070b] rounded-[20px] border border-white/10 h-[210px] sm:h-[230px] overflow-hidden relative flex items-center justify-center shrink-0">
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-3 left-3 bg-[#0d0e15]/90 px-2.5 py-1 rounded border border-white/10 font-mono text-[10px] text-[#00F0FF]">
                    ID: {char.id}
                  </div>
                </div>

                {/* Character Details */}
                <div className="text-center px-1 py-1 flex-1 flex flex-col justify-start mt-2">
                  <h3 className="text-2xl font-black text-white tracking-tight font-display">
                    {char.name}
                  </h3>
                  <p className="text-xs font-mono text-[#00F0FF] mt-0.5">
                    {char.age} Y/O • {char.role}
                  </p>

                  <div className="mt-2 text-left bg-[#07070b] p-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
                      <Target className="w-3 h-3 text-[#FF0055]" />
                      <span>Personality Profile</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300 leading-snug line-clamp-2">
                      "{char.quote}"
                    </p>
                  </div>
                </div>

                {/* Primary Interests Chips */}
                <div className="w-full pt-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FFE600]" />
                    <span>Signal Preferences</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-[58px] overflow-hidden">
                    {char.primaryInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2.5 py-1 bg-white/5 text-[#00F0FF] text-xs font-mono rounded-lg border border-[#00F0FF]/30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Center Select Button */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleSelect}
            disabled={isSelecting}
            className="w-24 h-24 sm:w-28 sm:h-28 bg-[#00F0FF] hover:bg-[#33f3ff] active:scale-95 text-[#07070b] font-black text-base sm:text-lg font-mono rounded-full shadow-[0_0_40px_rgba(0,240,255,0.4)] flex items-center justify-center transition-all hover:scale-105 focus:outline-none border-4 border-[#07070b]"
          >
            {isSelecting ? (
              <span className="animate-pulse">LOADING...</span>
            ) : (
              <span>SELECT</span>
            )}
          </button>
        </div>
      </main>

      {/* Help Modal Toggle */}
      <div className="fixed bottom-6 right-6 z-50 font-mono">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-11 h-11 bg-[#0d0e15] hover:bg-[#131520] text-[#00F0FF] rounded-full border border-[#00F0FF]/30 flex items-center justify-center shadow-lg transition-transform active:scale-95"
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {showHelp && (
          <div className="absolute bottom-14 right-0 w-72 bg-[#0d0e15] border border-white/20 rounded-2xl p-4 shadow-2xl text-xs text-slate-300 space-y-2 animate-in fade-in slide-in-from-bottom-2 font-sans">
            <h4 className="font-bold text-sm text-white font-mono text-[#00F0FF]">// INSTRUCTIONS</h4>
            <p className="text-xs">
              • Drag the center character card or use the navigation arrows.
            </p>
            <p className="text-xs">
              • Tap <strong className="text-[#00F0FF]">SELECT</strong> to start curating content for this persona.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};


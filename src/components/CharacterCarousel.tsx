import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import { motion } from 'framer-motion';
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
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);

  const totalItems = characters.length;

  const handleNext = () => {
    if (isSelecting) return;
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    if (isSelecting) return;
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleSelect = () => {
    if (isSelecting) return;
    setIsSelecting(true);
    setTimeout(() => {
      onSelectCharacter(characters[activeIndex]);
    }, 600);
  };

  // Keyboard navigation & mouse wheel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    let wheelCooldown = false;
    const handleWheel = (e: WheelEvent) => {
      if (isSelecting || wheelCooldown) return;
      if (Math.abs(e.deltaY) > 15) {
        wheelCooldown = true;
        if (e.deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        setTimeout(() => {
          wheelCooldown = false;
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isSelecting, totalItems, activeIndex]);

  // Pointer drag handlers for smooth swiping
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSelecting) return;
    setIsDown(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDown || isSelecting) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setIsDown(false);
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  return (
    <div 
      className="relative w-full h-screen max-h-screen bg-[#07070b] anime-grid-bg flex flex-col justify-between items-center overflow-hidden font-sans select-none text-white cursor-grab active:cursor-grabbing px-4 py-2"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Top Header Control bar */}
      <header className="w-full max-w-5xl mx-auto pt-4 pb-2 flex flex-col sm:flex-row justify-between items-center gap-2 z-30 font-mono text-xs shrink-0 pointer-events-auto">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
            <span>CHOOSE YOUR USER</span>
            <span className="text-[#00F0FF] text-xs font-mono px-2 py-0.5 rounded border border-[#00F0FF]/40 bg-[#00F0FF]/10">[ PERSONA DECK ]</span>
          </h2>
          <p className="text-slate-400 text-xs font-sans mt-0.5">
            Every user has different interests. Your recommendations shape what they see.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0d0e15] px-3.5 py-1.5 rounded-full border border-white/10 text-slate-300">
          <Cpu size={14} className="text-[#00F0FF]" />
          <span>SLOT: <strong className="text-[#00F0FF]">0{activeIndex + 1} / 0{characters.length}</strong></span>
        </div>
      </header>

      {/* Main Fan-Carousel Container */}
      <main className="relative flex-1 w-full max-w-4xl flex flex-col items-center justify-center pointer-events-auto overflow-hidden my-auto">
        
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          disabled={isSelecting}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 bg-[#0d0e15] hover:bg-[#131520] active:scale-95 text-[#00F0FF] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all border border-[#00F0FF]/40 focus:outline-none"
          aria-label="Previous character"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={handleNext}
          disabled={isSelecting}
          className="absolute right-2 sm:left-auto sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 bg-[#0d0e15] hover:bg-[#131520] active:scale-95 text-[#00F0FF] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all border border-[#00F0FF]/40 focus:outline-none"
          aria-label="Next character"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Carousel Viewport */}
        <div className="relative w-full h-[360px] sm:h-[380px] flex items-center justify-center">
          {characters.map((char, index) => {
            // Compute relative offset around activeIndex
            let offset = index - activeIndex;

            // Normalize offset so carousel wraps around seamlessly
            if (offset > totalItems / 2) offset -= totalItems;
            if (offset < -totalItems / 2) offset += totalItems;

            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            const zIndex = 50 - absOffset * 10;

            // 3D Fan transform math:
            // Active card (offset === 0) has translateX = 0, keeping it centered dead over the SELECT button
            const translateX = offset * 175;
            const translateY = absOffset * 14;
            const rotateDeg = offset * 10;
            const scale = isCenter ? 1 : Math.max(0.70, 0.85 - absOffset * 0.08);
            const opacity = isCenter ? 1 : Math.max(0.25, 0.65 - absOffset * 0.2);

            return (
              <motion.div
                key={char.id}
                style={{
                  zIndex,
                  transformOrigin: '50% 100%',
                }}
                animate={{
                  x: translateX,
                  y: isSelecting && isCenter ? -18 : translateY,
                  rotate: rotateDeg,
                  scale: isSelecting && isCenter ? 1.04 : scale,
                  opacity: isSelecting && !isCenter ? 0.12 : opacity,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.25, 0.1, 0.25, 1.0],
                }}
                onClick={() => {
                  if (!isCenter && !isSelecting) {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute w-[220px] sm:w-[245px] h-[350px] sm:h-[375px] glass-panel rounded-[20px] border p-3 flex flex-col justify-between cursor-pointer hud-corner-box shadow-2xl transition-colors ${
                  isCenter 
                    ? 'border-[#00F0FF] shadow-[0_10px_40px_8px_rgba(0,240,255,0.35)] bg-[#0d0e15]' 
                    : 'border-white/10 bg-[#0d0e15]/90 hover:border-white/30'
                }`}
              >
                {/* Character Avatar Portrait */}
                <div className="w-full bg-[#07070b] rounded-[14px] border border-white/10 h-[145px] sm:h-[160px] overflow-hidden relative flex items-center justify-center shrink-0">
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-full h-full object-cover object-center pointer-events-none"
                  />
                  <div className="absolute top-2 left-2 bg-[#0d0e15]/90 px-2 py-0.5 rounded border border-white/10 font-mono text-[9px] text-[#00F0FF]">
                    ID: {char.id}
                  </div>
                  <div className="absolute top-2 right-2 bg-[#0d0e15]/90 px-2 py-0.5 rounded border border-white/10 font-mono text-[9px] text-slate-300">
                    0{index + 1}
                  </div>
                </div>

                {/* Character Details */}
                <div className="text-center px-1 py-0.5 flex-1 flex flex-col justify-start mt-1">
                  <h3 className="text-base font-black text-white tracking-tight font-display">
                    {char.name}
                  </h3>
                  <p className="text-[10px] font-mono text-[#00F0FF] mt-0.5">
                    {char.age} Y/O • {char.role}
                  </p>

                  <div className="mt-1 text-left bg-[#07070b] p-1.5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-1 text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
                      <Target className="w-2.5 h-2.5 text-[#FF0055]" />
                      <span>Personality Profile</span>
                    </div>
                    <p className="text-[9px] font-sans text-slate-300 leading-snug line-clamp-2">
                      "{char.quote}"
                    </p>
                  </div>
                </div>

                {/* Primary Interests Chips */}
                <div className="w-full pt-0.5">
                  <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#FFE600]" />
                    <span>Signal Preferences</span>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-[36px] overflow-hidden">
                    {char.primaryInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-1.5 py-0.5 bg-white/5 text-[#00F0FF] text-[9px] font-mono rounded border border-[#00F0FF]/30"
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

        {/* Center Select Button (Centered right under active card) */}
        <div className="relative mt-2 z-50">
          <button
            onClick={handleSelect}
            disabled={isSelecting}
            className="w-18 h-18 sm:w-20 sm:h-20 bg-[#00F0FF] hover:bg-[#33f3ff] active:scale-95 text-[#07070b] font-black text-xs font-mono rounded-full shadow-[0_0_35px_rgba(0,240,255,0.4)] flex items-center justify-center transition-all hover:scale-105 focus:outline-none border-3 border-[#07070b]"
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
      <div className="fixed bottom-3 right-3 z-50 font-mono pointer-events-auto">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-8 h-8 bg-[#0d0e15] hover:bg-[#131520] text-[#00F0FF] rounded-full border border-[#00F0FF]/30 flex items-center justify-center shadow-lg transition-transform active:scale-95"
          aria-label="Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {showHelp && (
          <div className="absolute bottom-10 right-0 w-60 bg-[#0d0e15] border border-white/20 rounded-xl p-3 shadow-2xl text-[10px] text-slate-300 space-y-1 animate-in fade-in slide-in-from-bottom-2 font-sans">
            <h4 className="font-bold text-[11px] text-white font-mono text-[#00F0FF]">// INSTRUCTIONS</h4>
            <p>• Drag across screen, scroll mouse wheel, or click cards / arrows to navigate.</p>
            <p>• Tap <strong className="text-[#00F0FF]">SELECT</strong> to choose the active persona.</p>
          </div>
        )}
      </div>

    </div>
  );
};


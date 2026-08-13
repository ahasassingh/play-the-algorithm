import React, { useState } from 'react';
import { Character } from '../types';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface CharacterDeckProps {
  characters: Character[];
  onSelect: (character: Character) => void;
}

export const CharacterDeck: React.FC<CharacterDeckProps> = ({ characters, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Motion values for physical card drag
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-200, 200], [-12, 12]);
  const dragGlow = useTransform(dragX, [-150, 0, 150], [0.6, 0, 0.6]);

  const handleNext = () => {
    soundFx.play('swipe');
    setCurrentIndex((prev) => (prev + 1) % characters.length);
  };

  const handlePrev = () => {
    soundFx.play('swipe');
    setCurrentIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -80) {
      handleNext();
    } else if (info.offset.x > 80) {
      handlePrev();
    }
  };

  const activeCharacter = characters[currentIndex];

  const handleConfirmSelect = () => {
    setIsSelecting(true);
    soundFx.play('complete');
    setTimeout(() => {
      onSelect(activeCharacter);
    }, 700);
  };

  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-between px-4 py-6 overflow-hidden">
      {/* Background Micro Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-cyan-400 animate-ping duration-1000" />
        <div className="absolute top-2/3 right-12 w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
        <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
      </div>

      {/* Minimal Header */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">
            Algorithm Simulator &bull; Character Select
          </span>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition-all hover:scale-105"
        >
          <HelpCircle size={14} className="text-cyan-400" />
          <span>How to play</span>
        </button>
      </div>

      {/* Help Modal Popup */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 sm:right-10 z-50 w-80 bg-slate-900 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-xs text-slate-300 space-y-2"
          >
            <h4 className="font-bold text-cyan-400 text-sm flex items-center justify-between">
              <span>Goal of the Simulator</span>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </h4>
            <p>1. Drag or swipe cards to select a virtual human target.</p>
            <p>2. Predict their reactions and recommend content to maximize engagement.</p>
            <p>3. Watch how your decisions dynamically shape their feed into a filter bubble.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="text-center my-2 z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Select Target User
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Drag cards left or right to inspect profiles
        </p>
      </div>

      {/* Physical Card Deck Viewport with Smooth Layout Transitions */}
      <div className="relative w-full max-w-md h-[430px] flex items-center justify-center my-auto">
        <AnimatePresence mode="sync">
          {characters.map((char, index) => {
            // Determine relative position from active card (-2, -1, 0, 1, 2)
            let relativeOffset = index - currentIndex;
            if (relativeOffset > Math.floor(characters.length / 2)) {
              relativeOffset -= characters.length;
            } else if (relativeOffset < -Math.floor(characters.length / 2)) {
              relativeOffset += characters.length;
            }

            const absOffset = Math.abs(relativeOffset);
            if (absOffset > 2) return null;

            const isFront = relativeOffset === 0;

            // Smooth fan geometry calculations
            const targetRotate = relativeOffset * 10;
            const targetX = relativeOffset * 70;
            const targetY = absOffset * 14;
            const targetScale = 1 - absOffset * 0.08;
            const targetOpacity = 1 - absOffset * 0.25;

            return (
              <motion.div
                key={char.id}
                style={isFront ? { x: dragX, rotate: dragRotate } : {}}
                drag={isFront && !isSelecting ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={
                  isSelecting && isFront
                    ? { y: -40, scale: 1.06, zIndex: 50, opacity: 1, rotate: 0, x: 0 }
                    : isSelecting && !isFront
                    ? { scale: 0.7, opacity: 0, y: 80 }
                    : {
                        x: targetX,
                        y: targetY,
                        scale: targetScale,
                        rotate: targetRotate,
                        zIndex: 30 - absOffset,
                        opacity: targetOpacity,
                      }
                }
                exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.25 } }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 24,
                  mass: 0.8,
                }}
                className={`absolute w-[310px] sm:w-[350px] bg-slate-900/95 backdrop-blur-2xl border-2 rounded-3xl p-6 shadow-2xl flex flex-col justify-between select-none ${
                  isFront
                    ? 'border-cyan-400/80 shadow-cyan-500/25 cursor-grab active:cursor-grabbing'
                    : 'border-slate-800 pointer-events-none'
                }`}
              >
                {/* Dynamic Cyan Glow overlay while dragging */}
                {isFront && (
                  <motion.div
                    style={{ opacity: dragGlow }}
                    className="absolute inset-0 rounded-3xl bg-cyan-500/10 pointer-events-none"
                  />
                )}

                {/* Card Header */}
                <div className="flex items-center gap-4">
                  <div className={`p-1 rounded-full bg-gradient-to-tr ${char.avatarGradient} shadow-md`}>
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-900"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-white">{char.name}</h3>
                      <span className="text-xs bg-slate-800 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-slate-700">
                        {char.age}y
                      </span>
                    </div>
                    <p className="text-cyan-400 text-xs font-semibold tracking-wide">{char.role}</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-center my-3">
                  <p className="text-xs text-slate-300 italic">"{char.quote}"</p>
                </div>

                {/* Interests chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Target Interests
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {char.primaryInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 shadow-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio summary */}
                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {char.description}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-between w-full max-w-xs z-20 my-2">
        <motion.button
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={handlePrev}
          className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 rounded-full text-cyan-400 shadow-lg shadow-cyan-950 transition-all flex items-center gap-1 group"
          title="Previous character"
        >
          <ChevronLeft size={20} />
          <span className="text-xs font-bold pr-1 hidden sm:inline">PREV</span>
        </motion.button>

        {/* Card Position Dots */}
        <div className="flex gap-2">
          {characters.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleNext}
          className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 rounded-full text-cyan-400 shadow-lg shadow-cyan-950 transition-all flex items-center gap-1 group"
          title="Next character"
        >
          <span className="text-xs font-bold pl-1 hidden sm:inline">NEXT</span>
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Center-Bottom Gamified SELECT Button */}
      <div className="w-full max-w-sm z-20 mt-2">
        <motion.button
          animate={isSelecting ? { scale: 0.95 } : { scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirmSelect}
          disabled={isSelecting}
          className="relative w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-lg rounded-2xl shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span>SELECT {activeCharacter.name.toUpperCase()}</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </span>
          {/* Animated Glow Halo */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>
    </div>
  );
};

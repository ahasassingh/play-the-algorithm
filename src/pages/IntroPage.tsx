import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterDeck } from '../components/CharacterDeck';
import { CharacterCarousel } from '../components/CharacterCarousel';
import { CHARACTERS } from '../data/characters';
import { Character } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const IntroPage: React.FC = () => {
  const { setSelectedCharacter, setStage } = useGame();
  const [briefingCharacter, setBriefingCharacter] = useState<Character | null>(null);

  const handleCharacterSelect = (char: Character) => {
    soundFx.play('complete');
    setSelectedCharacter(char);
    setBriefingCharacter(char);
  };

  const handleStartMission = () => {
    soundFx.play('complete');
    setStage('simulation');
  };

  return (
    <div className="flex-1 flex flex-col justify-center bg-slate-950 text-slate-100 relative">
      {!briefingCharacter ? (
        <CharacterCarousel
          characters={CHARACTERS}
          onSelectCharacter={handleCharacterSelect}
        />
      ) : (
        /* Mission Briefing Overlay */
        <AnimatePresence>
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="w-full max-w-lg bg-[#0d0e15] border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] text-center space-y-6 relative overflow-hidden hud-corner-box font-mono"
            >
              {/* Mission Header */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#07070b] border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono tracking-widest uppercase">
                <Target size={14} className="text-[#FF0055]" />
                <span>[ MISSION OBJECTIVE ]</span>
              </div>

              {/* Character Avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="p-1 rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#FF0055] shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                  <img
                    src={briefingCharacter.avatar}
                    alt={briefingCharacter.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#07070b]"
                  />
                </div>
                <h2 className="text-3xl font-black text-white font-display tracking-tight">{briefingCharacter.name}</h2>
                <p className="text-[#00F0FF] font-mono text-xs font-semibold uppercase">{briefingCharacter.role}</p>
              </div>

              {/* Mission Goal */}
              <div className="bg-[#07070b] rounded-2xl p-4 border border-white/10 space-y-2 text-left">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">// CORE SIMULATION GOAL</span>
                <p className="text-base font-medium text-slate-200 leading-snug font-sans">
                  Curate the optimal feed for <strong className="text-white font-bold">{briefingCharacter.name}</strong> by predicting their content engagement reactions.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono text-slate-400">
                  <span>TARGET ENGAGEMENT: <strong className="text-[#00FF9D]">80%+</strong></span>
                  <span>TOTAL ROUNDS: <strong className="text-[#00F0FF]">5</strong></span>
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleStartMission}
                className="w-full py-4 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-base rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 font-mono"
              >
                <span className="tracking-widest uppercase">INITIALIZE SIMULATION</span>
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

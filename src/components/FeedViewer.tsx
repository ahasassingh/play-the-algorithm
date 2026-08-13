import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '../types';
import { Play, ArrowUpRight, ShieldCheck, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import { PredictionModal } from './PredictionModal';

interface FeedViewerProps {
  content: ContentItem | null;
  selectedCandidate: ContentItem | null;
  currentOptions: ContentItem[];
  isConsuming: boolean;
  engagementPercent: number | null;
  reactionEmoji: string | null;
  characterName: string;
  prediction: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  showResult: boolean;
  onSelectCandidate: (item: ContentItem) => void;
  onConfirmPrediction: (pred: 'HIGH' | 'MEDIUM' | 'LOW') => void;
  onWhyClick: () => void;
  onNextRound: () => void;
  isPredictionCorrect: boolean;
  currentRound: number;
}

export const FeedViewer: React.FC<FeedViewerProps> = ({
  content,
  selectedCandidate,
  currentOptions,
  isConsuming,
  engagementPercent,
  reactionEmoji,
  characterName,
  prediction,
  showResult,
  onSelectCandidate,
  onConfirmPrediction,
  onWhyClick,
  onNextRound,
  isPredictionCorrect,
  currentRound,
}) => {
  const activeItem = content || selectedCandidate;

  return (
    <div className="relative w-full h-full min-h-[440px] bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between overflow-hidden select-none">
      {/* Feed Viewport Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-extrabold text-xs text-white uppercase tracking-wider font-mono">
            {characterName}'s Live Feed & Content Engine
          </span>
        </div>
        {activeItem ? (
          <span className="font-mono bg-slate-800 px-2.5 py-0.5 rounded-full text-[10px] text-cyan-300 border border-slate-700">
            #{activeItem.category} &bull; {activeItem.subcategory}
          </span>
        ) : (
          <span className="font-mono text-[10px] text-cyan-400">Select content to recommend below</span>
        )}
      </div>

      {/* Screen Content Area */}
      <div className="relative flex-1 py-4 flex flex-col justify-between">
        {!selectedCandidate ? (
          /* State 1: Feed Empty -> Choose Content to Recommend within Live Feed */
          <div className="space-y-6 my-auto py-2">
            <div className="text-center space-y-1.5">
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight">Select Content to Recommend into Feed</h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">Choose which content piece {characterName} should watch next</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {currentOptions.slice(0, 4).map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCandidate(option)}
                  className="card-tactile p-4 sm:p-5 surface-level-2 border-2 rounded-2xl cursor-pointer transition-all group flex flex-col justify-between shadow-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                        🎬
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0f2942] text-[#38bdf8] border border-[#1e4976] shadow-sm">
                          {option.category} &bull; {option.subcategory}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-cyan-400 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      RECOMMEND &rarr;
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                      {option.title}
                    </h5>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {option.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : !prediction ? (
          /* State 2: Content Selected -> Embedded Prediction Step inside Feed */
          <div className="max-w-md mx-auto w-full my-auto">
            <PredictionModal
              characterName={characterName}
              category={selectedCandidate.category}
              onConfirmPrediction={onConfirmPrediction}
            />
          </div>
        ) : (
          /* State 3: Consuming & Feedback Stream inside Feed */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem?.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-between space-y-4"
            >
              {/* Active Post Content Display */}
              <div className="my-auto space-y-3 text-center">
                <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
                  <span className="text-6xl">🎬</span>

                  {/* Play video overlay indicator */}
                  {isConsuming && (
                    <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg animate-pulse">
                        <Play size={26} className="fill-slate-950 ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-white leading-snug">{activeItem?.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">{activeItem?.caption}</p>
                </div>
              </div>

              {/* Watching... Progress Bar */}
              {isConsuming && (
                <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs font-mono text-cyan-400 font-bold">
                    <span>{characterName} is watching video...</span>
                    <span className="animate-pulse">WATCHING...</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.8, ease: 'linear' }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Engagement Result & Actions embedded in Feed */}
              {!isConsuming && showResult && engagementPercent !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 space-y-3 shadow-lg"
                >
                  {/* Reaction Score Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{reactionEmoji || '😄'}</span>
                      <div>
                        <span className="text-lg font-black text-white font-mono">{engagementPercent}% Watch Time</span>
                        <p className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                          {engagementPercent >= 75 ? '🔥 High Engagement' : engagementPercent >= 50 ? '👍 Moderate Watch' : '😒 Skipped Quickly'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      +{engagementPercent} PTS
                    </span>
                  </div>

                  {/* Prediction Accuracy Banner */}
                  <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 font-bold ${
                    isPredictionCorrect
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                  }`}>
                    {isPredictionCorrect ? (
                      <>
                        <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                        <span>✓ Correct Prediction! You guessed {prediction}.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                        <span>✗ Unexpected! You predicted {prediction}, but {characterName} watched {engagementPercent}%.</span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={onWhyClick}
                      className="py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <HelpCircle size={14} />
                      <span>WHY ENGAGE THIS WAY?</span>
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onNextRound}
                      className="py-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
                    >
                      <span>CONTINUE TO ROUND {currentRound + 1}</span>
                      <ArrowRight size={15} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '../types';
import { Play, Flame, Heart, ArrowUpRight, Film, Clock } from 'lucide-react';

interface VirtualPhoneProps {
  content: ContentItem | null;
  isConsuming: boolean;
  engagementPercent: number | null;
  reactionEmoji: string | null;
  characterName: string;
}

export const VirtualPhone: React.FC<VirtualPhoneProps> = ({
  content,
  isConsuming,
  engagementPercent,
  reactionEmoji,
  characterName,
}) => {
  return (
    <div className="relative w-[270px] sm:w-[300px] h-[520px] bg-[#07070b] border-2 border-[#00F0FF]/30 rounded-[38px] p-3 shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col justify-between overflow-hidden select-none font-mono hud-corner-box">
      {/* Phone Top Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#0d0e15] rounded-b-xl z-30 flex items-center justify-center border-b border-white/10">
        <div className="w-10 h-1 bg-[#00F0FF]/40 rounded-full" />
      </div>

      {/* Screen Content Container */}
      <div className="relative flex-1 bg-[#0d0e15] rounded-[26px] overflow-hidden flex flex-col justify-between border border-white/10 mt-2 pt-4">
        {content ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={content.id}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex-1 flex flex-col justify-between p-4 relative"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 px-2 py-0.5 rounded text-[10px] uppercase">
                  #{content.category}
                </span>
                <span className="text-[9px] text-slate-500">// FEED_STREAM</span>
              </div>

              {/* Post Card Visual / Image */}
              <div className="my-auto space-y-3 text-center">
                <div className="relative w-full h-36 rounded-xl bg-[#07070b] border border-white/15 flex items-center justify-center overflow-hidden group shadow-inner">
                  <span className="text-5xl group-hover:scale-110 transition-transform">📱</span>

                  {/* Anime.js playback video overlay indicator */}
                  {isConsuming && (
                    <div className="absolute inset-0 bg-[#07070b]/60 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#00F0FF] text-[#07070b] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.6)] animate-pulse">
                        <Play size={22} className="fill-[#07070b] ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-left">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug font-sans">{content.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 font-sans">{content.caption}</p>
                </div>
              </div>

              {/* Anime.js Timeline Scrubber "Watching..." Progress Bar */}
              {isConsuming && (
                <div className="space-y-1.5 my-2 font-mono">
                  <div className="flex justify-between text-[10px] text-[#00F0FF]">
                    <span>{characterName} is watching...</span>
                    <span className="animate-pulse flex items-center gap-1">
                      <Clock size={10} /> PLAYING
                    </span>
                  </div>
                  <div className="w-full bg-[#07070b] h-2 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.8, ease: 'linear' }}
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#FF0055] rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Engagement Result Reveal */}
              {!isConsuming && engagementPercent !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#07070b] border border-[#00F0FF]/40 rounded-xl p-2.5 text-center space-y-1 shadow-lg font-mono"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">{reactionEmoji || '😄'}</span>
                    <span className="text-xl font-black text-white">{engagementPercent}%</span>
                  </div>
                  <p className="text-[10px] text-[#00F0FF] uppercase tracking-wider font-mono">
                    {engagementPercent >= 75 ? '🔥 HIGH ENGAGEMENT' : engagementPercent >= 50 ? '👍 MODERATE WATCH' : '😒 QUICK SKIPPED'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Empty Phone Standby State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2 font-mono">
            <div className="w-12 h-12 rounded-full bg-[#07070b] flex items-center justify-center border border-white/10">
              <ArrowUpRight size={24} className="text-[#00F0FF] animate-bounce" />
            </div>
            <p className="text-[11px] text-slate-400">// SELECT CONTENT CANDIDATE BELOW</p>
          </div>
        )}
      </div>

      {/* Phone Bottom Home Bar */}
      <div className="w-24 h-1 bg-white/20 rounded-full mx-auto mt-2" />
    </div>
  );
};


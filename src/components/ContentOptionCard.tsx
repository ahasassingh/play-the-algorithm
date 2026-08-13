import React, { useState } from 'react';
import { ContentItem } from '../types';
import { Sparkles, Info, Heart, ArrowUpRight, Cpu } from 'lucide-react';

interface ContentOptionCardProps {
  item: ContentItem;
  recommendationScore: number;
  breakdown: {
    interestMatch: number;
    engagementPotential: number;
    historyBoost: number;
    noveltyBoost: number;
    credibilityBoost: number;
    diversityBoost: number;
  };
  onSelect: () => void;
}

export const ContentOptionCard: React.FC<ContentOptionCardProps> = ({
  item,
  recommendationScore,
  breakdown,
  onSelect
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="relative group glass-panel hover:bg-[#131520] border border-white/10 hover:border-[#00F0FF]/50 rounded-2xl p-3 shadow-lg transition-all flex flex-col justify-between hud-corner-box font-mono">
      {/* Top Header & Thumbnail */}
      <div>
        <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5 bg-[#07070b] border border-white/10">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 bg-[#07070b]/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#00F0FF] border border-white/10">
            #{item.category}
          </div>

          {/* Recommendation Rank Badge */}
          <div className="absolute top-2 right-2 bg-[#00F0FF] text-[#07070b] px-2 py-0.5 rounded text-[10px] font-black font-mono shadow-[0_0_10px_rgba(0,240,255,0.4)] uppercase">
            SCORE {recommendationScore}
          </div>
        </div>

        <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug mb-1 font-sans">
          {item.title}
        </h4>
        <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">{item.caption}</p>
      </div>

      {/* Footer Controls */}
      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between gap-2 font-mono">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowExplanation(!showExplanation);
          }}
          className="text-[10px] font-mono text-slate-400 hover:text-[#00F0FF] flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          <Info size={13} />
          <span>[ WHY THIS? ]</span>
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="px-3 py-1.5 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-1 transition-all uppercase tracking-wider font-mono"
        >
          <span>RECOMMEND</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Popover Explanation */}
      {showExplanation && (
        <div className="absolute inset-0 z-30 bg-[#07070b]/95 backdrop-blur-md rounded-2xl p-3 border border-[#00F0FF]/50 flex flex-col justify-between text-xs animate-fade-in font-mono">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-[#00F0FF] text-[11px]">// SCORE BREAKDOWN</span>
              <span className="font-mono text-white font-black">{recommendationScore} PTS</span>
            </div>
            <div className="space-y-1.5 mt-2 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Learned Interest:</span>
                <span className="font-mono text-[#00F0FF]">{breakdown.interestMatch} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Engagement Potential:</span>
                <span className="font-mono text-[#FFE600]">{breakdown.engagementPotential} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">History Reinforcement:</span>
                <span className="font-mono text-[#FF0055]">+{breakdown.historyBoost} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diversity Value:</span>
                <span className="font-mono text-[#00FF9D]">{breakdown.diversityBoost} pts</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowExplanation(false)}
            className="w-full py-1 bg-[#0d0e15] hover:bg-[#131520] text-slate-300 rounded text-[10px] font-mono border border-white/10 uppercase"
          >
            [ CLOSE ]
          </button>
        </div>
      )}
    </div>
  );
};


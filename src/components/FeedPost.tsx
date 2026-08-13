import React from 'react';
import { ContentItem } from '../types';
import { Heart, MessageCircle, Share2, Eye, Award } from 'lucide-react';

interface FeedPostProps {
  item: ContentItem;
  reaction?: { engagementPercent: number; reactionText: string; reactionEmoji: string } | null;
}

export const FeedPost: React.FC<FeedPostProps> = ({ item, reaction }) => {
  return (
    <div className="flex flex-col bg-slate-900 text-white w-full h-full justify-between">
      {/* Video / Content Thumbnail Header */}
      <div className="relative w-full h-60 sm:h-72 bg-slate-950 overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        
        {/* Topic Badge Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-xs font-semibold text-cyan-400">
          {item.category} • {item.subcategory}
        </div>

        {/* Video Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">
          {item.duration}
        </div>

        {/* Reaction Overlay Banner if recent */}
        {reaction && (
          <div className="absolute inset-x-0 bottom-0 bg-slate-900/90 backdrop-blur-md p-3 border-t border-cyan-500/40 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{reaction.reactionEmoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
                  <span>Watch Engagement</span>
                  <span className="text-cyan-400 font-bold font-mono">{reaction.engagementPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-700" 
                    style={{ width: `${reaction.engagementPercent}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-cyan-200 mt-2 font-medium">{reaction.reactionText}</p>
          </div>
        )}
      </div>

      {/* Post Metadata & Actions */}
      <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
        {/* Creator Info */}
        <div className="flex items-center gap-3">
          <img
            src={item.creatorAvatar}
            alt={item.creator}
            className="w-9 h-9 rounded-full object-cover border border-slate-700"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-100">{item.creator}</h4>
            <p className="text-[11px] text-slate-400">Recommended for you</p>
          </div>
        </div>

        {/* Title & Caption */}
        <div>
          <h3 className="font-bold text-base text-slate-100 line-clamp-2 leading-snug mb-1">{item.title}</h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{item.caption}</p>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-slate-400 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer">
              <Heart size={16} />
              {item.likesCount}
            </span>
            <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
              <MessageCircle size={16} />
              {item.commentsCount}
            </span>
            <span className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
              <Share2 size={16} />
              Share
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

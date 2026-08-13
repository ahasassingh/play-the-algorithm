import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Play, Target, Heart, ThumbsDown, Sparkles } from 'lucide-react';

export const CharacterProfilePage: React.FC = () => {
  const { selectedCharacter, setStage } = useGame();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border-4 border-slate-900 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Back Button */}
        <button
          onClick={() => setStage('intro')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          <span>Back to Character Selector</span>
        </button>

        {/* Header Title */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-[#00c4e6]/20 text-[#008ba3] font-black text-xs uppercase tracking-widest rounded-full mb-1">
            Character Selected
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
            Meet {selectedCharacter.name}
          </h2>
          <p className="text-sm font-bold text-slate-600 mt-1">
            Now let's see what they like.
          </p>
        </div>

        {/* Character Card Preview */}
        <div className="bg-[#00c4e6] border-3 border-slate-900 rounded-[28px] p-5 shadow-lg mb-6 flex flex-col sm:flex-row items-center gap-5">
          <img
            src={selectedCharacter.avatar}
            alt={selectedCharacter.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-[20px] object-cover border-3 border-slate-900 bg-white shrink-0"
          />
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-2xl font-extrabold text-slate-950">{selectedCharacter.name}</h3>
            <p className="text-xs font-bold text-slate-900/80 mb-2">
              {selectedCharacter.age} • {selectedCharacter.role}
            </p>
            <p className="text-xs font-semibold text-slate-950 italic bg-white/70 p-3 rounded-xl border border-slate-900/20">
              "{selectedCharacter.quote}"
            </p>
          </div>
        </div>

        {/* Interests Summary */}
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <Heart size={14} className="text-[#008ba3]" />
              Stated Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCharacter.primaryInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 bg-white text-slate-950 border-2 border-slate-900 rounded-xl text-xs font-extrabold shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <ThumbsDown size={14} className="text-red-500" />
              Low Affinity Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCharacter.notInto.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-slate-200 text-slate-700 border border-slate-400 rounded-xl text-xs font-bold"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setStage('simulation')}
          className="w-full py-4 bg-[#00c4e6] hover:bg-[#00b5d4] text-slate-950 font-black text-lg rounded-2xl border-3 border-slate-900 shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
        >
          <span>Start Simulation for {selectedCharacter.name}</span>
          <Play size={20} className="fill-current" />
        </button>

      </div>
    </div>
  );
};


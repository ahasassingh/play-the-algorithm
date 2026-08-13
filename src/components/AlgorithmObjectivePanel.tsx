import React from 'react';
import { AlgorithmWeights } from '../types';
import { Sliders, Zap, Shield, Sparkles, Compass, Eye } from 'lucide-react';

interface AlgorithmObjectivePanelProps {
  weights: AlgorithmWeights;
  onChange: (newWeights: AlgorithmWeights) => void;
}

export const AlgorithmObjectivePanel: React.FC<AlgorithmObjectivePanelProps> = ({ weights, onChange }) => {
  const handleSliderChange = (key: keyof AlgorithmWeights, val: number) => {
    onChange({
      ...weights,
      [key]: val
    });
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
        <Sliders className="text-cyan-400" size={20} />
        <h3 className="text-lg font-bold text-white">Algorithm Objective Tuning</h3>
      </div>

      <p className="text-xs text-slate-300 mb-5">
        Adjust what the recommendation system optimizes for. Watch how changing weights directly changes what content options get prioritized!
      </p>

      <div className="space-y-4">
        {/* Engagement Potential */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Zap size={14} />
              Predicted Engagement
            </span>
            <span className="font-mono text-cyan-300">{Math.round(weights.engagementPotential * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={weights.engagementPotential}
            onChange={(e) => handleSliderChange('engagementPotential', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Topic Diversity */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Compass size={14} />
              Topic Diversity
            </span>
            <span className="font-mono text-emerald-300">{Math.round(weights.diversity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={weights.diversity}
            onChange={(e) => handleSliderChange('diversity', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Source Credibility */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Shield size={14} />
              Source Credibility
            </span>
            <span className="font-mono text-purple-300">{Math.round(weights.credibility * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={weights.credibility}
            onChange={(e) => handleSliderChange('credibility', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        {/* Novelty */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles size={14} />
              Novelty & Serendipity
            </span>
            <span className="font-mono text-amber-300">{Math.round(weights.novelty * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={weights.novelty}
            onChange={(e) => handleSliderChange('novelty', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>
    </div>
  );
};

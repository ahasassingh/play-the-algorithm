import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface WhyExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterName: string;
  category: string;
  engagementPercent: number;
  scoreBreakdown?: {
    interestMatch: number;
    engagementPotential: number;
    diversityBonus: number;
    credibilityBonus: number;
    noveltyBonus: number;
  };
}

export const WhyExplanationModal: React.FC<WhyExplanationModalProps> = ({
  isOpen,
  onClose,
  characterName,
  category,
  engagementPercent,
  scoreBreakdown,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 shadow-2xl shadow-cyan-500/20 text-slate-200 space-y-4 relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Cpu size={16} />
            <span>Algorithm Signal Breakdown</span>
          </div>

          <h3 className="text-xl font-bold text-white">
            Why did {characterName} engage {engagementPercent}%?
          </h3>

          <p className="text-xs text-slate-300">
            The recommendation algorithm combines internal weighted signals to estimate user interest:
          </p>

          {/* Signal Math Table */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
              <span>Recommendation Signal</span>
              <span>Points</span>
            </div>

            <div className="flex justify-between text-cyan-300">
              <span>Base Interest Signal ({category})</span>
              <span>+{(scoreBreakdown?.interestMatch ?? 0.45) * 100}</span>
            </div>

            <div className="flex justify-between text-blue-300">
              <span>Prior Interaction History</span>
              <span>+{(scoreBreakdown?.engagementPotential ?? 0.28) * 100}</span>
            </div>

            <div className="flex justify-between text-purple-300">
              <span>Novelty Factor</span>
              <span>+{(scoreBreakdown?.noveltyBonus ?? 0.10) * 100}</span>
            </div>

            <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-emerald-400 text-sm">
              <span>Estimated Result</span>
              <span>{engagementPercent}%</span>
            </div>
          </div>

          {/* Educational Insight */}
          <div className="bg-cyan-950/60 border border-cyan-500/30 rounded-xl p-3 text-xs text-cyan-200 flex items-start gap-2.5">
            <Sparkles size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong>System Insight:</strong> Every user click reinforces the algorithm's confidence in that category. Repeating choices rapidly narrows future recommendation candidates.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Got it — Back to Simulation
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

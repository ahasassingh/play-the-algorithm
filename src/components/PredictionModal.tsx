import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle, HelpCircle, Cpu } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface PredictionModalProps {
  characterName: string;
  category: string;
  onConfirmPrediction: (prediction: 'HIGH' | 'MEDIUM' | 'LOW') => void;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  characterName,
  category,
  onConfirmPrediction,
}) => {
  const [selected, setSelected] = useState<'HIGH' | 'MEDIUM' | 'LOW' | null>(null);

  const handleSelect = (val: 'HIGH' | 'MEDIUM' | 'LOW') => {
    soundFx.play('click');
    setSelected(val);
  };

  const handleConfirm = () => {
    if (!selected) return;
    soundFx.play('pop');
    onConfirmPrediction(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full glass-panel border border-[#00F0FF]/40 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,240,255,0.15)] space-y-4 font-mono hud-corner-box"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-[#00F0FF]" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            PREDICT {characterName.toUpperCase()}'S REACTION
          </h4>
        </div>
        <span className="text-[10px] font-mono text-[#00F0FF] bg-[#07070b] px-2.5 py-0.5 rounded border border-white/10 uppercase">
          TOPIC: #{category}
        </span>
      </div>

      <p className="text-xs text-slate-300 font-sans">
        Select your algorithmic prediction for <strong className="text-white">{characterName}</strong>'s watch engagement with <strong className="text-[#00F0FF]">#{category}</strong>:
      </p>

      {/* Prediction Cards */}
      <div className="grid grid-cols-3 gap-2.5 font-mono">
        {[
          { key: 'HIGH', label: 'HIGH (80-100%)', desc: 'LOVES TOPIC', color: 'border-[#00FF9D]/40 hover:bg-[#00FF9D]/10 text-[#00FF9D]' },
          { key: 'MEDIUM', label: 'MED (50-79%)', desc: 'MILD WATCH', color: 'border-[#FFE600]/40 hover:bg-[#FFE600]/10 text-[#FFE600]' },
          { key: 'LOW', label: 'LOW (0-49%)', desc: 'SKIPS FAST', color: 'border-[#FF0055]/40 hover:bg-[#FF0055]/10 text-[#FF0055]' },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => handleSelect(opt.key as any)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selected === opt.key
                ? 'bg-[#07070b] border-[#00F0FF] ring-2 ring-[#00F0FF]/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : `bg-[#07070b]/80 ${opt.color}`
            }`}
          >
            <div className="font-bold text-[11px] font-mono">{opt.label}</div>
            <div className="text-[9px] text-slate-400 mt-1 font-mono">{opt.desc}</div>
          </button>
        ))}
      </div>

      {/* Confirm Action */}
      <motion.button
        disabled={!selected}
        whileHover={{ scale: selected ? 1.02 : 1 }}
        whileTap={{ scale: selected ? 0.98 : 1 }}
        onClick={handleConfirm}
        className={`w-full py-3 rounded-xl font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
          selected
            ? 'bg-[#00F0FF] text-[#07070b] shadow-[0_0_20px_rgba(0,240,255,0.4)]'
            : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
        }`}
      >
        <span>[ CONFIRM PREDICTION & TRANSMIT ]</span>
      </motion.button>
    </motion.div>
  );
};


import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameHUD } from '../components/GameHUD';
import { FeedViewer } from '../components/FeedViewer';
import { PredictionModal } from '../components/PredictionModal';
import { PreferenceModelWidget } from '../components/PreferenceModelWidget';
import { WhyExplanationModal } from '../components/WhyExplanationModal';
import { ContentItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, HelpCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const SimulationView: React.FC = () => {
  const {
    selectedCharacter,
    currentRound,
    currentOptions,
    makeRecommendation,
    advanceRound,
    history,
    learnedPreferences,
    selectedContent,
    lastReaction,
  } = useGame();

  // Internal interaction state machine
  const [selectedCandidate, setSelectedCandidate] = useState<ContentItem | null>(null);
  const [prediction, setPrediction] = useState<'HIGH' | 'MEDIUM' | 'LOW' | null>(null);
  const [isConsuming, setIsConsuming] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);

  // Calculate Diversity Index from history
  const recentCategories = history.map(h => h.category);
  const uniqueCats = new Set(recentCategories).size;
  const totalRounds = history.length;
  const diversityPercent = totalRounds > 0 ? Math.round((uniqueCats / Math.max(totalRounds, 1)) * 100) : 100;
  const isBubbleForming = diversityPercent < 45 && totalRounds >= 3;

  // Handle content candidate click -> trigger prediction step
  const handleSelectOption = (item: ContentItem) => {
    soundFx.play('click');
    setSelectedCandidate(item);
    setPrediction(null);
    setShowResult(false);
  };

  // Lock prediction -> Trigger feed recommendation stream
  const handleConfirmPrediction = (pred: 'HIGH' | 'MEDIUM' | 'LOW') => {
    if (!selectedCandidate) return;
    setPrediction(pred);

    soundFx.play('pop');

    makeRecommendation(selectedCandidate);
    setIsConsuming(true);

    // Suspense delay while watching...
    setTimeout(() => {
      setIsConsuming(false);
      setShowResult(true);

      const currentScore = lastReaction?.engagementPercent ?? 75;
      if (currentScore >= 75) {
        soundFx.play('chime');
      } else {
        soundFx.play('low');
      }
    }, 1800);
  };

  const handleNextRound = () => {
    soundFx.play('swipe');
    setSelectedCandidate(null);
    setPrediction(null);
    setShowResult(false);
    advanceRound();
  };

  const isPredictionCorrect = () => {
    if (!prediction || !lastReaction) return false;
    const score = lastReaction.engagementPercent;
    if (prediction === 'HIGH' && score >= 80) return true;
    if (prediction === 'MEDIUM' && score >= 50 && score < 80) return true;
    if (prediction === 'LOW' && score < 50) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#07070b] anime-grid-bg text-white flex flex-col relative overflow-x-hidden font-sans">
      {/* HUD Header */}
      <GameHUD />

      {/* Main Game Interface Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col gap-6 my-auto">
        
        {/* Top Info Bar: Character & Competing System Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch font-mono">
          {/* Target Character Quick Profile */}
          <div className="md:col-span-5 glass-panel border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg hud-corner-box">
            <div className="flex items-center gap-3">
              <img
                src={selectedCharacter.avatar}
                alt={selectedCharacter.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#00F0FF]"
              />
              <div>
                <h3 className="font-extrabold text-white text-sm font-display">{selectedCharacter.name}</h3>
                <p className="text-xs text-[#00F0FF] font-mono">{selectedCharacter.role}</p>
              </div>
            </div>
            <span className="bg-[#07070b] px-3 py-1 rounded-full text-xs font-mono text-[#00F0FF] border border-[#00F0FF]/30">
              [ ROUND 0{currentRound}/05 ]
            </span>
          </div>

          {/* Competing Objectives Dual-Ended Tension Bar (Engagement vs Diversity) */}
          <div className="md:col-span-7 glass-panel border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg flex flex-col justify-between hud-corner-box">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  COMPETING ALGORITHMIC TARGETS
                </h4>
              </div>
              {isBubbleForming && (
                <span className="text-[11px] bg-[#FF0055]/10 border border-[#FF0055]/40 text-[#FF0055] font-mono font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle size={13} /> FILTER BUBBLE FORMING
                </span>
              )}
            </div>

            {/* Dual-Ended Tug-Of-War Seesaw Tension Bar */}
            <div className="space-y-1.5 bg-[#07070b] p-3 rounded-xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <div className="flex items-center gap-1.5 text-[#00F0FF]">
                  <Sparkles size={13} />
                  <span>ENGAGEMENT: <strong className="text-white">{lastReaction ? `${lastReaction.engagementPercent}%` : '80%'}</strong></span>
                </div>
                <div className="text-[10px] text-slate-500 font-normal uppercase tracking-widest">// VS //</div>
                <div className={`flex items-center gap-1.5 ${diversityPercent < 45 ? 'text-[#FF0055] animate-pulse' : 'text-[#00FF9D]'}`}>
                  <span>DIVERSITY: <strong className="text-white">{diversityPercent}%</strong></span>
                  <ShieldCheck size={13} />
                </div>
              </div>

              {/* Dual-Ended Progress Bar Track */}
              <div className="relative w-full h-3.5 bg-[#0d0e15] rounded-full overflow-hidden border border-white/10 flex items-center shadow-inner">
                {/* Left Side: Cyan Engagement */}
                <motion.div
                  animate={{ width: `${lastReaction ? lastReaction.engagementPercent / 2 : 40}%` }}
                  className="h-full bg-gradient-to-r from-[#00F0FF] to-blue-600 rounded-l-full shadow-sm"
                />

                {/* Center Balance Divider Pointer */}
                <div className="w-1 h-full bg-white z-10 opacity-60 shrink-0" />

                {/* Right Side: Pink/Green Diversity */}
                <motion.div
                  animate={{ width: `${diversityPercent / 2}%` }}
                  className={`h-full rounded-r-full shadow-sm ${
                    diversityPercent < 45
                      ? 'bg-gradient-to-r from-[#FF0055] to-rose-600'
                      : 'bg-gradient-to-r from-[#00FF9D] to-emerald-600'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Unified Main Section: Merged Live Feed + Selection + Reaction Stream & 3D Neural Brain */}
        <div className="space-y-6">
          {/* Merged Live Feed & Content Recommendation Engine */}
          <FeedViewer
            content={selectedContent}
            selectedCandidate={selectedCandidate}
            currentOptions={currentOptions}
            isConsuming={isConsuming}
            engagementPercent={lastReaction?.engagementPercent ?? null}
            reactionEmoji={lastReaction?.reactionEmoji ?? null}
            characterName={selectedCharacter.name}
            prediction={prediction}
            showResult={showResult}
            onSelectCandidate={handleSelectOption}
            onConfirmPrediction={handleConfirmPrediction}
            onWhyClick={() => setShowWhyModal(true)}
            onNextRound={handleNextRound}
            isPredictionCorrect={isPredictionCorrect()}
            currentRound={currentRound}
          />

          {/* 3D Algorithm Neural Learning Brain Widget */}
          <PreferenceModelWidget preferences={learnedPreferences} history={history} />
        </div>
      </div>

      {/* Optional WHY Signal Explanation Drawer */}
      <WhyExplanationModal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        characterName={selectedCharacter.name}
        category={selectedCandidate?.category || 'Content'}
        engagementPercent={lastReaction?.engagementPercent || 75}
      />
    </div>
  );
};

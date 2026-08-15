import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameHUD } from '../components/GameHUD';
import { FeedViewer } from '../components/FeedViewer';
import { PreferenceModelWidget } from '../components/PreferenceModelWidget';
import { WhyExplanationModal } from '../components/WhyExplanationModal';
import { GameTutorialOverlay, TutorialStep } from '../components/GameTutorialOverlay';
import { ContentItem } from '../types';
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
    isTutorialActive,
  } = useGame();

  // Tutorial tracking step state
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('WELCOME');

  // Internal interaction state machine
  const [selectedCandidate, setSelectedCandidate] = useState<ContentItem | null>(null);
  const [prediction, setPrediction] = useState<'HIGH' | 'MEDIUM' | 'LOW' | null>(null);
  const [isConsuming, setIsConsuming] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);

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
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 flex flex-col justify-center my-auto">
        {/* Side-by-Side Main Layout Grid: Live Feed + Selection Engine (left 7 cols) & 3D Preference Matrix (right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Merged Live Feed & Content Recommendation Engine */}
          <div className="lg:col-span-7 flex flex-col">
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
          </div>

          {/* 3D Algorithm Neural Learning Brain Widget */}
          <div className="lg:col-span-5 flex flex-col">
            <PreferenceModelWidget preferences={learnedPreferences} history={history} />
          </div>
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

      {/* Interactive Game Tutorial Overlay */}
      {isTutorialActive && (
        <GameTutorialOverlay
          onStepChange={setTutorialStep}
          selectedOption={selectedCandidate}
          predictionMade={!!prediction}
        />
      )}
    </div>
  );
};

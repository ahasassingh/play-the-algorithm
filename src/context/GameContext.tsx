import React, { createContext, useContext, useState } from 'react';
import { Character, ContentItem, Interaction, AlgorithmWeights } from '../types';
import { CHARACTERS } from '../data/characters';
import { calculateEngagement, getRecommendationCandidates, calculateRecommendationScore } from '../engine/recommendationEngine';

export type Stage = 
  | 'landing'
  | 'intro'
  | 'character-select'
  | 'character-profile'
  | 'simulation'
  | 'reveal'
  | 'balanced-challenge'
  | 'feed-comparison'
  | 'reflection'
  | 'results';

interface GameContextType {
  stage: Stage;
  setStage: (stage: Stage) => void;
  selectedCharacter: Character;
  setSelectedCharacter: (character: Character) => void;
  currentRound: number;
  history: Interaction[];
  learnedPreferences: { [category: string]: number };
  algorithmMode: 'engagement' | 'balanced';
  weights: AlgorithmWeights;
  setWeights: React.Dispatch<React.SetStateAction<AlgorithmWeights>>;
  currentOptions: ContentItem[];
  selectedContent: ContentItem | null;
  lastReaction: { engagementPercent: number; reactionText: string; reactionEmoji: string } | null;
  makeRecommendation: (content: ContentItem) => void;
  advanceRound: () => void;
  resetGame: () => void;
  isTutorialActive: boolean;
  startTutorial: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
}

const DEFAULT_ENGAGEMENT_WEIGHTS: AlgorithmWeights = {
  interestMatch: 0.50,
  engagementPotential: 0.30,
  diversity: 0.05,
  credibility: 0.05,
  novelty: 0.10
};

const DEFAULT_BALANCED_WEIGHTS: AlgorithmWeights = {
  interestMatch: 0.25,
  engagementPotential: 0.20,
  diversity: 0.25,
  credibility: 0.20,
  novelty: 0.10
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStage] = useState<Stage>('landing');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [history, setHistory] = useState<Interaction[]>([]);
  const [algorithmMode, setAlgorithmMode] = useState<'engagement' | 'balanced'>('engagement');
  const [weights, setWeights] = useState<AlgorithmWeights>(DEFAULT_ENGAGEMENT_WEIGHTS);
  
  // Learned preference matrix (starts neutral at 0.50 for all categories)
  const [learnedPreferences, setLearnedPreferences] = useState<{ [cat: string]: number }>({
    'Football': 0.50,
    'Technology': 0.50,
    'Gaming': 0.50,
    'Science': 0.50,
    'Cooking': 0.50,
    'Fashion': 0.50,
    'Music': 0.50,
    'Travel': 0.50,
    'Environment': 0.50,
    'Finance': 0.50
  });

  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [lastReaction, setLastReaction] = useState<{ engagementPercent: number; reactionText: string; reactionEmoji: string } | null>(null);

  // Compute candidates for current state
  const currentOptions = getRecommendationCandidates(selectedCharacter, history, learnedPreferences, weights);

  const makeRecommendation = (content: ContentItem) => {
    setSelectedContent(content);
    
    // 1. Calculate reaction
    const reaction = calculateEngagement(selectedCharacter, content, history);
    setLastReaction(reaction);

    // 2. Score breakdown
    const scoreInfo = calculateRecommendationScore(selectedCharacter, content, history, learnedPreferences, weights);

    // 3. Record interaction
    const interaction: Interaction = {
      round: currentRound,
      contentId: content.id,
      characterId: selectedCharacter.id,
      category: content.category,
      subcategory: content.subcategory,
      engagementPercent: reaction.engagementPercent,
      reactionText: reaction.reactionText,
      reactionEmoji: reaction.reactionEmoji,
      mode: algorithmMode,
      scoreBreakdown: scoreInfo.breakdown
    };

    setHistory(prev => [...prev, interaction]);

    // 4. Preference Learning update
    // Higher engagement raises learned preference; lower engagement decreases it
    setLearnedPreferences(prev => {
      const currentLearned = prev[content.category] ?? 0.50;
      const signal = reaction.engagementPercent / 100;
      const alpha = 0.35; // learning rate
      const updated = (1 - alpha) * currentLearned + alpha * signal;
      return {
        ...prev,
        [content.category]: Number(updated.toFixed(2))
      };
    });
  };

  const advanceRound = () => {
    setSelectedContent(null);
    setLastReaction(null);

    // Check transition thresholds
    if (currentRound === 5 && stage === 'simulation') {
      // Transition to Algorithm Reveal after Round 5 of Challenge 1
      setStage('reveal');
    } else if (currentRound === 8 && stage === 'balanced-challenge') {
      // Transition to Feed Comparison after Round 8
      setStage('feed-comparison');
    } else {
      setCurrentRound(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setStage('landing');
    setSelectedCharacter(CHARACTERS[0]);
    setCurrentRound(1);
    setHistory([]);
    setAlgorithmMode('engagement');
    setWeights(DEFAULT_ENGAGEMENT_WEIGHTS);
    setLearnedPreferences({
      'Football': 0.50,
      'Technology': 0.50,
      'Gaming': 0.50,
      'Science': 0.50,
      'Cooking': 0.50,
      'Fashion': 0.50,
      'Music': 0.50,
      'Travel': 0.50,
      'Environment': 0.50,
      'Finance': 0.50
    });
    setSelectedContent(null);
    setLastReaction(null);
  };

  // Helper when transitioning to balanced mode
  const switchStageToBalanced = () => {
    setAlgorithmMode('balanced');
    setWeights(DEFAULT_BALANCED_WEIGHTS);
    setCurrentRound(6);
    setStage('balanced-challenge');
  };

  const [isTutorialActive, setIsTutorialActive] = useState<boolean>(() => {
    return localStorage.getItem('algorithmLensTutorialCompleted') !== 'true';
  });

  const startTutorial = () => {
    setIsTutorialActive(true);
  };

  const completeTutorial = () => {
    localStorage.setItem('algorithmLensTutorialCompleted', 'true');
    setIsTutorialActive(false);
  };

  const skipTutorial = () => {
    localStorage.setItem('algorithmLensTutorialCompleted', 'true');
    setIsTutorialActive(false);
  };

  return (
    <GameContext.Provider value={{
      stage,
      setStage: (s: Stage) => {
        if (s === 'balanced-challenge') {
          switchStageToBalanced();
        } else {
          setStage(s);
        }
      },
      selectedCharacter,
      setSelectedCharacter,
      currentRound,
      history,
      learnedPreferences,
      algorithmMode,
      weights,
      setWeights,
      currentOptions,
      selectedContent,
      lastReaction,
      makeRecommendation,
      advanceRound,
      resetGame,
      isTutorialActive,
      startTutorial,
      skipTutorial,
      completeTutorial
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};

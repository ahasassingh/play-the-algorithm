import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { IntroPage } from './pages/IntroPage';
import { CharacterProfilePage } from './pages/CharacterProfilePage';
import { SimulationView } from './pages/SimulationView';
import { AlgorithmReveal } from './pages/AlgorithmReveal';
import { BalancedChallenge } from './pages/BalancedChallenge';
import { FeedComparisonView } from './pages/FeedComparisonView';
import { ReflectionView } from './pages/ReflectionView';
import { ResultsView } from './pages/ResultsView';

const GameRouter: React.FC = () => {
  const { stage } = useGame();

  return (
    <div className="min-h-screen bg-[#07070b] anime-grid-bg text-slate-100 flex flex-col font-sans selection:bg-[#00F0FF] selection:text-[#07070b]">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {stage === 'landing' && <LandingPage />}
        {stage === 'intro' && <IntroPage />}
        {stage === 'character-select' && <IntroPage />}
        {stage === 'character-profile' && <CharacterProfilePage />}
        {stage === 'simulation' && <SimulationView />}
        {stage === 'reveal' && <AlgorithmReveal />}
        {stage === 'balanced-challenge' && <BalancedChallenge />}
        {stage === 'feed-comparison' && <FeedComparisonView />}
        {stage === 'reflection' && <ReflectionView />}
        {stage === 'results' && <ResultsView />}
      </main>
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;

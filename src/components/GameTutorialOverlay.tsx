import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { t } from '../utils/i18n';
import { soundFx } from '../utils/sound';
import {
  Sparkles,
  ArrowRight,
  Target,
  Brain,
  ShieldCheck,
  Zap,
  HelpCircle,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';

export type TutorialStep =
  | 'WELCOME'
  | 'MEET'
  | 'DECISION'
  | 'PREDICT'
  | 'RESULT'
  | 'LEARNING'
  | 'FEEDBACK_LOOP'
  | 'OBJECTIVES'
  | 'WHY'
  | 'REALIZATION'
  | 'READY';

const STEP_ORDER: TutorialStep[] = [
  'WELCOME',
  'MEET',
  'DECISION',
  'PREDICT',
  'RESULT',
  'LEARNING',
  'FEEDBACK_LOOP',
  'OBJECTIVES',
  'WHY',
  'REALIZATION',
  'READY',
];

interface GameTutorialOverlayProps {
  onStepChange?: (step: TutorialStep) => void;
  selectedOption?: any;
  predictionMade?: boolean;
}

export const GameTutorialOverlay: React.FC<GameTutorialOverlayProps> = ({
  onStepChange,
  selectedOption,
  predictionMade,
}) => {
  const { selectedCharacter, completeTutorial, skipTutorial } = useGame();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentStep = STEP_ORDER[currentStepIndex];

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, []);

  // Notify parent of step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  // Auto-advance step 3 (DECISION) when user actually clicks a content option
  useEffect(() => {
    if (currentStep === 'DECISION' && selectedOption) {
      handleNextStep();
    }
  }, [selectedOption, currentStep]);

  // Auto-advance step 4 (PREDICT) when prediction is locked
  useEffect(() => {
    if (currentStep === 'PREDICT' && predictionMade) {
      handleNextStep();
    }
  }, [predictionMade, currentStep]);

  const handleNextStep = () => {
    soundFx.play('click');
    if (currentStepIndex < STEP_ORDER.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      soundFx.play('complete');
      completeTutorial();
    }
  };

  const handleSkip = () => {
    soundFx.play('swipe');
    skipTutorial();
  };

  const isInteractiveStep = currentStep === 'DECISION' || currentStep === 'PREDICT';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-4 font-mono select-none">
      {/* Semi-transparent Dim Backdrop overlay - non-blocking during interactive steps */}
      <div
        className={`absolute inset-0 bg-[#07070b]/75 backdrop-blur-[4px] transition-opacity ${
          isInteractiveStep ? 'pointer-events-none opacity-40' : 'pointer-events-auto opacity-100'
        }`}
      />

      {/* Top Tutorial Bar */}
      <div className="relative z-50 max-w-5xl mx-auto w-full flex items-center justify-between pointer-events-auto pt-2">
        <div className="flex items-center gap-2 bg-[#0d0e15] px-3.5 py-1.5 rounded-full border border-[#00F0FF]/40 text-[#00F0FF] text-xs shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Zap size={14} className="text-[#FF0055] animate-pulse" />
          <span>
            [ TUTORIAL MODE &bull; STEP {currentStepIndex + 1} / {STEP_ORDER.length} ]
          </span>
        </div>

        {/* Minimal Step Dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {STEP_ORDER.map((s, idx) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-6 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]'
                  : idx < currentStepIndex
                  ? 'w-2 bg-[#00FF9D]'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Skip Tutorial Button */}
        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 bg-[#0d0e15] hover:bg-[#131520] text-slate-400 hover:text-white border border-white/10 rounded-full text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>{t('tutorial.ready.skip')}</span>
          <X size={14} />
        </button>
      </div>

      {/* Main Center/Top Dynamic Tutorial Modal Card */}
      <div className={`relative z-50 max-w-xl w-full mx-auto pointer-events-auto transition-all ${
        isInteractiveStep ? 'mt-4 mb-auto' : 'my-auto'
      }`}>
        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME */}
          {currentStep === 'WELCOME' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="glass-panel border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-center space-y-6 hud-corner-box"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#07070b] border border-[#00F0FF]/40 text-[#00F0FF] text-xs tracking-widest uppercase">
                <Sparkles size={14} className="text-[#FF0055]" />
                <span>ALGORITHM ONBOARDING</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
                  {t('tutorial.welcome.title')}
                </h2>
                <p className="text-slate-300 text-sm font-sans">
                  {t('tutorial.welcome.subtitle')}
                </p>
              </div>

              <div className="bg-[#07070b] p-4 rounded-2xl border border-white/10 space-y-3 text-left">
                <div className="flex items-start gap-2 text-xs font-sans text-slate-200">
                  <span className="text-[#00F0FF] font-mono font-bold">01.</span>
                  <span>{t('tutorial.welcome.rule1')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-sans text-[#FFE600] border-t border-white/10 pt-2">
                  <span className="font-mono font-bold">02.</span>
                  <span>{t('tutorial.welcome.catch')}</span>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-4 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-base rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer uppercase"
              >
                <span>{t('tutorial.welcome.button')}</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: MEET YOUR USER */}
          {currentStep === 'MEET' && (
            <motion.div
              key="meet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-center space-y-6 hud-corner-box"
            >
              <span className="text-xs text-slate-400 uppercase tracking-widest block font-mono">
                {t('tutorial.meet.title')}
              </span>

              <div className="flex flex-col items-center gap-3">
                <div className="p-1 rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#FF0055] shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                  <img
                    src={selectedCharacter.avatar}
                    alt={selectedCharacter.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#07070b]"
                  />
                </div>
                <h3 className="text-2xl font-black text-white font-display">
                  {t('tutorial.meet.greeting', { name: selectedCharacter.name })}
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  {t('tutorial.meet.explanation')}
                </p>
              </div>

              {/* Character Interests Chips */}
              <div className="bg-[#07070b] p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                  INTEREST SIGNALS
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedCharacter.primaryInterests.map((interest, i) => (
                    <motion.span
                      key={interest}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className="px-3 py-1 bg-[#00F0FF]/15 text-[#00F0FF] text-xs font-mono font-bold rounded-lg border border-[#00F0FF]/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </div>

              <p className="text-xs font-mono text-[#00FF9D]">
                {t('tutorial.meet.conclusion')}
              </p>

              <button
                onClick={handleNextStep}
                className="w-full py-4 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-base rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer uppercase"
              >
                <span>{t('tutorial.meet.button')}</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 3: DECISION (SPOTLIGHT OVER CONTENT OPTIONS) */}
          {currentStep === 'DECISION' && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-panel border-2 border-[#00F0FF] rounded-3xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.3)] text-center space-y-4 hud-corner-box"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold animate-pulse">
                <Target size={14} className="text-[#FF0055]" />
                <span>{t('tutorial.decision.title')}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {t('tutorial.decision.prompt')}
              </h3>
              <p className="text-xs text-slate-300 font-sans">
                {t('tutorial.decision.subprompt', { name: selectedCharacter.name })}
              </p>
              <div className="p-3 bg-[#07070b] rounded-xl border border-white/10 text-xs text-[#FFE600]">
                👉 Click any content card below in the feed to recommend it!
              </div>
            </motion.div>
          )}

          {/* STEP 4: PREDICT */}
          {currentStep === 'PREDICT' && (
            <motion.div
              key="predict"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-panel border-2 border-[#FFE600] rounded-3xl p-6 shadow-[0_0_40px_rgba(255,230,0,0.25)] text-center space-y-4 hud-corner-box"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/15 border border-[#FFE600]/40 text-[#FFE600] text-xs font-bold">
                <Brain size={14} />
                <span>{t('tutorial.predict.title')}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {t('tutorial.predict.prompt', { name: selectedCharacter.name })}
              </h3>
              <div className="p-3 bg-[#07070b] rounded-xl border border-white/10 text-xs text-[#00F0FF]">
                👇 Select HIGH, MEDIUM, or LOW in the prediction panel below.
              </div>
            </motion.div>
          )}

          {/* STEP 5: RESULT & WATCHING */}
          {currentStep === 'RESULT' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-panel border border-[#00FF9D]/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,255,157,0.2)] text-center space-y-4 hud-corner-box"
            >
              <span className="text-xs text-[#00FF9D] font-bold uppercase tracking-wider block">
                STEP 05 // REACTION RESULT
              </span>
              <h3 className="text-xl font-bold text-white">
                Observe {selectedCharacter.name}'s Engagement!
              </h3>
              <p className="text-xs text-slate-300 font-sans">
                Notice how watch time percentage reflects interest alignment.
              </p>
              <button
                onClick={handleNextStep}
                className="w-full py-3.5 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer uppercase"
              >
                <span>CONTINUE TO LEARNING SIGNAL →</span>
              </button>
            </motion.div>
          )}

          {/* STEP 6: LEARNING (PREFERENCE MATRIX HIGHLIGHT) */}
          {currentStep === 'LEARNING' && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-panel border border-[#00F0FF]/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)] text-center space-y-4 hud-corner-box"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold">
                <Brain size={14} />
                <span>{t('tutorial.learning.title')}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {t('tutorial.learning.explanation')}
              </p>
              <p className="text-xs text-slate-300 font-sans">
                {t('tutorial.learning.subexplanation')}
              </p>

              <div className="p-3 bg-[#07070b] rounded-xl border border-[#00FF9D]/40 text-[#00FF9D] text-xs font-bold">
                👉 {t('tutorial.learning.conclusion')}
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-3.5 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer uppercase"
              >
                <span>{t('tutorial.learning.button')}</span>
              </button>
            </motion.div>
          )}

          {/* STEP 7: THE FEEDBACK LOOP DIAGRAM */}
          {currentStep === 'FEEDBACK_LOOP' && (
            <motion.div
              key="feedbackLoop"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel border-2 border-[#00F0FF] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.3)] text-center space-y-5 hud-corner-box"
            >
              <h3 className="text-2xl font-black text-white uppercase font-display tracking-tight">
                {t('tutorial.feedbackLoop.title')}
              </h3>

              {/* Animated Cyclic Node Diagram */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2">
                <div className="p-3 bg-[#07070b] border border-[#00F0FF]/40 rounded-xl text-[#00F0FF] font-bold">
                  1. {t('tutorial.feedbackLoop.step1')}
                </div>
                <div className="p-3 bg-[#07070b] border border-[#FF0055]/40 rounded-xl text-[#FF0055] font-bold">
                  2. {t('tutorial.feedbackLoop.step2')}
                </div>
                <div className="p-3 bg-[#07070b] border border-[#FFE600]/40 rounded-xl text-[#FFE600] font-bold">
                  3. {t('tutorial.feedbackLoop.step3')}
                </div>
                <div className="p-3 bg-[#07070b] border border-[#00FF9D]/40 rounded-xl text-[#00FF9D] font-bold">
                  4. {t('tutorial.feedbackLoop.step4')}
                </div>
              </div>

              <div className="text-xs text-slate-300 font-sans leading-relaxed">
                {t('tutorial.feedbackLoop.explanation')}
              </div>

              <div className="text-sm font-black text-[#FF0055] font-mono tracking-wider uppercase">
                {t('tutorial.feedbackLoop.emphasis')}
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-4 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-base rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all cursor-pointer uppercase"
              >
                <span>{t('tutorial.feedbackLoop.button')}</span>
              </button>
            </motion.div>
          )}

          {/* STEP 8: OBJECTIVES (ENGAGEMENT VS DIVERSITY) */}
          {currentStep === 'OBJECTIVES' && (
            <motion.div
              key="objectives"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-panel border border-white/20 rounded-3xl p-6 text-center space-y-4 hud-corner-box"
            >
              <h3 className="text-xl font-bold text-white uppercase font-display">
                {t('tutorial.objectives.title')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="bg-[#07070b] p-3.5 rounded-xl border border-[#00F0FF]/40 space-y-1">
                  <span className="text-[10px] text-[#00F0FF] font-bold block">
                    {t('tutorial.objectives.obj1Title')}
                  </span>
                  <p className="text-xs text-slate-300 font-sans">
                    {t('tutorial.objectives.obj1Desc')}
                  </p>
                </div>

                <div className="bg-[#07070b] p-3.5 rounded-xl border border-[#FF0055]/40 space-y-1">
                  <span className="text-[10px] text-[#FF0055] font-bold block">
                    {t('tutorial.objectives.obj2Title')}
                  </span>
                  <p className="text-xs text-slate-300 font-sans">
                    {t('tutorial.objectives.obj2Desc')}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans">
                {t('tutorial.objectives.explanation')}
              </p>

              <button
                onClick={handleNextStep}
                className="w-full py-3.5 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer uppercase"
              >
                <span>{t('tutorial.objectives.button')}</span>
              </button>
            </motion.div>
          )}

          {/* STEP 9: WHY BUTTON */}
          {currentStep === 'WHY' && (
            <motion.div
              key="why"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-panel border border-[#00F0FF]/40 rounded-3xl p-6 text-center space-y-4 hud-corner-box"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold">
                <HelpCircle size={14} />
                <span>{t('tutorial.why.title')}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {t('tutorial.why.explanation')}
              </p>
              <p className="text-xs font-mono text-[#00FF9D]">
                {t('tutorial.why.subexplanation')}
              </p>
              <button
                onClick={handleNextStep}
                className="w-full py-3.5 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer uppercase"
              >
                <span>{t('tutorial.why.button')}</span>
              </button>
            </motion.div>
          )}

          {/* STEP 10: THE REALIZATION */}
          {currentStep === 'REALIZATION' && (
            <motion.div
              key="realization"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-panel border-2 border-[#FF0055] rounded-3xl p-6 sm:p-8 text-center space-y-5 hud-corner-box shadow-[0_0_50px_rgba(255,0,85,0.3)]"
            >
              <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
                {t('tutorial.realization.title')}
              </h3>

              <div className="p-4 bg-[#07070b] rounded-2xl border border-[#FF0055]/40 space-y-2 text-xs font-sans text-slate-200">
                <p className="font-mono text-[#FF0055] font-bold text-sm">
                  {t('tutorial.realization.line1')}
                </p>
                <p>{t('tutorial.realization.line2')}</p>
                <p className="text-slate-300">{t('tutorial.realization.line3')}</p>
                <p className="text-[#00F0FF] font-semibold">{t('tutorial.realization.line4')}</p>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-4 bg-[#00F0FF] hover:bg-[#33f3ff] text-[#07070b] font-black text-base rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all cursor-pointer uppercase"
              >
                <span>{t('tutorial.realization.button')}</span>
              </button>
            </motion.div>
          )}

          {/* STEP 11: TUTORIAL READY */}
          {currentStep === 'READY' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel border-2 border-[#00FF9D] rounded-3xl p-6 sm:p-8 text-center space-y-6 hud-corner-box shadow-[0_0_60px_rgba(0,255,157,0.3)]"
            >
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight uppercase">
                  {t('tutorial.ready.title')}
                </h2>
                <p className="text-xl font-bold text-[#00FF9D] font-mono">
                  {t('tutorial.ready.subtitle')}
                </p>
              </div>

              <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                {t('tutorial.ready.tagline')}
              </p>

              <button
                onClick={handleNextStep}
                className="w-full py-5 bg-[#00FF9D] hover:bg-[#33ffaa] text-[#07070b] font-black text-lg rounded-2xl shadow-[0_0_40px_rgba(0,255,157,0.5)] flex items-center justify-center gap-3 transition-all hover:scale-105 cursor-pointer uppercase"
              >
                <Play size={20} className="fill-[#07070b]" />
                <span>{t('tutorial.ready.start')}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Indicator */}
      <div className="relative z-50 text-center text-[10px] text-slate-500 font-mono pb-1 pointer-events-auto">
        Algorithm Lens &bull; Interactive Game Walkthrough System
      </div>
    </div>
  );
};

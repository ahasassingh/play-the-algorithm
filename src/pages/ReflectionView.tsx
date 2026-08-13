import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { HelpCircle, Award, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReflectionView: React.FC = () => {
  const { setStage, selectedCharacter } = useGame();
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});

  const questions = [
    {
      id: 'q1',
      question: `What happened when you repeatedly recommended content ${selectedCharacter.name} liked?`,
      options: [
        { key: 'A', text: 'The system stopped learning.' },
        { key: 'B', text: 'Engagement signals reinforced preferences, making future options increasingly narrow.', correct: true }
      ]
    },
    {
      id: 'q2',
      question: 'What changed when you prioritized topic diversity in Stage 2?',
      options: [
        { key: 'A', text: 'The feed exposed the user to broader perspectives while maintaining reasonable engagement.', correct: true },
        { key: 'B', text: 'The character completely deleted their social media account.' }
      ]
    },
    {
      id: 'q3',
      question: 'What is the most critical question to ask when noticing a social feed becoming repetitive?',
      options: [
        { key: 'A', text: '"Why am I seeing this, and what is the system optimizing for?"', correct: true },
        { key: 'B', text: '"How fast is my Wi-Fi speed?"' }
      ]
    }
  ];

  const handleSelectOption = (qId: string, optionKey: string) => {
    setAnswers(prev => ({ ...prev, [qId]: optionKey }));
  };

  const isComplete = Object.keys(answers).length === questions.length;

  const handleFinish = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
    setStage('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={16} />
            <span>Interactive Media Literacy Quiz</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Reflection & Media Literacy Principles
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Test your understanding of algorithmic curation, feedback loops, and optimization goals!
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-slate-200">
                {idx + 1}. {q.question}
              </h3>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(q.id, opt.key)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? opt.correct
                            ? 'bg-emerald-950/80 border-emerald-400 text-white'
                            : 'bg-cyan-950/80 border-cyan-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && <CheckCircle2 size={16} className="text-cyan-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleFinish}
          disabled={!isComplete}
          className={`w-full py-4 font-extrabold text-base rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all ${
            isComplete
              ? 'bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 cursor-pointer hover:scale-[1.02]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <span>Calculate Insight Score</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

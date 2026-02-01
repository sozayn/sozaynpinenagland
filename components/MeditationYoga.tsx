import React, { useState, useEffect, useRef } from 'react';
// FIX: Import SparklesIcon instead of the non-exported Sparkles to resolve local declaration error.
import { LotusIcon, YogaIcon, PlayIcon, PauseIcon, StopCircleIcon, BrainCircuitIcon, SparklesIcon } from './icons';
import { generatePracticeSession } from '../services/geminiService';
import { Loader2, ArrowLeft, Wind, Moon, Sun, Zap } from 'lucide-react';

interface PracticeStep {
  duration: number; // in seconds
  instruction: string;
  mantra: string;
  poseName?: string;
}

interface Practice {
  title: string;
  description: string;
  mantra: string;
  type: 'Meditation' | 'Yoga';
  steps: PracticeStep[];
}

const energyStates = [
  { id: 'weary', label: 'Weary', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'restless', label: 'Restless', icon: Wind, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'scattered', label: 'Scattered', icon: BrainCircuitIcon, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  // Updated icon reference to use SparklesIcon from local icons module.
  { id: 'uninspired', label: 'Uninspired', icon: SparklesIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'intense', label: 'Seeking Power', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

const BreathingOrb = () => (
    <div className="relative w-64 h-64 flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="orb-inner w-32 h-32 bg-brand-accent rounded-full shadow-glow animate-breathe flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-white/30 animate-spin-slow"></div>
        </div>
        <style>{`
            @keyframes breathe {
                0%, 100% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(1.8); filter: brightness(1.3); }
            }
            @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .animate-breathe { animation: breathe 8s ease-in-out infinite; }
            .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        `}</style>
    </div>
);

interface MeditationYogaProps {
  onPracticeComplete: (type: 'Meditation' | 'Yoga', duration: number) => void;
}

const MeditationYoga: React.FC<MeditationYogaProps> = ({ onPracticeComplete }) => {
  const [view, setView] = useState<'selection' | 'energy' | 'loading' | 'active'>('selection');
  const [practiceType, setPracticeType] = useState<'Meditation' | 'Yoga' | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string>('');
  const [activePractice, setActivePractice] = useState<Practice | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const intervalRef = useRef<number | null>(null);

  const startAIGeneration = async (energy: string) => {
    setSelectedEnergy(energy);
    setView('loading');
    try {
        const session = await generatePracticeSession(practiceType!, energy);
        setActivePractice({ ...session, type: practiceType });
        setTimeLeft(session.steps[0].duration);
        setStepIndex(0);
        setView('active');
        setIsPaused(false);
    } catch (err) {
        alert("The cosmos is currently obscured. Please try again.");
        setView('energy');
    }
  };

  useEffect(() => {
    if (view === 'active' && activePractice && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (stepIndex < activePractice.steps.length - 1) {
              const nextIndex = stepIndex + 1;
              setStepIndex(nextIndex);
              return activePractice.steps[nextIndex].duration;
            } else {
              const totalMins = Math.round(activePractice.steps.reduce((acc, s) => acc + s.duration, 0) / 60);
              onPracticeComplete(activePractice.type, totalMins);
              handleStop();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [view, activePractice, isPaused, stepIndex]);

  const handleStop = () => {
    setView('selection');
    setActivePractice(null);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (view === 'loading') {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <div className="relative">
                <Loader2 className="w-16 h-16 text-brand-accent animate-spin" />
                {/* Updated component to use SparklesIcon from icons module. */}
                <SparklesIcon className="absolute -top-2 -right-2 w-6 h-6 text-brand-gold animate-pulse" />
            </div>
            <div className="text-center">
                <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-2">Consulting the Guardians</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide italic">Tailoring a journey for your {selectedEnergy} spirit...</p>
            </div>
        </div>
    );
  }

  if (view === 'active' && activePractice) {
    const currentStep = activePractice.steps[stepIndex];
    return (
        <div className="h-full flex flex-col items-center justify-between p-4 sm:p-12 animate-fade-in">
            <div className="text-center max-w-2xl">
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] mb-4 block">Current Initiation</span>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">{activePractice.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium italic">"{activePractice.mantra}"</p>
            </div>

            <div className="flex flex-col items-center gap-12">
                <BreathingOrb />
                <div className="text-center space-y-4">
                    {currentStep.poseName && <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest">{currentStep.poseName}</h2>}
                    <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-200 font-serif max-w-xl leading-relaxed">
                        {currentStep.instruction}
                    </p>
                    <div className="pt-4">
                        <span className="px-4 py-1.5 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-gold/20">
                            Mantra: {currentStep.mantra}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-8 w-full max-w-md">
                <div className="w-full flex items-center justify-between px-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">{formatTime(timeLeft)}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {stepIndex + 1} of {activePractice.steps.length}</span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-accent transition-all duration-1000" style={{ width: `${((stepIndex + 1) / activePractice.steps.length) * 100}%` }}></div>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => setIsPaused(!isPaused)} className="w-16 h-16 rounded-2xl bg-brand-accent text-white flex items-center justify-center shadow-glow hover:scale-105 transition-all">
                        {isPaused ? <PlayIcon size={24} /> : <PauseIcon size={24} />}
                    </button>
                    <button onClick={handleStop} className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                        <StopCircleIcon size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col items-center justify-center p-6 space-y-12">
        {view === 'energy' ? (
            <div className="w-full space-y-12 animate-slide-up">
                <div className="text-center space-y-4">
                    <button onClick={() => setView('selection')} className="flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-widest mb-8 mx-auto hover:gap-4 transition-all">
                        <ArrowLeft size={14} /> Back to Choice
                    </button>
                    <h1 className="font-serif text-5xl sm:text-7xl font-bold text-slate-900 dark:text-white">How is your spirit?</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Select your current energy to align the session.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {energyStates.map(state => (
                        <button 
                            key={state.id}
                            onClick={() => startAIGeneration(state.label)}
                            className={`group p-8 rounded-3xl border border-transparent transition-all hover:border-brand-accent hover:-translate-y-2 flex flex-col items-center gap-6 ${state.bg}`}
                        >
                            <state.icon size={40} className={`${state.color} group-hover:scale-110 transition-transform`} />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">{state.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <>
                <div className="text-center space-y-4 max-w-2xl animate-fade-in">
                    <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.5em] mb-4 block">Temple of Flow</span>
                    <h1 className="font-serif text-5xl sm:text-8xl font-bold text-slate-900 dark:text-white leading-tight">Return to the Center.</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-medium leading-relaxed">
                        Step away from the temporal noise. Choose a path to harmonize your mind and body through the ancient wisdom of the stars.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-slide-up">
                    <button 
                        onClick={() => { setPracticeType('Meditation'); setView('energy'); }}
                        className="group relative overflow-hidden p-12 bg-white dark:bg-brand-dark-secondary rounded-[40px] shadow-premium border border-slate-200 dark:border-slate-800 text-center transition-all hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-1000">
                            <LotusIcon size={120} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 dark:bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                <LotusIcon size={40} />
                            </div>
                            <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">Meditation</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">Calm the cognitive storms and inhabit the stillness of the void.</p>
                            <span className="inline-block px-6 py-2 bg-brand-accent text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-glow opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">Begin Journey</span>
                        </div>
                    </button>

                    <button 
                        onClick={() => { setPracticeType('Yoga'); setView('energy'); }}
                        className="group relative overflow-hidden p-12 bg-white dark:bg-brand-dark-secondary rounded-[40px] shadow-premium border border-slate-200 dark:border-slate-800 text-center transition-all hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-1000">
                            <YogaIcon size={120} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <YogaIcon size={40} />
                            </div>
                            <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">Yoga</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">Forge a bridge between breath and bone through sacred geometry.</p>
                            <span className="inline-block px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">Begin Flow</span>
                        </div>
                    </button>
                </div>
            </>
        )}
    </div>
  );
};

export default MeditationYoga;
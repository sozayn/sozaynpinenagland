
import React, { useState, useMemo, useEffect } from 'react';
import type { UserProfile, Book, Goal, GoalAspect } from '../types';
import { generateAttributesForAspects, generateGoalsForAspects } from '../services/geminiService';
import { Edit, Save, Loader, BookOpen, BrainCircuit, Check, X, Image as ImageIcon, TrendingUp, Sparkles, Trophy } from 'lucide-react';
import { GameIcon, YogaIcon } from './icons';

interface ProfileGoalsProps {
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  books: Book[];
}

const ReadingProgressChart = ({ progress, books }: { progress: { [key: number]: number }, books: Book[] }) => (
    <div className="space-y-4">
        {books.map(book => (
            <div key={book.id}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{book.title}</span>
                    <span className="text-xs font-black text-brand-accent">{progress[book.id] || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-brand-accent h-full rounded-full transition-all duration-1000" style={{ width: `${progress[book.id] || 0}%` }}></div>
                </div>
            </div>
        ))}
    </div>
);

const WellnessHeatmap = ({ log }: { log: UserProfile['wellnessLog'] }) => {
    const today = new Date();
    const days = Array.from({ length: 112 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();
    
    const logMap = new Map(log.map(l => [l.date, l]));

    return (
        <div className="pt-2">
            <div className="grid grid-cols-14 gap-1.5">
                {days.map(day => {
                    const entry = logMap.get(day);
                    let colorClass = 'bg-slate-100 dark:bg-slate-800/50';
                    if (entry) {
                        colorClass = entry.type === 'Meditation' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
                    }
                    return <div key={day} className={`w-full aspect-square rounded-sm transition-all duration-500 hover:scale-150 z-0 hover:z-10 cursor-help ${colorClass}`} title={day} />;
                })}
            </div>
            <div className="flex justify-between mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>16 weeks ago</span>
                <span>Today</span>
            </div>
            <style>{`.grid-cols-14 { grid-template-columns: repeat(14, minmax(0, 1fr)); }`}</style>
        </div>
    );
};

const ProfileGoals: React.FC<ProfileGoalsProps> = ({ profile, onUpdateProfile, books }) => {
  const [goalFilter, setGoalFilter] = useState('All');
  
  const filteredGoals = useMemo(() => {
    if (goalFilter === 'All') return profile.goals;
    const isCompleted = goalFilter === 'Completed';
    return profile.goals.map(aspect => ({
      ...aspect,
      finalGoals: aspect.finalGoals.filter(goal => goal.completed === isCompleted)
    })).filter(aspect => aspect.finalGoals.length > 0);
  }, [profile.goals, goalFilter]);

  const handleGoalCompletionToggle = (aspectTitle: string, goalId: string) => {
    const updatedGoals = profile.goals.map(aspect => {
      if (aspect.aspect === aspectTitle) {
        return {
          ...aspect,
          finalGoals: aspect.finalGoals.map(goal => {
            if (goal.id === goalId) {
              return { ...goal, completed: !goal.completed };
            }
            return goal;
          })
        };
      }
      return aspect;
    });
    onUpdateProfile({ goals: updatedGoals });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Profile Banner */}
      <div className="relative overflow-hidden p-8 sm:p-12 bg-white dark:bg-brand-dark-secondary rounded-3xl shadow-premium border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-10">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Sparkles size={200} className="text-brand-accent" />
        </div>
        
        <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-brand-accent/20">
            <img src={profile.picture} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-4 border-white dark:border-brand-dark-secondary">
            <Trophy size={20} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em]">Master Seeker</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white leading-tight">{profile.name}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{profile.email}</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { title: 'Knowledge', icon: BookOpen, content: <ReadingProgressChart progress={profile.readingProgress} books={books} />, accent: 'text-indigo-500' },
          { title: 'Vibe Check', icon: YogaIcon, content: <WellnessHeatmap log={profile.wellnessLog} />, accent: 'text-emerald-500' },
          { title: 'AI Synergy', icon: BrainCircuit, content: <div className="text-center py-4"><span className="text-5xl font-black text-slate-900 dark:text-white">{profile.aiInteractionLog.length}</span><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Signals Transmitted</p></div>, accent: 'text-cyan-500' },
          { title: 'Intellect', icon: GameIcon, content: <div className="space-y-3 py-2">{profile.gameLog.length > 0 ? profile.gameLog.slice(-3).map((log, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{log.gameId.replace('-', ' ')}</span>
              <span className="text-sm font-black text-brand-accent">{log.score} IQ</span>
            </div>
          )) : <p className="text-center text-xs text-slate-400 py-6 font-bold uppercase tracking-widest">No trials yet</p>}</div>, accent: 'text-orange-500' }
        ].map((card, i) => (
          <div key={i} className="group p-8 bg-white dark:bg-brand-dark-secondary rounded-2xl shadow-premium border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{card.title}</h3>
              <card.icon className={`w-5 h-5 ${card.accent}`} />
            </div>
            {card.content}
          </div>
        ))}
      </div>

      {/* Modernized Goals */}
      <div className="p-10 bg-white dark:bg-brand-dark-secondary rounded-3xl shadow-premium border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div>
            <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-2">Intentions</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Tracking your cosmic evolution.</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {['All', 'Active', 'Completed'].map(filter => (
              <button key={filter} onClick={() => setGoalFilter(filter)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${goalFilter === filter ? 'bg-white dark:bg-brand-dark shadow-sm text-brand-accent' : 'text-slate-400 hover:text-slate-600'}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredGoals.map(aspect => (
              <div key={aspect.aspect} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-brand-accent rounded-full" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{aspect.aspect}</h3>
                </div>
                <div className="space-y-4">
                  {aspect.finalGoals.map(goal => (
                    <button 
                      key={goal.id} 
                      onClick={() => handleGoalCompletionToggle(aspect.aspect, goal.id)}
                      className={`w-full group text-left p-6 rounded-2xl border transition-all duration-300 flex items-center gap-6 ${
                        goal.completed 
                          ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20 opacity-60' 
                          : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 hover:border-brand-accent'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${
                        goal.completed ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 group-hover:border-brand-accent'
                      }`}>
                        {goal.completed && <Check size={14} strokeWidth={4} />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm mb-1 ${goal.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>{goal.title}</p>
                        <p className={`text-xs leading-relaxed ${goal.completed ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400 font-medium'}`}>{goal.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
             <div className="mx-auto w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-brand-accent mb-6">
                <BrainCircuit size={40} />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Initialize Your Journey</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 font-medium">Collaborate with Devatra AI to manifest your personal and professional evolution.</p>
             <button className="px-8 py-4 bg-brand-accent text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-glow hover:bg-brand-accent-hover transition-all">
                Summon the Guardian Wizard
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileGoals;

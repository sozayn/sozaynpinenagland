
import React from 'react';
import {
  BookOpenIcon,
  UsersIcon,
  MessageSquareIcon,
  ClockIcon,
  YogaIcon,
  StarIcon,
  GameIcon,
  UserCircleIcon,
  LogOutIcon,
} from './icons';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const navItems = [
  { name: 'Book Reader', icon: BookOpenIcon, color: 'text-indigo-500' },
  { name: 'Character Gallery', icon: UsersIcon, color: 'text-pink-500' },
  { name: 'Devatra AI', icon: MessageSquareIcon, color: 'text-cyan-500' },
  { name: 'History Explorer', icon: ClockIcon, color: 'text-amber-500' },
  { name: 'Meditation & Yoga', icon: YogaIcon, color: 'text-emerald-500' },
  { name: 'Astrology', icon: StarIcon, color: 'text-purple-500' },
  { name: 'Game', icon: GameIcon, color: 'text-orange-500' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen, onLogout }) => {
  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity duration-300 backdrop-blur-sm ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>
      
      <nav className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-brand-dark border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col z-30 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-24 flex items-center px-8">
          <div className="bg-brand-accent p-2 rounded-xl shadow-glow">
            <img src="https://drive.google.com/uc?export=view&id=1kx-FEkNXVDXS_ZVw9nI2cJU2ZiHCfRU1" alt="Pinenagland Logo" className="h-8 w-8 invert brightness-0" />
          </div>
          <span className="ml-4 font-bold text-xl tracking-tight text-slate-900 dark:text-white">Pinenagland</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Core Library</p>
          {navItems.map((item) => {
            const isActive = activeView === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleViewChange(item.name)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-brand-accent/10 text-brand-accent shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-brand-accent' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span className="ml-4">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-accent shadow-glow" />}
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button
            onClick={() => handleViewChange('Profile & Goals')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeView === 'Profile & Goals'
                ? 'bg-indigo-50 dark:bg-brand-accent/10 text-brand-accent'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <UserCircleIcon className="h-5 w-5" />
            <span className="ml-4">Profile & Goals</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
          >
            <LogOutIcon className="h-5 w-5" />
            <span className="ml-4">Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

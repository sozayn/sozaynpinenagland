import React from 'react';
import type { FontSettings } from '../types';
import { Sun, Moon, Type, Pilcrow } from 'lucide-react';

interface FontSettingsPopoverProps {
  settings: FontSettings;
  onChange: (settings: Partial<FontSettings>) => void;
  onClose: () => void;
}

const fontSizes: FontSettings['fontSize'][] = ['text-base', 'text-lg', 'text-xl', 'text-2xl'];

const FontSettingsPopover: React.FC<FontSettingsPopoverProps> = ({ settings, onChange, onClose }) => {
  const currentSizeIndex = fontSizes.indexOf(settings.fontSize);

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} aria-hidden="true" />
      <div className="absolute top-14 right-0 w-72 bg-brand-dark-secondary rounded-lg shadow-2xl border border-brand-dark-tertiary z-20 p-6 text-gray-300 font-sans">
        
        {/* Theme */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">THEME</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onChange({ theme: 'light' })} 
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-base font-medium transition-colors ${settings.theme === 'light' ? 'bg-brand-accent text-white' : 'bg-brand-dark-tertiary text-gray-300 hover:bg-gray-700'}`}
            >
              <Sun size={16} /> Light
            </button>
            <button 
              onClick={() => onChange({ theme: 'dark' })} 
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-base font-medium transition-colors ${settings.theme === 'dark' ? 'bg-brand-accent text-white' : 'bg-brand-dark-tertiary text-gray-300 hover:bg-gray-700'}`}
            >
              <Moon size={16} /> Dark
            </button>
          </div>
        </div>

        {/* Font Family */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">FONT FAMILY</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onChange({ fontFamily: 'font-serif' })} 
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-base font-medium transition-colors ${settings.fontFamily === 'font-serif' ? 'bg-brand-accent text-white' : 'bg-brand-dark-tertiary text-gray-300 hover:bg-gray-700'}`}
            >
              <Type size={16} /> Serif
            </button>
            <button 
              onClick={() => onChange({ fontFamily: 'font-sans' })} 
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-base font-medium transition-colors ${settings.fontFamily === 'font-sans' ? 'bg-brand-accent text-white' : 'bg-brand-dark-tertiary text-gray-300 hover:bg-gray-700'}`}
            >
              <Pilcrow size={16} /> Sans
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">FONT SIZE</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-serif text-gray-400">A</span>
            <div className="flex-1 flex items-center justify-between relative px-2">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-brand-dark-tertiary -translate-y-1/2"></div>
              {fontSizes.map((size, index) => (
                <button
                  key={size}
                  aria-label={`Set font size ${index + 1}`}
                  onClick={() => onChange({ fontSize: size })}
                  className={`w-5 h-5 rounded-full z-10 transition-colors ${currentSizeIndex === index ? 'bg-brand-accent' : 'bg-gray-500'}`}
                />
              ))}
            </div>
            <span className="text-3xl font-serif text-gray-400">A</span>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default FontSettingsPopover;
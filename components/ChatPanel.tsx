
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, BrainCircuitIcon, XIcon } from './icons';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  quickQuestions: string[];
  thinkingEnabled: boolean;
  onThinkingToggle: (enabled: boolean) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  quickQuestions, 
  thinkingEnabled, 
  onThinkingToggle 
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-brand-dark-secondary rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
      {/* Dynamic Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b transition-colors duration-500 ${thinkingEnabled ? 'bg-indigo-50/50 dark:bg-brand-accent/5 border-brand-accent/20' : 'bg-white dark:bg-brand-dark-secondary border-slate-100 dark:border-slate-800'}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="https://drive.google.com/uc?export=view&id=17oDZYUqVg1xIZdFD9xyTsrLp2T4g9YZL" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" alt="Devatra AI" />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-900 dark:text-white">Devatra AI</span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isLoading ? 'Processing...' : 'Online'}</span>
          </div>
        </div>
        
        <button 
          onClick={() => onThinkingToggle(!thinkingEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border font-bold text-[10px] uppercase tracking-wider ${
            thinkingEnabled 
              ? 'bg-brand-accent text-white border-brand-accent shadow-glow' 
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
          }`}
        >
          <BrainCircuitIcon className={`w-3.5 h-3.5 ${thinkingEnabled ? 'animate-pulse' : ''}`} />
          {thinkingEnabled ? 'Deep Thinking' : 'Standard'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
              message.role === 'user'
                ? 'bg-brand-accent text-white rounded-tr-sm shadow-premium'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700 shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-2 px-1 tracking-wider opacity-60">
              {message.role === 'ai' ? 'Devatra' : 'Seeker'}
            </span>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col gap-3">
                {thinkingEnabled && (
                  <div className="flex items-center gap-2 mb-1">
                    <BrainCircuitIcon className="w-3.5 h-3.5 text-brand-accent animate-spin-slow" />
                    <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Accessing Akashic Records...</span>
                  </div>
                )}
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800">
        <div className="mb-4 flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(q)}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-400 rounded-lg hover:border-brand-accent hover:text-brand-accent transition-all shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
        
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={thinkingEnabled ? "Inquire deeply..." : "Message Devatra..."}
              className="w-full pl-5 pr-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent outline-none transition-all dark:text-white shadow-premium"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3.5 rounded-xl bg-brand-accent text-white hover:bg-brand-accent-hover transition-all disabled:opacity-30 shadow-glow"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;

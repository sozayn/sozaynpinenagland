
import React from 'react';
import ChatPanel from './ChatPanel';
import { quickQuestions } from '../data/mockData';
import type { ChatMessage } from '../types';

interface DevatraPageProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  thinkingEnabled: boolean;
  onThinkingToggle: (enabled: boolean) => void;
}

const DevatraPage: React.FC<DevatraPageProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  thinkingEnabled, 
  onThinkingToggle 
}) => {
    return (
        <div className="h-full">
            <ChatPanel 
                messages={messages} 
                onSendMessage={onSendMessage} 
                isLoading={isLoading}
                quickQuestions={quickQuestions}
                thinkingEnabled={thinkingEnabled}
                onThinkingToggle={onThinkingToggle}
            />
        </div>
    );
};

export default DevatraPage;

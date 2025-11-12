
import React, { useRef, useEffect } from 'react';
import { Session } from '../types';
import Message from './Message';
import PromptInput from './PromptInput';

interface ChatViewProps {
  session: Session | undefined;
  isLoading: boolean;
  onSendMessage: (prompt: string) => void;
}

const WelcomeScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl font-bold text-green-400">Ollama Mission Control</h1>
        <p className="mt-2 text-green-500/80">Select a mission or start a new one.</p>
    </div>
);


const ChatView: React.FC<ChatViewProps> = ({ session, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  if (!session) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden glassmorphic m-4 rounded-xl">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {session.messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && session.messages[session.messages.length - 1]?.role === 'assistant' && (
          <div className="flex justify-start">
            <div className="p-4 rounded-lg bg-black/30">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-green-500/20">
        <PromptInput onSubmit={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatView;

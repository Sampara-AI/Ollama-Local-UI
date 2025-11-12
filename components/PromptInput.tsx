
import React, { useState, KeyboardEvent } from 'react';
import { SendIcon } from './icons';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your command..."
        className="w-full p-4 pr-16 bg-transparent text-green-300 placeholder-green-700 rounded-lg neumorphic-in focus:outline-none resize-none"
        rows={1}
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-green-400 transition-colors disabled:text-green-800 disabled:cursor-not-allowed hover:bg-green-500/20"
      >
        <SendIcon />
      </button>
    </div>
  );
};

export default PromptInput;

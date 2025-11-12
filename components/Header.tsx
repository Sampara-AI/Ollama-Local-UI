
import React from 'react';
import { ModelSelectorIcon } from './icons';

interface HeaderProps {
  models: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  sessionTitle: string;
}

const Header: React.FC<HeaderProps> = ({ models, selectedModel, onModelChange, sessionTitle }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-green-500/20 glassmorphic z-10">
      <h1 className="text-lg font-bold text-green-400 tracking-wider glow-text">
        {sessionTitle}
      </h1>
      <div className="flex items-center gap-2 neumorphic-in p-1 rounded-lg">
        <ModelSelectorIcon />
        <select
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="bg-transparent text-green-400 text-sm focus:outline-none appearance-none cursor-pointer pr-4"
        >
          {models.length === 0 && <option>Loading...</option>}
          {models.map((model) => (
            <option key={model} value={model} className="bg-[#1a1a1a] text-green-400">
              {model}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;

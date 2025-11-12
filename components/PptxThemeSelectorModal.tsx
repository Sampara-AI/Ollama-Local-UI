
import React from 'react';

interface PptxThemeSelectorModalProps {
  onGenerate: (theme: string) => void;
  onClose: () => void;
}

const themes = [
    { id: 'matrix', name: 'Matrix', bg: 'bg-black', text: 'text-green-400', previewText: '[LOGGED_IN]' },
    { id: 'professional', name: 'Professional', bg: 'bg-white', text: 'text-gray-800', previewText: 'Q3 Report' },
    { id: 'deep-space', name: 'Deep Space', bg: 'bg-gray-900', text: 'text-cyan-300', previewText: 'Exploration' },
];

const PptxThemeSelectorModal: React.FC<PptxThemeSelectorModalProps> = ({ onGenerate, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
        onClick={onClose}
    >
      <div 
        className="glassmorphic neumorphic-out p-8 rounded-xl w-full max-w-2xl text-green-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Select Presentation Theme</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {themes.map(theme => (
                <div 
                    key={theme.id} 
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-green-400 ${theme.bg}`}
                    onClick={() => onGenerate(theme.id)}
                >
                    <div className="h-24 flex items-center justify-center mb-2 rounded neumorphic-in">
                        <span className={`font-bold ${theme.text}`}>{theme.previewText}</span>
                    </div>
                    <p className={`text-center font-semibold ${theme.text}`}>{theme.name}</p>
                </div>
            ))}
        </div>
        <div className="mt-8 flex justify-center">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-red-800/50 text-red-300 hover:bg-red-700/80 rounded-lg neumorphic-out transition-colors"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default PptxThemeSelectorModal;


import React, { useState } from 'react';
import { CopyIcon, SaveIcon, CheckIcon } from './icons';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const extension = language === 'python' ? 'py' : language === 'html' ? 'html' : language === 'javascript' ? 'js' : 'txt';
    const defaultFilename = `snippet.${extension}`;
    const filename = prompt('Save file as:', defaultFilename);

    if (filename) {
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };


  return (
    <div className="my-4 rounded-lg neumorphic-in overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-black/30 text-xs text-green-500">
        <span>{language}</span>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1 hover:text-green-300 transition-colors">
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={handleSave} className="flex items-center gap-1 hover:text-green-300 transition-colors">
            <SaveIcon />
            Save As...
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm overflow-x-auto bg-transparent text-green-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;

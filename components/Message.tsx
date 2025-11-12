
import React from 'react';
import { Message as MessageType } from '../types';
import CodeBlock from './CodeBlock';
import { UserIcon, AssistantIcon } from './icons';

interface MessageProps {
  message: MessageType;
}

const parseContent = (content: string) => {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    const match = part.match(/^```(\w*)\n([\s\S]*?)```$/);
    if (match) {
      const language = match[1] || 'plaintext';
      const code = match[2];
      return { type: 'code', language, content: code, key: `code-${index}` };
    }
    return { type: 'text', content: part, key: `text-${index}` };
  }).filter(p => p.content.trim());
};

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const parsedParts = parseContent(message.content);

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-green-900/50">
          <AssistantIcon />
        </div>
      )}
      <div
        className={`max-w-2xl w-full p-4 rounded-lg ${
          isUser
            ? 'bg-green-900/30 neumorphic-out'
            : 'bg-black/30'
        }`}
      >
        <div className="prose prose-invert text-green-300 whitespace-pre-wrap">
            {parsedParts.map(part => {
                if (part.type === 'code') {
                    return <CodeBlock key={part.key} language={part.language} code={part.content} />;
                }
                return <p key={part.key} className="my-0">{part.content}</p>;
            })}
        </div>
      </div>
       {isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-gray-700/50">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default Message;

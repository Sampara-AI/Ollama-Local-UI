
import React from 'react';
import { Session } from '../types';
import { AddIcon, DeleteIcon, DownloadIcon, EditIcon } from './icons';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  editingSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onDownloadChat: () => void;
  onStartEdit: (id: string | null) => void;
  onRenameSession: (id: string, newTitle: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  activeSessionId, 
  editingSessionId,
  onNewChat, 
  onSelectSession, 
  onDeleteSession,
  onDownloadChat,
  onStartEdit,
  onRenameSession
}) => {
  return (
    <aside className="w-64 bg-[#111111]/80 p-4 flex flex-col glassmorphic h-full">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-black text-green-400 tracking-widest">OLLAMA</h1>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 w-full p-3 text-sm text-black bg-green-400 hover:bg-green-300 transition-all duration-300 neumorphic-out font-bold rounded-lg"
        >
          <AddIcon />
          New Mission
        </button>
        <button
          onClick={onDownloadChat}
          className="flex items-center justify-center gap-2 w-full p-3 text-sm text-green-400 bg-[#1a1a1a] hover:bg-[#222] transition-all duration-300 neumorphic-out font-bold rounded-lg"
        >
          <DownloadIcon />
          Download .MD
        </button>
      </div>

      <div className="mt-6 border-t border-green-500/20 pt-4">
        <h2 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">History</h2>
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                    if (editingSessionId !== session.id) {
                        onSelectSession(session.id);
                    }
                }}
                className={`relative group p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  activeSessionId === session.id
                    ? 'neumorphic-in bg-green-900/20'
                    : 'neumorphic-out hover:bg-green-500/10'
                }`}
              >
                {editingSessionId === session.id ? (
                  <>
                    <input
                      type="text"
                      defaultValue={session.title}
                      className="w-full bg-transparent text-green-200 focus:outline-none focus:ring-1 focus:ring-green-400 rounded px-1 -mx-1"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => onRenameSession(session.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          onRenameSession(session.id, (e.target as HTMLInputElement).value);
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          onStartEdit(null);
                        }
                      }}
                    />
                    <p className="text-xs text-green-500/60 mt-1">{new Date(session.createdAt).toLocaleString()}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm truncate text-green-300 pr-16">{session.title}</p>
                    <p className="text-xs text-green-500/60">{new Date(session.createdAt).toLocaleString()}</p>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onStartEdit(session.id); }}
                        className="p-1 rounded-full bg-blue-800/50 text-blue-300 hover:bg-blue-700/80"
                        aria-label="Rename session"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                        className="p-1 rounded-full bg-red-800/50 text-red-300 hover:bg-red-700/80"
                        aria-label="Delete session"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Session, Message } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getModels, streamChat } from './services/ollamaService';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import Header from './components/Header';

const App: React.FC = () => {
  const [sessions, setSessions] = useLocalStorage<Session[]>('ollama-sessions', []);
  const [activeSessionId, setActiveSessionId] = useLocalStorage<string | null>('ollama-active-session', null);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const availableModels = await getModels();
        setModels(availableModels);
        if (availableModels.length > 0) {
          const activeSession = sessions.find(s => s.id === activeSessionId);
          setSelectedModel(activeSession?.model || availableModels[0]);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeSession = useMemo(() => sessions.find(s => s.id === activeSessionId), [sessions, activeSessionId]);

  const createNewSession = useCallback(() => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      title: 'New Mission',
      model: selectedModel || models[0],
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, [models, selectedModel, setSessions, setActiveSessionId]);

  useEffect(() => {
    if (!activeSessionId && sessions.length > 0) {
      setActiveSessionId(sessions[0].id);
    }
    if(sessions.length === 0 && models.length > 0){
      createNewSession();
    }
    const currentSession = sessions.find(s => s.id === activeSessionId);
    if(currentSession && currentSession.model !== selectedModel) {
        setSelectedModel(currentSession.model);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId, sessions, models, createNewSession]);

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    const session = sessions.find(s => s.id === id);
    if (session) {
      setSelectedModel(session.model);
    }
  };
  
  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      const remainingSessions = sessions.filter(s => s.id !== id);
      setActiveSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    if (activeSession) {
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, model } : s));
    }
  };

  const handleSendMessage = async (prompt: string) => {
    if (!activeSessionId) return;

    const userMessage: Message = { role: 'user', content: prompt };
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newTitle = s.messages.length === 0 ? prompt.substring(0, 30) : s.title;
        return { ...s, title: newTitle, messages: [...s.messages, userMessage] };
      }
      return s;
    }));

    setIsLoading(true);

    const assistantMessage: Message = { role: 'assistant', content: '' };
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMessage] } : s));

    try {
      const currentSession = sessions.find(s => s.id === activeSessionId);
      const history = currentSession ? [...currentSession.messages, userMessage] : [userMessage];

      const stream = streamChat(history, selectedModel);
      for await (const chunk of stream) {
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            const lastMsgIndex = s.messages.length - 1;
            const updatedMessages = [...s.messages];
            if (updatedMessages[lastMsgIndex].role === 'assistant') {
              updatedMessages[lastMsgIndex].content += chunk;
            }
            return { ...s, messages: updatedMessages };
          }
          return s;
        }));
      }
    } catch (error) {
      console.error("Error streaming chat:", error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, an error occurred.' };
       setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages.slice(0, -1), errorMessage] } : s));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadChat = () => {
    if (!activeSession) return;
    const { title, messages } = activeSession;
    const formattedContent = messages
      .map(msg => `## ${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}\n\n${msg.content}`)
      .join('\n\n---\n\n');
    
    const blob = new Blob([formattedContent], { type: 'text/markdown;charset=utf-t' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return; // Prevent empty titles
    setSessions(prev => 
      prev.map(s => (s.id === id ? { ...s, title: newTitle.trim() } : s))
    );
    setEditingSessionId(null);
  };

  return (
    <div className="flex h-screen w-full bg-black/50 text-[#00ff96]">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        editingSessionId={editingSessionId}
        onNewChat={createNewSession}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onDownloadChat={handleDownloadChat}
        onStartEdit={setEditingSessionId}
        onRenameSession={handleRenameSession}
      />
      <main className="flex flex-1 flex-col">
        <Header 
          models={models}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          sessionTitle={activeSession?.title || 'Mission Control'}
        />
        <ChatView
          session={activeSession}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default App;
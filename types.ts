
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Session {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  createdAt: number;
}

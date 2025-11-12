
import { Message } from '../types';

// --- MOCK OLLAMA API ---
// In a real application, you would replace these functions with actual API calls to your Ollama server.
// For example, using `fetch` to `http://localhost:11434/api/tags` and `http://localhost:11434/api/chat`.

const MOCK_MODELS = [
  'gemma:7b',
  'llama3:8b-instruct-q8_0',
  'codellama:13b',
  'mistral:latest',
  'phi3:latest',
];

const MOCK_RESPONSES = [
  {
    keywords: ['hello', 'hi', 'hey'],
    response: "Greetings, Operator. I am online and ready for instructions. How can I assist you in this mission?",
  },
  {
    keywords: ['python', 'code', 'script'],
    response: "Of course. Here is a Python script to demonstrate a basic web server. This can be a useful starting point for many network operations.\n\n```python\nimport http.server\nimport socketserver\n\nPORT = 8000\n\nHandler = http.server.SimpleHTTPRequestHandler\n\nwith socketserver.TCPServer(('', PORT), Handler) as httpd:\n    print('serving at port', PORT)\n    httpd.serve_forever()\n```\n\nThis script utilizes Python's built-in libraries to create a simple HTTP server. It will serve files from the directory it is run in on port 8000. Let me know if you need it modified.",
  },
  {
      keywords: ['html', 'website', 'frontend'],
      response: "Certainly. Here is the boilerplate for a modern, responsive HTML page using a flexbox layout.\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Mission Control UI</title>\n    <style>\n        body { font-family: monospace; background: #0a0a0a; color: #00ff00; margin: 0; }\n        .container { display: flex; flex-direction: column; min-height: 100vh; }\n        .header, .footer { background: #1a1a1a; padding: 1rem; text-align: center; }\n        .main { flex: 1; padding: 1rem; }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <header class=\"header\"><h1>STATUS: ONLINE</h1></header>\n        <main class=\"main\"><p>Awaiting your command...</p></main>\n        <footer class=\"footer\"><p>&copy; 2024 Operator Command</p></footer>\n    </div>\n</body>\n</html>\n```\n\nThis provides a solid foundation for a web interface. You can expand upon the `.main` section with your components.",
  }
];

const DEFAULT_RESPONSE = "I'm processing your request. The connection to the local network seems stable. Please provide more specific instructions if you have a particular goal in mind. I can assist with code generation, data analysis, or strategic planning.";

/**
 * Simulates fetching available models from the Ollama API.
 */
export const getModels = (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MODELS);
    }, 500); // Simulate network delay
  });
};

/**
 * Simulates streaming a chat response from the Ollama API.
 */
export async function* streamChat(
  messages: Message[],
  model: string // model is unused in mock but would be in a real API call
): AsyncGenerator<string, void, undefined> {
  const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

  let response = MOCK_RESPONSES.find(r => r.keywords.some(k => lastUserMessage.includes(k)))?.response || DEFAULT_RESPONSE;

  // Simulate streaming
  const words = response.split(/(\s+)/); // Split by space, keeping spaces
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 20));
    yield words[i];
  }
}

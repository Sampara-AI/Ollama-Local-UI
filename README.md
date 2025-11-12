# Ollama Mission Control

> A futuristic, Matrix-themed cockpit for your local Ollama models.

Welcome, Operator. This application provides a robust, modern interface for interacting with your local Ollama large language models. Designed for developers and AI architects, it streamlines workflows, maintains conversation context, and provides essential tools for code generation and management.

## Features

- **Model Detection & Selection:** Automatically detects available Ollama models and allows you to switch between them on the fly.
- **Session Management:** Conversations are saved as "Missions". You can create new sessions, switch between them, rename them, and delete them.
- **Persistent History:** Your sessions are saved to local storage, so your conversations are there when you return.
- **Markdown & Code Support:** Renders Markdown and provides syntax highlighting for code blocks.
- **Code Utilities:** Easily copy code snippets to your clipboard or save them directly to a file (`.py`, `.html`, etc.).
- **Download Conversations:** Export an entire conversation history as a Markdown (`.md`) file.
- **Futuristic UI/UX:** A "liquid glass," Matrix-themed design with neumorphic elements for a unique and immersive experience.

## Local Installation & Setup (macOS)

This is a frontend-only application that can be run in any modern web browser. It uses a mock service to simulate Ollama responses, so you don't need Ollama installed to try the UI.

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari).
- Python 3 (which is typically pre-installed on macOS) to run a simple local web server.

### Running the App

1.  **Get the code:**
    Clone this repository or download the source files to a folder on your machine.

2.  **Navigate to the directory:**
    Open the Terminal app and change into the directory where you saved the files.
    ```bash
    cd path/to/ollama-mission-control
    ```

3.  **Start a local server:**
    Since browsers have security restrictions about opening local files that load other files (like JavaScript modules), you need to serve them from a simple local server. Python provides an easy one.
    ```bash
    python3 -m http.server
    ```
    You should see a message like `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...`.

4.  **Open in browser:**
    Open your web browser and navigate to the following address:
    [http://localhost:8000](http://localhost:8000)

The Ollama Mission Control app should now be running.

### Connecting to a Real Ollama Instance (Developer Note)

The application is currently configured to use a mock API located in `services/ollamaService.ts`. To connect it to your actual local Ollama instance:

1.  Ensure Ollama is running on your machine (usually at `http://localhost:11434`).
2.  Modify the functions in `services/ollamaService.ts` to make `fetch` requests to the Ollama API endpoints.
    - `getModels` should fetch from `http://localhost:11434/api/tags`.
    - `streamChat` should make a POST request to `http://localhost:11434/api/chat` with the `stream: true` option and handle the streaming response.

// App.js
import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar'; // Import Sidebar
import './style/App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);

  // Add a new message to the array
  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Update the last message in the array (for streaming assistant response)
  const updateLastMessage = (content) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1] = {
        ...updatedMessages[updatedMessages.length - 1],
        content,
      };
      return updatedMessages;
    });
  };

  // Function to create a new session
  const handleNewSession = () => {
    const newSession = { id: sessions.length + 1, title: `Session ${sessions.length + 1}` };
    setSessions([...sessions, newSession]);
    setMessages([]); // Clear the messages for the new session
    setSessionId(newSession.id);
  };

  // Handle selecting a session
  const handleSelectSession = (id) => {
    setSessionId(id);
    // Reset messages for simplicity (this would usually load session messages)
    setMessages([]);
  };

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
      />
      <div className="main-content">
        <ChatWindow messages={messages} />
        <MessageInput
          addMessage={addMessage}
          updateLastMessage={updateLastMessage}
          sessionId={sessionId}
          setSessionId={setSessionId}
          messages={messages}
        />
      </div>
    </div>
  );
}

export default App;

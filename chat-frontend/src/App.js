// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';
import './style/App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null); // Holds the current session ID
  const [sessions, setSessions] = useState([]);

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/sessions');
        setSessions(response.data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  // Add a new message to the array
  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Update the last message in the array (for streaming assistant response)
  const updateLastMessage = (content) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1].content = content;
      return updatedMessages;
    });
  };

  // Handle when a new session is created (move new session to the top)
  const onNewSessionCreated = (newSession) => {
    setSessions((prevSessions) => [newSession, ...prevSessions]); // Add new session to the top of the list
  };

  // Handle selecting a session and loading its messages
  const handleSelectSession = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/chat/${id}/messages`);
      setSessionId(id);
      setMessages(response.data); // Load session messages
    } catch (error) {
      console.error('Error fetching session messages:', error);
    }
  };

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        onSelectSession={handleSelectSession}
        onNewSession={() => {
          setMessages([]);
          setSessionId(null);
        }}
      />
      <div className="main-content">
        <ChatWindow messages={messages} />
        <MessageInput
          addMessage={addMessage}
          updateLastMessage={updateLastMessage}
          sessionId={sessionId}
          setSessionId={setSessionId}
          onNewSessionCreated={onNewSessionCreated} // Pass this function to update the session list
          messages={messages}
        />
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';
import './style/App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

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

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const updateLastMessage = (content) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1].content = content;
      return updatedMessages;
    });
  };

  const onNewSessionCreated = (newSession) => {
    setSessions((prevSessions) => [newSession, ...prevSessions]);
  };

  const onDeleteSession = async (sessionIdToDelete) => {
    try {
      await axios.delete(`http://localhost:5001/api/sessions/${sessionIdToDelete}`);
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== sessionIdToDelete)
      );
      if (sessionId === sessionIdToDelete) {
        setMessages([]);
        setSessionId(null);
      }
      setModalOpen(false); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const onRenameSession = async (sessionId, newTitle) => {
    try {
      await axios.put(`http://localhost:5001/api/sessions/${sessionId}`, {
        title: newTitle,
      });
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === sessionId ? { ...session, title: newTitle } : session
        )
      );
    } catch (error) {
      console.error('Error renaming session:', error);
    }
  };

  const handleSelectSession = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/chat/${id}/messages`);
      setSessionId(id);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching session messages:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openDeleteModal = (session) => {
    setSessionToDelete(session);
    setModalOpen(true);
  };

  return (
    <div className={`app ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <button className="toggle-sidebar-button" onClick={toggleSidebar}>
        ☰
      </button>
      <Sidebar
        sessions={sessions}
        activeSessionId={sessionId}
        onSelectSession={handleSelectSession}
        onNewSession={() => {
          setMessages([]);
          setSessionId(null);
        }}
        onDeleteSession={onDeleteSession} // Use openDeleteModal here
        onRenameSession={onRenameSession}
        isOpen={isSidebarOpen}
      />
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <ChatWindow messages={messages} />
        <MessageInput
          addMessage={addMessage}
          updateLastMessage={updateLastMessage}
          sessionId={sessionId}
          setSessionId={setSessionId}
          onNewSessionCreated={onNewSessionCreated}
          messages={messages}
        />
      </div>
    </div>
  );
}

export default App;

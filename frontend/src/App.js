// src/App.js
import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [messages, setMessages] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleNewChat = () => {
    setMessages([]);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  return (
    <div className="app">
      {sidebarVisible && <Sidebar handleNewChat={handleNewChat} />}
      <div className="main">
        <div className="header">
          <button className="icon-button" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1>sql2pyspark</h1>
        </div>
        <ChatWindow messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
}

export default App;

// Sidebar.js
import React from 'react';
import '../style/Sidebar.css';

function Sidebar({ sessions, onSelectSession, onNewSession }) {
  return (
    <div className="sidebar">
      <h2>Conversations</h2>
      <button className="new-conversation-button" onClick={onNewSession}>
        + New Conversation
      </button>
      <ul className="session-list">
        {sessions.map((session, index) => (
          <li
            key={index}
            className="session-item"
            onClick={() => onSelectSession(session.id)}
          >
            {session.title || `Conversation ${index + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;

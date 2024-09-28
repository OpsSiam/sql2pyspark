// src/components/Sidebar.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function Sidebar({ handleNewChat }) {
  return (
    <div className="sidebar">
      <button className="new-chat-button" onClick={handleNewChat}>
        <FontAwesomeIcon icon={faPlus} /> New Conversation
      </button>
    </div>
  );
}

export default Sidebar;

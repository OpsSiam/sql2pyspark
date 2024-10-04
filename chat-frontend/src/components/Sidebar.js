// Sidebar.js
import React, { useState } from 'react';
import '../style/Sidebar.css';
import Modal from './Modal'; // Import the Modal component

function Sidebar({ sessions, onSelectSession, onNewSession, onDeleteSession, onRenameSession }) {
  const [activeSessionId, setActiveSessionId] = useState(null); // For keeping track of active session
  const [dropdownOpen, setDropdownOpen] = useState(null); // To handle dropdown visibility
  const [isRenaming, setIsRenaming] = useState(null); // To track the renaming state
  const [renameValue, setRenameValue] = useState(''); // Store the rename input value
  const [modalOpen, setModalOpen] = useState(false); // Control modal visibility
  const [sessionToDelete, setSessionToDelete] = useState(null); // Track which session to delete

  // Handle rename session logic
  const handleRenameSession = async (sessionId) => {
    if (renameValue.trim()) {
      await onRenameSession(sessionId, renameValue); // Call rename function from props
    }
    setIsRenaming(null); // Close rename input
    setDropdownOpen(null); // Close the dropdown if it's still open
  };

  // Open the delete confirmation modal
  const openDeleteModal = (session) => {
    setSessionToDelete(session);
    setModalOpen(true);
  };

  // Confirm deletion and close the modal
  const confirmDeleteSession = () => {
    onDeleteSession(sessionToDelete.id);
    setModalOpen(false);
    setDropdownOpen(null);
  };

  // Handle click outside to close the dropdown
  const handleClickOutside = () => {
    setDropdownOpen(null);
    setIsRenaming(null);
  };

  return (
    <div className="sidebar" onClick={handleClickOutside}>
      <h2>Conversations</h2>
      <button className="new-conversation-button" onClick={onNewSession}>
        + New Conversation
      </button>
      <ul className="session-list">
        {sessions.map((session, index) => (
          <li
            key={session.id}
            className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
            onClick={() => onSelectSession(session.id)}
            onMouseEnter={() => setActiveSessionId(session.id)}
            onMouseLeave={() => setActiveSessionId(null)}
          >
            {isRenaming === session.id ? (
              <input
                type="text"
                value={renameValue}
                autoFocus
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => handleRenameSession(session.id)} // Handle renaming on blur
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSession(session.id); // Handle renaming on Enter
                }}
              />
            ) : (
              <span className="session-title">{session.title || `Conversation ${index + 1}`}</span>
            )}

            {/* Three dots menu, visible on hover */}
            <span className="session-menu" onClick={(e) => e.stopPropagation()}>
              {activeSessionId === session.id && (
                <span className="three-dots" onClick={() => setDropdownOpen(session.id)}>•••</span>
              )}

              {/* Dropdown menu, visible on click */}
              {dropdownOpen === session.id && (
                <div className="dropdown">
                  <div
                    onClick={(e) => {
                      setIsRenaming(session.id); // Enter renaming state
                      setRenameValue(session.title); // Pre-fill with current title
                      setDropdownOpen(null); // Hide the dropdown immediately
                    }}
                  >
                    Rename
                  </div>
                  <div onClick={() => openDeleteModal(session)}>Delete</div> {/* Trigger modal on delete */}
                </div>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)} // Close modal
        onConfirm={confirmDeleteSession} // Confirm delete
        sessionName={sessionToDelete ? sessionToDelete.title : ''} // Pass session name to modal
      />
    </div>
  );
}

export default Sidebar;

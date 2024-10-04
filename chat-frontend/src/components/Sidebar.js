import React, { useState, useEffect, useRef } from 'react';
import '../style/Sidebar.css';
import Modal from './Modal'; // Import the Modal component

function Sidebar({ sessions, activeSessionId, onSelectSession, onNewSession, onDeleteSession, onRenameSession }) {
  const [dropdownOpen, setDropdownOpen] = useState(null); // To handle dropdown visibility
  const [isRenaming, setIsRenaming] = useState(null); // To track the renaming state
  const [renameValue, setRenameValue] = useState(''); // Store the rename input value
  const [modalOpen, setModalOpen] = useState(false); // Control modal visibility
  const [sessionToDelete, setSessionToDelete] = useState(null); // Track which session to delete
  const dropdownRef = useRef(null); // Ref to track the dropdown

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
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(null); // Close dropdown when clicking outside
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside the dropdown
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup event listener when component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="sidebar">
      <h2>Conversations</h2>
      <button className="new-conversation-button" onClick={onNewSession}>
        + New Conversation
      </button>
      <ul className="session-list">
        {sessions.map((session, index) => (
          <li
            key={session.id}
            className={`session-item ${activeSessionId === session.id ? 'active' : ''}`} // Add active class if selected
            onClick={() => onSelectSession(session.id)} // Clicking on the session selects it
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
            <span
              className="session-menu"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(dropdownOpen === session.id ? null : session.id); // Toggle dropdown on click
              }}
            >
              <span className="three-dots">•••</span> {/* Show three dots on hover */}
            </span>

            {/* Dropdown menu, visible on click (not on hover) */}
            {dropdownOpen === session.id && (
              <div className="dropdown" ref={dropdownRef}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
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

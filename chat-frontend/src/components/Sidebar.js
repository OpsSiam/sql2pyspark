import React, { useState, useRef, useEffect } from 'react';
import '../style/Sidebar.css';
import Modal from './Modal'; 
import { formatDistanceToNow, format, isYesterday, isWithinInterval, subDays } from 'date-fns'; // To handle dates

function Sidebar({ sessions, activeSessionId, onSelectSession, onNewSession, onDeleteSession, onRenameSession }) {
  const [dropdownOpen, setDropdownOpen] = useState(null); 
  const [isRenaming, setIsRenaming] = useState(null); 
  const [renameValue, setRenameValue] = useState(''); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [sessionToDelete, setSessionToDelete] = useState(null); 
  const dropdownRef = useRef(null); 

  // Handle rename session logic
  const handleRenameSession = async (sessionId) => {
    if (renameValue.trim()) {
      await onRenameSession(sessionId, renameValue); 
    }
    setIsRenaming(null); 
    setDropdownOpen(null); 
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
      setDropdownOpen(null); 
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper functions to categorize sessions by time
  const groupSessionsByTime = (sessions) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return {
      yesterday: sessions.filter(session => new Date(session.created_at) >= yesterday && new Date(session.created_at) < now),
      previousSevenDays: sessions.filter(session => new Date(session.created_at) >= sevenDaysAgo && new Date(session.created_at) < yesterday),
      previousThirtyDays: sessions.filter(session => new Date(session.created_at) >= thirtyDaysAgo && new Date(session.created_at) < sevenDaysAgo),
      older: sessions.filter(session => new Date(session.created_at) < thirtyDaysAgo),
    };
  };

  const { yesterday, previousSevenDays, previousThirtyDays, older } = groupSessionsByTime(sessions);

  return (
    <div className="sidebar">
      <h2>Conversations</h2>
      <button className="new-conversation-button" onClick={onNewSession}>
        + New Conversation
      </button>

      <ul className="session-list">
        {/* Yesterday's Sessions */}
        {yesterday.length > 0 && (
          <>
            <li className="time-period">Yesterday</li>
            {yesterday.map((session, index) => (
              <li
                key={session.id}
                className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
                onClick={() => onSelectSession(session.id)}
              >
                {isRenaming === session.id ? (
                  <input
                    type="text"
                    value={renameValue}
                    autoFocus
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSession(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSession(session.id);
                    }}
                  />
                ) : (
                  <span className="session-title">
                    {session.title || `Conversation ${index + 1}`}
                  </span>
                )}
                <span
                  className="session-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(dropdownOpen === session.id ? null : session.id);
                  }}
                >
                  <span className="three-dots">•••</span>
                </span>
                {dropdownOpen === session.id && (
                  <div className="dropdown" ref={dropdownRef}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRenaming(session.id);
                        setRenameValue(session.title);
                        setDropdownOpen(null);
                      }}
                    >
                      Rename
                    </div>
                    <div onClick={() => openDeleteModal(session)}>Delete</div>
                  </div>
                )}
              </li>
            ))}
          </>
        )}

        {/* Previous 7 Days Sessions */}
        {previousSevenDays.length > 0 && (
          <>
            <li className="time-period">Previous 7 Days</li>
            {previousSevenDays.map((session, index) => (
              <li
                key={session.id}
                className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
                onClick={() => onSelectSession(session.id)}
              >
                {isRenaming === session.id ? (
                  <input
                    type="text"
                    value={renameValue}
                    autoFocus
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSession(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSession(session.id);
                    }}
                  />
                ) : (
                  <span className="session-title">
                    {session.title || `Conversation ${index + 1}`}
                  </span>
                )}
                <span
                  className="session-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(dropdownOpen === session.id ? null : session.id);
                  }}
                >
                  <span className="three-dots">•••</span>
                </span>
                {dropdownOpen === session.id && (
                  <div className="dropdown" ref={dropdownRef}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRenaming(session.id);
                        setRenameValue(session.title);
                        setDropdownOpen(null);
                      }}
                    >
                      Rename
                    </div>
                    <div onClick={() => openDeleteModal(session)}>Delete</div>
                  </div>
                )}
              </li>
            ))}
          </>
        )}

        {/* Previous 30 Days Sessions */}
        {previousThirtyDays.length > 0 && (
          <>
            <li className="time-period">Previous 30 Days</li>
            {previousThirtyDays.map((session, index) => (
              <li
                key={session.id}
                className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
                onClick={() => onSelectSession(session.id)}
              >
                {isRenaming === session.id ? (
                  <input
                    type="text"
                    value={renameValue}
                    autoFocus
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSession(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSession(session.id);
                    }}
                  />
                ) : (
                  <span className="session-title">
                    {session.title || `Conversation ${index + 1}`}
                  </span>
                )}
                <span
                  className="session-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(dropdownOpen === session.id ? null : session.id);
                  }}
                >
                  <span className="three-dots">•••</span>
                </span>
                {dropdownOpen === session.id && (
                  <div className="dropdown" ref={dropdownRef}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRenaming(session.id);
                        setRenameValue(session.title);
                        setDropdownOpen(null);
                      }}
                    >
                      Rename
                    </div>
                    <div onClick={() => openDeleteModal(session)}>Delete</div>
                  </div>
                )}
              </li>
            ))}
          </>
        )}

        {/* Older Sessions */}
        {older.length > 0 && (
          <>
            <li className="time-period">Older</li>
            {older.map((session, index) => (
              <li
                key={session.id}
                className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
                onClick={() => onSelectSession(session.id)}
              >
                {isRenaming === session.id ? (
                  <input
                    type="text"
                    value={renameValue}
                    autoFocus
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSession(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSession(session.id);
                    }}
                  />
                ) : (
                  <span className="session-title">
                    {session.title || `Conversation ${index + 1}`}
                  </span>
                )}
                <span
                  className="session-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(dropdownOpen === session.id ? null : session.id);
                  }}
                >
                  <span className="three-dots">•••</span>
                </span>
                {dropdownOpen === session.id && (
                  <div className="dropdown" ref={dropdownRef}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRenaming(session.id);
                        setRenameValue(session.title);
                        setDropdownOpen(null);
                      }}
                    >
                      Rename
                    </div>
                    <div onClick={() => openDeleteModal(session)}>Delete</div>
                  </div>
                )}
              </li>
            ))}
          </>
        )}
      </ul>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDeleteSession}
        sessionName={sessionToDelete ? sessionToDelete.title : ''}
      />
    </div>
  );
}

export default Sidebar;

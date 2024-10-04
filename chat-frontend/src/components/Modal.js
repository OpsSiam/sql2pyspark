// Modal.js
import React from 'react';
import '../style/Modal.css';

function Modal({ isOpen, onClose, onConfirm, sessionName }) {
  if (!isOpen) return null; // If the modal isn't open, return null (don't render)

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Delete chat?</h2>
        <p>This will delete <strong>{sessionName}</strong>.</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;

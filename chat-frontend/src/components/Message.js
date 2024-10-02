import React from 'react';

function Message({ message }) {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">{message.content}</div>
    </div>
  );
}

export default Message;

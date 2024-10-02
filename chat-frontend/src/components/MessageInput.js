import React, { useState } from 'react';

function MessageInput({ addMessage }) {
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const userMessage = { role: 'user', content: input };
    addMessage(userMessage);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [userMessage] }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      let assistantMessage = { role: 'assistant', content: '' };
      addMessage(assistantMessage);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        assistantMessage.content += chunk;
        addMessage({ ...assistantMessage });
      }
    } catch (error) {
      console.error(error);
    }

    setInput('');
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default MessageInput;

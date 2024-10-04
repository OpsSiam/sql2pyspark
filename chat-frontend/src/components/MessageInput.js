// MessageInput.js
import React, { useState } from 'react';
import axios from 'axios';
import '../style/MessageInput.css';

function MessageInput({ addMessage, updateLastMessage, sessionId, setSessionId, messages }) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      try {
        const response = await axios.post('http://localhost:5001/api/sessions', {});
        currentSessionId = response.data.sessionId;
        setSessionId(currentSessionId);
      } catch (error) {
        console.error('Error creating session:', error);
        return;
      }
    }

    const userMessage = { role: 'user', content: input };
    addMessage(userMessage); // Add user message immediately
    setInput(''); // Clear the input
    setIsSending(true);

    let assistantMessage = { role: 'assistant', content: '' };
    addMessage(assistantMessage); // Initially add an empty assistant message

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId: currentSessionId,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let assistantContent = ''; // Buffer for assistant message content

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (let line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();

            if (dataStr === '[DONE]') break;

            try {
              const data = JSON.parse(dataStr);
              const delta = data.content;

              if (delta) {
                assistantContent += delta;

                // Here we update the last assistant message in place
                updateLastMessage(assistantContent);
              }
            } catch (e) {
              console.error('Error parsing data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={isSending}
      />
      <button onClick={sendMessage} disabled={isSending || input.trim() === ''}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;

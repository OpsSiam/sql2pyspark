// MessageInput.js
import React, { useState } from 'react';
import axios from 'axios';
import '../style/MessageInput.css';

function MessageInput({ addMessage, updateLastMessage, sessionId, setSessionId, messages, onNewSessionCreated }) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === '') return;
  
    let currentSessionId = sessionId;
  
    if (!currentSessionId) {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // รับ Timezone จาก browser
        const response = await axios.post('http://localhost:5001/api/sessions', {
          title: input,
          timezone // ส่ง timezone ไปที่ server
        });
        currentSessionId = response.data.id;
        setSessionId(currentSessionId);
      } catch (error) {
        console.error('Error creating session:', error);
        return;
      }
    }

    const userMessage = { role: 'user', content: input };
    addMessage(userMessage); // Add user message immediately to the chat window
    setInput(''); // Clear the input field

    let assistantMessage = { role: 'assistant', content: '' };
    addMessage(assistantMessage); // Add an empty assistant message to the chat window

    // Send the message to the backend and process the response
    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage], // Include previous messages and the new user message
          sessionId: currentSessionId, // Use the correct session ID
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let assistantContent = ''; // Buffer for assistant message content

      // Handle streaming response
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
                updateLastMessage(assistantContent); // Update the last assistant message content
              }
            } catch (e) {
              console.error('Error parsing data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error during message streaming:', error);
    } finally {
      setIsSending(false); // Unlock the input once the message has been fully sent
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        disabled={isSending} // Disable input while sending
      />
      <button onClick={sendMessage} disabled={isSending || input.trim() === ''}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;

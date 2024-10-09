// MessageInput.js
import React, { useState } from 'react';
import '../style/MessageInput.css';

export const sendMessage = async ({
  content,
  providedSessionId,
  sessionId,
  setSessionId,
  addMessage,
  updateLastMessage,
  messages,
}) => {
  if (content.trim() === '') return;

  let currentSessionId = providedSessionId || sessionId;

  if (!currentSessionId) {
    try {
      const response = await fetch('http://localhost:5001/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: content }),
      });
      const sessionData = await response.json();
      currentSessionId = sessionData.id;
      setSessionId(currentSessionId);
    } catch (error) {
      console.error('Error creating session:', error);
      return;
    }
  }

  const userMessage = { role: 'user', content };
  addMessage(userMessage);

  let assistantContent = '';
  addMessage({ role: 'assistant', content: assistantContent });

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
              updateLastMessage(assistantContent);
            }
          } catch (e) {
            console.error('Error parsing data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error during message streaming:', error);
  }
};

function MessageInput({
  addMessage,
  updateLastMessage,
  sessionId,
  setSessionId,
  messages,
}) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    setIsSending(true);
    await sendMessage({
      content: input,
      sessionId,
      setSessionId,
      addMessage,
      updateLastMessage,
      messages,
    });
    setInput('');
    setIsSending(false);
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
      <button onClick={handleSendMessage} disabled={isSending || input.trim() === ''}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;

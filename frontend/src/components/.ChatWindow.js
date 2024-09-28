// src/components/ChatWindow.js
import React, { useState } from 'react';
import Message from './Message';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';

function ChatWindow({ messages, setMessages }) {
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5001/api/convert', {
        sqlQuery: input,
      });
      const botMessage = { sender: 'bot', text: `\`\`\`\n${response.data.pysparkCode}\n\`\`\`` };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { sender: 'bot', text: 'There was an error in processing.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Enter the SQL command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage} className="send-button">
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;

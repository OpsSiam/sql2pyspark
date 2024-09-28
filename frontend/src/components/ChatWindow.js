import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import axios from 'axios';
import UploadButton from './UploadButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function ChatWindow({ messages, setMessages }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    try {
      const userMessage = { sender: 'user', text: input, isCode: false };
      setMessages([...messages, userMessage]);
      setInput('');

      const apiEndpoint = process.env.REACT_APP_SQL2SPARK_API;
      const response = await axios.post(`${apiEndpoint}/api/convert`, {
        sqlQuery: input,
      });

      const botMessage = { sender: 'bot', text: response.data.pysparkCode, isCode: true };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage();
    } else if (e.key === 'Enter' && e.shiftKey) {
      setInput(input + '\n');
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} isCode={msg.isCode} />
        ))}
        {error && <div className="error">{error}</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <UploadButton setMessages={setMessages} />
        <textarea
          rows="1"
          ref={textareaRef}
          placeholder="Enter SQL command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-textarea"
        />
        <button onClick={sendMessage} className="send-button">
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
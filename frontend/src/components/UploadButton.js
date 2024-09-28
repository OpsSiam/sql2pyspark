// src/components/UploadButton.js
import React, { useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

function UploadButton({ setMessages }) {
  const fileInputRef = useRef();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const sqlQuery = e.target.result;

        const userMessage = { sender: 'user', text: sqlQuery, isCode: false };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
          const response = await axios.post(`${process.env.SQL2SPARK_API_ENDPOINT}/api/convert`, {
            sqlQuery,
          });

          const botMessage = { sender: 'bot', text: response.data.pysparkCode, isCode: true };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
          console.error(error);
          const errorMessage = { sender: 'bot', text: 'An error occurred during processing.', isCode: false };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-button">
      <input
        type="file"
        accept=".sql,.txt"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button onClick={handleButtonClick} className="icon-button">
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </div>
  );
}

export default UploadButton;

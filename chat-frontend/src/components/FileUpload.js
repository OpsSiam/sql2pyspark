// FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import '../style/FileUpload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function FileUpload({ sessionId, addMessage, setSessionId, updateLastMessage, onNewSessionCreated }) {
  const [isSending, setIsSending] = useState(false);

  // Define supported file types (e.g., text files)
  const supportedFileTypes = [
    'text/plain',
    'application/json',
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv',
    'application/xml',
    'text/xml',
    'text/html',
    'application/rtf',
    'text/markdown',
    'application/x-yaml',
    'text/yaml',
  ];

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files).slice(0, 3); // Limit to 3 files
    let currentSessionId = sessionId;

    if (files.length > 0) {
      // Check if the files are all of supported types
      const unsupportedFiles = files.filter(file => !supportedFileTypes.includes(file.type));
      if (unsupportedFiles.length > 0) {
        addMessage({
          role: 'assistant',
          content: `Some files are not supported: ${unsupportedFiles.map(file => file.name).join(', ')}. Supported types are text, JSON, PDF, and similar.`,
        });
        return;
      }

      // Construct a user message displaying each file on a new line
      const fileMessages = files.map(file => `Uploaded file: ${file.name}`).join('\n');
      const userMessage = {
        role: 'user',
        content: fileMessages,
      };
      addMessage(userMessage);

      // Create a session if it doesn't exist yet
      if (!currentSessionId) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/sessions`, {
            title: `Uploaded files`,
          });
          currentSessionId = response.data.id;
          setSessionId(currentSessionId);
          onNewSessionCreated(response.data);
        } catch (error) {
          console.error('Error creating session:', error);
          return;
        }
      }

      // Prepare content for each file
      setIsSending(true);
      const combinedMessages = [];

      for (const file of files) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const fileContent = e.target.result;
          const combinedMessage = `Uploaded file: ${file.name}\n\nFile Content:\n${fileContent}`;

          combinedMessages.push(combinedMessage);

          if (combinedMessages.length === files.length) {
            // Send all combined messages to the server
            let assistantContent = '';
            addMessage({ role: 'assistant', content: assistantContent });

            try {
              const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  messages: combinedMessages.map(content => ({ role: 'user', content })),
                  sessionId: currentSessionId,
                }),
              });

              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

              const reader = response.body.getReader();
              const decoder = new TextDecoder('utf-8');

              while (true) {
                const { value, done } = await reader.read();
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
              console.error('Error sending file content:', error);
            } finally {
              setIsSending(false);
            }
          }
        };

        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="file-upload">
      <label htmlFor="file-upload-input" className="file-upload-label">
        <FontAwesomeIcon icon={faPaperclip} className="file-upload-icon" />
      </label>
      <input
        id="file-upload-input"
        type="file"
        onChange={handleFileUpload}
        disabled={isSending}
        className="file-upload-input"
        multiple
        accept={supportedFileTypes.join(', ')}
      />
    </div>
  );
}

export default FileUpload;

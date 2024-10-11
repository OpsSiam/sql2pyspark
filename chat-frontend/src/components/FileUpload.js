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
  const supportedFileTypes = ['text/plain', 'application/json', 'application/pdf'];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    let currentSessionId = sessionId;

    if (file) {
      // Check if the file type is supported
      if (!supportedFileTypes.includes(file.type)) {
        // Add a friendly rejection message to the assistant's response
        addMessage({
          role: 'assistant',
          content: `I'm sorry, but the file type "${file.type}" is not supported. Please upload a text, JSON, or PDF file.`,
        });
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target.result;

        const combinedMessage = `Uploaded file: ${file.name}\n\nFile Content:\n${fileContent}\n\nEnd of File Content`;

        const userMessage = {
          role: 'user',
          content: `Uploaded file: ${file.name}`,
        };
        addMessage(userMessage);

        if (!currentSessionId) {
          try {
            const response = await axios.post(`${API_BASE_URL}/api/sessions`, {
              title: `Uploaded file: ${file.name}`,
            });
            currentSessionId = response.data.id;
            setSessionId(currentSessionId);
            onNewSessionCreated(response.data);
          } catch (error) {
            console.error('Error creating session:', error);
            return;
          }
        }

        let assistantContent = '';
        addMessage({ role: 'assistant', content: assistantContent });

        try {
          setIsSending(true);
          const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: combinedMessage }],
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
      };

      reader.readAsText(file);
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
      />
    </div>
  );
}

export default FileUpload;

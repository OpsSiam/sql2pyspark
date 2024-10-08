import React from 'react';
import axios from 'axios';
import '../style/FileUpload.css'; 

function FileUpload({ sessionId, addMessage }) {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    let currentSessionId = sessionId;
    
    if (file) {
      // Read the file content using FileReader
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target.result;

        const combinedMessage = `Uploaded file: ${file.name}\n\nFile Content:\n${fileContent}\n\nEnd of File Content`;

        // Add the file name as the user message (but don't show the content)
        const userMessage = { 
          role: 'user', 
          content: `Uploaded file: ${file.name}`, // Display the file name and extension
        };
        addMessage(userMessage);

        try {
          // Send the file content to the backend as a message
          const response = await axios.post('http://localhost:5001/api/chat', {
            messages: [
              {
                role: 'user',
                content: combinedMessage,
              },
            ], 
            sessionId: currentSessionId,
          });

          // Add the AI's response to the chat window
          const assistantMessage = { role: 'assistant', content: response.data };
          addMessage(assistantMessage);
        } catch (error) {
          console.error('Error sending file content:', error);
        }
      };

      reader.readAsText(file); // Read the file as text (assuming it’s a text file)
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default FileUpload;

// Message.js
import React from 'react';
import '../style/Message.css';

function Message({ message }) {
  const formatMessage = (content) => {
    // Split content based on code block markers ``` ```
    const parts = content.split(/(```[\s\S]*?```)/);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract the language and code block's content
        let codeBlock = part.slice(3, -3).trim(); // Remove the surrounding ```
        const languageMatch = codeBlock.match(/^(\w+)\n/); // Match language identifier at the start of the code block
        let language = '';
        let code = codeBlock;

        // Check for language identifier (e.g., javascript)
        if (languageMatch) {
          language = languageMatch[1]; // Extract the language name
          code = codeBlock.replace(languageMatch[0], '').trim(); // Remove language identifier from code content
        }

        return (
          <div key={index} className="code-snippet-container">
            {language && <div className="code-language-title">{language}</div>} {/* Show the detected language */}
            <pre className={`code-block language-${language}`}>
              <code>{code}</code>
            </pre>
          </div>
        );
      } else {
        // Handle regular text content with line breaks
        return part.split('\n').map((line, i) => (
          <span key={`${index}-${i}`}>
            {line}
            <br />
          </span>
        ));
      }
    });
  };

  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        {formatMessage(message.content)} {/* Render message content with code blocks */}
      </div>
    </div>
  );
}

export default Message;

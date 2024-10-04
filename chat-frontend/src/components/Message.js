import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../style/Message.css';

function Message({ message }) {
  const [copyStatus, setCopyStatus] = useState({});

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopyStatus((prevState) => ({ ...prevState, [index]: true }));
      setTimeout(() => {
        setCopyStatus((prevState) => ({ ...prevState, [index]: false }));
      }, 2000); // Reset copy status after 2 seconds
    }).catch((err) => {
      console.error("Failed to copy code: ", err);
    });
  };

  const formatMessage = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        let codeBlock = part.slice(3, -3).trim();
        const languageMatch = codeBlock.match(/^(\w+)\n/);
        let language = '';
        let code = codeBlock;

        if (languageMatch) {
          language = languageMatch[1];
          code = codeBlock.replace(languageMatch[0], '').trim();
        }

        return (
          <div key={index} className="code-snippet-container">
            {/* Container for the language title and copy button */}
            <div className="code-header">
              {language && <div className="code-language-title">{language}</div>}
              {copyStatus[index] ? (
                <div className="copy-status">
                  <span className="copy-icon">✔</span> Copied !
                </div>
              ) : (
                <button className="copy-button" onClick={() => handleCopy(code, index)}>
                  Copy
                </button>
              )}
            </div>
            <pre className={`code-block language-${language}`}>
              <code>{code}</code>
            </pre>
          </div>
        );
      } else {
        // Render markdown content for non-code blocks
        return (
          <ReactMarkdown key={index} children={part} />
        );
      }
    });
  };

  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        {formatMessage(message.content)}
      </div>
    </div>
  );
}

export default Message;

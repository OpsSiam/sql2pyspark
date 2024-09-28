// src/components/Message.js
import React from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dracula from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';

function Message({ sender, text, isCode }) {
  return (
    <div className={`message ${sender}`}>
      <div className="message-text">
        {isCode ? (
          <div className="code-block">
            <SyntaxHighlighter
              language="python"
              style={dracula}
              wrapLongLines={true}
            >{text}
            </SyntaxHighlighter>
          </div>
        ) : (
          <div className="text-block">
            <pre>{text}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;

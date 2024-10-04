// controllers/chatController.js
const axios = require('axios');
const db = require('../db/database');
require('dotenv').config();

exports.chatHandler = async (req, res) => {
  const { messages, sessionId } = req.body;

  try {
    // Save user message to database
    const userMessage = messages[messages.length - 1];
    db.run(
      'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
      [sessionId, userMessage.role, userMessage.content]
    );

    // Call Azure OpenAI API
    const response = await axios({
      method: 'post',
      url: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
      headers: {
        'api-key': process.env.AZURE_OPENAI_API_KEY,
        'Content-Type': 'application/json',
      },
      data: {
        messages: messages,
        stream: true, // Ensure streaming is enabled
      },
      responseType: 'stream', // Set response type to stream
    });

    // Set up Server-Sent Events (SSE) headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Flush headers to establish the SSE connection

    let buffer = ''; // Buffer to hold incomplete JSON chunks
    let assistantContent = ''; // Buffer for the full assistant message

    // Listen for streaming data
    response.data.on('data', (chunk) => {
      buffer += chunk.toString(); // Convert chunk to string and append to buffer

      // Split buffer on double new lines (each SSE message ends with two new lines)
      const payloads = buffer.split('\n\n');

      for (let i = 0; i < payloads.length - 1; i++) {
        const payload = payloads[i];

        // Update buffer to hold any incomplete chunk at the end
        buffer = payloads[payloads.length - 1];

        // If the payload includes [DONE], stop the stream
        if (payload.includes('[DONE]')) {
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }

        // Handle actual message data
        if (payload.startsWith('data:')) {
          try {
            // Parse JSON payload
            const data = JSON.parse(payload.replace('data: ', ''));
            const delta = data.choices[0]?.delta?.content;

            if (delta) {
              assistantContent += delta; // Append the content from the chunk

              // Send the streamed data to the client
              res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
            }
          } catch (error) {
            console.error('JSON parse error:', error.message);
            // Do not break here; some chunks may be incomplete, just continue
          }
        }
      }
    });

    // When the stream ends
    response.data.on('end', () => {
      // Save the assistant's full response to the database
      db.run(
        'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
        [sessionId, 'assistant', assistantContent]
      );

      // Close the SSE connection
      res.write('data: [DONE]\n\n');
      res.end();
    });

    // Handle errors in streaming
    response.data.on('error', (err) => {
      console.error('Streaming error:', err);
      res.end();
    });

  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error processing the request');
  }
};

// Get messages for a session
exports.getMessages = (req, res) => {
  const sessionId = req.params.sessionId;
  db.all(
    'SELECT role, content, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC',
    [sessionId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
};

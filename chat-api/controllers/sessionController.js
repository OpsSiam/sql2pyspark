// controllers/sessionController.js
const db = require('../db/database');

// Create a new session
exports.createSession = (req, res) => {
  const { title } = req.body; // Get the title (first message) from the request body
  db.run('INSERT INTO sessions (title) VALUES (?)', [title], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, title }); // Return the new session ID and title
    }
  });
};

// Get all sessions
exports.getSessions = (req, res) => {
  db.all('SELECT * FROM sessions ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
};

// Delete a session
exports.deleteSession = (req, res) => {
  const sessionId = req.params.sessionId;

  db.serialize(() => {
    // Delete messages associated with the session
    db.run('DELETE FROM messages WHERE session_id = ?', [sessionId], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Delete the session
      db.run('DELETE FROM sessions WHERE id = ?', [sessionId], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'Session deleted successfully' });
      });
    });
  });
};

// Rename a session
exports.renameSession = (req, res) => {
  const sessionId = req.params.id;
  const { title } = req.body; // Extract the new title from the request body

  // Ensure that a non-empty title is provided
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  // Update the session title in the database
  db.run(
    'UPDATE sessions SET title = ? WHERE id = ?',
    [title, sessionId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Session not found' });
      } else {
        res.json({ id: sessionId, title });
      }
    }
  );
};

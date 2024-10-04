// controllers/sessionController.js
const db = require('../db/database');

// Create a new session
exports.createSession = (req, res) => {
  const { title } = req.body; // Get the title (first message) from the request body
  db.run('INSERT INTO sessions (title) VALUES (?)', [title], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID }); // Return the new session ID
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
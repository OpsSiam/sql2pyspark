// controllers/sessionController.js
const db = require('../db/database');

// Create a new session
exports.createSession = (req, res) => {
    let { topic } = req.body;
  
    if (!topic) {
      topic = 'New Chat'; // Default topic if none provided
    }
  
    db.run(
      'INSERT INTO sessions (topic) VALUES (?)',
      [topic],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ sessionId: this.lastID, topic });
        }
      }
    );
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
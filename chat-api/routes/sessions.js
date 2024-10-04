// routes/sessions.js
const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  deleteSession,
} = require('../controllers/sessionController');

router.post('/', createSession);
router.get('/', getSessions);
router.delete('/:sessionId', deleteSession);

module.exports = router;

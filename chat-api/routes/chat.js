// routes/chat.js
const express = require('express');
const router = express.Router();
const {
    chatHandler,
    getMessages,
  } = require('../controllers/chatController');
const { body, validationResult } = require('express-validator');

// Post message route
router.post(
  '/',
  [
    body('messages').isArray().withMessage('Messages must be an array'),
    // Additional validation rules can be added here
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  chatHandler
);

// Update the GET route to match the correct URL pattern for fetching messages
router.get('/:sessionId/messages', getMessages);

module.exports = router;

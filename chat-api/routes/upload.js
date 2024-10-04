// routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadHandler } = require('../controllers/uploadController');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), uploadHandler);

module.exports = router;

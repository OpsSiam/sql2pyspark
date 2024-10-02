const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


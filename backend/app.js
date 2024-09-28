// app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const apiRoutes = require('./routes/api');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api',(req, res, next) => {
  console.log(`${req.method}, Status ${res.statusCode}, ${req.originalUrl}`);
  next();
}, apiRoutes);

io.on('connection', (socket) => {
  console.log('The user is connected.');
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});


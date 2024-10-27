// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const errorHandler = require('./utils/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app and server
const app = express();
const server = http.createServer(app);

// Configure Socket.io server with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // You can replace '*' with your frontend URL for more security
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);

// Default route to check if the server is running
app.use("/", (req, res) => {
  return res.json({
    message: "Server is running",
    status: "200",
  });
});

// Real-time notifications using Socket.io
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  // Broadcast task updates and creations
  socket.on('taskUpdated', (task) => {
    socket.broadcast.emit('taskUpdated', task);
  });

  socket.on('taskCreated', (task) => {
    socket.broadcast.emit('taskCreated', task);
  });
});

// Set the port using environment variable
const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling middleware
app.use(errorHandler);

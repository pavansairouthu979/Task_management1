const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: ["http://localhost:5173", "https://augmentik-frontend.onrender.com"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Set socket globally
app.set('io', io);

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: ["http://localhost:5173", "https://augmentik-frontend.onrender.com"], // Add production URL here
    credentials: true
}));

// Root Route
app.get('/', (req, res) => {
    res.json({ message: 'Augmentik API is running...', status: 'OK' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));

// Socket logic
require('./sockets')(io);

// Periodic deadline check (every hour)
const { checkDeadlines } = require('./controllers/taskController');
setInterval(() => checkDeadlines(io), 60 * 60 * 1000);
checkDeadlines(io); // Run immediately on start

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

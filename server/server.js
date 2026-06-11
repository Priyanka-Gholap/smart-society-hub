import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import societyRoutes from './routes/societyRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import disasterRoutes from './routes/disasterRoutes.js';

dotenv.config();

// Initialize Express and Socket.io
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  socket.on('join_society', (societyId) => {
    socket.join(`society_${societyId}`);
    console.log(`✅ User joined society room: society_${societyId}`);
  });

  socket.on('alert_update', (data) => {
    io.to(`society_${data.societyId}`).emit('alert_notification', data);
  });

  socket.on('safety_update', (data) => {
    io.to(`society_${data.societyId}`).emit('safety_status_update', data);
  });

  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Store io instance for use in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/disaster', disasterRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Smart Society Hub API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════╗
  ║   Smart Society Hub - Disaster Ready Communities   ║
  ║              Backend API Server Running             ║
  ║   🚀 Server listening on port ${PORT}                  ║
  ║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                          ║
  ║   📡 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not Connected'}                     ║
  ╚════════════════════════════════════════════════════╝
  `);
});

export default app;
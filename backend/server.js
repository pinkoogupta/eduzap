import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/db/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectCloudinary from './src/utils/cloudinary.js';
import { createServer } from 'http';
import { initSocket } from './src/utils/socket.js';
import businesses from './src/businesses/businesses.js';

dotenv.config();
const app = express();
const server = createServer(app);

// Initialize Socket.IO
initSocket(server);

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes
app.use('/api/v1', businesses);

app.get('/', (req, res) => {
  res.send('APIs are working');
});

// Connect database and cloudinary
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
      console.log(`🚀 Server running on port: ${process.env.PORT || 3000}`);
      console.log(`🌐 Server accessible at: http://localhost:${process.env.PORT || 3000}`);
      console.log(`📱 For mobile testing, use your computer's IP address`);
    });

    server.on('error', (error) => {
      console.error('Error:', error);
      throw error;
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed!', err);
  });

connectCloudinary();

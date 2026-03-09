import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Load env vars FIRST before any other imports
dotenv.config();

// Routes (imported after dotenv.config)
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Connect to database
connectDB();

const app = express();

// Webhook routes BEFORE body parser (Stripe needs raw body)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use('/api/verification/webhook', express.raw({ type: 'application/json' }));
app.use('/api/contracts/webhook', express.raw({ type: 'application/json' }));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;

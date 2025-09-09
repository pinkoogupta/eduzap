import express from 'express';
import requestRoutes from './product/request.js';

const router = express.Router();

// Mount all domains
router.use('/requests', requestRoutes);

// Global error handler
router.use((err, req, res, next) => {
  console.error(`❌ Error in route ${req.originalUrl}:`, err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong in this module',
    error: err.message
  });
});

export default router;

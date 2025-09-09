import express from 'express';

import requestRoutes from './routes/request.route.js';

const router = express.Router();

try {
  router.use('/', requestRoutes);
} catch (err) {
  console.error('Error initializing request module:', err);
}

export default router;

import express from 'express';
import upload from '../../../middlewares/multer.middleware.js';
import {
  createRequest,
  getRequests,
  getSortedRequests,
  searchRequests,
  deleteRequest
} from '../controllers/request.controller.js';

const router = express.Router();

// Submit a request (single image upload)
router.post('/', upload.single('image'), createRequest);

// Fetch all requests
router.get('/get', getRequests);

// Fetch sorted requests
router.get('/sorted', getSortedRequests);

// Search requests by title
router.get('/search', searchRequests);

// Delete a request by ID
router.delete('/:id', deleteRequest);

export default router;

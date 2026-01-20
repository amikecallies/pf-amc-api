import express from 'express';
import { getReviews } from '../controllers/reviewsController.js';

const router = express.Router();

// POST /api/contact
router.get('/', getReviews);

export default router;

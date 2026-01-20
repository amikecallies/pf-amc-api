import express from 'express';
import { getInformation } from '../controllers/informationController.js';
import { contactValidation } from '../middleware/validator.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/contact
router.post('/', contactRateLimiter, contactValidation, getInformation);

export default router;

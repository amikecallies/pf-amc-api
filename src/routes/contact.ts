import express from 'express';
import { submitContact } from '../controllers/contactController.js';
import { contactValidation } from '../middleware/validator.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/contact
router.post('/', contactRateLimiter, contactValidation, submitContact);

export default router;

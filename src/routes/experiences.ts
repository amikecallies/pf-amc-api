import express from 'express';
import { getExperiences } from '../controllers/experiencesController.js';

const router = express.Router();

// POST /api/contact
router.get('/', getExperiences);

export default router;

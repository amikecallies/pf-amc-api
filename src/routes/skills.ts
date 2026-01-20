import express from 'express';
import { getSkills } from '../controllers/skillsController.js';

const router = express.Router();

// POST /api/contact
router.get('/', getSkills);

export default router;

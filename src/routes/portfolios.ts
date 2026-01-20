import express from 'express';
import { getPortfolios } from '../controllers/portfoliosController.js';

const router = express.Router();

// POST /api/contact
router.get('/', getPortfolios);

export default router;

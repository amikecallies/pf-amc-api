import express from 'express';
import { getPortfolios } from '../controllers/portfoliosController.js';

const router = express.Router();

router.get('/', getPortfolios);

export default router;

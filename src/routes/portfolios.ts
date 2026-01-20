import express from 'express';
import { getInformation } from '../controllers/informationController.js';

const router = express.Router();

// POST /api/contact
router.get('/', getInformation);

export default router;

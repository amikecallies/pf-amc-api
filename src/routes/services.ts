import express from 'express';
import { getServices } from '../controllers/servicesController.js';

const router = express.Router();

// POST /api/contact
router.get('/', getServices);

export default router;

import express from 'express';
import contactRoutes from './contact.js';
import informationRoutes from './information.js';

const router = express.Router();

// Mount route modules
router.use('/contact', contactRoutes);
router.use('/information', informationRoutes);
// router.use('/services', servicesRoutes);
// router.use('/reviews', reviewsRoutes);
// router.use('/skills', skillsRoutes);
// router.use('/portfolios', portfoliosRoutes);
// router.use('/experience', experienceRoutes);
// router.use('/blogs', blogsRoutes);

export default router;

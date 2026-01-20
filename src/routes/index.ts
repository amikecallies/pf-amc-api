import express from 'express';
import contactRoutes from './contact.js';
import informationRoutes from './information.js';
import experienceRoutes from './experiences.js';
import reviewsRoutes from './reviews.js';
import skillsRoutes from './skills.js';
import portfoliosRoutes from './portfolios.js';
// import blogsRoutes from './blogs.js';

const router = express.Router();

// Mount route modules
router.use('/contact', contactRoutes);
router.use('/information', informationRoutes);
router.use('/experience', experienceRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/skills', skillsRoutes);
router.use('/portfolios', portfoliosRoutes);
// router.use('/blogs', blogsRoutes);

export default router;

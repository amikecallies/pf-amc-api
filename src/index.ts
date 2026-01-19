import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import config from './config/index.js';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin: string | undefined, callback) => {
      try {
        // 2. Corrected Regex: Removed the trailing slash \/ before the $
        const previewUrlRegex = /^https:\/\/deploy-preview-(\d+)--vigorous-wozniak-60b75a\.netlify\.app$/;
        
        const isValidPreviewUrl = previewUrlRegex.test(origin?? '');
        const isAllowlisted = config.corsOrigins.includes(origin?? '');

        if (isValidPreviewUrl || isAllowlisted) {
          callback(null, true);
        } else {
          // It's helpful to log the origin that failed so you can debug in production
          console.warn(`CORS blocked for origin: ${origin}`);
          callback(new Error('CORS error: Not allowed'));
        }
      } catch (error) {
        console.error('CORS logic error:', error);
        callback(error instanceof Error ? error : new Error('Internal CORS error'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-Api-Key'],
    credentials: true // Set this to true if you ever use cookies or sessions
  })
);

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

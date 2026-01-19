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
      console
      const previewUrlRegex = /^https:\/\/deploy-preview-(\d+)--vigorous-wozniak-60b75a\.netlify\.app\/$/;

      const isValidPreviewUrl = origin?.match(previewUrlRegex);

      if (origin !== undefined) {
        if (isValidPreviewUrl || config.corsOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('CORS error: Not allowed'));
        }
      }

    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-Api-Key'],
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

import type { AppConfig } from '../types/index.js';

const config: AppConfig = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS - Add your frontend domain(s) here
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'https://adriancallies.com'],

  // AWS SES Configuration
  aws: {
    region: process.env.AWS_REGION || 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },

  // Email Configuration
  email: {
    from: process.env.EMAIL_FROM || 'no-reply@adriancallies.com',
    to: process.env.EMAIL_TO || 'adrianm.callies@gmail.com',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per window
  },
};

export default config;

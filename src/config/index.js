const config = {
  // Server
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS - Add your frontend domain(s) here
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'https://adriancallies.com'],

  // AWS SES Configuration
  aws: {
    region: process.env.AWS_REGION || 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIA4HJMF54KT4FN2KNY',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
  },

  // Email Configuration
  email: {
    from: process.env.EMAIL_FROM || 'no-reply@adriancallies.com', // default value (should be overwritten)
    to: process.env.EMAIL_TO || 'adrianm.callies@gmail.com',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per window
  },
};

export default config;

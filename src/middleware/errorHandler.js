import config from '../config/index.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, res) => {
  console.error('Error:', err);

  // AWS SES specific errors
  if (err.name === 'MessageRejected') {
    return res.status(500).json({
      success: false,
      error: 'Email could not be sent. Please try again later.',
    });
  }

  if (err.name === 'CredentialsProviderError' || err.name === 'InvalidClientTokenId') {
    console.error('AWS credentials error - check your environment variables');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error. Please contact the administrator.',
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.nodeEnv !== 'production' && { stack: err.stack }),
  });
};

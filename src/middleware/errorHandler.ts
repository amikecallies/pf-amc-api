import type { Request, Response, NextFunction } from 'express';
import config from '../config/index.js';

interface AppError extends Error {
  statusCode?: number;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // AWS SES specific errors
  if (err.name === 'MessageRejected') {
    res.status(500).json({
      success: false,
      error: 'Email could not be sent. Please try again later.',
    });
    return;
  }

  if (err.name === 'CredentialsProviderError' || err.name === 'InvalidClientTokenId') {
    console.error('AWS credentials error - check your environment variables');
    res.status(500).json({
      success: false,
      error: 'Server configuration error. Please contact the administrator.',
    });
    return;
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

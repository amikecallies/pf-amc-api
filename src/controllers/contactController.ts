import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sendContactEmail } from '../services/emailService.js';
import type { ContactFormData } from '../types/index.js';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array().map((err) => ({
          field: 'path' in err ? err.path : 'unknown',
          message: err.msg,
        })),
      });
      return;
    }

    const { name, email, subject, message } = req.body as ContactFormData;

    // Send the email
    await sendContactEmail({ name, email, subject, message });

    // Success response
    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully.',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

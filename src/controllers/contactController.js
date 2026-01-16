import { validationResult } from 'express-validator';
import { sendContactEmail } from '../services/emailService.js';

export const submitContact = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }

    const { name, email, subject, message } = req.body;

    // Send the email
    await sendContactEmail({ name, email, subject, message });

    // Success response
    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully.',
    });
  } catch (error) {
    next(error);
  }
};

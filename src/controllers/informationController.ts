import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { databaseService } from '../services/database.js';

export const getInformation = async (req: Request, res: Response): Promise<void> => {
  try {

    // API Key Validation
    const apiKey = req.header('x-Api-Key');

    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
      res.status(403).json({ 
        success: false,
        error: 'Forbidden: Client is not authorized.' 
      });
      return;
    }
          
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

 
    const collection = databaseService.getCollection('information');

    const data = await collection.findOne({});

    // Success response
    res.status(200).json(data);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

/**
 * Shared type definitions for the API
 */

/** Contact form submission data */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Standard API success response */
export interface ApiSuccessResponse {
  success: true;
  message: string;
}

/** Standard API error response */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: ValidationErrorDetail[];
  stack?: string;
}

/** Validation error detail */
export interface ValidationErrorDetail {
  field: string;
  message: string;
}

/** API response union type */
export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

/** Application configuration */
export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  mongodb: {
    uri: string;
  };
  aws: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
  email: {
    from: string;
    to: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

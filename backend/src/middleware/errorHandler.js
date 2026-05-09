import logger from '../utils/logger.js';
import { errorResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/errors.js';

/**
 * Global Express error handler.
 * Must be registered LAST with app.use().
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json(
      errorResponse('Validation failed', err.errors),
    );
  }

  // Known operational errors
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json(
      errorResponse(err.message, err.errors),
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(errorResponse('Invalid token'));
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(errorResponse('Token expired'));
  }

  // Unexpected errors — log full stack, hide details from client
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  return res.status(500).json(errorResponse('Internal server error'));
};

export default errorHandler;

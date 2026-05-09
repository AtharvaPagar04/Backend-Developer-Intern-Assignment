import { errorResponse } from '../utils/apiResponse.js';

/**
 * Catches requests to routes that don't exist.
 * Register AFTER all routes but BEFORE the error handler.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json(
    errorResponse(`Route ${req.method} ${req.originalUrl} not found`),
  );
};

export default notFoundHandler;

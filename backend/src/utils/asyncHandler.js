/**
 * Wraps an async Express route handler and forwards any rejection
 * to next() so the global error handler deals with it.
 *
 * @param {Function} fn  - async (req, res, next) => {}
 * @returns {Function}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

import { BadRequestError } from '../utils/errors.js';

/**
 * Like validate(), but parses req.query instead of req.body.
 * Replaces req.query with the parsed & coerced result so controllers
 * always receive typed values (e.g. page as a number, not a string).
 *
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
const validateQuery = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    throw new BadRequestError('Invalid query parameters', result.error.errors);
  }
  req.query = result.data;
  next();
};

export default validateQuery;

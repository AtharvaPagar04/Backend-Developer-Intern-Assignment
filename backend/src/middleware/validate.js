import { z } from 'zod';
import { BadRequestError } from '../utils/errors.js';

/**
 * Returns an Express middleware that validates req.body against the
 * provided Zod schema.  Throws BadRequestError on failure.
 *
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    throw new BadRequestError('Validation failed', result.error.errors);
  }
  req.body = result.data; // replace with parsed & stripped data
  next();
};

export default validate;

import { ForbiddenError } from '../utils/errors.js';

/**
 * Role-based authorization middleware factory.
 *
 * Must be used AFTER the `authenticate` middleware so that
 * req.user is already populated.
 *
 * Usage:
 *   router.get('/admin', authenticate, authorizeRoles('admin'), handler);
 *   router.delete('/post', authenticate, authorizeRoles('admin', 'user'), handler);
 *
 * @param {...string} allowedRoles  One or more role strings that may access the route.
 * @returns {import('express').RequestHandler}
 */
const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  // authenticate middleware guarantees req.user exists here,
  // but we guard defensively in case the chain is misconfigured.
  if (!req.user) {
    return next(new ForbiddenError('Authentication required before authorization'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(
      new ForbiddenError(
        `Access denied. Required role: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`,
      ),
    );
  }

  return next();
};

export default authorizeRoles;

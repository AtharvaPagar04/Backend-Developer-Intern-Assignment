import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

/**
 * Express middleware — Bearer token authentication.
 *
 * Extracts the JWT from the Authorization header, verifies it,
 * and attaches the decoded payload to req.user.
 *
 * req.user shape:
 *   { userId: string, email: string, role: string, iat: number, exp: number }
 *
 * On failure it calls next(UnauthorizedError) so the global error
 * handler serialises the 401 response — no try/catch needed in routes.
 *
 * @type {import('express').RequestHandler}
 */
const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization header missing or malformed'));
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (err) {
    return next(err); // UnauthorizedError from verifyAccessToken
  }
};

export default authenticate;

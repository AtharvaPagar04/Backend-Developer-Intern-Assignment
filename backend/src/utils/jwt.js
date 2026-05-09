import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { UnauthorizedError } from './errors.js';

/**
 * Signs a JWT access token.
 *
 * @param {{ userId: string, email: string, role: string }} payload
 * @returns {string}  signed JWT
 */
export const signAccessToken = (payload) => {
  if (!config.jwt.secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
    algorithm: 'HS256',
    issuer: 'intern-api',
  });
};

/**
 * Verifies and decodes a JWT access token.
 * Throws UnauthorizedError for invalid / expired tokens.
 *
 * @param {string} token
 * @returns {{ userId: string, email: string, role: string, iat: number, exp: number }}
 */
export const verifyAccessToken = (token) => {
  if (!config.jwt.secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    return jwt.verify(token, config.jwt.secret, {
      algorithms: ['HS256'],
      issuer: 'intern-api',
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token has expired');
    }
    throw new UnauthorizedError('Invalid access token');
  }
};

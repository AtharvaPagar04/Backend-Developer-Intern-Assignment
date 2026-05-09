import * as authService from './auth.service.js';
import { successResponse } from '../../utils/apiResponse.js';

/**
 * POST /api/v1/auth/register
 *
 * Body is pre-validated by the validate(registerSchema) middleware
 * before this handler runs.
 *
 * @type {import('express').RequestHandler}
 */
export const register = async (req, res) => {
  const user = await authService.register(req.body);

  return res.status(201).json(
    successResponse({ user }, 'Account created successfully'),
  );
};

/**
 * POST /api/v1/auth/login
 *
 * Body is pre-validated by the validate(loginSchema) middleware.
 *
 * @type {import('express').RequestHandler}
 */
export const login = async (req, res) => {
  const { user, accessToken } = await authService.login(req.body);

  return res.status(200).json(
    successResponse({ user, accessToken }, 'Login successful'),
  );
};

/**
 * GET /api/v1/auth/me
 *
 * Protected — authenticate middleware must run first.
 * req.user is the decoded JWT payload set by authenticate.
 *
 * @type {import('express').RequestHandler}
 */
export const getMe = async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);

  return res.status(200).json(
    successResponse({ user }, 'User profile retrieved'),
  );
};

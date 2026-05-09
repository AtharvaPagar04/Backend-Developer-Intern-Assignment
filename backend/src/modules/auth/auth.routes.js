import { Router } from 'express';
import * as authController from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';
import asyncHandler from '../../utils/asyncHandler.js';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user account
 *     description: |
 *       Creates a new user with the default role of **user**.
 *       Email is normalised to lowercase before storage.
 *       The password is bcrypt-hashed (cost 12) and is **never** returned in any response.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email address is already registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 */
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(authController.register),
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and receive a JWT access token
 *     description: |
 *       Validates credentials and returns a signed **HS256 JWT** access token.
 *       The token expires per the `JWT_ACCESS_EXPIRES_IN` environment variable (default **15 minutes**).
 *
 *       Use the token in subsequent requests as:
 *       `Authorization: Bearer <accessToken>`
 *
 *       > **Security note:** A timing-safe bcrypt comparison is always performed,
 *       > even when the email does not exist, to prevent user-enumeration attacks.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful. Returns the user profile and a Bearer access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 */
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(authController.login),
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the currently authenticated user's profile
 *     description: |
 *       Returns the full profile of the user identified by the Bearer token.
 *       Soft-deleted users receive a 404 even with a valid token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(authController.getMe),
);

export default router;


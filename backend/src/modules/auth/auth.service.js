import bcrypt from 'bcryptjs';
import * as authRepository from './auth.repository.js';
import { signAccessToken } from '../../utils/jwt.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../utils/errors.js';

const SALT_ROUNDS = 12;

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Registers a new user account.
 *
 * Steps:
 *  1. Check for an existing account with the same email.
 *  2. Hash the plaintext password.
 *  3. Persist the new user row.
 *  4. Return the sanitised user object (no password).
 *
 * @param {{ name: string, email: string, password: string }} dto
 * @returns {Promise<object>} sanitised user record
 */
export const register = async ({ name, email, password }) => {
  // Normalise email before any DB interaction
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Duplicate-email guard
  const existing = await authRepository.findByEmail(normalizedEmail);
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Persist
  const user = await authRepository.createUser({
    name: name.trim(),
    email: normalizedEmail,
    password: passwordHash,
    role: 'user', // enforce default; never trust client-supplied role
  });

  // 4. Return sanitised record (password excluded by repository)
  return user;
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Authenticates a user with email + password.
 *
 * Returns both the sanitised user object and a signed JWT access token.
 * Uses a timing-safe password comparison to mitigate user enumeration.
 *
 * @param {{ email: string, password: string }} dto
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export const login = async ({ email, password }) => {
  // Normalise email before any DB interaction
  const normalizedEmail = email.toLowerCase().trim();

  // Fetch user including password hash
  const userWithPassword = await authRepository.findByEmailWithPassword(normalizedEmail);

  // Always run bcrypt.compare to prevent timing-based user enumeration
  const dummyHash = '$2a$12$jZdPPhLWbs.bFXlV5lejyOsHsDWNxZtAQWve9CWA52wYVsQ8k/0xO';
  const passwordToCompare = userWithPassword?.password ?? dummyHash;
  const isMatch = await bcrypt.compare(password, passwordToCompare);

  if (!userWithPassword || !isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!userWithPassword.is_active) {
    throw new UnauthorizedError('Account is deactivated. Please contact support.');
  }

  // Build JWT payload — only non-sensitive identity fields
  const payload = {
    userId: userWithPassword.id,
    email: userWithPassword.email,
    role: userWithPassword.role,
  };

  const accessToken = signAccessToken(payload);

  // Strip password before returning the user object
  const { password: _pw, ...safeUser } = userWithPassword;

  return { user: safeUser, accessToken };
};

// ─── Get Current User ─────────────────────────────────────────────────────────

/**
 * Fetches the full profile of the currently authenticated user.
 * Called from the /auth/me route after authenticate middleware runs.
 *
 * @param {string} userId
 * @returns {Promise<object>} sanitised user record
 */
export const getCurrentUser = async (userId) => {
  const user = await authRepository.findById(userId);
  if (!user) {
    // Should not happen in practice because the JWT was valid,
    // but guards against deleted-account edge cases.
    throw new NotFoundError('User not found');
  }
  return user;
};

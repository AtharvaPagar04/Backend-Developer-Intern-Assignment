import { z } from 'zod';

// ─── Shared field definitions ─────────────────────────────────────────────────

const emailField = z
  .string({ required_error: 'Email is required' })
  .email('Must be a valid email address')
  .toLowerCase()
  .trim();

const passwordField = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters');

// ─── Register schema ──────────────────────────────────────────────────────────

/**
 * POST /auth/register
 *
 * Accepts: { name, email, password }
 * Returns parsed & normalised data on success.
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),

  email: emailField,

  password: passwordField,
});

// ─── Login schema ─────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 *
 * Accepts: { email, password }
 */
export const loginSchema = z.object({
  email: emailField,
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

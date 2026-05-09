import db from '../../config/database.js';

const TABLE = 'users';

/**
 * Columns returned for every public user query.
 * password is intentionally excluded from all repository reads
 * except findByEmailWithPassword which is only used by the login flow.
 */
const PUBLIC_COLUMNS = [
  'id',
  'name',
  'email',
  'role',
  'is_active',
  'created_at',
  'updated_at',
];

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Finds a user by their email address.
 * Returns only public columns (no password hash).
 *
 * @param {string} email
 * @returns {Promise<object|undefined>}
 */
export const findByEmail = (email) =>
  db(TABLE).select(PUBLIC_COLUMNS).where({ email }).whereNull('deleted_at').first();

/**
 * Finds a user by email AND includes the hashed password.
 * Used exclusively in the login flow for credential verification.
 *
 * @param {string} email
 * @returns {Promise<object|undefined>}
 */
export const findByEmailWithPassword = (email) =>
  db(TABLE)
    .select([...PUBLIC_COLUMNS, 'password'])
    .where({ email })
    .whereNull('deleted_at')
    .first();

/**
 * Finds a user by their UUID primary key.
 * Returns only public columns (no password hash).
 *
 * @param {string} id
 * @returns {Promise<object|undefined>}
 */
export const findById = (id) =>
  db(TABLE).select(PUBLIC_COLUMNS).where({ id }).whereNull('deleted_at').first();

/**
 * Inserts a new user row and returns the created record
 * (public columns only — password is never returned).
 *
 * @param {{ name: string, email: string, password: string, role?: string }} data
 * @returns {Promise<object>}
 */
export const createUser = (data) =>
  db(TABLE)
    .insert(data)
    .returning(PUBLIC_COLUMNS)
    .then(([user]) => user);

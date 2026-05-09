import db from '../../config/database.js';

const TABLE = 'tasks';

const TASK_COLUMNS = [
  'id',
  'user_id',
  'title',
  'description',
  'status',
  'priority',
  'due_date',
  'created_at',
  'updated_at',
];

// ─── Internal query builder helpers ──────────────────────────────────────────

/**
 * Returns a base query scoped to non-deleted tasks.
 * Accepts an optional user_id to scope results to one owner.
 *
 * @param {string|null} userId  - null means admin sees all
 * @returns {import('knex').Knex.QueryBuilder}
 */
const baseQuery = (userId = null) => {
  const q = db(TABLE).whereNull('deleted_at');
  if (userId) q.where({ user_id: userId });
  return q;
};

/**
 * Applies optional status/priority filters to an existing query builder.
 *
 * @param {import('knex').Knex.QueryBuilder} q
 * @param {{ status?: string, priority?: string }} filters
 */
const applyFilters = (q, { status, priority } = {}) => {
  if (status)   q.where({ status });
  if (priority) q.where({ priority });
};

// ─── Repository functions ─────────────────────────────────────────────────────

/**
 * Fetches a paginated list of tasks.
 *
 * @param {object} options
 * @param {string|null} options.userId    - null → admin; UUID → scoped to owner
 * @param {number}      options.page
 * @param {number}      options.limit
 * @param {string}      [options.status]
 * @param {string}      [options.priority]
 * @returns {Promise<{ tasks: object[], total: number }>}
 */
export const findAll = async ({ userId, page, limit, status, priority }) => {
  const offset = (page - 1) * limit;

  // Data query
  const dataQuery = baseQuery(userId)
    .clone()
    .select(TASK_COLUMNS)
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  // Count query (same filters, no pagination)
  const countQuery = baseQuery(userId).clone();

  applyFilters(dataQuery, { status, priority });
  applyFilters(countQuery, { status, priority });

  const [tasks, [{ count }]] = await Promise.all([
    dataQuery,
    countQuery.count('id as count'),
  ]);

  return { tasks, total: parseInt(count, 10) };
};

/**
 * Finds a single task by its UUID.
 * Does NOT enforce ownership — the service layer does that.
 *
 * @param {string} id
 * @returns {Promise<object|undefined>}
 */
export const findById = (id) =>
  db(TABLE).select(TASK_COLUMNS).where({ id }).whereNull('deleted_at').first();

/**
 * Inserts a new task row and returns the full record.
 *
 * @param {object} data
 * @returns {Promise<object>}
 */
export const createTask = (data) =>
  db(TABLE)
    .insert(data)
    .returning(TASK_COLUMNS)
    .then(([task]) => task);

/**
 * Applies a partial update to a task row.
 * updated_at is set to now() automatically.
 *
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
export const updateTask = (id, data) =>
  db(TABLE)
    .where({ id })
    .whereNull('deleted_at')
    .update({ ...data, updated_at: db.fn.now() })
    .returning(TASK_COLUMNS)
    .then(([task]) => task);

/**
 * Soft-deletes a task by setting deleted_at.
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
export const softDeleteTask = (id) =>
  db(TABLE)
    .where({ id })
    .whereNull('deleted_at')
    .update({ deleted_at: db.fn.now(), updated_at: db.fn.now() });

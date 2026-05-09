import * as taskRepository from './task.repository.js';
import { assertOwnership } from '../../utils/ownership.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Creates a new task owned by the requesting user.
 *
 * @param {object} options
 * @param {string} options.userId    - from req.user.userId
 * @param {object} options.dto       - validated createTaskSchema data
 * @returns {Promise<object>}
 */
export const createTask = async ({ userId, dto }) => {
  const task = await taskRepository.createTask({
    user_id:     userId,
    title:       dto.title,
    description: dto.description ?? null,
    status:      dto.status,
    priority:    dto.priority,
    due_date:    dto.due_date ?? null,
  });

  return task;
};

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * Returns a paginated, filtered list of tasks.
 * Admins see all tasks; regular users see only their own.
 *
 * @param {object} options
 * @param {string} options.userId
 * @param {string} options.role
 * @param {object} options.query    - validated listTasksQuerySchema data
 * @returns {Promise<{ tasks: object[], pagination: object }>}
 */
export const listTasks = async ({ userId, role, query }) => {
  const { page, limit, status, priority } = query;

  // Admins see every task; regular users scoped to their own
  const scopedUserId = role === 'admin' ? null : userId;

  const { tasks, total } = await taskRepository.findAll({
    userId:   scopedUserId,
    page,
    limit,
    status,
    priority,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

// ─── Get by ID ────────────────────────────────────────────────────────────────

/**
 * Fetches a single task by ID, enforcing ownership.
 *
 * @param {object} options
 * @param {string} options.taskId
 * @param {string} options.userId
 * @param {string} options.role
 * @returns {Promise<object>}
 */
export const getTaskById = async ({ taskId, userId, role }) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new NotFoundError('Task not found');

  assertOwnership({ requesterId: userId, requesterRole: role, ownerId: task.user_id });

  return task;
};

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Partially updates a task after ownership validation.
 *
 * @param {object} options
 * @param {string} options.taskId
 * @param {string} options.userId
 * @param {string} options.role
 * @param {object} options.dto     - validated updateTaskSchema data
 * @returns {Promise<object>}
 */
export const updateTask = async ({ taskId, userId, role, dto }) => {
  // Strip undefined keys so knex doesn't try to set them to NULL
  const updates = Object.fromEntries(
    Object.entries(dto).filter(([, v]) => v !== undefined),
  );

  if (Object.keys(updates).length === 0) {
    throw new BadRequestError('No fields provided for update');
  }

  const task = await taskRepository.findById(taskId);

  if (!task) throw new NotFoundError('Task not found');

  assertOwnership({ requesterId: userId, requesterRole: role, ownerId: task.user_id });

  const updated = await taskRepository.updateTask(taskId, updates);

  return updated;
};

// ─── Delete (soft) ────────────────────────────────────────────────────────────

/**
 * Soft-deletes a task after ownership validation.
 *
 * @param {object} options
 * @param {string} options.taskId
 * @param {string} options.userId
 * @param {string} options.role
 * @returns {Promise<void>}
 */
export const deleteTask = async ({ taskId, userId, role }) => {
  const task = await taskRepository.findById(taskId);

  if (!task) throw new NotFoundError('Task not found');

  assertOwnership({ requesterId: userId, requesterRole: role, ownerId: task.user_id });

  await taskRepository.softDeleteTask(taskId);
};

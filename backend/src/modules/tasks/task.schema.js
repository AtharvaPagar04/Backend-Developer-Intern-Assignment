import { z } from 'zod';

// ─── Enum constants (mirrors DB enums) ────────────────────────────────────────

export const TASK_STATUSES = ['pending', 'in_progress', 'completed', 'archived'];
export const TASK_PRIORITIES = ['low', 'medium', 'high'];

// ─── Create schema ─────────────────────────────────────────────────────────────

/**
 * POST /tasks
 * user_id is injected from req.user in the service — never accepted from client.
 */
export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),

  description: z
    .string()
    .max(5000, 'Description must not exceed 5000 characters')
    .trim()
    .nullable()
    .optional(),

  status: z
    .enum(TASK_STATUSES, {
      errorMap: () => ({ message: `Status must be one of: ${TASK_STATUSES.join(', ')}` }),
    })
    .optional()
    .default('pending'),

  priority: z
    .enum(TASK_PRIORITIES, {
      errorMap: () => ({ message: `Priority must be one of: ${TASK_PRIORITIES.join(', ')}` }),
    })
    .optional()
    .default('medium'),

  due_date: z
    .string()
    .date('due_date must be a valid date (YYYY-MM-DD)')
    .nullable()
    .optional(),
});

// ─── Update schema ────────────────────────────────────────────────────────────

/**
 * PATCH /tasks/:id
 * All fields are optional — at least one must be present (enforced in service).
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .trim()
    .optional(),

  description: z
    .string()
    .max(5000, 'Description must not exceed 5000 characters')
    .trim()
    .nullable()
    .optional(),

  status: z
    .enum(TASK_STATUSES, {
      errorMap: () => ({ message: `Status must be one of: ${TASK_STATUSES.join(', ')}` }),
    })
    .optional(),

  priority: z
    .enum(TASK_PRIORITIES, {
      errorMap: () => ({ message: `Priority must be one of: ${TASK_PRIORITIES.join(', ')}` }),
    })
    .optional(),

  due_date: z
    .string()
    .date('due_date must be a valid date (YYYY-MM-DD)')
    .nullable()
    .optional(),
});

// ─── Query filter schema ──────────────────────────────────────────────────────

/**
 * GET /tasks — query-string params: ?page=1&limit=10&status=pending&priority=high
 */
export const listTasksQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? Math.max(1, parseInt(v, 10)) : 1))
    .pipe(z.number().int().positive()),

  limit: z
    .string()
    .optional()
    .transform((v) => {
      const n = v ? parseInt(v, 10) : 20;
      return Math.min(Math.max(1, n), 100); // clamp 1–100
    })
    .pipe(z.number().int().positive()),

  status: z
    .enum(TASK_STATUSES, {
      errorMap: () => ({ message: `status filter must be one of: ${TASK_STATUSES.join(', ')}` }),
    })
    .optional(),

  priority: z
    .enum(TASK_PRIORITIES, {
      errorMap: () => ({ message: `priority filter must be one of: ${TASK_PRIORITIES.join(', ')}` }),
    })
    .optional(),
});

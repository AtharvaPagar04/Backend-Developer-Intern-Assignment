import { Router } from 'express';
import * as taskController from './task.controller.js';
import { createTaskSchema, updateTaskSchema, listTasksQuerySchema } from './task.schema.js';
import authenticate from '../../middleware/authenticate.js';
import validate from '../../middleware/validate.js';
import validateQuery from '../../middleware/validateQuery.js';
import asyncHandler from '../../utils/asyncHandler.js';

const router = Router();

// All task routes require an authenticated user
router.use(authenticate);

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     description: |
 *       Creates a task owned by the authenticated user.
 *       The `user_id` is set server-side from the JWT — it cannot be supplied by the client.
 *       `status` defaults to `pending`; `priority` defaults to `medium`.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/',
  validate(createTaskSchema),
  asyncHandler(taskController.createTask),
);

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks (paginated and filtered)
 *     description: |
 *       Returns a paginated list of tasks.
 *
 *       **Scoping rules:**
 *       - `user` role — returns only tasks belonging to the authenticated user.
 *       - `admin` role — returns tasks from all users.
 *
 *       **Soft-deleted tasks** (`deleted_at IS NOT NULL`) are always excluded.
 *
 *       Results are ordered by `created_at DESC`.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/StatusFilter'
 *       - $ref: '#/components/parameters/PriorityFilter'
 *     responses:
 *       200:
 *         description: Paginated task list returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedTasksResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/',
  validateQuery(listTasksQuerySchema),
  asyncHandler(taskController.listTasks),
);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a task by ID
 *     description: |
 *       Fetches a single task.
 *
 *       **Ownership enforcement:**
 *       - `user` — can only fetch their own tasks (403 otherwise).
 *       - `admin` — can fetch any task.
 *
 *       Returns 404 if the task does not exist or has been soft-deleted.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Task found and returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:id',
  asyncHandler(taskController.getTaskById),
);

/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Partially update a task
 *     description: |
 *       Applies a partial update. All fields are optional — only the fields present
 *       in the request body are modified; omitted fields retain their current values.
 *       At least one field must be provided (empty body → 400).
 *
 *       **Ownership enforcement:**
 *       - `user` — can only update their own tasks.
 *       - `admin` — can update any task.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch(
  '/:id',
  validate(updateTaskSchema),
  asyncHandler(taskController.updateTask),
);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Soft-delete a task
 *     description: |
 *       Marks the task as deleted by setting the `deleted_at` timestamp.
 *       The record is **not** physically removed from the database.
 *       After deletion the task is excluded from all list and lookup responses.
 *
 *       **Ownership enforcement:**
 *       - `user` — can only delete their own tasks.
 *       - `admin` — can delete any task.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Task soft-deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Task deleted successfully' }
 *                 data:    { nullable: true, example: null }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
  '/:id',
  asyncHandler(taskController.deleteTask),
);

export default router;


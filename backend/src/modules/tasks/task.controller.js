import * as taskService from './task.service.js';
import { successResponse } from '../../utils/apiResponse.js';

/**
 * POST /api/v1/tasks
 * Body pre-validated by validate(createTaskSchema).
 *
 * @type {import('express').RequestHandler}
 */
export const createTask = async (req, res) => {
  const task = await taskService.createTask({
    userId: req.user.userId,
    dto:    req.body,
  });

  return res.status(201).json(successResponse({ task }, 'Task created successfully'));
};

/**
 * GET /api/v1/tasks
 * Query pre-validated by validateQuery(listTasksQuerySchema).
 *
 * @type {import('express').RequestHandler}
 */
export const listTasks = async (req, res) => {
  const { tasks, pagination } = await taskService.listTasks({
    userId: req.user.userId,
    role:   req.user.role,
    query:  req.query,
  });

  return res.status(200).json(successResponse({ tasks, pagination }, 'Tasks retrieved'));
};

/**
 * GET /api/v1/tasks/:id
 *
 * @type {import('express').RequestHandler}
 */
export const getTaskById = async (req, res) => {
  const task = await taskService.getTaskById({
    taskId: req.params.id,
    userId: req.user.userId,
    role:   req.user.role,
  });

  return res.status(200).json(successResponse({ task }, 'Task retrieved'));
};

/**
 * PATCH /api/v1/tasks/:id
 * Body pre-validated by validate(updateTaskSchema).
 *
 * @type {import('express').RequestHandler}
 */
export const updateTask = async (req, res) => {
  const task = await taskService.updateTask({
    taskId: req.params.id,
    userId: req.user.userId,
    role:   req.user.role,
    dto:    req.body,
  });

  return res.status(200).json(successResponse({ task }, 'Task updated successfully'));
};

/**
 * DELETE /api/v1/tasks/:id
 *
 * @type {import('express').RequestHandler}
 */
export const deleteTask = async (req, res) => {
  await taskService.deleteTask({
    taskId: req.params.id,
    userId: req.user.userId,
    role:   req.user.role,
  });

  return res.status(200).json(successResponse(null, 'Task deleted successfully'));
};

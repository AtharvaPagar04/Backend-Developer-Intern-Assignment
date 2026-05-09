import express from 'express';
import db from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: API health check
 *     security: []
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is degraded
 */
router.get('/', async (_req, res) => {
  const status = { api: 'ok', db: 'unknown' };
  let httpStatus = 200;

  try {
    await db.raw('SELECT 1');
    status.db = 'ok';
  } catch {
    status.db = 'unreachable';
    httpStatus = 503;
  }

  const payload =
    httpStatus === 200
      ? successResponse(status, 'Service healthy')
      : errorResponse('Service degraded', status);

  return res.status(httpStatus).json(payload);
});

export default router;

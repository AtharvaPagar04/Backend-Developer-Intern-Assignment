import express from 'express';
import db from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: API and database health check
 *     description: |
 *       Returns the liveness status of the API process and its PostgreSQL connection.
 *
 *       | `data.api` | `data.db`    | HTTP status |
 *       |------------|--------------|-------------|
 *       | `ok`       | `ok`         | **200**     |
 *       | `ok`       | `unreachable`| **503**     |
 *
 *       This endpoint is intentionally **unauthenticated** and is safe to call
 *       from load-balancer health probes.
 *     security: []
 *     responses:
 *       200:
 *         description: All systems operational.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: Service degraded — database is unreachable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Service degraded
 *                 errors:
 *                   type: object
 *                   properties:
 *                     api: { type: string, example: ok }
 *                     db:  { type: string, example: unreachable }
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


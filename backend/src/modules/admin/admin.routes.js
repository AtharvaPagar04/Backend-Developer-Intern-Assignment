import { Router } from 'express';
import authenticate from '../../middleware/authenticate.js';
import authorizeRoles from '../../middleware/authorizeRoles.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';

const router = Router();

// All admin routes require authentication + admin role.
// Apply both middleware at the router level so every
// route added here is automatically protected.
router.use(authenticate);
router.use(authorizeRoles('admin'));

/**
 * @openapi
 * /admin/ping:
 *   get:
 *     tags: [Admin]
 *     summary: Admin connectivity check
 *     description: |
 *       Verifies the requesting user is both **authenticated** and holds the **admin** role.
 *       Use this endpoint to confirm admin-level access is working before calling
 *       other admin-only routes.
 *
 *       > **Role required:** `admin`
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access confirmed. Returns the verified admin's identity.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Admin access confirmed
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Pong
 *                     admin:
 *                       type: object
 *                       properties:
 *                         userId: { type: string, format: uuid,  example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }
 *                         email:  { type: string, format: email, example: 'admin@example.com' }
 *                         role:   { type: string, example: admin }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get(
  '/ping',
  asyncHandler(async (req, res) => {
    return res.status(200).json(
      successResponse(
        {
          message: 'Pong',
          admin: {
            userId: req.user.userId,
            email:  req.user.email,
            role:   req.user.role,
          },
        },
        'Admin access confirmed',
      ),
    );
  }),
);

export default router;


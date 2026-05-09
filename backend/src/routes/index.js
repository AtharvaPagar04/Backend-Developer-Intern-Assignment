import express from 'express';
import healthRouter from './health.js';
import authRouter from '../modules/auth/auth.routes.js';
import adminRouter from '../modules/admin/admin.routes.js';
import taskRouter from '../modules/tasks/task.routes.js';

// Module routers (wired in as features are implemented)
// import userRouter  from '../modules/users/user.routes.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/tasks', taskRouter);

// router.use('/users', userRouter);

export default router;


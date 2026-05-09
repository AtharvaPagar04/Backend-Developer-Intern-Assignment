import express from 'express';
import healthRouter from './health.js';

// Module routers (wired in as features are implemented)
// import authRouter  from '../modules/auth/auth.routes.js';
// import userRouter  from '../modules/users/user.routes.js';
// import taskRouter  from '../modules/tasks/task.routes.js';
// import adminRouter from '../modules/admin/admin.routes.js';

const router = express.Router();

router.use('/health', healthRouter);

// router.use('/auth',  authRouter);
// router.use('/users', userRouter);
// router.use('/tasks', taskRouter);
// router.use('/admin', adminRouter);

export default router;

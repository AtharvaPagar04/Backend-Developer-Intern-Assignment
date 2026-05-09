import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/database.js';
import bcrypt from 'bcryptjs';

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const ts = Date.now();

const userA    = { name: 'User A',    email: `usera.${ts}@example.com`,  password: 'Str0ng!Pass' };
const userB    = { name: 'User B',    email: `userb.${ts}@example.com`,  password: 'Str0ng!Pass' };
const adminUser = { name: 'Admin',   email: `admin.${ts}@example.com`,   password: 'Str0ng!Pass' };

let tokenA, tokenB, adminToken;
let userAId, adminId;

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeAll(async () => {
  const hash = await bcrypt.hash('Str0ng!Pass', 12);

  const [insertedUserA, insertedAdmin] = await db('users')
    .insert([
      { name: userA.name,     email: userA.email,     password: hash, role: 'user'  },
      { name: userB.name,     email: userB.email,     password: hash, role: 'user'  },
      { name: adminUser.name, email: adminUser.email,  password: hash, role: 'admin' },
    ])
    .returning(['id', 'email']);

  // insertedUserA is index 0, admin is index 2
  userAId  = insertedUserA.id;
  adminId  = insertedAdmin.id;

  const logins = await Promise.all([
    request(app).post('/api/v1/auth/login').send({ email: userA.email,     password: userA.password }),
    request(app).post('/api/v1/auth/login').send({ email: userB.email,     password: userB.password }),
    request(app).post('/api/v1/auth/login').send({ email: adminUser.email, password: adminUser.password }),
  ]);

  tokenA     = logins[0].body.data.accessToken;
  tokenB     = logins[1].body.data.accessToken;
  adminToken = logins[2].body.data.accessToken;
});

afterAll(async () => {
  await db('users').whereIn('email', [userA.email, userB.email, adminUser.email]).del();
  await db.destroy();
});

// ─── Helper ───────────────────────────────────────────────────────────────────

const createTask = (token, overrides = {}) =>
  request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test Task', priority: 'medium', ...overrides });

// ─── POST /tasks ──────────────────────────────────────────────────────────────

describe('POST /api/v1/tasks', () => {
  it('creates a task for authenticated user and returns 201', async () => {
    const res = await createTask(tokenA);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.task.title).toBe('Test Task');
    expect(res.body.data.task.status).toBe('pending');
    expect(res.body.data.task.priority).toBe('medium');
    expect(res.body.data.task.user_id).toBeDefined();
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ priority: 'high' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for invalid status enum', async () => {
    const res = await createTask(tokenA, { status: 'unknown_status' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/api/v1/tasks').send({ title: 'No auth' });
    expect(res.statusCode).toBe(401);
  });
});

// ─── GET /tasks ───────────────────────────────────────────────────────────────

describe('GET /api/v1/tasks', () => {
  beforeAll(async () => {
    // Seed a few extra tasks for pagination/filter tests
    await Promise.all([
      createTask(tokenA, { title: 'Task A1', status: 'in_progress', priority: 'high' }),
      createTask(tokenA, { title: 'Task A2', status: 'completed',   priority: 'low'  }),
      createTask(tokenB, { title: 'Task B1', status: 'pending',     priority: 'high' }),
    ]);
  });

  it('returns only the authenticated user\'s tasks', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(200);
    const tasks = res.body.data.tasks;
    tasks.forEach((t) => expect(t.user_id).toBe(userAId));
  });

  it('admin sees all tasks', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.tasks.length).toBeGreaterThan(0);
  });

  it('returns pagination metadata', async () => {
    const res = await request(app)
      .get('/api/v1/tasks?page=1&limit=2')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.pagination).toMatchObject({
      page: 1,
      limit: 2,
    });
    expect(typeof res.body.data.pagination.total).toBe('number');
  });

  it('filters by status', async () => {
    const res = await request(app)
      .get('/api/v1/tasks?status=in_progress')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(200);
    res.body.data.tasks.forEach((t) => expect(t.status).toBe('in_progress'));
  });

  it('filters by priority', async () => {
    const res = await request(app)
      .get('/api/v1/tasks?priority=high')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(200);
    res.body.data.tasks.forEach((t) => expect(t.priority).toBe('high'));
  });

  it('returns 400 for invalid status filter', async () => {
    const res = await request(app)
      .get('/api/v1/tasks?status=oops')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(400);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.statusCode).toBe(401);
  });
});

// ─── GET /tasks/:id ───────────────────────────────────────────────────────────

describe('GET /api/v1/tasks/:id', () => {
  let taskId;

  beforeAll(async () => {
    const res = await createTask(tokenA, { title: 'Ownership Test Task' });
    taskId = res.body.data.task.id;
  });

  it('owner can fetch their task', async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.task.id).toBe(taskId);
  });

  it('admin can fetch any task', async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('other user gets 403', async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.statusCode).toBe(403);
  });

  it('returns 404 for non-existent task', async () => {
    const res = await request(app)
      .get('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(404);
  });
});

// ─── PATCH /tasks/:id ─────────────────────────────────────────────────────────

describe('PATCH /api/v1/tasks/:id', () => {
  let taskId;

  beforeAll(async () => {
    const res = await createTask(tokenA, { title: 'To Update' });
    taskId = res.body.data.task.id;
  });

  it('owner can update their task', async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Updated Title', status: 'in_progress' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.task.title).toBe('Updated Title');
    expect(res.body.data.task.status).toBe('in_progress');
  });

  it('partial update preserves untouched fields', async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ priority: 'high' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.task.title).toBe('Updated Title'); // unchanged
    expect(res.body.data.task.priority).toBe('high');
  });

  it('returns 400 with empty body', async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('other user gets 403', async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Hijacked' });
    expect(res.statusCode).toBe(403);
  });

  it('admin can update any task', async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'archived' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.task.status).toBe('archived');
  });
});

// ─── DELETE /tasks/:id ────────────────────────────────────────────────────────

describe('DELETE /api/v1/tasks/:id', () => {
  let taskId;

  beforeAll(async () => {
    const res = await createTask(tokenA, { title: 'To Delete' });
    taskId = res.body.data.task.id;
  });

  it('other user cannot delete', async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.statusCode).toBe(403);
  });

  it('owner can soft-delete their task', async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('soft-deleted task is no longer findable', async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.statusCode).toBe(404);
  });

  it('soft-deleted task excluded from list', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${tokenA}`);
    const ids = res.body.data.tasks.map((t) => t.id);
    expect(ids).not.toContain(taskId);
  });
});

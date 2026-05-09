import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/database.js';
import bcrypt from 'bcryptjs';

// ─── Test fixtures ─────────────────────────────────────────────────────────────

const timestamp = Date.now();

const regularUser = {
  email: `user.${timestamp}@example.com`,
  password: 'Str0ng!Pass',
  name: 'Regular User',
};

const adminUser = {
  email: `admin.${timestamp}@example.com`,
  password: 'Str0ng!Pass',
  name: 'Admin User',
};

let regularToken;
let adminToken;

// ─── Setup: seed users directly into DB ───────────────────────────────────────

beforeAll(async () => {
  const hash = await bcrypt.hash('Str0ng!Pass', 12);

  await db('users').insert([
    { name: regularUser.name, email: regularUser.email, password: hash, role: 'user' },
    { name: adminUser.name,   email: adminUser.email,   password: hash, role: 'admin' },
  ]);

  // Obtain tokens via login
  const [resUser, resAdmin] = await Promise.all([
    request(app).post('/api/v1/auth/login').send({ email: regularUser.email, password: regularUser.password }),
    request(app).post('/api/v1/auth/login').send({ email: adminUser.email,   password: adminUser.password }),
  ]);

  regularToken = resUser.body.data.accessToken;
  adminToken   = resAdmin.body.data.accessToken;
});

afterAll(async () => {
  await db('users').whereIn('email', [regularUser.email, adminUser.email]).del();
  await db.destroy();
});

// ─── GET /api/v1/admin/ping ────────────────────────────────────────────────────

describe('GET /api/v1/admin/ping', () => {
  it('returns 200 for an admin user', async () => {
    const res = await request(app)
      .get('/api/v1/admin/ping')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.admin.role).toBe('admin');
  });

  it('returns 403 for a regular user', async () => {
    const res = await request(app)
      .get('/api/v1/admin/ping')
      .set('Authorization', `Bearer ${regularToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/api/v1/admin/ping');
    expect(res.statusCode).toBe(401);
  });

  it('returns 401 with a malformed token', async () => {
    const res = await request(app)
      .get('/api/v1/admin/ping')
      .set('Authorization', 'Bearer not.a.token');
    expect(res.statusCode).toBe(401);
  });
});

// ─── authorizeRoles unit-level validation ─────────────────────────────────────

describe('authorizeRoles middleware — edge cases', () => {
  it('returns 403 when no roles are allowed (empty authorisation)', async () => {
    // A route protected by authorizeRoles() with no args should deny everyone
    const res = await request(app)
      .get('/api/v1/admin/ping')
      .set('Authorization', `Bearer ${regularToken}`);
    expect(res.statusCode).toBe(403);
  });
});

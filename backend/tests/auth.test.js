import request from 'supertest';
import app from '../src/app.js';
import db from '../src/config/database.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const testUser = {
  name: 'Test User',
  email: `test.${Date.now()}@example.com`,
  password: 'Str0ng!Pass',
};

let accessToken;

// Clean up after all tests
afterAll(async () => {
  await db('users').where('email', testUser.email).del();
  await db.destroy();
});

// ─── Register ─────────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/register', () => {
  it('creates a new user and returns 201', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toMatchObject({
      name: testUser.name,
      email: testUser.email,
      role: 'user',
    });
    // Password must never be present in any response
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('rejects duplicate email with 409', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing fields with 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'nope@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a weak password with 400', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Weak',
      email: 'weak@example.com',
      password: '123',
    });
    expect(res.statusCode).toBe(400);
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/login', () => {
  it('returns 200 with accessToken on valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.accessToken).toBe('string');
    expect(res.body.data.user.password).toBeUndefined();

    // Store token for /me tests
    accessToken = res.body.data.accessToken;
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 on non-existent email', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'ghost@example.com',
      password: 'anything',
    });
    expect(res.statusCode).toBe(401);
  });

  it('returns 400 on missing body', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
});

// ─── /me ─────────────────────────────────────────────────────────────────────

describe('GET /api/v1/auth/me', () => {
  it('returns the current user profile with a valid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('returns 401 with a malformed token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer not.a.real.token');
    expect(res.statusCode).toBe(401);
  });
});

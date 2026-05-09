import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/v1/health', () => {
  it('returns 200 with status ok when db is reachable', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.api).toBe('ok');
  });

  it('returns JSON content-type', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['content-type']).toMatch(/json/);
  });
});

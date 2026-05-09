import apiClient from './client.js';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data).then((r) => r.data),
  login:    (data) => apiClient.post('/auth/login',    data).then((r) => r.data),
  me:       ()     => apiClient.get('/auth/me').then((r) => r.data),
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const tasksApi = {
  list: (params) =>
    apiClient.get('/tasks', { params }).then((r) => r.data),

  getById: (id) =>
    apiClient.get(`/tasks/${id}`).then((r) => r.data),

  create: (data) =>
    apiClient.post('/tasks', data).then((r) => r.data),

  update: (id, data) =>
    apiClient.patch(`/tasks/${id}`, data).then((r) => r.data),

  remove: (id) =>
    apiClient.delete(`/tasks/${id}`).then((r) => r.data),
};

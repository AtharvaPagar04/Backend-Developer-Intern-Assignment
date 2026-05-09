import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * Reads the API base URL from Vite env vars; falls back to the
 * dev proxy path so it works out-of-the-box with `npm run dev`.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor — attach auth token ──────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — handle 401 globally ───────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Redirect to login when auth is implemented
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('omega_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Auth API
export const authApi = {
  register: (email: string, password: string, name?: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
};

// Projects API
export const projectsApi = {
  list: (page = 1, limit = 20) =>
    api.get(`/projects?page=${page}&limit=${limit}`),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  archive: (id: string) => api.post(`/projects/${id}/archive`),
  artifacts: (id: string) => api.get(`/projects/${id}/artifacts`),
};

// Agents API
export const agentsApi = {
  list: () => api.get('/agents'),
  createTask: (projectId: string, data: any) =>
    api.post(`/agents/tasks/${projectId}`, data),
  getTasks: (projectId: string) => api.get(`/agents/tasks/${projectId}`),
  executeTask: (taskId: string) => api.post(`/agents/tasks/${taskId}/execute`),
};

// Deployments API
export const deploymentsApi = {
  deploy: (projectId: string, platform: string) =>
    api.post(`/deployments/${projectId}`, { platform }),
  list: (projectId: string) => api.get(`/deployments/project/${projectId}`),
  status: (id: string) => api.get(`/deployments/${id}/status`),
  rollback: (id: string) => api.post(`/deployments/${id}/rollback`),
};

// Organizations API
export const orgsApi = {
  list: () => api.get('/organizations'),
  create: (name: string, description?: string) =>
    api.post('/organizations', { name, description }),
  get: (id: string) => api.get(`/organizations/${id}`),
  invite: (orgId: string, email: string, role?: string) =>
    api.post(`/organizations/${orgId}/invite`, { email, role }),
};

// OMEGA INFINITY API Client
import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const client: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('omega_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('omega_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============

export const authApi = {
  login: (email: string, password: string) => client.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string }) => client.post('/auth/register', data),
  me: () => client.get('/auth/me'),
  refreshToken: () => client.post('/auth/refresh'),
};

// ============ PROJECTS ============

export const projectsApi = {
  list: () => client.get('/projects'),
  get: (id: string) => client.get(`/projects/${id}`),
  create: (data: { name: string; description: string; techStack: string[] }) => client.post('/projects', data),
  update: (id: string, data: any) => client.put(`/projects/${id}`, data),
  delete: (id: string) => client.delete(`/projects/${id}`),
  getStats: (id: string) => client.get(`/projects/${id}/stats`),
};

// ============ AGENTS ============

export const agentsApi = {
  list: () => client.get('/agents'),
  get: (id: string) => client.get(`/agents/${id}`),
  toggle: (id: string, active: boolean) => client.put(`/agents/${id}/toggle`, { active }),
  updateConfig: (id: string, config: any) => client.put(`/agents/${id}/config`, { config }),
  getExecutions: (id: string) => client.get(`/agents/${id}/executions`),
};

// ============ WORKFLOWS ============

export const workflowsApi = {
  list: () => client.get('/workflows'),
  get: (id: string) => client.get(`/workflows/${id}`),
  create: (data: { name: string; description: string; tasks: any[]; projectId?: string }) =>
    client.post('/workflows', data),
  execute: (id: string) => client.post(`/workflows/${id}/execute`),
  getTemplates: () => client.get('/workflows/templates'),
  getByProject: (projectId: string) => client.get(`/workflows/project/${projectId}`),
};

// ============ DEPLOYMENTS ============

export const deploymentsApi = {
  list: () => client.get('/deployments'),
  get: (id: string) => client.get(`/deployments/${id}`),
  create: (data: { projectId: string; environment: string; platform: string; version: string }) =>
    client.post('/deployments', data),
  redeploy: (id: string) => client.post(`/deployments/${id}/redeploy`),
  getLogs: (id: string) => client.get(`/deployments/${id}/logs`),
};

// ============ ORGANIZATIONS ============

export const orgsApi = {
  list: () => client.get('/orgs'),
  get: (id: string) => client.get(`/orgs/${id}`),
  create: (data: { name: string; description: string }) => client.post('/orgs', data),
  update: (id: string, data: any) => client.put(`/orgs/${id}`, data),
  getMembers: (id: string) => client.get(`/orgs/${id}/members`),
  inviteMember: (orgId: string, email: string, role: string) =>
    client.post(`/orgs/${orgId}/invite`, { email, role }),
  removeMember: (orgId: string, userId: string) => client.delete(`/orgs/${orgId}/members/${userId}`),
};

// ============ NOTIFICATIONS ============

export const notificationsApi = {
  list: (limit?: number) => client.get('/notifications', { params: { limit } }),
  getUnreadCount: () => client.get('/notifications/unread-count'),
  markAsRead: (id: string) => client.put(`/notifications/${id}/read`),
  markAllAsRead: () => client.put('/notifications/read-all'),
};

export default {
  auth: authApi,
  projects: projectsApi,
  agents: agentsApi,
  workflows: workflowsApi,
  deployments: deploymentsApi,
  orgs: orgsApi,
  notifications: notificationsApi,
};

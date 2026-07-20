// OMEGA INFINITY Zustand Store
import { create } from 'zustand';

interface AppState {
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  currentOrg: any | null;
  sidebarOpen: boolean;
  notificationsOpen: boolean;
  unreadCount: number;
  activeAgents: number;
  activeWorkflows: number;

  setUser: (user: any) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setAuth: (user: any, accessToken: string, refreshToken: string) => void;
  setOrg: (org: any) => void;
  logout: () => void;
  restoreSession: () => void;
  toggleSidebar: () => void;
  toggleNotifications: () => void;
  setUnreadCount: (count: number) => void;
  setActiveAgents: (count: number) => void;
  setActiveWorkflows: (count: number) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  currentOrg: null,
  sidebarOpen: true,
  notificationsOpen: false,
  unreadCount: 0,
  activeAgents: 10,
  activeWorkflows: 0,

  setUser: (user) => {
    if (typeof window !== 'undefined' && user) localStorage.setItem('omega_user', JSON.stringify(user));
    set({ user, isAuthenticated: !!user });
  },

  setToken: (token) => {
    if (token && typeof window !== 'undefined') localStorage.setItem('omega_token', token);
    else if (typeof window !== 'undefined') localStorage.removeItem('omega_token');
    set({ token });
  },

  setRefreshToken: (token) => {
    if (token && typeof window !== 'undefined') localStorage.setItem('omega_refresh_token', token);
    else if (typeof window !== 'undefined') localStorage.removeItem('omega_refresh_token');
    set({ refreshToken: token });
  },

  setAuth: (user, accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omega_token', accessToken);
      localStorage.setItem('omega_refresh_token', refreshToken);
      localStorage.setItem('omega_user', JSON.stringify(user));
    }
    set({ user, token: accessToken, refreshToken, isAuthenticated: true });
  },

  setOrg: (org) => set({ currentOrg: org }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('omega_token');
      localStorage.removeItem('omega_refresh_token');
      localStorage.removeItem('omega_user');
    }
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false, currentOrg: null });
  },

  restoreSession: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('omega_token');
    const refreshToken = localStorage.getItem('omega_refresh_token');
    const userStr = localStorage.getItem('omega_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, refreshToken, isAuthenticated: true });
      } catch {
        localStorage.removeItem('omega_user');
      }
    }
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleNotifications: () => set((state) => ({ notificationsOpen: !state.notificationsOpen })),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setActiveAgents: (count) => set({ activeAgents: count }),
  setActiveWorkflows: (count) => set({ activeWorkflows: count }),
}));

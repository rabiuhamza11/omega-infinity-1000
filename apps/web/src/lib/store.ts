// OMEGA INFINITY Zustand Store
import { create } from 'zustand';

interface AppState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  currentOrg: any | null;
  sidebarOpen: boolean;
  notificationsOpen: boolean;
  unreadCount: number;
  activeAgents: number;
  activeWorkflows: number;

  setUser: (user: any) => void;
  setToken: (token: string | null) => void;
  setOrg: (org: any) => void;
  logout: () => void;
  toggleSidebar: () => void;
  toggleNotifications: () => void;
  setUnreadCount: (count: number) => void;
  setActiveAgents: (count: number) => void;
  setActiveWorkflows: (count: number) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('omega_token') : null,
  isAuthenticated: false,
  currentOrg: null,
  sidebarOpen: true,
  notificationsOpen: false,
  unreadCount: 0,
  activeAgents: 10,
  activeWorkflows: 0,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    if (token && typeof window !== 'undefined') localStorage.setItem('omega_token', token);
    else if (typeof window !== 'undefined') localStorage.removeItem('omega_token');
    set({ token });
  },
  setOrg: (org) => set({ currentOrg: org }),
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('omega_token');
    set({ user: null, token: null, isAuthenticated: false, currentOrg: null });
  },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleNotifications: () => set((state) => ({ notificationsOpen: !state.notificationsOpen })),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setActiveAgents: (count) => set({ activeAgents: count }),
  setActiveWorkflows: (count) => set({ activeWorkflows: count }),
}));

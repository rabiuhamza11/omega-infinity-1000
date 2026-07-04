'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { projectsApi, agentsApi } from '@/lib/api';
import { LayoutDashboard, FolderKanban, Bot, Rocket, Settings, Users, LogOut, MessageSquare } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/agents', label: 'AI Agents', icon: Bot },
  { href: '/dashboard/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/dashboard/deployments', label: 'Deployments', icon: Rocket },
  { href: '/dashboard/organizations', label: 'Organizations', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loadFromStorage, logout, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState({ projects: 0, agents: 0, deployments: 0 });

  useEffect(() => {
    loadFromStorage();
    if (!token && typeof window !== 'undefined') {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (token) {
      projectsApi.list().then(() => setStats((s) => ({ ...s, projects: 0 }))).catch(() => {});
      agentsApi.list().then(() => setStats((s) => ({ ...s, agents: 0 }))).catch(() => {});
    }
  }, [token]);

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-omega-panel border-r border-white/5 flex flex-col fixed h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-omega-accent to-omega-glow bg-clip-text text-transparent">OMEGA</h1>
        </div>
        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <div key={item.href} className={`nav-item ${active ? 'active' : ''}`} onClick={() => router.push(item.href)}>
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-omega-accent flex items-center justify-center text-sm font-bold">{user?.name?.[0] || 'U'}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-white/30 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="nav-item text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, LayoutDashboard, GitBranch, Cpu, Rocket, MessageSquare, Settings, LogOut, Bell, Menu } from 'lucide-react';
import { useStore } from '@/lib/store';
import { authApi } from '@/lib/api';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Projects', icon: GitBranch },
  { href: '/dashboard/agents', label: 'Agents', icon: Cpu },
  { href: '/dashboard/deployments', label: 'Deployments', icon: Rocket },
  { href: '/dashboard/chat', label: 'Agent Chat', icon: MessageSquare },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const restoreSession = useStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('omega_token');
      if (!token) router.push('/');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setNotifications([
      { id: 1, title: 'Deployment Successful', message: 'E-Commerce Platform v1.2.0 deployed', time: '2m ago', read: false },
      { id: 2, title: 'Agent Completed', message: 'Code Generator finished 342 files', time: '15m ago', read: false },
      { id: 3, title: 'Workflow Done', message: 'Full-Stack App workflow completed', time: '1h ago', read: false },
    ]);
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    router.push('/');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const userName = user?.name || (typeof window !== 'undefined' ? (() => {
    try { const u = JSON.parse(localStorage.getItem('omega_user') || '{}'); return u.name || 'Admin'; }
    catch { return 'Admin'; }
  })() : 'Admin');
  const userEmail = user?.email || (typeof window !== 'undefined' ? (() => {
    try { const u = JSON.parse(localStorage.getItem('omega_user') || '{}'); return u.email || 'admin@omegainfinity.io'; }
    catch { return 'admin@omegainfinity.io'; }
  })() : 'admin@omegainfinity.io');
  const userInitial = (userName || 'A').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {sidebarOpen && (
        <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col fixed h-full z-40">
          <div className="p-6 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-sm">OMEGA INFINITY</div>
                <div className="text-xs text-white/30">1000 Enterprise</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                    isActive ? 'bg-purple-600/20 text-purple-400 font-medium' : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">{userInitial}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{userName}</div>
                <div className="text-xs text-white/30 truncate">{userEmail}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full text-xs text-white/40 hover:text-red-400 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>
      )}

      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all`}>
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 bg-slate-950/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white">
              <Menu size={22} />
            </button>
            <div className="text-sm text-white/40">
              <span className="text-purple-400">10 agents</span> active ·{' '}
              <span className="text-green-400">96.2%</span> success rate
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="text-white/40 hover:text-white relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-xs flex items-center justify-center text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
              All Systems Operational
            </span>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

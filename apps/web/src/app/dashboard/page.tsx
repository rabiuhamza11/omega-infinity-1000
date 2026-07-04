'use client';
import { useState, useEffect } from 'react';
import { Rocket, Cpu, GitBranch, Activity, TrendingUp, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 4,
    activeAgents: 10,
    deployments: 12,
    workflows: 28,
    successRate: 96.2,
  });
  const [recentActivity, setRecentActivity] = useState([
    { type: 'deployment', icon: 'rocket', title: 'E-Commerce Platform deployed to production', meta: 'v1.2.0 · Vercel · 2m ago', status: 'success' },
    { type: 'agent', icon: 'cpu', title: 'Code Generator finished: 342 files generated', meta: 'E-Commerce Platform · 15m ago', status: 'success' },
    { type: 'workflow', icon: 'activity', title: 'Full-Stack App workflow completed', meta: '9 tasks · 12.4s total · 1h ago', status: 'success' },
    { type: 'agent', icon: 'cpu', title: 'Security Agent found 2 warnings', meta: 'Fintech Dashboard · 2h ago', status: 'warning' },
    { type: 'deployment', icon: 'rocket', title: 'Fintech Dashboard deployment failed', meta: 'v0.1.0 · Docker · 3h ago', status: 'failed' },
    { type: 'project', icon: 'git', title: 'New project created: Healthcare Portal', meta: '5h ago', status: 'info' },
    { type: 'agent', icon: 'cpu', title: 'QA Agent: 87 tests passing', meta: 'E-Commerce Platform · 6h ago', status: 'success' },
    { type: 'workflow', icon: 'activity', title: 'Security Audit workflow started', meta: '4 tasks · 8h ago', status: 'running' },
  ]);

  const statusColors: Record<string, string> = {
    success: 'text-green-400 bg-green-500/10',
    failed: 'text-red-400 bg-red-500/10',
    warning: 'text-yellow-400 bg-yellow-500/10',
    running: 'text-blue-400 bg-blue-500/10',
    info: 'text-purple-400 bg-purple-500/10',
  };

  const iconMap: Record<string, any> = { rocket: Rocket, cpu: Cpu, activity: Activity, git: GitBranch };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-white/40">Overview of your AI-powered software factory</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <GitBranch size={20} className="text-blue-400" />
            <span className="text-xs text-green-400">+1 this week</span>
          </div>
          <div className="text-2xl font-bold">{stats.projects}</div>
          <div className="text-xs text-white/40">Projects</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Cpu size={20} className="text-purple-400" />
            <span className="text-xs text-green-400">All active</span>
          </div>
          <div className="text-2xl font-bold">{stats.activeAgents}</div>
          <div className="text-xs text-white/40">AI Agents</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Rocket size={20} className="text-green-400" />
            <span className="text-xs text-green-400">+3 today</span>
          </div>
          <div className="text-2xl font-bold">{stats.deployments}</div>
          <div className="text-xs text-white/40">Deployments</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Activity size={20} className="text-yellow-400" />
            <span className="text-xs text-green-400">+5 this week</span>
          </div>
          <div className="text-2xl font-bold">{stats.workflows}</div>
          <div className="text-xs text-white/40">Workflows</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={20} className="text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.successRate}%</div>
          <div className="text-xs text-white/40">Success Rate</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock size={18} /> Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => {
            const Icon = iconMap[activity.icon] || Activity;
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/8 transition">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${statusColors[activity.status]}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{activity.title}</div>
                  <div className="text-xs text-white/40">{activity.meta}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${statusColors[activity.status]} capitalize`}>
                  {activity.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <button className="card hover:bg-white/5 transition text-left">
          <Rocket size={24} className="text-green-400 mb-2" />
          <div className="font-medium">Deploy Project</div>
          <div className="text-xs text-white/40">Push to Vercel/Render</div>
        </button>
        <button className="card hover:bg-white/5 transition text-left">
          <Activity size={24} className="text-yellow-400 mb-2" />
          <div className="font-medium">Run Workflow</div>
          <div className="text-xs text-white/40">Execute multi-agent task</div>
        </button>
        <button className="card hover:bg-white/5 transition text-left">
          <Cpu size={24} className="text-purple-400 mb-2" />
          <div className="font-medium">Manage Agents</div>
          <div className="text-xs text-white/40">Configure AI agents</div>
        </button>
        <button className="card hover:bg-white/5 transition text-left">
          <GitBranch size={24} className="text-blue-400 mb-2" />
          <div className="font-medium">New Project</div>
          <div className="text-xs text-white/40">Start from template</div>
        </button>
      </div>
    </div>
  );
}

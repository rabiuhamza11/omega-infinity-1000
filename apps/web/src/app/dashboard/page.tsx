'use client';

import { useEffect, useState } from 'react';
import { projectsApi } from '@/lib/api';
import { FolderKanban, Bot, Rocket, TrendingUp, Plus } from 'lucide-react';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    projectsApi.list().then(({ data }) => setProjects(data.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-white/40 mt-1">Overview of your AI-powered projects</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus size={18} /> New Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FolderKanban} label="Projects" value={projects.length} />
        <StatCard icon={Bot} label="Active Agents" value={10} />
        <StatCard icon={Rocket} label="Deployments" value={0} />
        <StatCard icon={TrendingUp} label="Tasks Completed" value={0} />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
        {projects.length === 0 ? (
          <p className="text-white/30 text-center py-8">No projects yet. Create your first AI-powered project!</p>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-white/30">{p.description}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-omega-accent/20 text-omega-glow">{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/40 text-sm">{label}</span>
        <Icon size={18} className="text-omega-accent" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

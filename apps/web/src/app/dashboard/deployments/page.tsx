'use client';
import { useState } from 'react';
import { Rocket, CheckCircle, Clock, XCircle, GitBranch, ExternalLink, RotateCcw, Server, Globe } from 'lucide-react';

const deployments = [
  { id: '1', version: 'v1.2.0', project: 'E-Commerce Platform', env: 'production', platform: 'Vercel', url: 'ecommerce.omegainfinity.io', status: 'SUCCESS', date: '2024-07-04 14:32', duration: '2m 15s', commit: 'a3b2c1d' },
  { id: '2', version: 'v1.1.0', project: 'E-Commerce Platform', env: 'production', platform: 'Vercel', url: 'ecommerce.omegainfinity.io', status: 'SUCCESS', date: '2024-06-28 10:15', duration: '1m 48s', commit: 'b4c3d2e' },
  { id: '3', version: 'v0.8.0', project: 'Healthcare Portal', env: 'staging', platform: 'Vercel', url: 'healthcare-stg.omegainfinity.io', status: 'SUCCESS', date: '2024-06-25 16:45', duration: '3m 02s', commit: 'c5d4e3f' },
  { id: '4', version: 'v0.1.0', project: 'Fintech Dashboard', env: 'staging', platform: 'Docker', url: 'fintech-stg.render.com', status: 'FAILED', date: '2024-06-22 09:22', duration: '5m 30s', commit: 'd6e5f4g' },
  { id: '5', version: 'v1.0.0', project: 'AI Chat Service', env: 'production', platform: 'Vercel', url: 'aichat.omegainfinity.io', status: 'SUCCESS', date: '2024-06-20 12:00', duration: '1m 20s', commit: 'e7f6g5h' },
  { id: '6', version: 'v0.9.0', project: 'AI Chat Service', env: 'staging', platform: 'Render', url: 'aichat-stg.render.com', status: 'SUCCESS', date: '2024-06-18 15:30', duration: '2m 45s', commit: 'f8g7h6i' },
  { id: '7', version: 'v0.5.0', project: 'Healthcare Portal', env: 'production', platform: 'Render', url: 'healthcare.omegainfinity.io', status: 'SUCCESS', date: '2024-06-15 08:00', duration: '3m 12s', commit: 'g9h8i7j' },
];

const platformIcons: Record<string, string> = { Vercel: '▲', Render: '⚡', Docker: '🐳' };
const statusConfig = {
  SUCCESS: { icon: CheckCircle, color: 'text-green-400 bg-green-500/20', label: 'Success' },
  FAILED: { icon: XCircle, color: 'text-red-400 bg-red-500/20', label: 'Failed' },
  PENDING: { icon: Clock, color: 'text-yellow-400 bg-yellow-500/20', label: 'Pending' },
  BUILDING: { icon: RotateCcw, color: 'text-blue-400 bg-blue-500/20', label: 'Building' },
};

export default function DeploymentsPage() {
  const [filter, setFilter] = useState<'all' | 'production' | 'staging'>('all');
  const [selected, setSelected] = useState<typeof deployments[0] | null>(null);

  const filtered = deployments.filter(d => filter === 'all' || d.env === filter);
  const successCount = deployments.filter(d => d.status === 'SUCCESS').length;
  const failCount = deployments.filter(d => d.status === 'FAILED').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Deployments</h1>
          <p className="text-white/40">Track and manage application deployments</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Rocket size={18} /> New Deployment</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Rocket size={20} className="text-purple-400" />
            <span className="text-xs text-white/30">Total</span>
          </div>
          <div className="text-2xl font-bold">{deployments.length}</div>
          <div className="text-xs text-white/40">Deployments</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-xs text-green-400">{((successCount / deployments.length) * 100).toFixed(0)}%</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{successCount}</div>
          <div className="text-xs text-white/40">Successful</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <XCircle size={20} className="text-red-400" />
            <span className="text-xs text-white/30">All time</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{failCount}</div>
          <div className="text-xs text-white/40">Failed</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Globe size={20} className="text-blue-400" />
            <span className="text-xs text-white/30">Active</span>
          </div>
          <div className="text-2xl font-bold">4</div>
          <div className="text-xs text-white/40">Live URLs</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(['all', 'production', 'staging'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition ${filter === f ? 'bg-purple-600 text-white font-medium' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Deployments Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-xs text-white/40">
              <th className="text-left p-3 font-medium">Version</th>
              <th className="text-left p-3 font-medium">Project</th>
              <th className="text-left p-3 font-medium">Environment</th>
              <th className="text-left p-3 font-medium">Platform</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Date</th>
              <th className="text-right p-3 font-medium hidden md:table-cell">Duration</th>
              <th className="text-center p-3 font-medium">Status</th>
              <th className="text-center p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => {
              const StatusIcon = statusConfig[d.status as keyof typeof statusConfig]?.icon || Clock;
              return (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setSelected(d)}>
                  <td className="p-3">
                    <div className="font-mono font-bold text-sm">{d.version}</div>
                    <div className="text-xs text-white/30 font-mono flex items-center gap-1"><GitBranch size={10} /> {d.commit}</div>
                  </td>
                  <td className="p-3 text-sm">{d.project}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${d.env === 'production' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {d.env}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm flex items-center gap-1.5">
                      <span className="text-base">{platformIcons[d.platform]}</span> {d.platform}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-white/30 hidden md:table-cell font-mono">{d.date}</td>
                  <td className="p-3 text-right text-xs text-white/40 hidden md:table-cell font-mono">{d.duration}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${statusConfig[d.status as keyof typeof statusConfig]?.color}`}>
                      <StatusIcon size={12} /> {statusConfig[d.status as keyof typeof statusConfig]?.label}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {d.url && d.status === 'SUCCESS' && (
                      <a href={`https://${d.url}`} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-purple-400" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="card max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold flex items-center gap-2">{selected.project} {selected.version}</h3>
                <div className="text-xs text-white/40 font-mono mt-1">Commit: {selected.commit}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white/40">Environment</span>
                <span className={selected.env === 'production' ? 'text-green-400' : 'text-yellow-400'}>{selected.env}</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white/40">Platform</span>
                <span>{platformIcons[selected.platform]} {selected.platform}</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white/40">Status</span>
                <span className={selected.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}>{selected.status}</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white/40">Duration</span>
                <span className="font-mono">{selected.duration}</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-white/40">Deployed</span>
                <span className="font-mono text-xs">{selected.date}</span>
              </div>
              {selected.url && (
                <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                  <span className="text-white/40">URL</span>
                  <a href={`https://${selected.url}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center gap-1 text-xs">
                    {selected.url} <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button className="flex-1 py-2.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 text-sm">View Logs</button>
              <button className="flex-1 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-600/90 text-sm flex items-center justify-center gap-2">
                <RotateCcw size={14} /> Redeploy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

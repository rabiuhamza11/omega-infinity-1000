'use client';
import { useState, useEffect } from 'react';
import { Rocket, CheckCircle, XCircle, Clock, GitBranch, Server, Globe } from 'lucide-react';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<any[]>([]);

  useEffect(() => {
    // Demo data
    setDeployments([
      { id: 1, projectName: 'E-Commerce Platform', environment: 'production', platform: 'vercel', url: 'https://ecommerce-app.vercel.app', status: 'SUCCESS', version: 'v1.2.0', deployedAt: '2024-07-04 14:32', duration: '2m 15s' },
      { id: 2, projectName: 'Healthcare Portal', environment: 'staging', platform: 'render', url: 'https://healthcare-portal-staging.onrender.com', status: 'SUCCESS', version: 'v0.9.1', deployedAt: '2024-07-04 12:18', duration: '3m 42s' },
      { id: 3, projectName: 'Fintech Dashboard', environment: 'production', platform: 'docker', url: 'https://fintech-api.harz.io', status: 'FAILED', version: 'v0.1.0', deployedAt: '2024-07-03 18:05', duration: '1m 23s' },
      { id: 4, projectName: 'AI Chat Service', environment: 'production', platform: 'vercel', url: 'https://ai-chat-svc.vercel.app', status: 'SUCCESS', version: 'v2.0.0', deployedAt: '2024-07-02 09:45', duration: '1m 58s' },
      { id: 5, projectName: 'E-Commerce Platform', environment: 'staging', platform: 'vercel', url: 'https://ecommerce-staging.vercel.app', status: 'SUCCESS', version: 'v1.2.1-beta', deployedAt: '2024-07-04 16:20', duration: '2m 05s' },
    ]);
  }, []);

  const successCount = deployments.filter((d) => d.status === 'SUCCESS').length;
  const failedCount = deployments.filter((d) => d.status === 'FAILED').length;

  const statusIcon = (status: string) => {
    if (status === 'SUCCESS') return <CheckCircle size={18} className="text-green-400" />;
    if (status === 'FAILED') return <XCircle size={18} className="text-red-400" />;
    return <Clock size={18} className="text-yellow-400" />;
  };

  const platformIcon = (platform: string) => {
    if (platform === 'vercel') return <Rocket size={16} />;
    if (platform === 'docker') return <Server size={16} />;
    return <Globe size={16} />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Deployments</h1>
          <p className="text-white/40">Track deployments across all projects and environments</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Rocket size={18} /> Deploy Now
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-white/40 text-sm mb-2">Total Deployments</div>
          <div className="text-2xl font-bold">{deployments.length}</div>
        </div>
        <div className="card">
          <div className="text-white/40 text-sm mb-2">Successful</div>
          <div className="text-2xl font-bold text-green-400">{successCount}</div>
        </div>
        <div className="card">
          <div className="text-white/40 text-sm mb-2">Failed</div>
          <div className="text-2xl font-bold text-red-400">{failedCount}</div>
        </div>
      </div>

      {/* Deployments List */}
      <div className="space-y-3">
        {deployments.map((d) => (
          <div key={d.id} className="card hover:bg-white/5 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {statusIcon(d.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{d.projectName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      d.environment === 'production' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>{d.environment}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                    <span className="flex items-center gap-1">{platformIcon(d.platform)} {d.platform}</span>
                    <span className="flex items-center gap-1"><GitBranch size={12} /> {d.version}</span>
                    <span>{d.deployedAt}</span>
                    <span>· {d.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {d.status === 'SUCCESS' && (
                  <a href={d.url} target="_blank" rel="noopener noreferrer"
                    className="text-tradeos-accent text-sm hover:underline">
                    Visit →
                  </a>
                )}
                {d.status === 'FAILED' && (
                  <button className="text-red-400 text-sm hover:underline">View Logs</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

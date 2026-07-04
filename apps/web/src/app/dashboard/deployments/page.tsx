'use client';

import { useEffect, useState } from 'react';
import { deploymentsApi } from '@/lib/api';
import { Rocket, RotateCcw, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<any[]>([]);

  useEffect(() => {
    deploymentsApi.list('').then(({ data }) => setDeployments(data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Deployments</h1>
      <p className="text-white/40 mb-6">Manage your project deployments</p>

      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            {['VERCEL', 'RENDER', 'GITHUB_PAGES', 'DOCKER'].map((p) => (
              <span key={p} className="px-4 py-2 rounded-lg bg-white/5 text-sm font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {deployments.length === 0 ? (
        <div className="card text-center py-12">
          <Rocket size={40} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/30">No deployments yet. Deploy a project to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deployments.map((d) => (
            <div key={d.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                {d.status === 'DEPLOYED' ? <CheckCircle className="text-green-500" /> : d.status === 'FAILED' ? <XCircle className="text-red-500" /> : <Loader className="text-yellow-500 animate-spin" />}
                <div>
                  <p className="font-medium">{d.platform}</p>
                  {d.url && <a href={d.url} className="text-sm text-omega-glow hover:underline">{d.url}</a>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/30">{new Date(d.createdAt).toLocaleString()}</span>
                {d.status === 'DEPLOYED' && <button className="btn-secondary text-sm px-3 py-1"><RotateCcw size={14} /> Rollback</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

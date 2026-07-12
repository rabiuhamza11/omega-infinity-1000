'use client';
import { useState, useEffect } from 'react';
import { Rocket, CheckCircle, Clock, XCircle, GitBranch, ExternalLink, RotateCcw, Server, Globe, Plus, Loader2, X } from 'lucide-react';

const API_BASE = 'https://superagent-2286fb2f.base44.app/functions/omegaInfinityApi';

const STATIC_DEPLOYMENTS = [
  { id: 's1', version: 'v1.2.0', project: 'E-Commerce Platform', env: 'production', platform: 'Vercel', url: 'ecommerce.omegainfinity.io', status: 'SUCCESS', date: '2026-07-04 14:32', duration: '2m 15s', commit: 'a3b2c1d' },
  { id: 's2', version: 'v1.1.0', project: 'E-Commerce Platform', env: 'production', platform: 'Vercel', url: 'ecommerce.omegainfinity.io', status: 'SUCCESS', date: '2026-06-28 10:15', duration: '1m 48s', commit: 'b4c3d2e' },
  { id: 's3', version: 'v0.8.0', project: 'Healthcare Portal', env: 'staging', platform: 'Vercel', url: 'healthcare-stg.omegainfinity.io', status: 'SUCCESS', date: '2026-06-25 16:45', duration: '3m 02s', commit: 'c5d4e3f' },
  { id: 's4', version: 'v0.1.0', project: 'Fintech Dashboard', env: 'staging', platform: 'Docker', url: '', status: 'FAILED', date: '2026-06-22 09:22', duration: '5m 30s', commit: 'd6e5f4g' },
  { id: 's5', version: 'v1.0.0', project: 'AI Chat Service', env: 'production', platform: 'Vercel', url: 'aichat.omegainfinity.io', status: 'SUCCESS', date: '2026-06-20 12:00', duration: '1m 20s', commit: 'e7f6g5h' },
];

const PLATFORMS = ['Vercel', 'Render', 'Netlify', 'Railway', 'Docker'];
const PROJECTS = ['E-Commerce Platform', 'Healthcare Portal', 'Fintech Dashboard', 'AI Chat Service'];
const ENVS = ['production', 'staging'];

const platformIcons: Record<string, string> = { Vercel: '▲', Render: '⚡', Docker: '🐳', Netlify: '🌐', Railway: '🚂' };
const statusConfig = {
  SUCCESS: { icon: CheckCircle, color: 'text-green-400 bg-green-500/20', label: 'Success' },
  FAILED: { icon: XCircle, color: 'text-red-400 bg-red-500/20', label: 'Failed' },
  PENDING: { icon: Clock, color: 'text-yellow-400 bg-yellow-500/20', label: 'Pending' },
  BUILDING: { icon: RotateCcw, color: 'text-blue-400 bg-blue-500/20', label: 'Building' },
};

export default function DeploymentsPage() {
  const [filter, setFilter] = useState<'all' | 'production' | 'staging'>('all');
  const [selected, setSelected] = useState<any | null>(null);
  const [deployments, setDeployments] = useState(STATIC_DEPLOYMENTS as any[]);
  const [showModal, setShowModal] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [form, setForm] = useState({ project: PROJECTS[0], environment: 'production', platform: 'Vercel' });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadRecentRuns();
  }, []);

  const loadRecentRuns = async () => {
    try {
      const res = await fetch(`${API_BASE}?action=recent_runs`);
      const data = await res.json();
      const runs = (data.runs || [])
        .filter((r: any) => r.run_type === 'deployment')
        .map((r: any, i: number) => ({
          id: `r${r.id}`,
          version: 'live',
          project: r.project_name,
          env: r.summary?.includes('staging') ? 'staging' : 'production',
          platform: r.summary?.match(/(Vercel|Render|Netlify|Railway|Docker)/)?.[1] || 'Vercel',
          url: '',
          status: r.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
          date: new Date(r.created_date).toLocaleString(),
          duration: '—',
          commit: 'live',
        }));
      if (runs.length > 0) setDeployments([...runs, ...STATIC_DEPLOYMENTS]);
    } catch (_) {}
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const res = await fetch(`${API_BASE}?action=create_deployment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('deploy failed');
      const data = await res.json();
      const newDeploy = {
        id: `r${data.run?.id || Date.now()}`,
        version: 'live',
        project: form.project,
        env: form.environment,
        platform: form.platform,
        url: '',
        status: 'SUCCESS',
        date: new Date().toLocaleString(),
        duration: '—',
        commit: 'live',
      };
      setDeployments(prev => [newDeploy, ...prev]);
      setToast(`✅ ${form.project} deployed to ${form.platform} (${form.environment})`);
      setShowModal(false);
      setTimeout(() => setToast(null), 5000);
    } catch (e) {
      setToast('❌ Deploy failed — please try again.');
      setTimeout(() => setToast(null), 4000);
    } finally {
      setDeploying(false);
    }
  };

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
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Rocket size={18} /> New Deployment
        </button>
      </div>

      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${toast.startsWith('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2"><Rocket size={20} className="text-purple-400" /><span className="text-xs text-white/30">Total</span></div>
          <div className="text-2xl font-bold">{deployments.length}</div>
          <div className="text-xs text-white/40">Deployments</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2"><CheckCircle size={20} className="text-green-400" /><span className="text-xs text-green-400">{deployments.length ? ((successCount / deployments.length) * 100).toFixed(0) : 0}%</span></div>
          <div className="text-2xl font-bold text-green-400">{successCount}</div>
          <div className="text-xs text-white/40">Successful</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2"><XCircle size={20} className="text-red-400" /><span className="text-xs text-white/30">All time</span></div>
          <div className="text-2xl font-bold text-red-400">{failCount}</div>
          <div className="text-xs text-white/40">Failed</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2"><Globe size={20} className="text-blue-400" /><span className="text-xs text-white/30">Active</span></div>
          <div className="text-2xl font-bold">{successCount}</div>
          <div className="text-xs text-white/40">Live Deploys</div>
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

      {/* Table */}
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
              const sc = statusConfig[d.status as keyof typeof statusConfig];
              const StatusIcon = sc?.icon || Clock;
              return (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setSelected(d)}>
                  <td className="p-3">
                    <div className="font-mono font-bold text-sm">{d.version}</div>
                    <div className="text-xs text-white/30 font-mono flex items-center gap-1"><GitBranch size={10} /> {d.commit}</div>
                  </td>
                  <td className="p-3 text-sm">{d.project}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${d.env === 'production' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{d.env}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm flex items-center gap-1.5"><span className="text-base">{platformIcons[d.platform] || '🔷'}</span> {d.platform}</span>
                  </td>
                  <td className="p-3 text-xs text-white/30 hidden md:table-cell font-mono">{d.date}</td>
                  <td className="p-3 text-right text-xs text-white/40 hidden md:table-cell font-mono">{d.duration}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${sc?.color}`}>
                      <StatusIcon size={12} /> {sc?.label}
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
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[['Platform', selected.platform], ['Environment', selected.env], ['Date', selected.date], ['Duration', selected.duration]].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-white/40 mb-1">{k}</div>
                  <div className="text-sm font-medium">{v}</div>
                </div>
              ))}
            </div>
            {selected.url && selected.status === 'SUCCESS' && (
              <a href={`https://${selected.url}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-400 text-sm hover:underline">
                <Globe size={14} /> https://{selected.url}
              </a>
            )}
          </div>
        </div>
      )}

      {/* New Deployment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="card max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg flex items-center gap-2"><Rocket size={20} className="text-purple-400" /> New Deployment</h3>
              <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Project</label>
                <select value={form.project} onChange={(e) => setForm(f => ({ ...f, project: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
                  {PROJECTS.map(p => <option key={p} value={p} className="bg-gray-900">{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Environment</label>
                <div className="flex gap-2">
                  {ENVS.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, environment: e }))}
                      className={`flex-1 py-2 rounded-lg text-sm capitalize transition ${form.environment === e ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => setForm(f => ({ ...f, platform: p }))}
                      className={`py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition ${form.platform === p ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                      <span>{platformIcons[p] || '🔷'}</span> {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleDeploy} disabled={deploying}
              className="mt-6 w-full btn-primary flex items-center justify-center gap-2 py-3">
              {deploying ? <><Loader2 size={18} className="animate-spin" /> Deploying...</> : <><Rocket size={18} /> Deploy Now</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

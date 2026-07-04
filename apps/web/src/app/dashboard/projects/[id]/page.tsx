'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Cpu, Rocket, GitBranch, CheckCircle, Clock, Play, FileCode, Shield, Database } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [tab, setTab] = useState<'overview' | 'agents' | 'deployments' | 'workflow'>('overview');

  useEffect(() => {
    // Demo project data
    setProject({
      id: params.id,
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce with payments, inventory, and admin dashboard',
      status: 'ACTIVE',
      techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
      createdAt: '2024-06-15',
      updatedAt: '2024-07-04',
      progress: 78,
      stats: { files: 342, commits: 156, deploys: 12, agents: 8 },
    });
    setAgents([
      { name: 'Architect Agent', type: 'architect', status: 'completed', task: 'System design', duration: '2.3s' },
      { name: 'Database Agent', type: 'database', status: 'completed', task: 'Schema design (12 tables)', duration: '1.8s' },
      { name: 'API Agent', type: 'api', status: 'completed', task: 'REST API (24 endpoints)', duration: '3.1s' },
      { name: 'Code Generator', type: 'codegen', status: 'completed', task: 'Backend + Frontend code', duration: '12.4s' },
      { name: 'Frontend Agent', type: 'frontend', status: 'completed', task: 'UI components (18)', duration: '8.7s' },
      { name: 'QA Agent', type: 'qa', status: 'completed', task: 'Tests (87 passing)', duration: '5.2s' },
      { name: 'Security Agent', type: 'security', status: 'completed', task: 'Audit (2 warnings)', duration: '3.6s' },
      { name: 'DevOps Agent', type: 'devops', status: 'running', task: 'CI/CD pipeline setup', duration: null },
    ]);
    setDeployments([
      { version: 'v1.2.0', env: 'production', platform: 'vercel', status: 'SUCCESS', date: '2024-07-04 14:32' },
      { version: 'v1.1.0', env: 'production', platform: 'vercel', status: 'SUCCESS', date: '2024-06-28 10:15' },
      { version: 'v1.0.0', env: 'staging', platform: 'vercel', status: 'SUCCESS', date: '2024-06-20 16:45' },
      { version: 'v0.9.0', env: 'staging', platform: 'render', status: 'FAILED', date: '2024-06-18 09:22' },
    ]);
  }, [params.id]);

  if (!project) return <div className="flex items-center justify-center h-64 text-white/40">Loading...</div>;

  const agentIcon = (type: string) => {
    const icons: Record<string, any> = { architect: FileCode, database: Database, api: FileCode, codegen: Cpu, frontend: Cpu, qa: Shield, security: Shield, devops: Rocket };
    const Icon = icons[type] || Cpu;
    return <Icon size={16} />;
  };

  return (
    <div>
      {/* Header */}
      <button onClick={() => router.push('/dashboard/projects')} className="text-white/40 hover:text-white text-sm mb-4 flex items-center gap-1">
        <ArrowLeft size={16} /> Back to Projects
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
          <p className="text-white/40">{project.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1 rounded-full ${project.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
            {project.status}
          </span>
          <button className="btn-primary flex items-center gap-2"><Play size={16} /> Run Workflow</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">Project Progress</span>
          <span className="text-sm font-bold">{project.progress}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card text-center"><div className="text-2xl font-bold">{project.stats.files}</div><div className="text-xs text-white/40">Files</div></div>
        <div className="card text-center"><div className="text-2xl font-bold">{project.stats.commits}</div><div className="text-xs text-white/40">Commits</div></div>
        <div className="card text-center"><div className="text-2xl font-bold">{project.stats.deploys}</div><div className="text-xs text-white/40">Deploys</div></div>
        <div className="card text-center"><div className="text-2xl font-bold">{project.stats.agents}</div><div className="text-xs text-white/40">Agents</div></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/5">
        {(['overview', 'agents', 'deployments', 'workflow'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition ${
              tab === t ? 'border-purple-500 text-white' : 'border-transparent text-white/40 hover:text-white/60'
            }`}>{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm font-mono">{tech}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card"><div className="text-white/40 text-sm mb-1">Created</div><div className="font-mono">{project.createdAt}</div></div>
            <div className="card"><div className="text-white/40 text-sm mb-1">Last Updated</div><div className="font-mono">{project.updatedAt}</div></div>
          </div>
        </div>
      )}

      {tab === 'agents' && (
        <div className="space-y-3">
          {agents.map((a, i) => (
            <div key={i} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">{agentIcon(a.type)}</div>
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-white/40">{a.task}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {a.duration && <span className="text-xs text-white/30 font-mono">{a.duration}</span>}
                {a.status === 'completed' ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Done</span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-1"><Clock size={12} /> Running</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'deployments' && (
        <div className="space-y-3">
          {deployments.map((d, i) => (
            <div key={i} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Rocket size={18} className="text-white/40" />
                <div>
                  <div className="font-mono font-medium">{d.version}</div>
                  <div className="text-xs text-white/40">{d.platform} · {d.env} · {d.date}</div>
                </div>
              </div>
              {d.status === 'SUCCESS' ? (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Success</span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">Failed</span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'workflow' && (
        <div className="card">
          <h3 className="font-semibold mb-4">Workflow Execution</h3>
          <div className="space-y-3">
            {agents.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  a.status === 'completed' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black animate-pulse'
                }`}>{i + 1}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-xs text-white/40">{a.task}</div>
                </div>
                {i < agents.length - 1 && <div className="absolute left-[14px] w-px h-8 bg-white/10" style={{ marginTop: '24px' }} />}
              </div>
            ))}
          </div>
          <button className="btn-primary w-full mt-6">Execute Full Workflow</button>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { GitBranch, Plus, Rocket, Cpu, Activity, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects([
      { id: '1', name: 'E-Commerce Platform', description: 'Full-stack e-commerce with payments, inventory, and admin dashboard', status: 'ACTIVE', techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'Stripe'], progress: 78, agents: 8, deploys: 4 },
      { id: '2', name: 'Healthcare Portal', description: 'Patient management system with appointments and medical records', status: 'ACTIVE', techStack: ['React', 'Express', 'MongoDB'], progress: 45, agents: 5, deploys: 2 },
      { id: '3', name: 'Fintech Dashboard', description: 'Real-time financial analytics dashboard with AI insights', status: 'PLANNING', techStack: ['Vue.js', 'Django', 'Redis'], progress: 12, agents: 3, deploys: 1 },
      { id: '4', name: 'AI Chat Service', description: 'LLM-powered customer support chatbot with sentiment analysis', status: 'COMPLETED', techStack: ['Next.js', 'FastAPI', 'OpenAI'], progress: 100, agents: 6, deploys: 5 },
    ]);
  }, []);

  const statusColors = {
    ACTIVE: 'bg-green-500/20 text-green-400',
    PLANNING: 'bg-yellow-500/20 text-yellow-400',
    COMPLETED: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Projects</h1>
          <p className="text-white/40">Manage your AI-generated software projects</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus size={18} /> New Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} onClick={() => router.push(`/dashboard/projects/${p.id}`)}
            className="card cursor-pointer hover:bg-white/5 transition group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <GitBranch size={20} />
                </div>
                <div>
                  <div className="font-semibold group-hover:text-white">{p.name}</div>
                  <div className="text-xs text-white/40">{p.description}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[p.status]}`}>{p.status}</span>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.techStack.map((tech) => (
                <span key={tech} className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 font-mono">{tech}</span>
              ))}
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/40">Progress</span>
                <span className="text-xs font-bold">{p.progress}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${p.progress}%` }} />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1"><Cpu size={14} /> {p.agents} agents</span>
                <span className="flex items-center gap-1"><Rocket size={14} /> {p.deploys} deploys</span>
              </div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-white/60 transition" />
            </div>
          </div>
        ))}
      </div>

      {/* Templates */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity size={18} /> Quick Start Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card cursor-pointer hover:bg-white/5 transition">
            <div className="text-3xl mb-2">🛒</div>
            <div className="font-medium mb-1">E-Commerce App</div>
            <div className="text-xs text-white/40">Next.js + Stripe + PostgreSQL</div>
          </div>
          <div className="card cursor-pointer hover:bg-white/5 transition">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-medium mb-1">Analytics Dashboard</div>
            <div className="text-xs text-white/40">React + Charts + Redis</div>
          </div>
          <div className="card cursor-pointer hover:bg-white/5 transition">
            <div className="text-3xl mb-2">🤖</div>
            <div className="font-medium mb-1">AI Chat Service</div>
            <div className="text-xs text-white/40">Next.js + OpenAI + FastAPI</div>
          </div>
        </div>
      </div>
    </div>
  );
}

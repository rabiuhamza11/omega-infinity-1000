'use client';

import { useEffect, useState } from 'react';
import { projectsApi } from '@/lib/api';
import { Plus, FolderKanban, Archive, Trash2 } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', prompt: '' });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    projectsApi.list().then(({ data }) => setProjects(data.data || [])).catch(() => {});
  };

  const create = async () => {
    if (!form.name) return;
    await projectsApi.create(form);
    setForm({ name: '', description: '', prompt: '' });
    setShowCreate(false);
    loadProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-white/40 mt-1">Create and manage AI-powered software projects</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus size={18} /> New Project</button>
      </div>

      {showCreate && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">Create New Project</h3>
          <div className="space-y-4">
            <input className="input" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <textarea className="input min-h-[80px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <textarea className="input min-h-[100px]" placeholder="Describe what you want to build (natural language prompt)..." value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} />
            <div className="flex gap-3">
              <button onClick={create} className="btn-primary">Create Project</button>
              <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 && !showCreate ? (
        <div className="card text-center py-12">
          <FolderKanban size={40} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/30">No projects yet. Create your first AI-powered project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="card hover:border-omega-accent/30 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-white/40 mt-1">{p.description || 'No description'}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${p.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>{p.status}</span>
              </div>
              {p.prompt && <p className="text-sm text-white/30 bg-white/5 rounded-lg p-3 mb-3">"{p.prompt.substring(0, 100)}..."</p>}
              <div className="flex gap-2">
                <button className="btn-secondary text-sm px-3 py-1 flex items-center gap-1"><Archive size={14} /> Archive</button>
                <button className="text-red-400 text-sm px-3 py-1 flex items-center gap-1 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

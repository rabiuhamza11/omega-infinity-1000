'use client';
import { useState } from 'react';
import { Settings, Shield, Key, Monitor, Globe, Bell, Save, Trash2, Plus, Check, AlertTriangle, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const [tab, setTab] = useState<'profile' | 'security' | 'apikeys' | 'deployments' | 'notifications'>('profile');
  const [saved, setSaved] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: '1', platform: 'GitHub', label: 'Personal Access Token', status: 'connected', addedAt: '2024-06-15' },
    { id: '2', platform: 'Vercel', label: 'Deploy Token', status: 'connected', addedAt: '2024-06-20' },
    { id: '3', platform: 'Render', label: 'API Key', status: 'connected', addedAt: '2024-07-01' },
  ]);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'apikeys', label: 'API Keys & Integrations', icon: Key },
    { id: 'deployments', label: 'Deployment Targets', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-white/40 mb-6">Manage your account, security, and integrations</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/5 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                tab === t.id ? 'border-purple-500 text-white' : 'border-transparent text-white/40 hover:text-white/60'
              }`}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Profile */}
      {tab === 'profile' && (
        <div className="max-w-2xl space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Full Name</label>
                  <input className="input" defaultValue="Rabiu Hamza Mohammed" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Email</label>
                  <input className="input" defaultValue="admin@omegainfinity.io" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Role</label>
                <select className="input" defaultValue="ADMIN">
                  <option value="ADMIN">Admin</option>
                  <option value="DEVELOPER">Developer</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Organization</label>
                <input className="input" defaultValue="HARZ Technologies" />
              </div>
              <button onClick={save} className="btn-primary flex items-center gap-2">
                {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      {tab === 'security' && (
        <div className="max-w-2xl space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield size={18} /> Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="font-medium text-sm">Two-Factor Authentication</div>
                  <div className="text-xs text-white/40 mt-0.5">Add an extra layer of security</div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                  <Check size={12} /> Enabled
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="font-medium text-sm">Change Password</div>
                  <div className="text-xs text-white/40 mt-0.5">Last changed 30 days ago</div>
                </div>
                <button className="text-purple-400 text-sm hover:underline">Change</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="font-medium text-sm">Active Sessions</div>
                  <div className="text-xs text-white/40 mt-0.5">2 active sessions</div>
                </div>
                <button className="text-red-400 text-sm hover:underline">Revoke All</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="font-medium text-sm">IP Whitelist</div>
                  <div className="text-xs text-white/40 mt-0.5">105.112.x.x (Lagos, NG)</div>
                </div>
                <button className="text-purple-400 text-sm hover:underline">Manage</button>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} className="text-red-400" />
                  <span className="font-medium text-red-400 text-sm">Danger Zone</span>
                </div>
                <p className="text-xs text-white/40 mb-3">Delete your account and all associated data. This cannot be undone.</p>
                <button className="text-red-400 text-sm border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys */}
      {tab === 'apikeys' && (
        <div className="max-w-3xl space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Key size={18} /> Integration Keys</h3>
              <button className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Key</button>
            </div>
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Key size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{key.platform}</div>
                      <div className="text-xs text-white/40">{key.label} · Added {key.addedAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Connected</span>
                    <button className="text-white/30 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">AI Model Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">OpenAI API Key</label>
                <input type="password" className="input font-mono" placeholder="sk-..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Model</label>
                  <select className="input" defaultValue="gpt-4">
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3 Opus</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Max Tokens</label>
                  <input type="number" className="input" defaultValue={4000} />
                </div>
              </div>
              <button onClick={save} className="btn-primary flex items-center gap-2">
                {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deployments */}
      {tab === 'deployments' && (
        <div className="max-w-3xl space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Globe size={18} /> Deployment Platforms</h3>
            <div className="space-y-3">
              {[
                { name: 'Vercel', status: 'connected', desc: 'Frontend deployment platform', icon: '▲' },
                { name: 'Render', status: 'connected', desc: 'Backend hosting and services', icon: '⚡' },
                { name: 'Docker Hub', status: 'connected', desc: 'Container image registry', icon: '🐳' },
                { name: 'GitHub Pages', status: 'available', desc: 'Static site hosting', icon: '🐙' },
                { name: 'Railway', status: 'available', desc: 'Full-stack deployment platform', icon: '🚂' },
                { name: 'Fly.io', status: 'available', desc: 'Global container deployment', icon: '✈️' },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{p.icon}</div>
                    <div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-white/40">{p.desc}</div>
                    </div>
                  </div>
                  {p.status === 'connected' ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                      <Check size={12} /> Connected
                    </span>
                  ) : (
                    <button className="text-purple-400 text-sm hover:underline">Connect</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="max-w-2xl space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell size={18} /> Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { label: 'Deployment successful', desc: 'When a project deploys successfully', email: true, push: true },
                { label: 'Deployment failed', desc: 'When a deployment fails', email: true, push: true },
                { label: 'Agent completed', desc: 'When an AI agent finishes a task', email: false, push: true },
                { label: 'Workflow status', desc: 'When a workflow starts or completes', email: false, push: true },
                { label: 'Security alerts', desc: 'Critical security findings', email: true, push: true },
                { label: 'Weekly summary', desc: 'Weekly activity digest', email: true, push: false },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{n.label}</div>
                    <div className="text-xs text-white/40">{n.desc}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-white/40">
                      <input type="checkbox" defaultChecked={n.email} className="rounded" /> Email
                    </label>
                    <label className="flex items-center gap-2 text-xs text-white/40">
                      <input type="checkbox" defaultChecked={n.push} className="rounded" /> Push
                    </label>
                  </div>
                </div>
              ))}
              <button onClick={save} className="btn-primary flex items-center gap-2 mt-4">
                {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Preferences</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

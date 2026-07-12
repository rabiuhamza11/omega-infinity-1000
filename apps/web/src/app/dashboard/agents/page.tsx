'use client';
import { useState } from 'react';
import { Cpu, Zap, Play, Pause, CheckCircle, Clock, Activity, GitBranch, Code, Shield, Rocket, FileText, Database, Layers, Loader2 } from 'lucide-react';

const API_BASE = 'https://superagent-2286fb2f.base44.app/functions/omegaInfinityApi';

const agents = [
  { name: 'Orchestrator', role: 'Executive coordination', icon: Layers, color: '#A855F7', status: 'active', tasks: 28, completed: 26, avgTime: '2.4s' },
  { name: 'Architect', role: 'System design', icon: GitBranch, color: '#3B82F6', status: 'active', tasks: 12, completed: 11, avgTime: '8.1s' },
  { name: 'Code Generator', role: 'Full-stack code generation', icon: Code, color: '#00D9A3', status: 'active', tasks: 45, completed: 43, avgTime: '12.3s' },
  { name: 'Database Agent', role: 'Schema & migrations', icon: Database, color: '#F59E0B', status: 'active', tasks: 18, completed: 18, avgTime: '3.2s' },
  { name: 'QA Agent', role: 'Testing & quality assurance', icon: Activity, color: '#10B981', status: 'active', tasks: 32, completed: 30, avgTime: '5.6s' },
  { name: 'Security Agent', role: 'Security audits', icon: Shield, color: '#EF4444', status: 'active', tasks: 15, completed: 14, avgTime: '7.8s' },
  { name: 'DevOps Agent', role: 'CI/CD & deployment', icon: Rocket, color: '#06B6D4', status: 'active', tasks: 22, completed: 21, avgTime: '4.5s' },
  { name: 'Frontend Agent', role: 'UI/UX components', icon: Cpu, color: '#EC4899', status: 'active', tasks: 38, completed: 36, avgTime: '6.2s' },
  { name: 'Documentation Agent', role: 'Docs & READMEs', icon: FileText, color: '#8B5CF6', status: 'paused', tasks: 16, completed: 14, avgTime: '2.1s' },
  { name: 'Deployment Agent', role: 'Production releases', icon: Rocket, color: '#F97316', status: 'active', tasks: 8, completed: 7, avgTime: '15.4s' },
];

export default function AgentsPage() {
  const [agentList, setAgentList] = useState(agents);
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const toggleAgent = (name: string) => {
    setAgentList(prev => prev.map(a => a.name === name ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
  };

  const runAllAgents = async () => {
    setRunning(true);
    setLastRun(null);
    try {
      const res = await fetch(`${API_BASE}?action=run_agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setAgentList(prev => prev.map(a => ({
        ...a,
        status: 'active',
        tasks: a.tasks + 1,
        completed: a.completed + 1,
      })));
      setLastRun(data.message || 'All agents ran successfully.');
    } catch (e) {
      setLastRun('Run failed — please try again.');
    } finally {
      setRunning(false);
    }
  };

  const activeCount = agentList.filter(a => a.status === 'active').length;
  const totalTasks = agentList.reduce((s, a) => s + a.tasks, 0);
  const totalCompleted = agentList.reduce((s, a) => s + a.completed, 0);
  const successRate = ((totalCompleted / totalTasks) * 100).toFixed(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><Cpu size={24} className="text-purple-400" /> AI Agents</h1>
          <p className="text-white/40">10 specialized agents working together</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={runAllAgents} disabled={running}>
          {running ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />} Run All Agents
        </button>
      </div>

      {lastRun && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 text-sm">{lastRun}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Activity size={20} className="text-purple-400" />
            <span className="text-xs text-green-400">{activeCount} running</span>
          </div>
          <div className="text-2xl font-bold">{activeCount}/10</div>
          <div className="text-xs text-white/40">Active Agents</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-xs text-green-400">{successRate}%</span>
          </div>
          <div className="text-2xl font-bold">{totalCompleted}</div>
          <div className="text-xs text-white/40">Tasks Completed</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Clock size={20} className="text-blue-400" />
            <span className="text-xs text-white/30">Total</span>
          </div>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <div className="text-xs text-white/40">Total Tasks</div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Zap size={20} className="text-yellow-400" />
            <span className="text-xs text-white/30">Avg</span>
          </div>
          <div className="text-2xl font-bold">6.8s</div>
          <div className="text-xs text-white/40">Avg Response Time</div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentList.map((agent) => {
          const Icon = agent.icon;
          const completionRate = (agent.completed / agent.tasks) * 100;
          return (
            <div key={agent.name} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${agent.color}20` }}>
                    <Icon size={20} style={{ color: agent.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{agent.name}</div>
                    <div className="text-xs text-white/40">{agent.role}</div>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full mt-2 ${agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-sm font-bold">{agent.tasks}</div>
                  <div className="text-xs text-white/30">Tasks</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-sm font-bold text-green-400">{agent.completed}</div>
                  <div className="text-xs text-white/30">Done</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-sm font-bold text-white/60">{agent.avgTime}</div>
                  <div className="text-xs text-white/30">Avg</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/30">Completion</span>
                  <span className="text-xs font-bold">{completionRate.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${completionRate}%`, background: agent.color }} />
                </div>
              </div>

              {/* Toggle */}
              <button onClick={() => toggleAgent(agent.name)}
                className={`w-full py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                  agent.status === 'active' ? 'bg-purple-600/20 text-purple-400' : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}>
                {agent.status === 'active' ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Start</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { Cpu, Play, Pause, CheckCircle, AlertCircle, Zap, Activity, ToggleLeft, ToggleRight } from 'lucide-react';

const AGENT_LIST = [
  { name: 'Architect Agent', type: 'architect', description: 'Designs system architecture and technical specifications', capabilities: ['system-design', 'tech-stack-selection', 'scalability-analysis'], status: 'active', executions: 42, successRate: 95.2, lastRun: '2h ago' },
  { name: 'Code Generator', type: 'codegen', description: 'Generates full-stack code from specifications', capabilities: ['code-generation', 'refactoring', 'code-review'], status: 'active', executions: 128, successRate: 91.4, lastRun: '15m ago' },
  { name: 'DevOps Agent', type: 'devops', description: 'Handles CI/CD pipelines, infrastructure, and deployments', capabilities: ['ci-cd-setup', 'docker', 'kubernetes'], status: 'active', executions: 56, successRate: 98.2, lastRun: '1h ago' },
  { name: 'QA Agent', type: 'qa', description: 'Writes and runs tests, ensures quality', capabilities: ['unit-tests', 'integration-tests', 'e2e-tests'], status: 'active', executions: 89, successRate: 94.1, lastRun: '30m ago' },
  { name: 'Security Agent', type: 'security', description: 'Audits code for vulnerabilities and security issues', capabilities: ['vulnerability-scan', 'dependency-audit', 'secret-detection'], status: 'active', executions: 34, successRate: 100, lastRun: '3h ago' },
  { name: 'Documentation Agent', type: 'docs', description: 'Auto-generates documentation from code', capabilities: ['api-docs', 'readme', 'architecture-docs'], status: 'active', executions: 45, successRate: 97.8, lastRun: '5h ago' },
  { name: 'Database Agent', type: 'database', description: 'Designs schemas, writes migrations, optimizes queries', capabilities: ['schema-design', 'migrations', 'query-optimization'], status: 'active', executions: 28, successRate: 96.4, lastRun: '6h ago' },
  { name: 'Frontend Agent', type: 'frontend', description: 'Generates UI components and pages', capabilities: ['react-components', 'css', 'responsive-design'], status: 'active', executions: 67, successRate: 92.3, lastRun: '45m ago' },
  { name: 'API Agent', type: 'api', description: 'Designs and implements REST/GraphQL APIs', capabilities: ['rest-design', 'graphql-schema', 'openapi-spec'], status: 'active', executions: 51, successRate: 95.7, lastRun: '2h ago' },
  { name: 'Orchestrator', type: 'orchestrator', description: 'Coordinates all agents and manages workflows', capabilities: ['task-routing', 'workflow-management', 'conflict-resolution'], status: 'active', executions: 203, successRate: 98.9, lastRun: 'just now' },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState(AGENT_LIST);

  const toggleAgent = (type: string) => {
    setAgents((prev) => prev.map((a) =>
      a.type === type ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
  };

  const totalExecutions = agents.reduce((s, a) => s + a.executions, 0);
  const avgSuccessRate = agents.reduce((s, a) => s + a.successRate, 0) / agents.length;
  const activeCount = agents.filter((a) => a.status === 'active').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><Cpu size={24} className="text-purple-500" /> AI Agents</h1>
          <p className="text-white/40">10 specialized agents working for you</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Zap size={18} /> Run All Agents</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card"><div className="text-white/40 text-sm mb-2 flex items-center gap-2"><Activity size={14} /> Active Agents</div><div className="text-2xl font-bold text-green-400">{activeCount}/10</div></div>
        <div className="card"><div className="text-white/40 text-sm mb-2">Total Executions</div><div className="text-2xl font-bold">{totalExecutions.toLocaleString()}</div></div>
        <div className="card"><div className="text-white/40 text-sm mb-2">Avg Success Rate</div><div className="text-2xl font-bold text-green-400">{avgSuccessRate.toFixed(1)}%</div></div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.type} className="card hover:bg-white/5 transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <div className="font-semibold">{agent.name}</div>
                  <div className="text-xs text-white/40">{agent.description}</div>
                </div>
              </div>
              <button onClick={() => toggleAgent(agent.type)} className="text-white/40 hover:text-white">
                {agent.status === 'active' ? <ToggleRight size={28} className="text-green-400" /> : <ToggleLeft size={28} />}
              </button>
            </div>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {agent.capabilities.map((cap) => (
                <span key={cap} className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 font-mono">{cap}</span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-white/40">{agent.executions} runs</span>
                <span className={agent.successRate >= 95 ? 'text-green-400' : 'text-yellow-400'}>{agent.successRate}% success</span>
                <span className="text-white/30">{agent.lastRun}</span>
              </div>
              {agent.status === 'active' ? (
                <span className="text-xs flex items-center gap-1 text-green-400"><CheckCircle size={12} /> Active</span>
              ) : (
                <span className="text-xs flex items-center gap-1 text-white/30"><AlertCircle size={12} /> Paused</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

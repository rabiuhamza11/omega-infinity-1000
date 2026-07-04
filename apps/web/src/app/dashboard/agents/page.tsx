'use client';

import { useEffect, useState } from 'react';
import { agentsApi } from '@/lib/api';
import { Bot, Cpu, Database, Shield, Rocket, FileText, Code, TestTube, GitBranch, Crown } from 'lucide-react';

const agentIcons: Record<string, any> = {
  EXECUTIVE: Crown, PLANNER: GitBranch, BACKEND: Code, FRONTEND: Cpu,
  DATABASE: Database, QA: TestTube, SECURITY: Shield, DEVOPS: Rocket,
  DOCUMENTATION: FileText, DEPLOYMENT: Bot,
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    agentsApi.list().then(({ data }) => setAgents(data || [])).catch(() => {
      // Show default agents if API not connected
      setAgents([
        { name: 'Executive Agent', type: 'EXECUTIVE', description: 'Coordinates all agents and manages project scope', enabled: true },
        { name: 'Planner Agent', type: 'PLANNER', description: 'Creates detailed project plans and task breakdowns', enabled: true },
        { name: 'Backend Agent', type: 'BACKEND', description: 'Generates API routes, services, and models', enabled: true },
        { name: 'Frontend Agent', type: 'FRONTEND', description: 'Builds components, pages, and UI', enabled: true },
        { name: 'Database Agent', type: 'DATABASE', description: 'Designs schemas, migrations, and queries', enabled: true },
        { name: 'QA Agent', type: 'QA', description: 'Generates and runs tests', enabled: true },
        { name: 'Security Agent', type: 'SECURITY', description: 'Audits code for vulnerabilities', enabled: true },
        { name: 'DevOps Agent', type: 'DEVOPS', description: 'Sets up CI/CD, Docker, and infrastructure', enabled: true },
        { name: 'Documentation Agent', type: 'DOCUMENTATION', description: 'Generates README, API docs, and guides', enabled: true },
        { name: 'Deployment Agent', type: 'DEPLOYMENT', description: 'Handles deployment to Vercel, Render, Docker', enabled: true },
      ]);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">AI Agents</h1>
      <p className="text-white/40 mb-6">10 specialized agents working together to build your software</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = agentIcons[agent.type] || Bot;
          return (
            <div key={agent.type} className="card hover:border-omega-accent/30 transition cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-omega-accent/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-omega-glow" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-xs text-omega-glow">{agent.type}</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${agent.enabled ? 'bg-green-500' : 'bg-gray-500'}`} />
              </div>
              <p className="text-sm text-white/40">{agent.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

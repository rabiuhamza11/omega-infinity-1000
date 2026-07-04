import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

export interface WorkflowTask {
  id: string;
  agentType: string;
  input: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
  dependencies?: string[];
  startedAt?: Date;
  completedAt?: Date;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  tasks: WorkflowTask[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  projectId?: string;
  createdAt: Date;
  completedAt?: Date;
}

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);
  private workflows = new Map<string, WorkflowDefinition>();

  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description: string; tasks: any[]; projectId?: string }): Promise<WorkflowDefinition> {
    const id = `wf-${Date.now()}`;
    const workflow: WorkflowDefinition = {
      id,
      name: data.name,
      description: data.description,
      tasks: data.tasks.map((t, i) => ({
        id: t.id || `task-${i + 1}`,
        agentType: t.agentType,
        input: t.input,
        status: 'pending',
        dependencies: t.dependencies || [],
      })),
      status: 'pending',
      projectId: data.projectId,
      createdAt: new Date(),
    };

    this.workflows.set(id, workflow);
    this.logger.log(`Workflow created: ${id} (${data.name})`);
    return workflow;
  }

  async execute(workflowId: string): Promise<WorkflowDefinition> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error(`Workflow not found: ${workflowId}`);

    workflow.status = 'running';
    this.logger.log(`Executing workflow: ${workflow.name}`);

    // Topological sort
    const sorted = this.topologicalSort(workflow.tasks);

    for (const task of sorted) {
      // Check dependencies
      const deps = task.dependencies || [];
      const allDepsComplete = deps.every((depId) => {
        const dep = workflow.tasks.find((t) => t.id === depId);
        return dep?.status === 'completed';
      });

      if (!allDepsComplete) {
        task.status = 'failed';
        this.logger.error(`Task ${task.id} failed: dependencies not met`);
        continue;
      }

      task.status = 'running';
      task.startedAt = new Date();
      this.logger.log(`Running task: ${task.id} (agent: ${task.agentType})`);

      try {
        // Simulate agent execution
        await new Promise((resolve) => setTimeout(resolve, 500));
        task.output = `[${task.agentType}] Executed: "${task.input.substring(0, 80)}"`;
        task.status = 'completed';
        task.completedAt = new Date();
        this.logger.log(`Task completed: ${task.id}`);
      } catch (error) {
        task.status = 'failed';
        task.completedAt = new Date();
        this.logger.error(`Task failed: ${task.id} — ${error.message}`);
      }
    }

    const allCompleted = workflow.tasks.every((t) => t.status === 'completed');
    workflow.status = allCompleted ? 'completed' : 'failed';
    workflow.completedAt = new Date();

    this.logger.log(`Workflow ${workflow.status}: ${workflow.name}`);
    return workflow;
  }

  async getById(id: string): Promise<WorkflowDefinition | null> {
    return this.workflows.get(id) || null;
  }

  async list(): Promise<WorkflowDefinition[]> {
    return Array.from(this.workflows.values());
  }

  async getProjectWorkflows(projectId: string): Promise<WorkflowDefinition[]> {
    return Array.from(this.workflows.values()).filter((w) => w.projectId === projectId);
  }

  private topologicalSort(tasks: WorkflowTask[]): WorkflowTask[] {
    const sorted: WorkflowTask[] = [];
    const visited = new Set<string>();

    const visit = (taskId: string) => {
      if (visited.has(taskId)) return;
      visited.add(taskId);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      for (const dep of task.dependencies || []) visit(dep);
      sorted.push(task);
    };

    for (const task of tasks) visit(task.id);
    return sorted;
  }

  // Predefined workflow templates
  getTemplates(): any[] {
    return [
      {
        name: 'Full-Stack App Generation',
        description: 'Generate a complete full-stack application from a spec',
        tasks: [
          { id: 't1', agentType: 'architect', input: 'Design system architecture from project spec' },
          { id: 't2', agentType: 'database', input: 'Design database schema', dependencies: ['t1'] },
          { id: 't3', agentType: 'api', input: 'Design REST API', dependencies: ['t2'] },
          { id: 't4', agentType: 'codegen', input: 'Generate backend code', dependencies: ['t3'] },
          { id: 't5', agentType: 'frontend', input: 'Generate frontend UI', dependencies: ['t3'] },
          { id: 't6', agentType: 'qa', input: 'Write tests', dependencies: ['t4', 't5'] },
          { id: 't7', agentType: 'security', input: 'Security audit', dependencies: ['t4', 't5'] },
          { id: 't8', agentType: 'devops', input: 'Setup CI/CD pipeline', dependencies: ['t6'] },
          { id: 't9', agentType: 'docs', input: 'Generate documentation', dependencies: ['t4', 't5'] },
        ],
      },
      {
        name: 'API-Only Service',
        description: 'Generate a backend API service',
        tasks: [
          { id: 't1', agentType: 'architect', input: 'Design API architecture' },
          { id: 't2', agentType: 'database', input: 'Design database schema', dependencies: ['t1'] },
          { id: 't3', agentType: 'api', input: 'Generate API code', dependencies: ['t2'] },
          { id: 't4', agentType: 'qa', input: 'Write API tests', dependencies: ['t3'] },
          { id: 't5', agentType: 'security', input: 'Security audit', dependencies: ['t3'] },
          { id: 't6', agentType: 'docs', input: 'Generate API documentation', dependencies: ['t3'] },
        ],
      },
      {
        name: 'Security Audit',
        description: 'Full security review of an existing project',
        tasks: [
          { id: 't1', agentType: 'security', input: 'Scan for vulnerabilities' },
          { id: 't2', agentType: 'security', input: 'Check dependency vulnerabilities', dependencies: ['t1'] },
          { id: 't3', agentType: 'security', input: 'Detect hardcoded secrets', dependencies: ['t1'] },
          { id: 't4', agentType: 'docs', input: 'Generate security report', dependencies: ['t2', 't3'] },
        ],
      },
    ];
  }
}

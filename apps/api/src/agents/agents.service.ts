import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.agent.findMany({ where: { enabled: true } });
  }

  async findOne(id: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async create(dto: { name: string; type: string; description?: string; config?: any }) {
    return this.prisma.agent.create({
      data: {
        name: dto.name,
        type: dto.type as any,
        description: dto.description || '',
        capabilities: [],
        config: dto.config,
      } as any,
    });
  }

  async createTask(userId: string, projectId: string, dto: { title: string; description?: string; agentId?: string; input?: any; priority?: number }) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        projectId,
        agentId: dto.agentId,
        input: dto.input || {},
        priority: dto.priority || 5,
        status: 'QUEUED',
      } as any,
    });
  }

  async getTasks(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId } as any,
      orderBy: { createdAt: 'desc' } as any,
      include: { agent: true } as any,
    });
  }

  async executeTask(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } as any, include: { agent: true } as any });
    if (!task) throw new NotFoundException('Task not found');

    await this.prisma.task.update({ where: { id: taskId } as any, data: { status: 'RUNNING', startedAt: new Date() } as any });

    try {
      const result = this.simulateAgent(task);
      
      await this.prisma.task.update({
        where: { id: taskId } as any,
        data: { status: 'COMPLETED', output: result, result: JSON.stringify(result), completedAt: new Date() } as any,
      });

      return { taskId, status: 'COMPLETED', result };
    } catch (error) {
      await this.prisma.task.update({
        where: { id: taskId } as any,
        data: { status: 'FAILED', result: (error as Error).message, completedAt: new Date() } as any,
      });
      throw error;
    }
  }

  private simulateAgent(task: any) {
    const agentType = task.agent?.type || 'PLANNER';
    return {
      agent: agentType,
      task: task.title,
      output: `[${agentType}] Processed task: ${task.title}`,
      timestamp: new Date().toISOString(),
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.agent.findMany({ where: { enabled: true }, include: { _count: { select: { tasks: true } } } });
  }

  async findOne(id: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async create(dto: { name: string; type: string; description?: string; config?: any }) {
    return this.prisma.agent.create({ data: { ...dto, type: dto.type as any } });
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
      },
    });
  }

  async getTasks(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: { agent: true },
    });
  }

  async executeTask(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId }, include: { agent: true, project: true } });
    if (!task) throw new NotFoundException('Task not found');

    await this.prisma.task.update({ where: { id: taskId }, data: { status: 'RUNNING', startedAt: new Date() } });

    try {
      // Agent execution logic would go here
      // For now, simulate agent processing
      const result = this.simulateAgent(task);
      
      await this.prisma.task.update({
        where: { id: taskId },
        data: { status: 'COMPLETED', output: result, result: JSON.stringify(result), completedAt: new Date() },
      });

      return { taskId, status: 'COMPLETED', result };
    } catch (error) {
      await this.prisma.task.update({
        where: { id: taskId },
        data: { status: 'FAILED', result: error.message, completedAt: new Date() },
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

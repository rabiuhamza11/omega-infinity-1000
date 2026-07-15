import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: { name: string; description?: string; prompt?: string; organizationId?: string }) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description || '',
        ownerId: userId,
        orgId: dto.organizationId,
      } as any,
    });
  }

  async findAll(userId: string, query: { page?: number; limit?: number; status?: string }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const where: any = { ownerId: userId };
    if (query.status) where.status = query.status;

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { tasks: true, deployments: true } } } as any,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { tasks: true, deployments: true } as any,
    });
    if (!project) throw new NotFoundException('Project not found');
    if ((project as any).ownerId !== userId) throw new ForbiddenException('Access denied');
    return project;
  }

  async update(userId: string, id: string, dto: Partial<{ name: string; description: string; status: string; prompt: string }>) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if ((project as any).ownerId !== userId) throw new ForbiddenException('Access denied');
    return this.prisma.project.update({ where: { id }, data: dto as any });
  }

  async archive(userId: string, id: string) {
    return this.update(userId, id, { status: 'ARCHIVED' });
  }

  async remove(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if ((project as any).ownerId !== userId) throw new ForbiddenException('Access denied');
    await this.prisma.project.delete({ where: { id } });
    return { message: 'Project deleted' };
  }

  async addArtifact(userId: string, projectId: string, dto: { name: string; type: string; content: string; filePath?: string; language?: string }) {
    const project = await this.findOne(userId, projectId);
    // Store artifact as a task with special type
    return this.prisma.task.create({
      data: {
        title: dto.name,
        description: dto.type,
        projectId,
        input: { content: dto.content, filePath: dto.filePath, language: dto.language } as any,
        status: 'COMPLETED',
      } as any,
    });
  }

  async getArtifacts(userId: string, projectId: string) {
    await this.findOne(userId, projectId);
    return this.prisma.task.findMany({
      where: { projectId, status: 'COMPLETED' } as any,
      orderBy: { createdAt: 'desc' } as any,
    });
  }
}

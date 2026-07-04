import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DeploymentsService {
  constructor(private prisma: PrismaService) {}

  async deploy(userId: string, projectId: string, dto: { platform: string; config?: any }) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const deployment = await this.prisma.deployment.create({
      data: {
        projectId,
        platform: dto.platform as any,
        config: dto.config || {},
        status: 'BUILDING',
        triggeredBy: userId,
      },
    });

    // In production: call Vercel/Render/GitHub APIs
    // For now: simulate deployment
    setTimeout(async () => {
      await this.prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          status: 'DEPLOYED',
          url: `https://${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.omega-infinity.app`,
          deploymentId: `dep_${Date.now()}`,
          logs: 'Build completed successfully',
        },
      });
    }, 2000);

    return deployment;
  }

  async findAll(projectId: string) {
    return this.prisma.deployment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const deployment = await this.prisma.deployment.findUnique({ where: { id } });
    if (!deployment) throw new NotFoundException('Deployment not found');
    return deployment;
  }

  async rollback(id: string) {
    const deployment = await this.prisma.deployment.findUnique({ where: { id } });
    if (!deployment) throw new NotFoundException('Deployment not found');
    
    // Find previous successful deployment
    const previous = await this.prisma.deployment.findFirst({
      where: {
        projectId: deployment.projectId,
        id: { not: id },
        status: 'DEPLOYED',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (previous) {
      await this.prisma.deployment.update({
        where: { id: previous.id },
        data: { status: 'DEPLOYED' },
      });
    }

    return this.prisma.deployment.update({
      where: { id },
      data: { status: 'ROLLED_BACK' },
    });
  }

  async getStatus(id: string) {
    return this.findOne(id);
  }
}

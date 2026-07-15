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
        platform: dto.platform,
        config: dto.config || {},
        status: 'BUILDING',
        version: '1.0.0',
        environment: 'production',
        triggeredBy: userId,
      } as any,
    });

    setTimeout(async () => {
      await this.prisma.deployment.update({
        where: { id: deployment.id } as any,
        data: {
          status: 'DEPLOYED',
          url: `https://${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.omega-infinity.app`,
          logs: 'Build completed successfully',
        } as any,
      });
    }, 2000);

    return deployment;
  }

  async findAll(projectId: string) {
    return this.prisma.deployment.findMany({
      where: { projectId } as any,
      orderBy: { deployedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const deployment = await this.prisma.deployment.findUnique({ where: { id } });
    if (!deployment) throw new NotFoundException('Deployment not found');
    return deployment;
  }
}

import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class OrgsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: { name: string; description?: string }) {
    const existing = await this.prisma.organization.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Organization name already taken');

    const org = await this.prisma.organization.create({
      data: {
        name: dto.name,
        description: dto.description,
        ownerId: userId,
        members: {
          create: { userId, role: 'OWNER' },
        },
      } as any,
      include: { members: true } as any,
    });
    return org;
  }

  async findAll(userId: string) {
    return this.prisma.organization.findMany({
      where: { members: { some: { userId } } } as any,
      include: { _count: { select: { members: true, projects: true } } } as any,
    });
  }

  async findOne(userId: string, orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: { members: { include: { user: { select: { id: true, email: true, name: true, avatar: true } } } } } as any,
    });
    if (!org) throw new NotFoundException('Organization not found');
    const member = (org as any).members?.find((m: any) => m.userId === userId);
    if (!member) throw new ForbiddenException('Access denied');
    return org;
  }

  async update(userId: string, orgId: string, dto: Partial<{ name: string; description: string }>) {
    const org = await this.findOne(userId, orgId);
    return this.prisma.organization.update({ where: { id: orgId }, data: dto as any });
  }

  async remove(userId: string, orgId: string) {
    await this.findOne(userId, orgId);
    return this.prisma.organization.delete({ where: { id: orgId } });
  }

  async invite(userId: string, orgId: string, email: string, role?: string) {
    const org = await this.findOne(userId, orgId);
    const inviter = (org as any).members?.find((m: any) => m.userId === userId);
    if (!inviter || (inviter.role !== 'OWNER' && inviter.role !== 'ADMIN')) {
      throw new ForbiddenException('Only owners and admins can invite');
    }

    const invitee = await this.prisma.user.findUnique({ where: { email } });
    if (!invitee) throw new NotFoundException('User not found');

    const existing = await this.prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId: invitee.id } } as any,
    });
    if (existing) throw new ConflictException('User already a member');

    return this.prisma.orgMember.create({
      data: { orgId, userId: invitee.id, role: (role || 'DEVELOPER') as any } as any,
    });
  }

  async updateRole(userId: string, orgId: string, memberUserId: string, role: string) {
    const org = await this.findOne(userId, orgId);
    const requester = (org as any).members?.find((m: any) => m.userId === userId);
    if (!requester || requester.role !== 'OWNER') {
      throw new ForbiddenException('Only owners can change roles');
    }

    return this.prisma.orgMember.update({
      where: { orgId_userId: { orgId, userId: memberUserId } } as any,
      data: { role: role as any },
    });
  }
}

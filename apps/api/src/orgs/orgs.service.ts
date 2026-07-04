import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class OrgsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: { name: string; description?: string }) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const existing = await this.prisma.organization.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Organization slug already taken');

    const org = await this.prisma.organization.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        memberships: {
          create: { userId, role: 'OWNER', status: 'ACTIVE', joinedAt: new Date() },
        },
      },
      include: { memberships: true },
    });
    return org;
  }

  async findAll(userId: string) {
    return this.prisma.organization.findMany({
      where: { memberships: { some: { userId } } },
      include: { _count: { select: { memberships: true, projects: true } } },
    });
  }

  async findOne(userId: string, orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: { memberships: { include: { user: { select: { id: true, email: true, name: true, avatarUrl: true } } } } },
    });
    if (!org) throw new NotFoundException('Organization not found');
    const isMember = org.memberships.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('You are not a member of this organization');
    return org;
  }

  async invite(userId: string, orgId: string, email: string, role: string = 'MEMBER') {
    const org = await this.prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new NotFoundException('Organization not found');
    const membership = await this.prisma.membership.findUnique({
      where: { userId_organizationId: { userId, organizationId: orgId } },
    });
    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      throw new ForbiddenException('Only owners and admins can invite members');
    }
    const invitee = await this.prisma.user.findUnique({ where: { email } });
    if (!invitee) throw new NotFoundException('User not found with that email');

    return this.prisma.membership.create({
      data: { userId: invitee.id, organizationId: orgId, role: role as any, status: 'PENDING' },
    });
  }

  async updateRole(userId: string, orgId: string, targetUserId: string, role: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId_organizationId: { userId, organizationId: orgId } },
    });
    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      throw new ForbiddenException('Only owners and admins can update roles');
    }
    return this.prisma.membership.update({
      where: { userId_organizationId: { userId: targetUserId, organizationId: orgId } },
      data: { role: role as any },
    });
  }

  async remove(userId: string, orgId: string) {
    return this.prisma.organization.delete({ where: { id: orgId } });
  }
}

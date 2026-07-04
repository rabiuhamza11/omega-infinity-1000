import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrgsService } from './orgs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrgsController {
  constructor(private orgsService: OrgsService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: { name: string; description?: string }) {
    return this.orgsService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.orgsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.orgsService.findOne(req.user.id, id);
  }

  @Post(':id/invite')
  async invite(@Req() req: any, @Param('id') id: string, @Body() dto: { email: string; role?: string }) {
    return this.orgsService.invite(req.user.id, id, dto.email, dto.role);
  }

  @Patch(':id/members/:userId')
  async updateRole(@Req() req: any, @Param('id') id: string, @Param('userId') userId: string, @Body('role') role: string) {
    return this.orgsService.updateRole(req.user.id, id, userId, role);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.orgsService.remove(req.user.id, id);
  }
}

import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DeploymentsService } from './deployments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Deployments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deployments')
export class DeploymentsController {
  constructor(private deploymentsService: DeploymentsService) {}

  @Post(':projectId')
  async deploy(@Req() req: any, @Param('projectId') projectId: string, @Body() dto: any) {
    return this.deploymentsService.deploy(req.user.id, projectId, dto);
  }

  @Get('project/:projectId')
  async findAll(@Param('projectId') projectId: string) {
    return this.deploymentsService.findAll(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.deploymentsService.findOne(id);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    return this.deploymentsService.getStatus(id);
  }

  @Post(':id/rollback')
  async rollback(@Param('id') id: string) {
    return this.deploymentsService.rollback(id);
  }
}

import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('AI Agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Get()
  async findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Post()
  async create(@Body() dto: any) {
    return this.agentsService.create(dto);
  }

  @Post('tasks/:projectId')
  async createTask(@Req() req: any, @Param('projectId') projectId: string, @Body() dto: any) {
    return this.agentsService.createTask(req.user.id, projectId, dto);
  }

  @Get('tasks/:projectId')
  async getTasks(@Param('projectId') projectId: string) {
    return this.agentsService.getTasks(projectId);
  }

  @Post('tasks/:taskId/execute')
  async executeTask(@Param('taskId') taskId: string) {
    return this.agentsService.executeTask(taskId);
  }
}

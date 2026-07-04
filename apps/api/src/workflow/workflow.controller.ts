import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  async create(@Body() body: { name: string; description: string; tasks: any[]; projectId?: string }) {
    return this.workflowService.create(body);
  }

  @Get()
  async list() {
    return this.workflowService.list();
  }

  @Get('templates')
  async templates() {
    return this.workflowService.getTemplates();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.workflowService.getById(id);
  }

  @Get('project/:projectId')
  async getByProject(@Param('projectId') projectId: string) {
    return this.workflowService.getProjectWorkflows(projectId);
  }

  @Post(':id/execute')
  async execute(@Param('id') id: string) {
    return this.workflowService.execute(id);
  }
}

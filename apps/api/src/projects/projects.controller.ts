import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: any) {
    return this.projectsService.create(req.user.id, dto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Req() req: any, @Query() query: any) {
    return this.projectsService.findAll(req.user.id, query);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.projectsService.update(req.user.id, id, dto);
  }

  @Post(':id/archive')
  async archive(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.archive(req.user.id, id);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.remove(req.user.id, id);
  }

  @Post(':id/artifacts')
  async addArtifact(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.projectsService.addArtifact(req.user.id, id, dto);
  }

  @Get(':id/artifacts')
  async getArtifacts(@Req() req: any, @Param('id') id: string) {
    return this.projectsService.getArtifacts(req.user.id, id);
  }
}

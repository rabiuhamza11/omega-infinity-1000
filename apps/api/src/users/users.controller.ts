import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() dto: { name?: string; avatarUrl?: string }) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get('memberships')
  async getMemberships(@Req() req: any) {
    return this.usersService.getMemberships(req.user.id);
  }
}

import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { ProjectsModule } from './projects/projects.module';
import { AgentsModule } from './agents/agents.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { WorkflowModule } from './workflow/workflow.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    OrgsModule,
    ProjectsModule,
    AgentsModule,
    DeploymentsModule,
    WorkflowModule,
  ],
})
export class AppModule {}

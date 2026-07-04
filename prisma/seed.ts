// OMEGA INFINITY 1000 — Database Seed Script
// Populates demo data for users, orgs, projects, agents, and deployments

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding OMEGA INFINITY 1000...\n');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@omegainfinity.io' },
    update: {},
    create: {
      email: 'admin@omegainfinity.io',
      password: await bcrypt.hash('admin123456', 10),
      name: 'Rabiu Hamza Mohammed',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Create developer user
  const dev = await prisma.user.upsert({
    where: { email: 'dev@omegainfinity.io' },
    update: {},
    create: {
      email: 'dev@omegainfinity.io',
      password: await bcrypt.hash('dev123456', 10),
      name: 'Developer User',
      role: 'DEVELOPER',
    },
  });

  // Create organization
  const org = await prisma.organization.upsert({
    where: { name: 'HARZ Technologies' },
    update: {},
    create: {
      name: 'HARZ Technologies',
      description: 'AI-powered software engineering company',
      ownerId: admin.id,
    },
  });
  console.log(`✅ Organization: ${org.name}`);

  // Add members
  await prisma.orgMember.createMany({
    data: [
      { orgId: org.id, userId: admin.id, role: 'OWNER' },
      { orgId: org.id, userId: dev.id, role: 'DEVELOPER' },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ Org members: 2`);

  // Create projects
  const projects = [
    { name: 'E-Commerce Platform', description: 'Full-stack e-commerce with payments, inventory, and admin dashboard', status: 'ACTIVE', techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'Stripe'] },
    { name: 'Healthcare Portal', description: 'Patient management system with appointments and records', status: 'ACTIVE', techStack: ['React', 'Express', 'MongoDB'] },
    { name: 'Fintech Dashboard', description: 'Real-time financial analytics dashboard', status: 'PLANNING', techStack: ['Vue.js', 'Django', 'Redis'] },
    { name: 'AI Chat Service', description: 'LLM-powered customer support chatbot', status: 'COMPLETED', techStack: ['Next.js', 'FastAPI', 'OpenAI'] },
  ];

  for (const p of projects) {
    await prisma.project.create({
      data: {
        ...p,
        orgId: org.id,
        ownerId: admin.id,
        techStack: p.techStack,
      },
    });
  }
  console.log(`✅ Projects: ${projects.length} created`);

  // Create AI agents
  const agents = [
    { name: 'Architect Agent', type: 'architect', description: 'Designs system architecture', capabilities: ['system-design', 'tech-stack-selection'], isActive: true },
    { name: 'Code Generator', type: 'codegen', description: 'Generates full-stack code', capabilities: ['code-generation', 'refactoring'], isActive: true },
    { name: 'DevOps Agent', type: 'devops', description: 'Handles CI/CD and infrastructure', capabilities: ['ci-cd', 'docker', 'kubernetes'], isActive: true },
    { name: 'QA Agent', type: 'qa', description: 'Writes and runs tests', capabilities: ['unit-tests', 'integration-tests'], isActive: true },
    { name: 'Security Agent', type: 'security', description: 'Audits for vulnerabilities', capabilities: ['vulnerability-scan', 'owasp-check'], isActive: true },
    { name: 'Documentation Agent', type: 'docs', description: 'Auto-generates documentation', capabilities: ['api-docs', 'readme'], isActive: true },
    { name: 'Database Agent', type: 'database', description: 'Designs schemas and migrations', capabilities: ['schema-design', 'migrations'], isActive: true },
    { name: 'Frontend Agent', type: 'frontend', description: 'Generates UI components', capabilities: ['react-components', 'responsive-design'], isActive: true },
    { name: 'API Agent', type: 'api', description: 'Designs REST/GraphQL APIs', capabilities: ['rest-design', 'openapi-spec'], isActive: true },
    { name: 'Orchestrator', type: 'orchestrator', description: 'Coordinates all agents', capabilities: ['task-routing', 'workflow-management'], isActive: true },
  ];

  for (const agent of agents) {
    await prisma.agent.create({
      data: {
        ...agent,
        capabilities: agent.capabilities,
        config: { model: 'gpt-4', temperature: 0.3, maxTokens: 4000 },
        orgId: org.id,
      },
    });
  }
  console.log(`✅ AI Agents: ${agents.length} created`);

  // Create deployments
  const deployments = [
    { environment: 'production', platform: 'vercel', url: 'https://ecommerce-app.vercel.app', status: 'SUCCESS', version: 'v1.2.0' },
    { environment: 'staging', platform: 'render', url: 'https://healthcare-portal-staging.onrender.com', status: 'SUCCESS', version: 'v0.9.1' },
    { environment: 'production', platform: 'docker', url: 'https://fintech-api.harz.io', status: 'FAILED', version: 'v0.1.0' },
    { environment: 'production', platform: 'vercel', url: 'https://ai-chat-svc.vercel.app', status: 'SUCCESS', version: 'v2.0.0' },
  ];

  for (const d of deployments) {
    await prisma.deployment.create({
      data: {
        ...d,
        orgId: org.id,
        logs: d.status === 'FAILED' ? 'Build failed: Module not found error in src/index.ts' : 'Deployment completed successfully',
      },
    });
  }
  console.log(`✅ Deployments: ${deployments.length} created`);

  // Create notifications
  const notifications = [
    { type: 'deployment', title: 'Deployment Successful', message: 'E-Commerce Platform v1.2.0 deployed to production', priority: 'normal', userId: admin.id },
    { type: 'deployment', title: 'Deployment Failed', message: 'Fintech Dashboard v0.1.0 failed to deploy', priority: 'high', userId: admin.id },
    { type: 'agent', title: 'Agent Completed', message: 'Architect Agent finished designing E-Commerce Platform', priority: 'normal', userId: admin.id },
    { type: 'project', title: 'New Project', message: 'Healthcare Portal project created', priority: 'low', userId: dev.id },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }
  console.log(`✅ Notifications: ${notifications.length} created`);

  // Create audit logs
  const auditLogs = [
    { action: 'USER_LOGIN', userId: admin.id, details: 'Admin logged in from 105.112.x.x' },
    { action: 'PROJECT_CREATED', userId: admin.id, details: 'Created project: E-Commerce Platform' },
    { action: 'AGENT_EXECUTED', userId: admin.id, details: 'Architect Agent executed on E-Commerce Platform' },
    { action: 'DEPLOYMENT_TRIGGERED', userId: admin.id, details: 'Triggered deployment: E-Commerce Platform to production' },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({ data: log });
  }
  console.log(`✅ Audit logs: ${auditLogs.length} created`);

  console.log('\n🎉 Seeding complete!');
  console.log('Admin login: admin@omegainfinity.io / admin123456');
  console.log('Dev login: dev@omegainfinity.io / dev123456');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

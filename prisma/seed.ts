import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default agents
  const agents = [
    { name: 'Executive Agent', type: 'EXECUTIVE', description: 'Coordinates all agents and manages project scope' },
    { name: 'Planner Agent', type: 'PLANNER', description: 'Creates detailed project plans and task breakdowns' },
    { name: 'Backend Agent', type: 'BACKEND', description: 'Generates API routes, services, and models' },
    { name: 'Frontend Agent', type: 'FRONTEND', description: 'Builds components, pages, and UI' },
    { name: 'Database Agent', type: 'DATABASE', description: 'Designs schemas, migrations, and queries' },
    { name: 'QA Agent', type: 'QA', description: 'Generates and runs tests' },
    { name: 'Security Agent', type: 'SECURITY', description: 'Audits code for vulnerabilities' },
    { name: 'DevOps Agent', type: 'DEVOPS', description: 'Sets up CI/CD, Docker, and infrastructure' },
    { name: 'Documentation Agent', type: 'DOCUMENTATION', description: 'Generates README, API docs, and guides' },
    { name: 'Deployment Agent', type: 'DEPLOYMENT', description: 'Handles deployment to Vercel, Render, Docker' },
  ];

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { id: agent.type.toLowerCase() },
      update: {},
      create: { ...agent, id: agent.type.toLowerCase(), enabled: true, version: '1.0.0' },
    });
  }
  console.log(`✅ Created ${agents.length} agents`);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@omega-infinity.io' },
    update: {},
    create: {
      email: 'admin@omega-infinity.io',
      passwordHash: adminPassword,
      name: 'System Admin',
      role: 'SUPER_ADMIN',
      emailVerified: true,
    },
  });
  console.log(`✅ Created admin user: ${admin.email}`);

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

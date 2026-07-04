# 🚀 OMEGA INFINITY 1000 Enterprise

**AI Platform for Creating, Managing, Deploying, and Operating Software Projects from Natural-Language Prompts**

[![CI/CD](https://github.com/omega-infinity/omega-infinity-1000/actions/workflows/ci.yml/badge.svg)](https://github.com/omega-infinity/omega-infinity-1000/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Repository Structure](#repository-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Agent SDK](#agent-sdk)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

OMEGA INFINITY 1000 is an enterprise-grade AI platform that enables users to describe software projects in natural language and have them built, tested, and deployed automatically by a coordinated team of AI agents.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, App Router |
| Backend | NestJS 10, TypeScript, REST API, OpenAPI/Swagger |
| Database | PostgreSQL 16, Prisma ORM |
| Auth | JWT (access + refresh), OAuth (Google, GitHub), RBAC |
| Infrastructure | Docker, Docker Compose, GitHub Actions, Vercel, Render |

## Features

### Authentication
- Register, Login, Logout
- JWT access (15min) + refresh (30d) tokens with rotation
- Password reset with email tokens
- Email verification
- OAuth: Google & GitHub
- Role-Based Access Control (RBAC)

### Organizations
- Create organizations with unique slugs
- Invite members by email
- Assign roles: OWNER, ADMIN, MEMBER, VIEWER
- Manage permissions per organization

### Projects
- CRUD operations (create, update, archive, delete)
- Store prompts and generated artifacts
- Track project status (ACTIVE, ARCHIVED, DEPLOYED, BUILDING, FAILED)
- Pagination, filtering, sorting

### AI Orchestrator
- Agent registry with 10 built-in agents
- Task scheduler and queue
- Workflow engine for multi-agent coordination
- Conversation history with messages
- Extensible plugin architecture

### AI Agent SDK
Common agent interface — add new agents without changing core platform:

| Agent | Role |
|-------|------|
| Executive | Coordinates all agents, high-level decisions |
| Planner | Task breakdowns, timelines |
| Backend | API routes, services, models |
| Frontend | Components, pages, UI |
| Database | Schemas, migrations, queries |
| QA | Unit, integration, e2e tests |
| Security | Vulnerability auditing |
| DevOps | CI/CD, Docker, infrastructure |
| Documentation | README, API docs, guides |
| Deployment | Vercel, Render, Docker deployment |

### Deployment Integration
- GitHub: create repos, push code
- Vercel: deploy frontend
- Render: deploy backend
- Docker: containerized deployment
- Rollback support

## Repository Structure

```
omega-infinity-1000/
├── apps/
│   ├── api/                 # NestJS backend
│   │   └── src/
│   │       ├── auth/        # Auth module (JWT, OAuth, RBAC)
│   │       ├── users/       # User profile management
│   │       ├── orgs/        # Organizations & memberships
│   │       ├── projects/    # Project CRUD & artifacts
│   │       ├── agents/      # AI agent management & task execution
│   │       ├── deployments/ # Deployment management & rollback
│   │       └── common/      # Shared Prisma service
│   ├── web/                 # Next.js frontend
│   │   └── src/
│   │       ├── app/         # App Router pages
│   │       │   ├── dashboard/
│   │       │   │   ├── agents/
│   │       │   │   ├── chat/
│   │       │   │   ├── deployments/
│   │       │   │   ├── projects/
│   │       │   │   └── settings/
│   │       │   └── page.tsx # Login/Register
│   │       ├── components/  # Shared components
│   │       └── lib/         # API client, state store
│   └── worker/              # Background job processor
├── packages/
│   ├── agent-sdk/           # Agent SDK (10 agents + workflow engine)
│   ├── ai-engine/           # AI orchestration engine
│   ├── shared/              # Shared types & utilities
│   └── ui/                  # Shared UI components
├── prisma/
│   └── schema.prisma        # 11 database models
├── docker/
│   ├── Dockerfile           # Backend image
│   ├── Dockerfile.web       # Frontend image
│   └── docker-compose.yml   # Full stack orchestration
├── docs/                    # Documentation
└── .github/workflows/       # CI/CD pipeline
```

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or use Docker)
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/omega-infinity/omega-infinity-1000.git
cd omega-infinity-1000
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Database Setup

```bash
# Start PostgreSQL with Docker
npm run docker:up

# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### 4. Start Development

```bash
npm run dev
```

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://omega:omega_secret@localhost:5432/omega_infinity

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Deployment Integrations
VERCEL_TOKEN=your-vercel-token
RENDER_DEPLOY_HOOK=your-render-deploy-hook-url

# CORS
CORS_ORIGIN=http://localhost:3001
```

## Database Models

11 models defined in Prisma:

1. **User** — email, password, OAuth, role
2. **RefreshToken** — JWT refresh with rotation
3. **Organization** — name, slug, description
4. **Membership** — user-org relationship with roles
5. **Project** — name, status, prompt, config
6. **Artifact** — generated files/code/docs
7. **Agent** — AI agent registry
8. **Task** — Agent tasks with status tracking
9. **Conversation** — Chat history
10. **Message** — Individual messages
11. **Deployment** — Deploy records with rollback
12. **ApiKey** — API keys with scopes
13. **AuditLog** — Security audit trail

## API Documentation

Full Swagger/OpenAPI docs available at `/api/docs` when running.

### Key Endpoints

```
Auth:
  POST   /api/v1/auth/register
  POST   /api/v1/auth/login
  POST   /api/v1/auth/refresh
  POST   /api/v1/auth/logout
  POST   /api/v1/auth/password/reset-request
  POST   /api/v1/auth/password/reset
  POST   /api/v1/auth/verify-email

Users:
  GET    /api/v1/users/profile
  PUT    /api/v1/users/profile
  GET    /api/v1/users/memberships

Organizations:
  POST   /api/v1/organizations
  GET    /api/v1/organizations
  GET    /api/v1/organizations/:id
  POST   /api/v1/organizations/:id/invite
  PATCH  /api/v1/organizations/:id/members/:userId
  DELETE /api/v1/organizations/:id

Projects:
  POST   /api/v1/projects
  GET    /api/v1/projects
  GET    /api/v1/projects/:id
  PATCH  /api/v1/projects/:id
  DELETE /api/v1/projects/:id
  POST   /api/v1/projects/:id/archive
  GET    /api/v1/projects/:id/artifacts

Agents:
  GET    /api/v1/agents
  POST   /api/v1/agents
  POST   /api/v1/agents/tasks/:projectId
  GET    /api/v1/agents/tasks/:projectId
  POST   /api/v1/agents/tasks/:taskId/execute

Deployments:
  POST   /api/v1/deployments/:projectId
  GET    /api/v1/deployments/project/:projectId
  GET    /api/v1/deployments/:id/status
  POST   /api/v1/deployments/:id/rollback
```

## Agent SDK

```typescript
import { createDefaultRegistry, WorkflowEngine, AgentType } from '@omega/agent-sdk';

const registry = createDefaultRegistry();
const engine = new WorkflowEngine(registry);

// Run a full development workflow
const results = await engine.runWorkflow(
  { projectId: '123', taskId: '456', input: { prompt: 'Build a todo app' }, project: {} },
  [AgentType.EXECUTIVE, AgentType.PLANNER, AgentType.DATABASE, AgentType.BACKEND, AgentType.FRONTEND, AgentType.QA, AgentType.DEVOPS]
);
```

## Deployment

### Docker (Full Stack)

```bash
cd docker
docker-compose up -d
```

### Vercel (Frontend)

```bash
cd apps/web
vercel --prod
```

### Render (Backend)

```bash
# Connect your GitHub repo to Render
# Set environment variables in Render dashboard
# Auto-deploys on push to main
```

## Testing

```bash
# Unit + integration tests
npm test

# E2E tests
npm run test:e2e
```

## License

MIT © 2026 OMEGA INFINITY

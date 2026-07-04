FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/agent-sdk/package.json ./packages/agent-sdk/
COPY packages/shared/package.json ./packages/shared/
COPY prisma/ ./prisma/

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build
RUN npm run build:api

# ============ PRODUCTION ============
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/apps/api/src/main.js"]

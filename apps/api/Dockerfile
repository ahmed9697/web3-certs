# ---- Base Stage ----
# Defines a base image with pnpm installed.
FROM node:20-alpine AS base
RUN npm install -g pnpm

# ---- Dependencies Stage ----
FROM base AS dependencies
WORKDIR /app
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy only the package.json files for all workspaces
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/contracts/package.json ./packages/contracts/

# Install ALL production dependencies for the entire monorepo
RUN pnpm fetch --prod
RUN pnpm install -r --prod --offline

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app

# Copy dependencies from the previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps ./apps
COPY --from=dependencies /app/packages ./packages
COPY --from=dependencies /app/package.json ./

# Copy the rest of the source code
COPY . .

# Build the specific 'api' application
RUN pnpm --filter api build

# ---- Runner Stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary files for running the API from the previous stages
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]
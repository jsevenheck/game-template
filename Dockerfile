# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app
ENV CI=true

# Build stage
FROM base AS builder

COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --prod=false --no-frozen-lockfile

# Build server and client
RUN pnpm run build

# Production stage
FROM base AS runtime
ENV NODE_ENV=production

COPY package.json ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --prod --no-frozen-lockfile

COPY --from=builder /app/dist ./dist

ENV PORT=3001
EXPOSE 3001

CMD ["pnpm", "start"]

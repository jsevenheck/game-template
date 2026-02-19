# Your Game

<!-- TODO: describe your game here -->

A real-time multiplayer party game built with Vue 3 + Socket.IO + TypeScript.

## Quick Start

**Production mode:**

```bash
pnpm install
pnpm run build
pnpm start
```

Open `http://localhost:3001`.

**Development mode** (with hot reload):

```bash
pnpm install
pnpm run dev
```

Backend server on port 3001, Vite dev server on port 5173. Open `http://localhost:5173`.

## Scripts

| Script                  | What it does                                 |
| ----------------------- | -------------------------------------------- |
| `pnpm dev`              | Server + Vite client together                |
| `pnpm build`            | Production build (server + client)           |
| `pnpm build:standalone` | Full standalone build (web + server)         |
| `pnpm build:lib`        | Library bundle for Game Hub embedding        |
| `pnpm typecheck`        | `tsc` + `vue-tsc`                            |
| `pnpm lint`             | ESLint check (0 warnings required)           |
| `pnpm lint:fix`         | ESLint auto-fix                              |
| `pnpm format`           | Prettier rewrite all files in place          |
| `pnpm format:check`     | Prettier dry-run, exit 1 on diffs            |
| `pnpm test`             | Jest unit tests                              |
| `pnpm test:e2e`         | Playwright E2E (auto-starts server + client) |

## Docker

```bash
docker build -t your-game .
docker run --rm -p 3001:3001 your-game
```

Override port with `-e PORT=<port>`.

## Project Docs

- Architecture: `docs/architecture.md`
- Socket.IO API: `docs/api.md`
- Game Hub integration: `docs/game-hub-integration.md`

## Rename Guide

See `RENAME_GUIDE.md` for a checklist of all placeholders to replace when starting a new game.

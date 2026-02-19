# AGENTS.md — Your Game

Purpose: concise instructions for AI coding agents working in this repository.

## Project Overview

**Your Game** is a real-time multiplayer party game built with Vue 3 + Socket.IO + TypeScript.

<!-- TODO: replace this description with your game concept -->

Architecture layers:

- `core/src`: shared contracts (types, events, constants), zero runtime dependencies
- `server/src`: Socket.IO backend (models + managers + event handlers)
- `ui-vue/src`: Vue 3 client (Pinia store, composables, phase components)
- `standalone-server/src`: thin standalone Express + Socket.IO wrapper
- `standalone-web/src`: thin standalone Vue app entry

## Key Patterns (Must Follow)

1. **Manager pattern**
   - Keep Socket.IO handlers thin.
   - Put business logic into `server/src/managers/*` — pure-ish functions operating on `Room`.
   - Handlers validate input, call managers, then broadcast.

2. **Per-player sanitization**
   - Always broadcast room state via `broadcastManager`.
   - Never emit raw internal room state directly.
   - Strip `resumeToken`, `socketId`, and any game-secret fields before sending to clients.

3. **Phase-based state machine**
   - Valid phases are defined in `core/src/types.ts`.
   - Do not mutate phase ad hoc in handlers; use manager helpers for transitions.
   - Keep transition side effects explicit and testable.

## Common Tasks

### Add a new Socket.IO event

1. Add event contract in `core/src/events.ts`.
2. Add server handler in `server/src/handlers/socketHandlers.ts`.
3. Implement/reuse logic in `server/src/managers/*`.
4. Update client emitter/listener usage (`ui-vue/src/App.vue` or composables/stores).
5. Add unit tests for manager logic and handler flow.

### Add a new Vue component

1. Create component in `ui-vue/src/components` or `ui-vue/src/panels`.
2. Keep shared game state in Pinia (`ui-vue/src/stores/game.ts`), not duplicated in component-local state.
3. Wire phase rendering in `ui-vue/src/App.vue`.
4. Keep socket interaction centralized in App/store/composables where possible.

### Modify game logic

1. Change shared types/constants first if the contract changes (`core/src/*`).
2. Update relevant manager(s) and phase transitions.
3. Preserve broadcast sanitization guarantees.
4. Update unit tests and E2E tests for behavior changes.

## Testing Guidelines

Run these from repo root:

- Unit tests: `pnpm test`
- E2E tests: `pnpm test:e2e`
- Type checks: `pnpm typecheck`
- Lint and format checks: `pnpm lint && pnpm format:check`

For gameplay or event-contract changes, run unit + E2E.

## Development Workflow

- Install deps: `pnpm install`
- Start dev stack: `pnpm dev`
  - server on `:3001`
  - Vite client on `:5173`
- Build standalone production artifacts: `pnpm build`
- Build Game Hub library bundle: `pnpm build:lib`

## MCP Servers

| Server     | Purpose                              |
| ---------- | ------------------------------------ |
| fetch      | Fetch URLs / docs during development |
| filesystem | File operations                      |
| ripgrep    | Fast codebase search                 |
| pnpm       | Package management                   |
| playwright | Browser automation / E2E             |

## Working Rules

- Keep TypeScript strictness intact; avoid `any` unless unavoidable.
- Avoid leaking internal fields (`resumeToken`, `socketId`) to clients.
- Keep docs updated when adding/changing events, phases, or integration behavior.
- Use pnpm for all package management — never npm or yarn.

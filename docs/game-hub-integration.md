# Game Hub Integration

This document explains how your game integrates with the Game Hub platform.

## Overview

The `game-hub` platform uses an automated integration model:

- The hub owns the code transformation process (`scripts/transform-game.mjs` in the hub repository).
- Games are auto-discovered — no manual registration in platform files is required.
- Integration is fully automated via GitHub Actions using the `receive-game-sync.yml` workflow in the `game-hub` repo.

## The Synchronization Process

Whenever changes are merged into the `main` branch, the `.github/workflows/sync-to-hub.yml` workflow is triggered.

This workflow:

1. Calls the `receive-game-sync.yml` workflow on the `game-hub` repository.
2. The hub checks out this game's source code.
3. The hub runs its internal transformer to adapt the game source into the hub's structure.
4. A pull request is automatically opened in the `game-hub` repository with the integrated game.

### Integration Prerequisites

For the synchronization to work, the repository must have a secret configured:

- Name: `GAME_SYNC_TOKEN`
- Value: A Personal Access Token (or GitHub App token) with `actions:write` permission on the `jsevenheck/game-hub` repository.

## Hub Adapter Configuration

### 1. Server Adapter (`server/src/index.ts`)

Exports:

- `definition`: Game metadata (`id`, `name`, `minPlayers`, `maxPlayers`).
- `register`: Setup function that binds socket handlers to the provided Game Hub namespace.
- `handler`: Combined interface expected by Game Hub.

### 2. Hub Dependencies (`hub.config.json`)

This file at the repo root declares dependencies needed only in the hub environment (i.e. not in the standalone server's own `package.json`):

```json
{
  "serverDependencies": {
    "nanoid": "^5.1.6"
  }
}
```

Add any extra server runtime deps here (e.g. `better-sqlite3`). Dev-only types go under `serverDevDependencies`.

### 3. Web UI Manifest (`ui-vue/src/index.ts`)

Exports:

- `manifest`: Game metadata for the hub UI registry (`id`, `title`, `minPlayers`, `maxPlayers`).
- `GameComponent`: Root Vue component for the game.

## Local Development vs. Embedded (Game Hub)

### Embedded (Game Hub)

- `wsNamespace` is injected (e.g. `/g/YOUR_GAME_ID`).
- The standalone landing page is skipped.
- The client emits `autoJoinRoom({ sessionId, playerId, name })`.
- The server resolves or creates a room via `sessionId -> roomCode` mapping.

### Standalone

- `wsNamespace` is undefined.
- The client uses `createRoom` / `joinRoom` from the standard landing UI.
- Room code sharing is done by players directly.

## Hub Integration Props

`ui-vue/src/types/config.ts` defines these integration props:

| Prop          | Type     | Purpose                                                      |
| ------------- | -------- | ------------------------------------------------------------ |
| `sessionId`   | `string` | Hub party/session identifier                                 |
| `joinToken`   | `string` | Optional auth token passed in handshake                      |
| `wsNamespace` | `string` | Optional namespace override (e.g. `/g/YOUR_GAME_ID`)        |
| `apiBaseUrl`  | `string` | Optional base URL when API is on another origin/path         |
| `playerId`    | `string` | Stable hub player id                                         |
| `playerName`  | `string` | Display name used in game                                    |

## Integration Checklist

1. Replace all `YOUR_GAME_ID` placeholders (see [RENAME_GUIDE.md](../RENAME_GUIDE.md)).
2. Build and verify locally (`pnpm typecheck`, `pnpm lint`, `pnpm test`).
3. Add `GAME_SYNC_TOKEN` secret to the GitHub repository settings.
4. Merge to `main` — the sync workflow triggers automatically after CI passes.

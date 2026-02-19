# Game Hub Integration

This document describes how to package and run **Your Game** in Game Hub, and how that differs from standalone mode.

## Hub Integration Props

`ui-vue/src/types/config.ts` defines these integration props:

| Prop          | Type     | Purpose                                                     |
| ------------- | -------- | ----------------------------------------------------------- |
| `sessionId`   | `string` | Hub party/session identifier                                |
| `joinToken`   | `string` | Optional auth token passed in handshake                     |
| `wsNamespace` | `string` | Optional namespace override (for example `/g/YOUR_GAME_ID`) |
| `apiBaseUrl`  | `string` | Optional base URL when API is on another origin/path        |
| `playerId`    | `string` | Stable hub player id                                        |
| `playerName`  | `string` | Display name used in game                                   |

## Template Baseline vs Hub-specific Extensions

Template baseline includes:

- `manifest` and `GameComponent` export from `ui-vue/src/index.ts`
- Socket namespace `/g/YOUR_GAME_ID` in `server/src/handlers/socketHandlers.ts`
- Room/session lifecycle: `createRoom`, `joinRoom`, `resumePlayer`, `requestState`

Not implemented by default (add if your hub needs it):

- `autoJoinRoom(...)` event flow
- join token validation logic
- dynamic namespace from `wsNamespace`

## Library Build

For Game Hub web integration, build the library bundle:

```bash
pnpm build:lib
```

Library entry point: `ui-vue/src/index.ts`

Exports:

- `manifest`
- `GameComponent`
- shared event/type exports for host-side typing

## Game Hub Registry

After building, register the game in both Game Hub registries:

1. Server registry: import your server `registerGame(...)`
2. Web registry: import `GameComponent` and `manifest` and call `registerGameUI(...)`

## Integration Checklist

1. Replace all `YOUR_GAME_ID` placeholders (see [RENAME_GUIDE.md](../RENAME_GUIDE.md)).
2. Build and verify locally (`pnpm typecheck`, `pnpm lint`, `pnpm test`).
3. Build library bundle (`pnpm build:lib`).
4. Copy built output into your Game Hub game registry location.
5. Register game in server and web registries.
6. Ensure host mounts `GameComponent` with required embedded props.
7. Ensure server registers namespace `/g/YOUR_GAME_ID`.
8. If needed, implement and validate hub-specific auto-join flow.

# Game Template - Rename Guide

When starting a new game from this template, do a global find and replace for these placeholders:

| Placeholder    | Replace with                  | Example      |
| -------------- | ----------------------------- | ------------ |
| `YOUR_GAME_ID` | kebab-case game id            | `werewolves` |
| `your-game`    | package/game id in kebab-case | `werewolves` |
| `YourGame`     | PascalCase library name       | `Werewolves` |
| `Your Game`    | display name                  | `Werewolves` |

## Files to update

| File                                    | What to change                                 |
| --------------------------------------- | ---------------------------------------------- |
| `package.json`                          | `name`, `description`                          |
| `server/src/index.ts`                   | `id`, `name`, `minPlayers`, `maxPlayers`       |
| `server/src/handlers/socketHandlers.ts` | `GAME_ID` constant                             |
| `standalone-server/src/index.ts`        | `GAME_ID` constant                             |
| `ui-vue/package.json`                   | `name`, `main`, `module`, `exports`            |
| `ui-vue/vite.lib.config.ts`             | `lib.name`, `lib.fileName`, `cssFileName`      |
| `ui-vue/src/index.ts`                   | `manifest.id`, `manifest.title`, player counts |
| `ui-vue/src/composables/useSocket.ts`   | `GAME_ID` constant                             |
| `ui-vue/index.html`                     | `<title>`                                      |
| `ui-vue/src/components/Landing.vue`     | game title in `<h1>`                           |
| `standalone-web/index.html`             | `<title>`                                      |
| `standalone-web/package.json`           | `name`                                         |
| `standalone-server/package.json`        | `name`                                         |
| `hub.config.json`                       | `serverDependencies` (keep/extend as needed)   |
| `.github/workflows/sync-to-hub.yml`     | `game-id` field (replace `YOUR_GAME_ID`)       |

## After renaming

1. Fill in game-specific logic:
   - `core/src/types.ts` for Phase, Player, Room and RoomView
   - `core/src/events.ts` for all socket events
   - `core/src/constants.ts` for game constants
   - `server/src/models/room.ts` for room state initialization
   - `server/src/managers/broadcastManager.ts` for Room to RoomView projection
   - `server/src/managers/phaseManager.ts` for phase transitions
   - `server/src/handlers/socketHandlers.ts` for event handling
   - `ui-vue/src/App.vue` for game UI
   - `ui-vue/src/stores/game.ts` for client state

2. Install dependencies:

```bash
pnpm install
```

3. Start the dev stack:

```bash
pnpm dev
```

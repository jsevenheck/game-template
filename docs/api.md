# Your Game - Socket.IO API

Namespace: `/g/YOUR_GAME_ID`

## Client -> Server Events

All callback responses follow this shape:

- success: `{ ok: true, ... }`
- error: `{ ok: false, error: string }`

### Session

#### `createRoom`

```ts
createRoom(data: { name: string }, cb)
```

Response:

```ts
{
  ok: true;
  roomCode: string;
  playerId: string;
  resumeToken: string;
}
```

#### `joinRoom`

```ts
joinRoom(data: { name: string; code: string }, cb)
```

Response:

```ts
{
  ok: true;
  playerId: string;
  resumeToken: string;
}
```

#### `resumePlayer`

```ts
resumePlayer(data: { roomCode: string; playerId: string; resumeToken: string }, cb)
```

Response:

```ts
{
  ok: true;
}
```

#### `requestState`

```ts
requestState(data: { roomCode: string; playerId: string })
```

Sends `roomState` to that specific player.

### Lobby

#### `startGame`

```ts
startGame(data: { roomCode: string; playerId: string }, cb)
```

Response:

```ts
{
  ok: true;
}
```

Host only.

### Gameplay

The template does not include gameplay-specific events yet.
Add your own events in `core/src/events.ts` and implement them in
`server/src/handlers/socketHandlers.ts`.

## Server -> Client Events

### `roomState`

```ts
roomState(room: RoomView)
```

Per-player sanitized room state. Emitted after every state change.

## Error Handling

Callback-based events return `{ ok: false, error }` on validation, permission,
or state errors.

Common error types:

- room or player not found
- invalid input
- invalid resume token
- host-only violations
- wrong game phase for requested action

Example:

```ts
{ ok: false, error: 'Room not found' }
```

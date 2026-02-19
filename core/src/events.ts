// TODO: Define all Socket.IO events for your game here.
// Split into ClientToServerEvents (client sends) and ServerToClientEvents (server sends).
// These types are shared between server and ui-vue.

import type { RoomView } from './types';

// ─── Client → Server ─────────────────────────────────────────────────────────

export interface ClientToServerEvents {
  /** Create a new room and become host */
  createRoom: (
    data: { name: string },
    cb: (
      res:
        | { ok: true; roomCode: string; playerId: string; resumeToken: string }
        | { ok: false; error: string }
    ) => void
  ) => void;

  /** Join an existing room by code */
  joinRoom: (
    data: { name: string; code: string },
    cb: (
      res: { ok: true; playerId: string; resumeToken: string } | { ok: false; error: string }
    ) => void
  ) => void;

  /** Reconnect with a previously stored session */
  resumePlayer: (
    data: { roomCode: string; playerId: string; resumeToken: string },
    cb: (res: { ok: true } | { ok: false; error: string }) => void
  ) => void;

  /** Request full room state (e.g. after reconnect) */
  requestState: (data: { roomCode: string; playerId: string }) => void;

  /** Start the game (host only) */
  startGame: (
    data: { roomCode: string; playerId: string },
    cb: (res: { ok: true } | { ok: false; error: string }) => void
  ) => void;

  // TODO: add game-specific events
}

// ─── Server → Client ─────────────────────────────────────────────────────────

export interface ServerToClientEvents {
  /** Full room state broadcast to all players in the room */
  roomState: (room: RoomView) => void;

  // TODO: add game-specific events
}

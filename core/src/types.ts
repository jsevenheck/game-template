// TODO: Define your game-specific types here.
// The types below are a typical starting point — adapt them to your game.

export type Phase = 'lobby' | 'playing' | 'ended';

// ─── Player ──────────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  resumeToken: string;
  score: number;
  connected: boolean;
  isHost: boolean;
  socketId: string | null;
}

/** Subset of Player that is safe to send to all clients */
export interface PlayerView {
  id: string;
  name: string;
  score: number;
  connected: boolean;
  isHost: boolean;
}

// ─── Room ────────────────────────────────────────────────────────────────────

export interface Room {
  code: string;
  hostId: string | null;
  phase: Phase;
  players: Record<string, Player>;
  // TODO: add game-specific room state
}

/** Subset of Room that is safe to broadcast */
export interface RoomView {
  code: string;
  phase: Phase;
  players: PlayerView[];
  // TODO: mirror game-specific fields from Room
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface StoredSession {
  playerId: string;
  roomCode: string;
  name: string;
  resumeToken: string;
}

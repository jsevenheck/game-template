import { nanoid } from 'nanoid';
import type { Room } from '../../../core/src/types';
import { createPlayer } from './player';
import { setSocketIndex } from './player';

const rooms = new Map<string, Room>();
// session (persistent browser id) → roomCode
const sessionToRoom = new Map<string, string>();
// cleanup timers for empty rooms
const roomCleanupTimers = new Map<string, ReturnType<typeof setTimeout>>();

const ROOM_CLEANUP_DELAY_MS = 5 * 60 * 1000; // 5 minutes

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

function scheduleRoomCleanup(code: string): void {
  clearRoomCleanup(code);
  const timer = setTimeout(() => {
    rooms.delete(code);
  }, ROOM_CLEANUP_DELAY_MS);
  roomCleanupTimers.set(code, timer);
}

export function clearRoomCleanup(code: string): void {
  const timer = roomCleanupTimers.get(code);
  if (timer) {
    clearTimeout(timer);
    roomCleanupTimers.delete(code);
  }
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export function createRoom(
  hostName: string,
  socketId: string
): { room: Room; hostId: string; resumeToken: string } {
  const code = generateRoomCode();
  const host = createPlayer(hostName, true);
  host.socketId = socketId;

  const room: Room = {
    code,
    hostId: host.id,
    phase: 'lobby',
    players: { [host.id]: host },
    // TODO: initialise game-specific state
  };

  rooms.set(code, room);
  setSocketIndex(socketId, code, host.id);

  return { room, hostId: host.id, resumeToken: host.resumeToken };
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code);
}

export function deleteRoom(code: string): void {
  rooms.delete(code);
}

// ─── Session mapping ──────────────────────────────────────────────────────────

export function setSessionToRoom(sessionId: string, roomCode: string): void {
  sessionToRoom.set(sessionId, roomCode);
}

export function getSessionRoom(sessionId: string): string | undefined {
  return sessionToRoom.get(sessionId);
}

// Re-export so socketHandlers doesn't need to import player separately
export { scheduleRoomCleanup };
export { nanoid };

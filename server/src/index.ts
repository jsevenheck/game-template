import type { Server } from 'socket.io';
import { registerGame } from './handlers/socketHandlers';

// TODO: replace with your game info
export const definition = {
  id: 'YOUR_GAME_ID',
  name: 'Your Game',
  minPlayers: 2,
  maxPlayers: 16,
} as const;

/**
 * Game Hub plugin entry point.
 * Registers Socket.IO handlers on `/g/<gameId>`.
 */
export function register(io: Server, namespace = `/g/${definition.id}`) {
  return registerGame(io, namespace);
}

export const handler = { definition, register };

import type { Namespace } from 'socket.io';
import type { ServerToClientEvents, ClientToServerEvents } from '../../../core/src/events';
import type { Room, RoomView, PlayerView } from '../../../core/src/types';

type GameNamespace = Namespace<ClientToServerEvents, ServerToClientEvents>;

// ─── View projection ──────────────────────────────────────────────────────────

function toRoomView(room: Room): RoomView {
  const players: PlayerView[] = Object.values(room.players).map((p) => ({
    id: p.id,
    name: p.name,
    score: p.score,
    connected: p.connected,
    isHost: p.isHost,
  }));

  return {
    code: room.code,
    phase: room.phase,
    players,
    // TODO: map game-specific fields from Room → RoomView
  };
}

// ─── Broadcast ────────────────────────────────────────────────────────────────

/** Broadcast full room state to everyone in the room */
export function broadcastRoom(nsp: GameNamespace, room: Room): void {
  nsp.to(room.code).emit('roomState', toRoomView(room));
}

/** Send room state only to a specific player */
export function sendRoomToPlayer(nsp: GameNamespace, room: Room, playerId: string): void {
  const player = room.players[playerId];
  if (!player?.socketId) return;
  nsp.to(player.socketId).emit('roomState', toRoomView(room));
}

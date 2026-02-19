import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../../core/src/events';
import { MIN_PLAYERS } from '../../../core/src/constants';
import { createRoom, getRoom, clearRoomCleanup } from '../models/room';
import { createPlayer, setSocketIndex, getSocketIndex, deleteSocketIndex } from '../models/player';
import { broadcastRoom, sendRoomToPlayer } from '../managers/broadcastManager';

// TODO: replace YOUR_GAME_ID with your actual game id (e.g. 'blackout')
const GAME_ID = 'YOUR_GAME_ID';

type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function registerGame(io: Server, namespace = `/g/${GAME_ID}`): void {
  const nsp = io.of(namespace);

  // Auth middleware — extract session/player info from handshake
  nsp.use((socket, next) => {
    const auth = socket.handshake.auth || {};
    socket.data.sessionId = auth.sessionId;
    socket.data.playerId = auth.playerId;
    next();
  });

  nsp.on('connection', (socket: GameSocket) => {
    // ── createRoom ──────────────────────────────────────────────────────────
    socket.on('createRoom', (data, cb) => {
      const name = data.name?.trim();
      if (!name || name.length > 20) {
        return cb({ ok: false, error: 'Invalid name' });
      }

      const { room, hostId, resumeToken } = createRoom(name, socket.id);
      socket.join(room.code);
      broadcastRoom(nsp, room);

      cb({ ok: true, roomCode: room.code, playerId: hostId, resumeToken });
    });

    // ── joinRoom ────────────────────────────────────────────────────────────
    socket.on('joinRoom', (data, cb) => {
      const name = data.name?.trim();
      const code = data.code?.trim().toUpperCase();
      if (!name || name.length > 20) {
        return cb({ ok: false, error: 'Invalid name' });
      }

      const room = getRoom(code);
      if (!room) {
        return cb({ ok: false, error: 'Room not found' });
      }
      if (room.phase !== 'lobby') {
        return cb({ ok: false, error: 'Game already started' });
      }

      const nameExists = Object.values(room.players).some(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );
      if (nameExists) {
        return cb({ ok: false, error: 'Name already taken' });
      }

      const player = createPlayer(name, false);
      player.socketId = socket.id;
      room.players[player.id] = player;
      setSocketIndex(socket.id, code, player.id);
      clearRoomCleanup(code);

      socket.join(code);
      broadcastRoom(nsp, room);

      cb({ ok: true, playerId: player.id, resumeToken: player.resumeToken });
    });

    // ── resumePlayer ────────────────────────────────────────────────────────
    socket.on('resumePlayer', (data, cb) => {
      const room = getRoom(data.roomCode);
      if (!room) return cb({ ok: false, error: 'Room not found' });

      const player = room.players[data.playerId];
      if (!player) return cb({ ok: false, error: 'Player not found' });
      if (player.resumeToken !== data.resumeToken) {
        return cb({ ok: false, error: 'Invalid resume token' });
      }

      if (player.socketId) deleteSocketIndex(player.socketId);

      player.socketId = socket.id;
      player.connected = true;
      setSocketIndex(socket.id, room.code, player.id);
      clearRoomCleanup(room.code);

      socket.join(room.code);
      broadcastRoom(nsp, room);
      cb({ ok: true });
    });

    // ── requestState ────────────────────────────────────────────────────────
    socket.on('requestState', (data) => {
      const room = getRoom(data.roomCode);
      if (!room || !room.players[data.playerId]) return;
      sendRoomToPlayer(nsp, room, data.playerId);
    });

    // ── startGame ───────────────────────────────────────────────────────────
    socket.on('startGame', (data, cb) => {
      const room = getRoom(data.roomCode);
      if (!room) return cb({ ok: false, error: 'Room not found' });
      if (room.hostId !== data.playerId) return cb({ ok: false, error: 'Only host can start' });
      if (room.phase !== 'lobby') return cb({ ok: false, error: 'Game already started' });

      const connected = Object.values(room.players).filter((p) => p.connected);
      if (connected.length < MIN_PLAYERS) {
        return cb({ ok: false, error: `Need at least ${MIN_PLAYERS} players` });
      }

      // TODO: transition to 'playing', initialise first round, etc.
      room.phase = 'playing';
      broadcastRoom(nsp, room);
      cb({ ok: true });
    });

    // TODO: add game-specific socket events here

    // ── disconnect ──────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      const index = getSocketIndex(socket.id);
      if (!index) return;

      const room = getRoom(index.roomCode);
      if (room) {
        const player = room.players[index.playerId];
        if (player) {
          player.connected = false;
          player.socketId = null;
          broadcastRoom(nsp, room);
        }
      }
      deleteSocketIndex(socket.id);
    });
  });
}

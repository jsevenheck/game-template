import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RoomView, Phase } from '@shared/types';

export const useGameStore = defineStore('game', () => {
  // ─── Session ───────────────────────────────────────────────────────────────
  const playerId = ref<string | null>(null);
  const roomCode = ref<string | null>(null);
  const resumeToken = ref<string | null>(null);
  const playerName = ref<string | null>(null);

  // ─── Room state (from server) ──────────────────────────────────────────────
  const phase = ref<Phase | null>(null);
  const room = ref<RoomView | null>(null);

  // ─── Actions ──────────────────────────────────────────────────────────────

  function applyRoomState(state: RoomView) {
    room.value = state;
    phase.value = state.phase;
  }

  function setSession(data: {
    playerId: string;
    roomCode: string;
    resumeToken: string;
    name: string;
  }) {
    playerId.value = data.playerId;
    roomCode.value = data.roomCode;
    resumeToken.value = data.resumeToken;
    playerName.value = data.name;
  }

  function reset() {
    playerId.value = null;
    roomCode.value = null;
    resumeToken.value = null;
    playerName.value = null;
    phase.value = null;
    room.value = null;
  }

  // TODO: add game-specific state and actions

  return {
    playerId,
    roomCode,
    resumeToken,
    playerName,
    phase,
    room,
    applyRoomState,
    setSession,
    reset,
  };
});

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();

defineEmits<{
  startGame: [];
}>();

const isHost = computed(
  () => store.room?.players.find((p) => p.id === store.playerId)?.isHost ?? false
);

const connectedCount = computed(() => store.room?.players.filter((p) => p.connected).length ?? 0);

// TODO: adjust minimum player count for your game
const MIN_PLAYERS = 2;
</script>

<template>
  <div class="lobby">
    <div class="room-code-display">
      <p class="label">Room Code</p>
      <h2 class="code">
        {{ store.roomCode }}
      </h2>
      <p class="hint">Share this code with your friends!</p>
    </div>

    <div class="players-list">
      <h3>Players ({{ connectedCount }})</h3>
      <div
        v-for="player in store.room?.players"
        :key="player.id"
        class="player-item"
        :class="{ disconnected: !player.connected }"
      >
        <span class="player-name">{{ player.name }}</span>
        <span v-if="player.isHost" class="badge host">Host</span>
        <span v-if="!player.connected" class="badge offline">Offline</span>
      </div>
    </div>

    <div v-if="isHost" class="host-controls">
      <!-- TODO: add host-only game configuration here -->
      <button
        class="btn btn-primary btn-start"
        :disabled="connectedCount < MIN_PLAYERS"
        @click="$emit('startGame')"
      >
        Start Game
      </button>
      <p v-if="connectedCount < MIN_PLAYERS" class="hint">
        Need at least {{ MIN_PLAYERS }} players to start
      </p>
    </div>

    <div v-else class="waiting">
      <p>Waiting for host to start the game...</p>
    </div>
  </div>
</template>

<style scoped>
.lobby {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1rem;
}

.room-code-display {
  text-align: center;
}

.label {
  color: #71717a;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.code {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 0.4em;
  color: #8b5cf6;
}

.hint {
  color: #71717a;
  font-size: 0.875rem;
}

.players-list {
  width: 100%;
  max-width: 320px;
}

.players-list h3 {
  color: #a1a1aa;
  margin-bottom: 0.75rem;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #27272a;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.player-item.disconnected {
  opacity: 0.5;
}

.player-name {
  flex: 1;
  color: #fff;
}

.badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.badge.host {
  background: #8b5cf6;
  color: #fff;
}

.badge.offline {
  background: #3f3f46;
  color: #71717a;
}

.host-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: #8b5cf6;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #7c3aed;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-start {
  padding: 1rem 3rem;
  font-size: 1.25rem;
}

.waiting {
  color: #71717a;
}
</style>

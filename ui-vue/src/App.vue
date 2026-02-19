<script setup lang="ts">
import { useGameStore } from './stores/game';
import { useSocket } from './composables/useSocket';
import Landing from './components/Landing.vue';
import Lobby from './components/Lobby.vue';
import GameOver from './components/GameOver.vue';
// TODO: import your game-specific play component
// import GamePlay from './components/GamePlay.vue';

const store = useGameStore();
const { socket } = useSocket();

socket.on('roomState', (state) => {
  store.applyRoomState(state);
});

function handleCreate(name: string) {
  socket.emit('createRoom', { name }, (res) => {
    if (!res.ok) return;
    store.setSession({
      playerId: res.playerId,
      roomCode: res.roomCode,
      resumeToken: res.resumeToken,
      name,
    });
  });
}

function handleJoin(name: string, code: string) {
  socket.emit('joinRoom', { name, code }, (res) => {
    if (!res.ok) return;
    store.setSession({
      playerId: res.playerId,
      roomCode: code,
      resumeToken: res.resumeToken,
      name,
    });
  });
}

function handleStartGame() {
  if (!store.roomCode || !store.playerId) return;
  socket.emit('startGame', { roomCode: store.roomCode, playerId: store.playerId }, () => {});
}

function handleRestart() {
  // TODO: implement restart logic
}
</script>

<template>
  <div class="app">
    <Landing v-if="store.phase === null" @create="handleCreate" @join="handleJoin" />
    <Lobby v-else-if="store.phase === 'lobby'" @start-game="handleStartGame" />
    <!-- TODO: add your game-specific play view here -->
    <!-- <GamePlay v-else-if="store.phase === 'playing'" /> -->
    <GameOver v-else-if="store.phase === 'ended'" @restart="handleRestart" />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, sans-serif;
}

.app {
  min-height: 100dvh;
}
</style>

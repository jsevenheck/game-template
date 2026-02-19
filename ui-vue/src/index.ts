// Library entry point — used when building as a Game Hub plugin.
// TODO: update id, title, minPlayers, maxPlayers
import GameComponent from './App.vue';

export const manifest = {
  id: 'YOUR_GAME_ID',
  title: 'Your Game',
  minPlayers: 2,
  maxPlayers: 16,
};

export { GameComponent };
export default GameComponent;

// Re-export shared types so Game Hub can import them from the library
export type { RoomView, PlayerView } from '@shared/types';
export type { ClientToServerEvents, ServerToClientEvents } from '@shared/events';

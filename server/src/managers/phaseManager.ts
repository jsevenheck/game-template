// TODO: add game-specific phase transition logic here.
// These stubs cover the standard lobby → playing → ended lifecycle.

import type { Room } from '../../../core/src/types';

export function transitionToPlaying(room: Room): void {
  room.phase = 'playing';
  // TODO: initialise round/game state
}

export function transitionToEnded(room: Room): void {
  room.phase = 'ended';
  // TODO: compute winners, final scores, etc.
}

export function transitionToLobby(room: Room): void {
  room.phase = 'lobby';
  // TODO: reset game-specific state so a new game can start
}

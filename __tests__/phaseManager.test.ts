import {
  transitionToPlaying,
  transitionToEnded,
  transitionToLobby,
} from '../server/src/managers/phaseManager';
import type { Room } from '../core/src/types';

function makeRoom(): Room {
  return {
    code: 'TEST',
    hostId: 'p1',
    phase: 'lobby',
    players: {},
  };
}

describe('phaseManager', () => {
  test('transitionToPlaying sets phase to playing', () => {
    const room = makeRoom();
    transitionToPlaying(room);
    expect(room.phase).toBe('playing');
  });

  test('transitionToEnded sets phase to ended', () => {
    const room = makeRoom();
    transitionToEnded(room);
    expect(room.phase).toBe('ended');
  });

  test('transitionToLobby sets phase to lobby', () => {
    const room = makeRoom();
    room.phase = 'playing';
    transitionToLobby(room);
    expect(room.phase).toBe('lobby');
  });
});

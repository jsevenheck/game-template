import { customAlphabet } from 'nanoid';
import {
  MIN_PLAYERS as BASE_MIN_PLAYERS,
  MAX_PLAYERS as BASE_MAX_PLAYERS,
  // TODO: import other constants from core that need E2E overrides
} from '../../../core/src/constants';

export const PORT = process.env.PORT ?? 3001;
export const IS_E2E = process.env.E2E_TESTS === '1';

// TODO: add timing constants with E2E overrides, e.g.:
// export const ROUND_TIMEOUT_MS = IS_E2E ? 0 : BASE_ROUND_TIMEOUT_MS;

export const MIN_PLAYERS = BASE_MIN_PLAYERS;
export const MAX_PLAYERS = BASE_MAX_PLAYERS;
export const MAX_PLAYER_NAME_LENGTH = 32;

// nanoid generators
export const ROOM_CODE = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 4);
export const PLAYER_ID = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12);
export const RESUME_TOKEN = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 24);

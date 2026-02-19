#!/usr/bin/env node
// Game Hub export script.
// Run from repo root: node scripts/transform-for-gamehub.mjs
//
// TODO: replace YOUR_GAME_ID with the actual game id (also update package names below).

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

const GAME_ID = 'YOUR_GAME_ID';
const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'game-export', GAME_ID);

function writeJson(filePath, data) {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeFile(filePath, content) {
  writeFileSync(filePath, content.trimStart());
}

function rewriteImports(dir) {
  const replacements = [
    ['@shared/', `@game-hub/${GAME_ID}-shared/`],
    ['../../core/src/', `@game-hub/${GAME_ID}-shared/`],
    ['../../../core/src/', `@game-hub/${GAME_ID}-shared/`],
    ['../../../../core/src/', `@game-hub/${GAME_ID}-shared/`],
  ];

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      rewriteImports(full);
      continue;
    }
    if (!full.endsWith('.ts') && !full.endsWith('.vue')) continue;
    let content = readFileSync(full, 'utf-8');
    for (const [from, to] of replacements) {
      content = content.replaceAll(from, to);
    }
    writeFileSync(full, content);
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'web', 'src'), { recursive: true });
mkdirSync(join(OUT, 'server', 'src'), { recursive: true });
mkdirSync(join(OUT, 'shared', 'src'), { recursive: true });

cpSync(join(ROOT, 'ui-vue', 'src'), join(OUT, 'web', 'src'), { recursive: true });
cpSync(join(ROOT, 'server', 'src'), join(OUT, 'server', 'src'), { recursive: true });
cpSync(join(ROOT, 'core', 'src'), join(OUT, 'shared', 'src'), { recursive: true });

rewriteImports(OUT);

writeFile(
  join(OUT, 'server', 'src', 'index.ts'),
  `
import type { Server } from 'socket.io';
import { registerGame } from './handlers/socketHandlers';

export const definition = {
  id: '${GAME_ID}',
  name: 'Your Game', // TODO: update display name
  minPlayers: 2,
  maxPlayers: 16,
} as const;

export function register(io: Server, namespace = '/g/${GAME_ID}') {
  return registerGame(io, namespace);
}

export const handler = { definition, register };
`
);

if (!existsSync(join(OUT, 'shared', 'src', 'index.ts'))) {
  writeFile(
    join(OUT, 'shared', 'src', 'index.ts'),
    `
export * from './types';
export * from './events';
export * from './constants';
`
  );
}

writeJson(join(OUT, 'shared', 'package.json'), {
  name: `@game-hub/${GAME_ID}-shared`,
  version: '1.0.0',
  type: 'module',
  main: 'dist/index.js',
  types: 'dist/index.d.ts',
  exports: {
    '.': { import: './dist/index.js', types: './dist/index.d.ts' },
    './events': { import: './dist/events.js', types: './dist/events.d.ts' },
    './types': { import: './dist/types.js', types: './dist/types.d.ts' },
    './constants': { import: './dist/constants.js', types: './dist/constants.d.ts' },
  },
  scripts: { build: 'tsup', typecheck: 'tsc --noEmit' },
  devDependencies: { tsup: '^8.4.2', typescript: '^5.9.3' },
});

writeJson(join(OUT, 'server', 'package.json'), {
  name: `@game-hub/${GAME_ID}-server`,
  version: '1.0.0',
  type: 'module',
  main: 'dist/index.js',
  exports: { '.': { import: './dist/index.js', types: './dist/index.d.ts' } },
  scripts: { build: 'tsup', typecheck: 'tsc --noEmit' },
  dependencies: {
    [`@game-hub/${GAME_ID}-shared`]: 'workspace:*',
    nanoid: '^5.1.6',
    'socket.io': '^4.8.3',
  },
  devDependencies: { '@types/node': '^22.19.7', tsup: '^8.4.2', typescript: '^5.9.3' },
});

writeJson(join(OUT, 'web', 'package.json'), {
  name: `@game-hub/${GAME_ID}-web`,
  version: '1.0.0',
  type: 'module',
  main: 'src/index.ts',
  exports: { '.': './src/index.ts' },
  scripts: { typecheck: 'vue-tsc --noEmit' },
  dependencies: {
    [`@game-hub/${GAME_ID}-shared`]: 'workspace:*',
    pinia: '^3.0.0',
    'socket.io-client': '^4.8.3',
    vue: '^3.5.0',
  },
  devDependencies: { typescript: '^5.9.3', 'vue-tsc': '^2.2.1' },
});

writeFile(
  join(OUT, 'README.md'),
  `
# ${GAME_ID} — Game Hub Integration

Generated export for integration into the Game Hub monorepo.

## Structure

- web/: Vue game UI package
- server/: Socket namespace package
- shared/: shared contracts package

## Next Steps in Game Hub

1. Copy this folder to \`games/${GAME_ID}\`.
2. Register \`@game-hub/${GAME_ID}-server\` in \`apps/platform-server/src/index.ts\`.
3. Register \`@game-hub/${GAME_ID}-web\` in \`apps/platform-web/src/gameRegistry.ts\`.
4. Run \`pnpm install\`, \`pnpm typecheck\`, \`pnpm lint\`, \`pnpm test\`.
`
);

console.log('Game Hub export created at:', OUT);

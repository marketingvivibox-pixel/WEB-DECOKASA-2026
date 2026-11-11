'use strict';

// Las dependencias del libro se instalan aisladas del resto de la tienda.
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const modules = path.join(__dirname, 'pruebas/node_modules');
const env = { ...process.env, NODE_PATH: [modules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter) };

for (const args of [
  ['--test', path.join(root, 'tests/libro-reclamaciones.test.cjs')],
  [path.join(__dirname, 'verificar-respaldo.cjs')],
]) {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    if (result.error) console.error(result.error.message);
    process.exit(result.status || 1);
  }
}

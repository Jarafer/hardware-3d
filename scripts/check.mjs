import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { getPixelRatio } from '../src/config.js';

async function checkDirectory(url) {
  for (const entry of await readdir(url, { withFileTypes: true })) {
    const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), url);
    if (entry.isDirectory()) await checkDirectory(child);
    else if (/\.m?js$/.test(entry.name)) {
      const result = spawnSync(process.execPath, ['--check', fileURLToPath(child)], { encoding: 'utf8' });
      if (result.status !== 0) throw new Error(result.stderr);
    }
  }
}
await checkDirectory(new URL('../src/', import.meta.url));
await checkDirectory(new URL('./', import.meta.url));
assert.equal(getPixelRatio(3, false), 1.5);
assert.equal(getPixelRatio(3, true), 1);
assert.equal(getPixelRatio(1, false), 1);
assert.equal(getPixelRatio(undefined, false), 1);
console.log('Sintaxis de los módulos correcta. Límites de resolución verificados (4 casos).');

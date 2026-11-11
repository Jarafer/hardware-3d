import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { ramResources, ramVideoEmbedUrl } from '../src/education/ramResources.js';

for (const [name, asset] of [['infografía', ramResources.infographic], ['PDF', ramResources.pdf]]) {
  test(`el recurso local ${name} conserva íntegro el archivo aportado`, async () => {
    assert.ok(!asset.path.startsWith('/') && !asset.path.includes('..') && !asset.path.includes('://'));
    const bytes = await readFile(new URL(`../public/${asset.path}`, import.meta.url));
    assert.equal(bytes.length, asset.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
    assert.equal(bytes.subarray(0, name === 'PDF' ? 5 : 8).toString('hex'), name === 'PDF' ? '255044462d' : '89504e470d0a1a0a');
  });
}

test('el reproductor usa el video solicitado sin reproducción automática', () => {
  const url = new URL(ramVideoEmbedUrl());
  assert.equal(url.origin, 'https://www.youtube-nocookie.com');
  assert.equal(url.pathname, '/embed/RCooHWPP_P0');
  assert.equal(url.searchParams.get('autoplay'), '0');
  assert.equal(url.searchParams.get('controls'), '1');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookPose, sampleTransition, LEAF_COUNT } from '../src/scene/bookMotion.js';

test('el libro vuelve a las mismas poses exactas tras aperturas y cierres repetidos', () => {
  const closed = bookPose(0);
  const open = bookPose(1);
  assert.equal(closed.coverAngle, 0);
  assert.equal(open.coverAngle, Math.PI);
  assert.equal(open.leafAngles.length, LEAF_COUNT);
  assert.ok(open.leafAngles.every((angle) => angle === Math.PI));
  for (let cycle = 0; cycle < 20; cycle++) {
    assert.deepEqual(bookPose(sampleTransition({ from: 0, to: 1, start: 0, duration: 2600 }, 3000).progress), open);
    assert.deepEqual(bookPose(sampleTransition({ from: 1, to: 0, start: 0, duration: 2600 }, 3000).progress), closed);
  }
});

test('la tapa precede a las hojas y las hojas conservan su orden angular', () => {
  for (let step = 0; step <= 1000; step++) {
    const pose = bookPose(step / 1000);
    assert.ok(pose.coverAngle >= pose.leafAngles[0]);
    for (let index = 1; index < LEAF_COUNT; index++) assert.ok(pose.leafAngles[index - 1] >= pose.leafAngles[index]);
    assert.ok(pose.coverHeight >= 0.199999 && pose.coverHeight <= 0.48);
  }
});

test('el progreso depende del tiempo absoluto y no del número de fotogramas', () => {
  const transition = { from: 0, to: 1, start: 100, duration: 2600 };
  const direct = sampleTransition(transition, 1400);
  for (const fps of [15, 30, 60, 144]) {
    for (let time = 100; time < 1400; time += 1000 / fps) sampleTransition(transition, time);
    assert.deepEqual(sampleTransition(transition, 1400), direct);
  }
  assert.equal(direct.progress, 0.5);
});

test('invertir el destino a mitad de animación conserva la pose de inicio', () => {
  const current = sampleTransition({ from: 0, to: 1, start: 0, duration: 2600 }, 1030).progress;
  const reverse = { from: current, to: 0, start: 1030, duration: current * 2600 };
  assert.equal(sampleTransition(reverse, 1030).progress, current);
  assert.deepEqual(bookPose(sampleTransition(reverse, 1030).progress), bookPose(current));
  assert.equal(sampleTransition(reverse, 5000).progress, 0);
});

test('movimiento reducido llega al estado final en la primera actualización', () => {
  assert.deepEqual(sampleTransition({ from: 0.4, to: 1, start: 100, duration: 0 }, 100), { progress: 1, fraction: 1, done: true });
  assert.deepEqual(sampleTransition({ from: 1, to: 0, start: 100, duration: 0 }, 100), { progress: 0, fraction: 1, done: true });
});

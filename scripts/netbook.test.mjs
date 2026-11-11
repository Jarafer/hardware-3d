import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Netbook3D } from '../src/scene/Netbook3D.js';
import { BOOK_DURATION, TOTAL_DURATION, sequencePose, sampleSequence, netbookCameraLimits, netbookZoomDistance } from '../src/scene/labMotion.js';

test('la netbook solo aparece después de la apertura completa, también al recorrer el cierre', () => {
  for (let time = 0; time <= TOTAL_DURATION; time += 5) {
    const pose = sequencePose(time);
    if (pose.book < 1) assert.equal(pose.netbook, 0);
    if (pose.netbook > 0) assert.equal(pose.book, 1);
  }
  const close = { from: TOTAL_DURATION, to: 0, duration: TOTAL_DURATION, start: 0 };
  assert.deepEqual(sequencePose(sampleSequence(close, 1100).time), { book: 1, netbook: 0 });
  assert.equal(sequencePose(BOOK_DURATION).netbook, 0);
  assert.deepEqual(sequencePose(TOTAL_DURATION), { book: 1, netbook: 1 });
});

test('la secuencia se puede revertir al emerger y finalizar sin animación', () => {
  const opening = { from: 0, to: TOTAL_DURATION, start: 10, duration: TOTAL_DURATION };
  const current = sampleSequence(opening, 3010).time;
  const reverse = { from: current, to: 0, start: 3010, duration: current };
  assert.equal(sampleSequence(reverse, 3010).time, current);
  assert.equal(sampleSequence(reverse, 10000).time, 0);
  assert.equal(sampleSequence({ ...opening, duration: 0 }, 10).time, TOTAL_DURATION);
  assert.equal(sampleSequence({ ...reverse, duration: 0 }, 3010).time, 0);
});

test('la rotación de Netbook3D se limita y Vista inicial recupera la pose original', () => {
  const netbook = new Netbook3D();
  assert.deepEqual(netbook.rotate(500, -500), { yaw: 35, tilt: -8 });
  assert.deepEqual(netbook.rotate(-500, 500), { yaw: -35, tilt: 8 });
  assert.deepEqual(netbook.resetView(), { yaw: -12, tilt: 0 });
  netbook.setEmergence(0);
  assert.equal(netbook.group.visible, false);
  netbook.setEmergence(1);
  assert.equal(netbook.group.visible, true);
  netbook.dispose();
});

test('la carcasa queda sobre la página durante la aparición y en los límites de rotación', () => {
  const netbook = new Netbook3D();
  for (let step = 0; step <= 20; step++) for (const yaw of [-35, 0, 35]) for (const tilt of [-8, 8]) {
    netbook.setEmergence(step / 20);
    netbook.rotate(yaw, tilt);
    netbook.group.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(netbook.pivot);
    assert.ok(bounds.min.y > 0, `La carcasa debe quedar sobre el montaje: ${bounds.min.y}`);
  }
  netbook.dispose();
});

test('el contrato de reemplazo admite un Object3D, normaliza sus límites y libera la geometría anterior', () => {
  const netbook = new Netbook3D();
  const previousGeometries = new Set();
  netbook.model.traverse((object) => { if (object.geometry) previousGeometries.add(object.geometry); });
  let disposed = 0;
  previousGeometries.forEach((geometry) => geometry.addEventListener('dispose', () => disposed++));
  const replacement = new THREE.Group();
  replacement.add(new THREE.Mesh(new THREE.BoxGeometry(100, 50, 10), new THREE.MeshStandardMaterial()));
  netbook.setModel(replacement);
  assert.equal(disposed, previousGeometries.size);
  netbook.rotate(0, 0);
  netbook.setEmergence(1);
  netbook.group.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(netbook.pivot);
  const size = bounds.getSize(new THREE.Vector3());
  assert.ok(size.x <= 2.150001 && size.y <= 1.600001 && size.z <= 1.850001);
  const current = netbook.model;
  assert.throws(() => netbook.setModel(new THREE.Group()), /volumen/);
  assert.equal(netbook.model, current);
  netbook.dispose();
});

test('el zoom conserva límites seguros y se adapta a pantallas angostas', () => {
  for (const aspect of [0.5, 0.8, 1, 1.8, 3]) {
    const limits = netbookCameraLimits(aspect);
    assert.ok(limits.min >= 3.6 && limits.max > limits.min);
    assert.equal(netbookZoomDistance(-500, aspect), limits.max);
    assert.ok(Math.abs(netbookZoomDistance(500, aspect) - limits.min) < 1e-10);
    for (let percent = 0; percent <= 100; percent++) {
      const distance = netbookZoomDistance(percent, aspect);
      assert.ok(distance >= limits.min - 1e-10 && distance <= limits.max);
    }
  }
});

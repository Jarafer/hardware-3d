import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { components, schematicNotice, handlingNotice } from '../src/education/components.js';
import { InternalView } from '../src/scene/InternalView.js';

function createFixture() {
  const view = new InternalView(components);
  const mount = new THREE.Group();
  mount.position.set(1.35, 0.26, 0);
  mount.add(view.group);
  view.group.visible = true;
  return view;
}
function cameraFor(view, aspect = 1.6) {
  const camera = new THREE.PerspectiveCamera(37, aspect, 0.1, 60);
  const destination = view.cameraView(aspect);
  camera.position.copy(destination.focus).add(new THREE.Vector3().setFromSpherical(destination.pose));
  camera.lookAt(destination.focus);
  camera.updateMatrixWorld(true);
  return camera;
}

test('los cuatro IDs educativos son estables y se vinculan a objetos 3D reales', () => {
  assert.deepEqual(components.map((entry) => entry.id), ['ram', 'almacenamiento', 'placa-madre', 'refrigeracion']);
  const view = createFixture();
  assert.equal(view.entries.size, 4);
  for (const info of components) {
    const entry = view.entries.get(info.id);
    assert.equal(entry.info, info);
    assert.ok(entry.object.isGroup);
    assert.ok(info.function.length > 30 && info.precautions.length >= 2 && info.question.endsWith('?'));
    assert.ok(!new THREE.Box3().setFromObject(entry.object).isEmpty());
  }
  assert.match(schematicNotice, /esquemático/);
  assert.match(schematicNotice, /modelo real/);
  assert.match(handlingNotice, /manual del fabricante/);
  view.dispose();
});

test('Raycaster selecciona cada una de las cuatro piezas desde la vista general', () => {
  const view = createFixture();
  const camera = cameraFor(view);
  for (const { id, object } of view.entries.values()) {
    const point = object.localToWorld(new THREE.Vector3(0, 0.15, 0)).project(camera);
    assert.equal(view.pick(camera, new THREE.Vector2(point.x, point.y)), id);
  }
  assert.equal(view.pick(camera, new THREE.Vector2(0.99, 0.99)), null);
  view.group.visible = false;
  assert.equal(view.pick(camera, new THREE.Vector2(0, 0)), null);
  view.dispose();
});

test('cada selección resalta solo su pieza y la vista general elimina el resaltado', () => {
  const view = createFixture();
  for (let cycle = 0; cycle < 4; cycle++) for (const info of components) {
    assert.equal(view.select(info.id), true);
    assert.equal(view.selectedId, info.id);
    assert.deepEqual([...view.entries.values()].filter((entry) => entry.outline.visible).map((entry) => entry.id), [info.id]);
  }
  assert.equal(view.select('pieza-inexistente'), false);
  assert.equal(view.selectedId, 'refrigeracion');
  view.select(null);
  assert.ok([...view.entries.values()].every((entry) => !entry.outline.visible));
  view.dispose();
});

test('los encuadres generales y de detalle quedan por encima de la geometría', () => {
  const view = createFixture();
  for (const id of [null, ...components.map((info) => info.id)]) for (const aspect of [0.8, 1, 1.8, 3]) {
    view.select(id);
    const destination = view.cameraView(aspect);
    const camera = cameraFor(view, aspect);
    const bounds = new THREE.Box3().setFromObject(view.group);
    assert.ok(destination.pose.radius >= 1.9 && destination.pose.radius <= 7);
    assert.ok(camera.position.y > bounds.max.y + 0.4);
  }
  view.dispose();
});

test('los marcadores proyectados conservan los IDs de la selección', () => {
  const view = createFixture();
  const markers = view.markers(cameraFor(view));
  assert.deepEqual(markers.map((marker) => marker.id), components.map((info) => info.id));
  assert.ok(markers.every((marker) => marker.visible && marker.x > 0 && marker.x < 100 && marker.y > 0 && marker.y < 100));
  view.dispose();
});

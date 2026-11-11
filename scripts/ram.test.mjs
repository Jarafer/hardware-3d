import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Ram3D } from '../src/scene/Ram3D.js';
import { ramParts, ramLesson, bookIndex, ramReflectionFeedback } from '../src/education/ramContent.js';
import { measureResources } from '../src/scene/resourceAudit.js';
import { createBook } from '../src/scene/createBook.js';
import { bookContent } from '../src/education/bookContent.js';

test('cada entrada impresa en la página del libro selecciona su parte por Raycaster', () => {
  // Canvas simulado solo para crear texturas en Node; mallas, UV y rayos son reales.
  const previousDocument = globalThis.document;
  const context = new Proxy({}, { get: (_, key) => key === 'measureText' ? text => ({ width: text.length * 12 }) : () => {} });
  globalThis.document = { createElement: () => ({ getContext: () => context }) };
  let book;
  try {
    book = createBook(bookContent); book.setProgress(1); book.setChapter('ram');
    let page; book.group.traverse(object => { if (object.material?.map === book.textures[3]) page = object; });
    assert.ok(page);
    for (let index = 0; index < ramParts.length; index++) {
      const v = 1 - (193 + index * 77 + 35) / 768;
      const point = page.localToWorld(new THREE.Vector3(0, (v - 0.5) * 3.52, 0));
      const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 60); camera.up.set(0, 0, -1);
      camera.position.copy(point).add(new THREE.Vector3(0, 4, 0)); camera.lookAt(point); camera.updateMatrixWorld();
      assert.equal(book.pickRamGuide(camera, new THREE.Vector2()), ramParts[index].id);
      book.setChapter('overview'); assert.equal(book.pickRamGuide(camera, new THREE.Vector2()), null); book.setChapter('ram');
    }
  } finally {
    if (book) {
      book.dispose(); const resources = new Set();
      book.group.traverse(object => { if (object.geometry) resources.add(object.geometry); if (object.material) resources.add(object.material); });
      resources.forEach(resource => resource.dispose());
    }
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
});

test('las seis partes educativas se vinculan al modelo, y el índice no habilita capítulos futuros', () => {
  const ram = new Ram3D();
  assert.deepEqual([...ram.entries.keys()], ramParts.map(part => part.id));
  assert.deepEqual(bookIndex.filter(chapter => chapter.available).map(chapter => chapter.id), ['overview', 'ram', 'micro', 'motherboard', 'storage', 'connectors', 'flex', 'keyboard', 'safety', 'diagnostic', 'bibliography']);
  assert.equal(ram.select('inventada'), false);
  for (const part of ramParts) {
    assert.equal(ram.select(part.id), true);
    for (const [id, entry] of ram.entries) assert.equal(entry.material.emissiveIntensity, id === part.id ? 0.38 : 0);
  }
  ram.dispose();
});

test('RAM: cincuenta giros y apariciones se restablecen sin acumular poses y sin atravesar la página', () => {
  const ram = new Ram3D();
  for (let i = 0; i < 50; i++) {
    ram.setEmergence(1); ram.rotate(i * 371); assert.ok(ram.yaw >= 0 && ram.yaw < 360);
    const bounds = new THREE.Box3().setFromObject(ram.group); assert.ok(bounds.min.y >= 0);
    ram.setEmergence(0); assert.equal(ram.group.visible, false);
  }
  ram.reset(); assert.equal(ram.yaw, 12); assert.equal(ram.selectedId, null); ram.dispose();
});

test('RAM: el modelo completo cabe en móvil y escritorio durante todo el giro', () => {
  const ram = new Ram3D(); ram.setEmergence(1);
  for (const aspect of [0.5, 0.74, 1, 1.8, 3]) for (let yaw = 0; yaw < 360; yaw += 30) {
    ram.rotate(yaw); ram.group.updateMatrixWorld(true);
    const { focus, pose } = ram.cameraView(aspect);
    const camera = new THREE.PerspectiveCamera(37, aspect, 0.1, 60);
    camera.position.copy(focus).add(new THREE.Vector3().setFromSpherical(pose)); camera.lookAt(focus); camera.updateMatrixWorld();
    const bounds = new THREE.Box3().setFromObject(ram.group);
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      const p = new THREE.Vector3(x, y, z).project(camera); assert.ok(Math.abs(p.x) < 1 && Math.abs(p.y) < 1 && Math.abs(p.z) < 1);
    }
  }
  ram.dispose();
});

test('el Raycaster identifica la placa y la etiqueta desde el frente del módulo', () => {
  const ram = new Ram3D(); ram.setEmergence(1); ram.rotate(0); ram.group.updateMatrixWorld(true);
  for (const [id, local] of [['pcb', new THREE.Vector3(-1, 0.72, 0)], ['etiqueta', new THREE.Vector3(0.30, 0.65, 0.09)], ['etiqueta', new THREE.Vector3(0.01, 0.57, 0.10)]]) {
    const focus = ram.pivot.localToWorld(local);
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 60); camera.position.copy(focus).add(new THREE.Vector3(0, 0, 4)); camera.lookAt(focus); camera.updateMatrixWorld();
    assert.equal(ram.pick(camera, new THREE.Vector2()), id);
  }
  ram.dispose();
});

test('RAM comparte geometrías y libera cada recurso una vez en veinte reconstrucciones', () => {
  for (let cycle = 0; cycle < 20; cycle++) {
    const ram = new Ram3D(); const resources = new Set();
    assert.ok(measureResources(ram.group).meshes <= 10, 'chips y contactos se dibujan con instancias');
    ram.group.traverse(object => { if (object.geometry) resources.add(object.geometry); if (object.material) resources.add(object.material); });
    const counts = new Map(); resources.forEach(resource => resource.addEventListener('dispose', () => counts.set(resource, (counts.get(resource) ?? 0) + 1)));
    ram.dispose(); resources.forEach(resource => assert.equal(counts.get(resource), 1));
  }
});

test('la reflexión pide fundamento sin certificar un diagnóstico, y las cifras se identifican como ficticias', () => {
  assert.equal(ramReflectionFeedback('breve', 'breve').complete, false);
  const feedback = ramReflectionFeedback('La ocupación aumentó al abrir aplicaciones.', 'La carga de trabajo puede explicar los datos; hace falta contrastar.');
  assert.equal(feedback.complete, true); assert.match(feedback.text, /No se evaluó automáticamente/);
  assert.match(ramLesson.labelNotice, /ficticia/); assert.match(ramLesson.caution, /varias causas/);
});

test('las referencias numeradas siguen el giro, mantienen sus IDs y ocultan la etiqueta en el reverso', () => {
  const ram = new Ram3D();
  assert.deepEqual(ram.markers(new THREE.PerspectiveCamera()), []);
  ram.setEmergence(1);
  const parent = new THREE.Group(); parent.position.set(1.35, 0.26, 0); parent.add(ram.group);
  const camera = new THREE.PerspectiveCamera(37, 0.75, 0.1, 60);
  const { focus, pose } = ram.cameraView(0.75);
  camera.position.copy(focus).add(new THREE.Vector3().setFromSpherical(pose)); camera.lookAt(focus); camera.updateMatrixWorld();
  ram.rotate(0);
  const front = ram.markers(camera);
  assert.deepEqual(front.map(marker => marker.id), ramParts.map(part => part.id));
  assert.equal(front.length, 6); assert.ok(front.every(marker => marker.visible && Number.isFinite(marker.x) && Number.isFinite(marker.y)));
  ram.rotate(180);
  const back = ram.markers(camera);
  assert.equal(back.find(marker => marker.id === 'etiqueta').visible, false);
  assert.ok(back.filter(marker => marker.id !== 'etiqueta').every(marker => marker.visible));
  assert.notEqual(back.find(marker => marker.id === 'chips').x, front.find(marker => marker.id === 'chips').x);
  ram.dispose();
});

test('las referencias frontales señalan partes que realmente selecciona el Raycaster', () => {
  const ram = new Ram3D(); ram.setEmergence(1); ram.rotate(0);
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 60);
  camera.position.set(0, 0.6, 5); camera.lookAt(0, 0.6, 0); camera.updateMatrixWorld();
  for (const marker of ram.markers(camera)) {
    assert.equal(ram.pick(camera, new THREE.Vector2(marker.x / 50 - 1, 1 - marker.y / 50)), marker.id, marker.id);
  }
  ram.dispose();
});

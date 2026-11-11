import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Netbook3D, disposeModel } from '../src/scene/Netbook3D.js';
import { InternalView } from '../src/scene/InternalView.js';
import { components } from '../src/education/components.js';
import { measureResources } from '../src/scene/resourceAudit.js';
import { netbookCameraLimits } from '../src/scene/labMotion.js';

test('la netbook completa cabe en el encuadre más cercano en móvil y escritorio, incluidos los giros extremos', () => {
  const model = new Netbook3D();
  model.setEmergence(1);
  const focus = new THREE.Vector3(0, 0.74, 0);
  for (const aspect of [0.5, 279 / 380, 0.9, 1.8, 3]) {
    const camera = new THREE.PerspectiveCamera(37, aspect, 0.1, 60);
    camera.position.copy(focus).add(new THREE.Vector3().setFromSpherical(new THREE.Spherical(netbookCameraLimits(aspect).min, 1, 0.34)));
    camera.lookAt(focus); camera.updateMatrixWorld();
    for (const yaw of [-35, -12, 35]) for (const tilt of [-8, 0, 8]) {
      model.rotate(yaw, tilt); model.group.updateMatrixWorld(true);
      model.model.traverse(object => {
        if (!object.geometry) return;
        const positions = object.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const p = new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld).project(camera);
          assert.ok(Math.abs(p.x) < 1 && Math.abs(p.y) < 1 && Math.abs(p.z) < 1, `Fuera del encuadre: ${aspect}, ${yaw}, ${tilt}`);
        }
      });
    }
  }
  model.dispose();
});

test('el inventario cuenta una sola vez recursos compartidos, incluidos buffers de instancias', () => {
  const root = new THREE.Group();
  const geometry = new THREE.BoxGeometry();
  const texture = new THREE.Texture({ width: 8, height: 8 });
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.InstancedMesh(geometry, material, 3);
  root.add(mesh, new THREE.Mesh(geometry, material));
  const measured = measureResources(root);
  assert.equal(measured.geometries, 1);
  assert.equal(measured.materials, 1);
  assert.equal(measured.textures, 1);
  assert.equal(measured.textureBytesEstimate, Math.ceil(8 * 8 * 4 * 4 / 3));
  const bytes = Object.values(geometry.attributes).reduce((n, a) => n + a.array.byteLength, geometry.index.array.byteLength);
  assert.equal(measured.geometryArrayBytes, bytes + mesh.instanceMatrix.array.byteLength);
  disposeModel(root);
});

for (const [name, create] of [['netbook', () => new Netbook3D()], ['esquema interno', () => new InternalView(components)]]) {
  test(`${name}: veinte construcciones y liberaciones conservan el inventario y liberan cada recurso una vez`, () => {
    let first;
    for (let cycle = 0; cycle < 20; cycle++) {
      const model = create();
      const inventory = measureResources(model.group);
      first ??= inventory;
      assert.deepEqual(inventory, first);
      assert.ok(inventory.geometries < inventory.meshes, 'se comparten geometrías');
      const resources = new Set();
      model.group.traverse(object => {
        if (object.geometry) resources.add(object.geometry);
        for (const material of [object.material ?? []].flat()) resources.add(material);
      });
      const events = new Map();
      for (const resource of resources) resource.addEventListener('dispose', () => events.set(resource, (events.get(resource) ?? 0) + 1));
      model.dispose();
      for (const resource of resources) assert.equal(events.get(resource), 1);
      assert.equal(model.group.parent, null);
    }
  });
}

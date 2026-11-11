import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { clamp, emergencePose, NETBOOK_LIMITS } from './labMotion.js';

// Libera recursos propios también al sustituir la geometría por la escena de un GLB.
export function disposeModel(root) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  root.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of [object.material ?? []].flat()) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
    if (object.isInstancedMesh) object.dispose();
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

export function createProceduralNetbook() {
  const root = new THREE.Group();
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  root.name = 'Netbook procedural — carcasa exterior';
  const matte = (color, roughness = 0.83) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.12 });
  const shell = matte(0x232b34);
  const deck = matte(0x38414a);
  const black = matte(0x10161d);
  const detail = matte(0x66717a);
  const keysMaterial = matte(0x1c232b);
  const legendMaterial = new THREE.MeshBasicMaterial({ color: 0xa5afb4 });
  function box(parent, width, height, depth, x, y, z, material, radius = 0) {
    const geometry = radius ? new RoundedBoxGeometry(width, height, depth, 2, radius) : unitBox;
    const mesh = new THREE.Mesh(geometry, material);
    if (!radius) mesh.scale.set(width, height, depth);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  box(root, 2.16, 0.13, 1.48, 0, 0.09, 0, shell, 0.045);
  box(root, 2.12, 0.025, 1.44, 0, 0.158, 0, deck, 0.012);
  box(root, 1.9, 0.008, 0.79, 0, 0.176, -0.14, black, 0.003);
  // Teclas y leyendas instanciadas: dos draw calls para todo el bloque alfanumérico.
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.135, 0.025, 0.115), keysMaterial, 60);
  const legends = new THREE.InstancedMesh(new THREE.BoxGeometry(0.034, 0.001, 0.012), legendMaterial, 60);
  keys.castShadow = true;
  const dummy = new THREE.Object3D();
  for (let row = 0; row < 5; row++) for (let col = 0; col < 12; col++) {
    const index = row * 12 + col;
    dummy.position.set(-0.845 + col * 0.153, 0.198, -0.435 + row * 0.14);
    dummy.updateMatrix();
    keys.setMatrixAt(index, dummy.matrix);
    dummy.position.y += 0.013;
    dummy.position.z -= 0.018;
    dummy.updateMatrix();
    legends.setMatrixAt(index, dummy.matrix);
  }
  root.add(keys, legends);
  box(root, 0.74, 0.026, 0.10, 0, 0.199, 0.27, keysMaterial, 0.005);
  box(root, 0.65, 0.007, 0.28, 0, 0.176, 0.50, detail, 0.003);
  box(root, 0.625, 0.008, 0.255, 0, 0.181, 0.50, shell, 0.003);
  box(root, 0.59, 0.003, 0.006, 0, 0.187, 0.58, detail);
  box(root, 0.006, 0.003, 0.042, 0, 0.188, 0.608, detail);
  const hinge = new THREE.Group();
  hinge.name = 'Conjunto de pantalla y bisagras';
  hinge.position.set(0, 0.19, -0.65);
  hinge.rotation.x = -0.22;
  root.add(hinge);
  box(hinge, 2.13, 1.32, 0.075, 0, 0.65, 0, shell, 0.028);
  box(hinge, 1.94, 1.12, 0.012, 0, 0.67, 0.041, black, 0.005);
  const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x193746 });
  box(hinge, 1.86, 1.045, 0.003, 0, 0.675, 0.049, screenMaterial);
  // Gráfico de pantalla discreto; no representa un sistema operativo ni una actividad.
  const blue = new THREE.MeshBasicMaterial({ color: 0x437e90 });
  const pale = new THREE.MeshBasicMaterial({ color: 0x90b4b7 });
  box(hinge, 1.86, 0.058, 0.002, 0, 1.168, 0.052, blue);
  box(hinge, 0.48, 0.35, 0.002, 0, 0.75, 0.052, blue);
  box(hinge, 0.40, 0.27, 0.002, 0, 0.75, 0.054, screenMaterial);
  for (const [width, y] of [[0.72, 0.43], [0.47, 0.36]]) box(hinge, width, 0.018, 0.002, 0, y, 0.052, pale);
  for (const x of [-0.82, 0.82]) {
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.30, 12), detail);
    cylinder.rotation.z = Math.PI / 2;
    cylinder.position.set(x, 0.19, -0.64);
    cylinder.castShadow = true;
    root.add(cylinder);
  }
  const webcam = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), black);
  webcam.position.set(0, 1.267, 0.045);
  hinge.add(webcam);
  // Puertos exteriores representativos: USB, vídeo, red, audio y alimentación.
  for (const [side, z, length, height] of [[-1, -0.36, 0.15, 0.045], [-1, 0, 0.15, 0.045], [-1, 0.35, 0.20, 0.05], [1, -0.32, 0.19, 0.075], [1, 0.05, 0.15, 0.045]]) {
    box(root, 0.012, height + 0.012, length + 0.014, side * 1.078, 0.09, z, detail);
    box(root, 0.014, height, length, side * 1.085, 0.09, z, black);
    if (height < 0.06) box(root, 0.016, 0.012, length * 0.65, side * 1.088, 0.085, z, deck);
  }
  for (const z of [0.37, 0.52]) {
    const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.012, 12), black);
    jack.rotation.z = Math.PI / 2;
    jack.position.set(1.082, 0.085, z);
    root.add(jack);
  }
  const vent = new THREE.InstancedMesh(new THREE.BoxGeometry(0.006, 0.026, 0.045), black, 12);
  for (let i = 0; i < 12; i++) { dummy.position.set(-1.079, 0.09, -0.56 + i * 0.011); dummy.updateMatrix(); vent.setMatrixAt(i, dummy.matrix); }
  root.add(vent);
  for (let i = 0; i < 3; i++) {
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.009, 0.006), new THREE.MeshBasicMaterial({ color: i === 0 ? 0x44846e : 0x71828a }));
    led.position.set(0.73 + i * 0.07, 0.10, 0.742);
    root.add(led);
  }
  for (const x of [-0.8, 0.8]) for (const z of [-0.5, 0.5]) box(root, 0.17, 0.025, 0.1, x, 0.0125, z, black, 0.006);
  root.updateMatrixWorld(true);
  return root;
}

export class Netbook3D {
  constructor({ model = createProceduralNetbook() } = {}) {
    this.group = new THREE.Group();
    this.group.name = 'Netbook3D — aparición pop-up';
    this.pivot = new THREE.Group();
    this.pivot.name = 'Rotación limitada de la netbook';
    this.group.add(this.pivot);
    this.supports = new THREE.Group();
    this.supports.name = 'Pliegues de papel del montaje pop-up';
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0xe6d6b4, roughness: 1, side: THREE.DoubleSide });
    for (const x of [-0.63, 0.63]) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute([x, 0, -0.30, x, 0, 0.30, x, -0.18, 0], 3));
      geometry.computeVertexNormals();
      const support = new THREE.Mesh(geometry, supportMaterial);
      support.castShadow = true;
      this.supports.add(support);
    }
    this.group.add(this.supports);
    this.setModel(model);
    this.resetView();
    this.setEmergence(0);
  }
  // Contrato GLB: recibir gltf.scene (Object3D), Y arriba y frente hacia +Z.
  // Se toma propiedad de sus recursos y se normaliza a una envolvente segura.
  setModel(model) {
    if (!model?.isObject3D || model === this.group || model === this.pivot || model.parent) throw new Error('El modelo debe ser un Object3D independiente y sin padre.');
    const wrapper = new THREE.Group();
    wrapper.add(model);
    wrapper.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(wrapper);
    const size = bounds.getSize(new THREE.Vector3());
    if (bounds.isEmpty() || !Number.isFinite(size.length()) || Math.min(size.x, size.y, size.z) <= 0) { wrapper.remove(model); throw new Error('El modelo necesita volumen y límites válidos.'); }
    const scale = Math.min(2.15 / size.x, 1.6 / size.y, 1.85 / size.z);
    const center = bounds.getCenter(new THREE.Vector3());
    wrapper.scale.setScalar(scale);
    wrapper.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
    if (this.model) { this.pivot.remove(this.model); disposeModel(this.model); }
    this.model = wrapper;
    this.pivot.add(wrapper);
  }
  setEmergence(progress) {
    const pose = emergencePose(progress);
    this.group.visible = pose.visible;
    this.group.scale.setScalar(pose.scale);
    this.group.position.y = pose.height;
    this.group.rotation.set(pose.tilt, pose.yaw, 0);
  }
  rotate(yaw, tilt) {
    this.yaw = clamp(yaw, ...NETBOOK_LIMITS.yaw);
    this.tilt = clamp(tilt, ...NETBOOK_LIMITS.tilt);
    this.pivot.rotation.set(THREE.MathUtils.degToRad(this.tilt), THREE.MathUtils.degToRad(this.yaw), 0, 'YXZ');
    return { yaw: this.yaw, tilt: this.tilt };
  }
  resetView() { return this.rotate(-12, 0); }
  dispose() { this.group.removeFromParent(); disposeModel(this.model); disposeModel(this.supports); this.group.clear(); }
}

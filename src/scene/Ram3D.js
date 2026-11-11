import * as THREE from 'three';
import { disposeModel } from './Netbook3D.js';
import { clamp } from './labMotion.js';

export class Ram3D {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'RAM SO-DIMM — representación didáctica';
    this.pivot = new THREE.Group();
    this.group.add(this.pivot);
    this.entries = new Map();
    this.raycaster = new THREE.Raycaster();
    const box = new THREE.BoxGeometry(1, 1, 1);
    const colors = { pcb: 0x27624e, chips: 0x303945, contactos: 0xc6a05b, muesca: 0xd49b46, etiqueta: 0xf0e5ce, retencion: 0xb08b49 };
    for (const [id, color] of Object.entries(colors)) {
      const object = new THREE.Group();
      const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: id === 'contactos' ? 0.35 : 0.04 });
      this.entries.set(id, { object, material }); this.pivot.add(object);
    }
    const instances = { chips: [], contactos: [], labelBars: [] };
    const add = (id, x, y, z, w, h, d) => {
      if (instances[id]) { instances[id].push([x, y, z, w, h, d]); return; }
      const entry = this.entries.get(id); const mesh = new THREE.Mesh(box, entry.material);
      mesh.position.set(x, y, z); mesh.scale.set(w, h, d); mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.userData.ramPartId = id; entry.object.add(mesh); return mesh;
    };
    // La abertura de la muesca es geometría real; no una marca pintada.
    const shape = new THREE.Shape();
    shape.moveTo(-1.08, 0.08); shape.lineTo(-0.27, 0.08); shape.lineTo(-0.27, 0.19);
    shape.lineTo(-0.16, 0.19); shape.lineTo(-0.16, 0.08); shape.lineTo(1.08, 0.08);
    shape.lineTo(1.08, 0.34); shape.lineTo(1.02, 0.34); shape.lineTo(1.02, 0.43); shape.lineTo(1.08, 0.43);
    shape.lineTo(1.08, 0.76); shape.lineTo(-1.08, 0.76); shape.lineTo(-1.08, 0.43);
    shape.lineTo(-1.02, 0.43); shape.lineTo(-1.02, 0.34); shape.lineTo(-1.08, 0.34); shape.closePath();
    const board = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.045, bevelEnabled: false }), this.entries.get('pcb').material);
    board.position.z = -0.0225; board.castShadow = true; board.receiveShadow = true; board.userData.ramPartId = 'pcb'; this.entries.get('pcb').object.add(board);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) add('chips', -0.77 + i * 0.51, 0.46, side * 0.052, 0.38, 0.32, 0.055);
      for (let i = 0; i < 48; i++) { const x = -1.025 + i * 0.0435; if (x > -0.29 && x < -0.14) continue; add('contactos', x, 0.125, side * 0.026, 0.027, 0.085, 0.008); }
    }
    add('etiqueta', 0.30, 0.57, 0.085, 0.75, 0.20, 0.012);
    for (let i = 0; i < 14; i++) add('labelBars', 0.01 + i * 0.043, 0.57, 0.095, i % 3 ? 0.008 : 0.017, 0.10, 0.004);
    add('muesca', -0.215, 0.198, 0, 0.11, 0.014, 0.055);
    // Soportes de papel separados de las partes educativas: no son etiquetas del módulo.
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0xf0e5ce, roughness: 1 });
    for (const x of [-0.65, 0.65]) { const support = new THREE.Mesh(box, supportMaterial); support.position.set(x, 0.025, 0); support.scale.set(0.15, 0.05, 0.48); this.group.add(support); }
    for (const x of [-1.02, 1.02]) add('retencion', x, 0.385, 0, 0.012, 0.09, 0.052);
    this.anchors = new Map([
      ['pcb', [-0.91, 0.69, 0.03]], ['chips', [-0.77, 0.46, 0.09]], ['contactos', [0.70, 0.125, 0.035]],
      ['muesca', [-0.215, 0.198, 0.03]], ['etiqueta', [0.30, 0.66, 0.10]], ['retencion', [1.02, 0.385, 0.03]],
    ]);
    const transform = new THREE.Object3D();
    for (const [id, poses] of Object.entries(instances)) {
      const partId = id === 'labelBars' ? 'etiqueta' : id;
      const material = id === 'labelBars' ? new THREE.MeshStandardMaterial({ color: 0x303945, roughness: 1 }) : this.entries.get(id).material;
      const mesh = new THREE.InstancedMesh(box, material, poses.length);
      poses.forEach(([x, y, z, w, h, d], index) => { transform.position.set(x, y, z); transform.scale.set(w, h, d); transform.updateMatrix(); mesh.setMatrixAt(index, transform.matrix); });
      mesh.castShadow = true; mesh.receiveShadow = true; mesh.userData.ramPartId = partId;
      this.entries.get(partId).object.add(mesh);
    }
    this.reset(); this.setEmergence(0);
  }
  setEmergence(progress) {
    const p = clamp(progress, 0, 1); this.group.visible = p > 0;
    this.group.scale.setScalar(0.03 + 0.97 * p); this.group.position.y = 0.04 + 0.17 * p;
  }
  rotate(degrees) { this.yaw = ((degrees % 360) + 360) % 360; this.pivot.rotation.set(-0.15, THREE.MathUtils.degToRad(this.yaw), 0); }
  reset() { this.rotate(12); this.select(null); }
  select(id) {
    if (id !== null && !this.entries.has(id)) return false;
    this.selectedId = id;
    for (const [key, entry] of this.entries) { entry.material.emissive.set(key === id ? 0x437e90 : 0); entry.material.emissiveIntensity = key === id ? 0.38 : 0; }
    return true;
  }
  pick(camera, point) {
    this.group.updateWorldMatrix(true, true); this.raycaster.setFromCamera(point, camera);
    return this.raycaster.intersectObject(this.pivot, true).find(hit => hit.object.userData.ramPartId)?.object.userData.ramPartId ?? null;
  }
  markers(camera) {
    if (!this.group.visible) return [];
    this.group.updateWorldMatrix(true, true);
    const front = this.pivot.worldToLocal(camera.getWorldPosition(new THREE.Vector3())).z >= 0;
    return [...this.anchors].map(([id, anchor]) => {
      const local = new THREE.Vector3(...anchor);
      if (!front && id !== 'etiqueta') local.z *= -1;
      const point = this.pivot.localToWorld(local).project(camera);
      return { id, x: (point.x + 1) * 50, y: (1 - point.y) * 50, visible: (front || id !== 'etiqueta') && Math.abs(point.x) < 1 && Math.abs(point.y) < 1 && Math.abs(point.z) < 1 };
    });
  }
  cameraView(aspect) {
    const focus = this.group.localToWorld(new THREE.Vector3(0, 0.40, 0));
    const angle = Math.atan(Math.tan(37 * Math.PI / 360) * Math.min(1, Math.max(0.3, aspect)));
    return { focus, pose: new THREE.Spherical(Math.max(4.5, 1.65 / Math.sin(angle)), 1.05, 0.04) };
  }
  dispose() { this.group.removeFromParent(); disposeModel(this.group); this.group.clear(); }
}

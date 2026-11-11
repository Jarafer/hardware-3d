import * as THREE from 'three';
import { disposeModel } from './Netbook3D.js';

export class InternalView {
  constructor(information) {
    this.group = new THREE.Group();
    this.group.name = 'Vista interna esquemática — ubicación ilustrativa';
    this.group.position.y = 0.22;
    this.group.visible = false;
    this.entries = new Map();
    this.raycaster = new THREE.Raycaster();
    const unitBox = new THREE.BoxGeometry(1, 1, 1);
    const material = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.06 });
    function box(parent, width, height, depth, x, y, z, surface) {
      const mesh = new THREE.Mesh(unitBox, surface);
      mesh.scale.set(width, height, depth);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }
    box(this.group, 2.32, 0.07, 1.97, 0, 0.035, 0, material(0x303945));
    box(this.group, 2.22, 0.014, 1.87, 0, 0.078, 0, material(0xd0bd96));
    const builders = {
      ram: (part, base) => {
        box(part, 0.70, 0.035, 0.26, 0, 0.12, 0, base);
        const dark = material(0x303945);
        const gold = material(0xc6a477);
        for (let i = 0; i < 3; i++) box(part, 0.13, 0.025, 0.13, -0.22 + i * 0.22, 0.15, -0.02, dark);
        for (let i = 0; i < 12; i++) box(part, 0.028, 0.007, 0.045, -0.30 + i * 0.054, 0.142, 0.11, gold);
        return [0.70, 0.19, 0.28];
      },
      storage: (part, base) => {
        box(part, 0.70, 0.10, 0.52, 0, 0.14, 0, base);
        box(part, 0.56, 0.008, 0.34, 0, 0.194, 0, material(0xddd8c5));
        const ink = material(0x303945);
        for (let i = 0; i < 3; i++) box(part, 0.34 - i * 0.055, 0.002, 0.012, 0, 0.20, -0.07 + i * 0.06, ink);
        box(part, 0.05, 0.04, 0.22, -0.37, 0.14, 0, material(0xc6a477));
        return [0.79, 0.23, 0.55];
      },
      motherboard: (part, base) => {
        box(part, 1.10, 0.045, 1.48, 0, 0.11, 0, base);
        const dark = material(0x303945);
        const metal = material(0xb2b2a0);
        box(part, 0.36, 0.05, 0.36, -0.08, 0.155, -0.28, dark);
        box(part, 0.27, 0.007, 0.27, -0.08, 0.184, -0.28, metal);
        for (let i = 0; i < 4; i++) box(part, 0.12, 0.027, 0.18, -0.32 + i * 0.20, 0.15, 0.37, dark);
        for (let i = 0; i < 5; i++) box(part, 0.017, 0.003, 0.42, 0.19 + i * 0.047, 0.136, -0.16, metal);
        box(part, 0.73, 0.03, 0.07, 0, 0.15, 0.63, dark);
        return [1.13, 0.23, 1.51];
      },
      cooling: (part, base) => {
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.07, 24), base);
        housing.position.y = 0.14;
        part.add(housing);
        const dark = material(0x303945);
        const blades = material(0x9cabb0);
        const center = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.035, 16), dark);
        center.position.y = 0.205;
        part.add(center);
        for (let i = 0; i < 8; i++) {
          const angle = i * Math.PI / 4;
          const blade = box(part, 0.07, 0.015, 0.16, Math.sin(angle) * 0.14, 0.19, Math.cos(angle) * 0.14, blades);
          blade.rotation.y = angle + 0.4;
        }
        box(part, 0.16, 0.05, 0.12, -0.31, 0.14, 0, base);
        return [0.73, 0.25, 0.57];
      },
    };
    const positions = { ram: [0.62, -0.68], storage: [0.62, 0.57], motherboard: [-0.49, 0], cooling: [0.62, -0.07] };
    for (const info of information) {
      if (!builders[info.objectKey] || this.entries.has(info.id)) throw new Error('Identificador de componente desconocido o duplicado.');
      const object = new THREE.Group();
      object.name = info.name;
      const [x, z] = positions[info.objectKey];
      object.position.set(x, 0, z);
      const dimensions = builders[info.objectKey](object, material(info.color));
      object.traverse((child) => { child.userData.componentId = info.id; });
      const outlineBox = new THREE.BoxGeometry(dimensions[0] + 0.035, dimensions[1], dimensions[2] + 0.035);
      const outline = new THREE.LineSegments(new THREE.EdgesGeometry(outlineBox), new THREE.LineBasicMaterial({ color: 0x437e90 }));
      outlineBox.dispose();
      outline.position.y = 0.14;
      outline.visible = false;
      object.add(outline);
      this.group.add(object);
      this.entries.set(info.id, { id: info.id, info, object, outline });
    }
    this.selectedId = null;
  }
  select(id) {
    if (id !== null && !this.entries.has(id)) return false;
    this.selectedId = id;
    for (const entry of this.entries.values()) {
      const selected = entry.id === id;
      entry.outline.visible = selected;
      entry.object.traverse((object) => {
        if (object.material?.isMeshStandardMaterial) {
          object.material.emissive.set(selected ? 0x437e90 : 0x000000);
          object.material.emissiveIntensity = selected ? 0.23 : 0;
        }
      });
    }
    return true;
  }
  pick(camera, point) {
    if (!this.group.visible) return null;
    this.group.updateWorldMatrix(true, true);
    this.raycaster.setFromCamera(point, camera);
    const hits = this.raycaster.intersectObjects([...this.entries.values()].map((entry) => entry.object), true);
    return hits.find((hit) => this.entries.has(hit.object.userData.componentId))?.object.userData.componentId ?? null;
  }
  cameraView(aspect) {
    this.group.updateWorldMatrix(true, true);
    const entry = this.entries.get(this.selectedId);
    const focus = (entry?.object ?? this.group).localToWorld(new THREE.Vector3(0, 0.14, 0));
    const width = entry ? (entry.id === 'placa-madre' ? 1.9 : 1.4) : 2.9;
    const distance = Math.min(7, Math.max(entry ? 1.9 : 3.8, width / (2 * Math.tan(37 * Math.PI / 360) * aspect)));
    return { focus, pose: new THREE.Spherical(distance, 0.32, 0.06) };
  }
  markers(camera) {
    if (!this.group.visible) return [];
    this.group.updateWorldMatrix(true, true);
    return [...this.entries.values()].map((entry) => {
      const point = entry.object.localToWorld(new THREE.Vector3(0, 0.31, 0)).project(camera);
      return { id: entry.id, x: (point.x + 1) * 50, y: (1 - point.y) * 50, visible: Math.abs(point.x) < 1 && Math.abs(point.y) < 1 && Math.abs(point.z) < 1 };
    });
  }
  dispose() { this.group.removeFromParent(); disposeModel(this.group); }
}

import * as THREE from 'three';
import { bookPose, LEAF_COUNT } from './bookMotion.js';
import { createBookTexture, createRamGuideTexture } from './bookTextures.js';

export function createBook(content) {
  const group = new THREE.Group();
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  group.name = 'Libro de laboratorio';
  const coverMaterial = new THREE.MeshStandardMaterial({ color: 0x303e48, roughness: 0.87 });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xc6a477, roughness: 1 });
  const paperMaterial = new THREE.MeshStandardMaterial({ color: 0xeee0bd, roughness: 1 });
  const textures = ['cover', 'left', 'right'].map((kind) => createBookTexture(kind, content));
  const printed = textures.map((map) => new THREE.MeshStandardMaterial({ map, roughness: 1 }));
  const ramGuide = createRamGuideTexture(content.ramGuide ?? []);
  const ramTextures = [ramGuide.texture, createBookTexture('right', { ...content, ...content.ramPrint, page: '4 / MEMORIA RAM' })];
  textures.push(...ramTextures);
  function box(parent, width, thickness, length, x, y, material) {
    const mesh = new THREE.Mesh(unitBox, material);
    mesh.scale.set(width, thickness, length);
    mesh.position.set(x, y, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function print(parent, width, length, x, y, material, underside = false) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, length), material);
    mesh.position.set(x, y, 0);
    mesh.rotation.set(underside ? Math.PI / 2 : -Math.PI / 2, 0, underside ? Math.PI : 0);
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  const back = new THREE.Group();
  back.name = 'Contratapa';
  group.add(back);
  box(back, 2.7, 0.10, 3.8, 1.35, 0.1, coverMaterial);
  box(back, 2.52, 0.10, 3.58, 1.34, 0.20, paperMaterial);
  print(back, 2.48, 3.54, 1.34, 0.252, printed[2]);
  // Líneas del canto: geometría liviana que sigue visible con el libro cerrado.
  for (let i = 0; i < 7; i++) box(back, 0.009, 0.004, 3.56, 2.603, 0.16 + i * 0.013, edgeMaterial);
  const spine = new THREE.Group();
  spine.name = 'Lomo y encuadernación';
  group.add(spine);
  box(spine, 0.14, 0.45, 3.83, -0.035, 0.265, coverMaterial);
  for (const z of [-1.35, 1.35]) {
    const band = box(spine, 0.16, 0.47, 0.075, -0.035, 0.265, edgeMaterial);
    band.position.z = z;
  }
  const coverPivot = new THREE.Group();
  coverPivot.name = 'Pivote de tapa en el lomo';
  group.add(coverPivot);
  box(coverPivot, 2.7, 0.10, 3.8, 1.35, 0, coverMaterial);
  print(coverPivot, 2.61, 3.70, 1.35, 0.052, printed[0]);
  box(coverPivot, 2.51, 0.007, 3.58, 1.35, -0.054, paperMaterial);
  let guidePage;
  const guideRaycaster = new THREE.Raycaster();
  const leaves = Array.from({ length: LEAF_COUNT }, (_, index) => {
    const pivot = new THREE.Group();
    pivot.name = `Pivote de hoja ${index + 1} en el lomo`;
    pivot.position.y = 0.34;
    const y = 0.0625 - index * 0.025;
    // Fino grosor y holgura en el canal del lomo evitan caras coplanares y roces.
    box(pivot, 2.48, 0.022, 3.54, 1.35, y, paperMaterial);
    if (index === LEAF_COUNT - 1) guidePage = print(pivot, 2.46, 3.52, 1.35, y - 0.012, printed[1], true);
    group.add(pivot);
    return pivot;
  });
  // La netbook se monta aquí; la escena coordina su aparición después de las hojas.
  const objectMount = new THREE.Group();
  objectMount.name = 'Montaje pop-up de la netbook';
  objectMount.position.set(1.35, 0.26, 0);
  group.add(objectMount);
  function setProgress(progress) {
    const pose = bookPose(progress);
    coverPivot.rotation.z = pose.coverAngle;
    coverPivot.position.y = pose.coverHeight;
    leaves.forEach((leaf, index) => { leaf.rotation.z = pose.leafAngles[index]; });
    group.position.x = pose.offsetX;
    group.updateMatrixWorld(true);
  }
  setProgress(0);
  return { group, objectMount, setProgress, textures,
    selectRamPart: ramGuide.select,
    pickRamGuide(camera, point) {
      if (printed[1].map !== ramGuide.texture) return null;
      group.updateWorldMatrix(true, true); guideRaycaster.setFromCamera(point, camera);
      const hit = guideRaycaster.intersectObject(guidePage)[0]; if (!hit?.uv) return null;
      const x = hit.uv.x * 512; const y = (1 - hit.uv.y) * 768 - 193;
      if (x < 35 || x > 477 || y < 0 || y >= 6 * 77 || y % 77 > 69) return null;
      return content.ramGuide?.[Math.floor(y / 77)]?.id ?? null;
    },
    setChapter(id) { printed[1].map = id === 'ram' ? ramTextures[0] : textures[1]; printed[2].map = id === 'ram' ? ramTextures[1] : textures[2]; },
    dispose() { textures.forEach((texture) => texture.dispose()); } };
}

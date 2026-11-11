import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// El contorno se trazó sobre la foto superior. Las partes impresas no aportan medidas de altura.
const contour = [
  [16, 290], [24, 166], [28, 139], [35, 34], [44, 28], [197, 28],
  [202, 18], [291, 18], [299, 22], [488, 27], [496, 35], [498, 66],
  [503, 74], [503, 125], [492, 134], [500, 151], [500, 197], [493, 203],
  [499, 220], [500, 244], [490, 252], [496, 267], [495, 301], [486, 307],
  [494, 313], [493, 387], [438, 387], [436, 361], [344, 359], [344, 327],
  [130, 321], [20, 320], [15, 313],
];
const unit = 3.6 / 488;
const thickness = 0.049;

function shapeFor(points) {
  return new THREE.Shape(points.map(([x, y]) => new THREE.Vector2((x - 259) * unit, (203 - y) * unit)));
}

function photoGeometry(shape, rear) {
  const geometry = new THREE.ShapeGeometry(shape);
  const position = geometry.getAttribute('position');
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i) / unit + 259;
    const y = 203 - position.getY(i) / unit;
    if (rear) {
      // El borde de puertos de la foto posterior está arriba. Este mapeo
      // orienta ese borde a la izquierda al mirar la placa desde atrás.
      const photoX = 500 - (y - 18) * (453 / 369);
      const photoY = 63 + (503 - x) * (587 / 488);
      uv.setXY(i, photoX / 528, 1 - photoY / 677);
    } else {
      uv.setXY(i, x / 510, 1 - y / 406);
    }
  }
  return geometry;
}

function makeBoard(frontPhoto, rearPhoto) {
  const board = new THREE.Group();
  const front = new THREE.MeshBasicMaterial({ map: frontPhoto });
  const rear = new THREE.MeshBasicMaterial({ map: rearPhoto, side: THREE.BackSide });
  const pcb = new THREE.MeshBasicMaterial({ color: '#264635' });
  const dark = new THREE.MeshBasicMaterial({ color: '#253638' });
  const metal = new THREE.MeshBasicMaterial({ color: '#666f6a' });

  function solid(shape, depth, base, material) {
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }), material);
    mesh.position.z = base;
    board.add(mesh);
  }
  function surface(shape, z, material, isRear = false) {
    const mesh = new THREE.Mesh(photoGeometry(shape, isRear), material);
    mesh.position.z = z;
    board.add(mesh);
  }
  const plate = shapeFor(contour);
  solid(plate, thickness, -thickness / 2, pcb);
  surface(plate, thickness / 2 + 0.001, front);
  surface(plate, -thickness / 2 - 0.001, rear, true);

  // Relieves aproximados de los elementos visibles en la cara superior.
  for (const [x0, y0, x1, y1, depth, material] of [
    [210, 105, 290, 183, 0.018, dark],
    [126, 291, 373, 313, 0.038, dark],
    [406, 57, 445, 100, 0.026, dark],
    [461, 76, 500, 122, 0.076, metal],
    [453, 151, 495, 196, 0.057, metal],
  ]) {
    const piece = shapeFor([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
    solid(piece, depth, thickness / 2, material);
    surface(piece, thickness / 2 + depth + 0.001, front);
  }
  return board;
}

export function createMotherboardScene({ canvas, frontUrl, rearUrl, lowPerformance, onStatus, onFace }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPerformance, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = false;
  camera.position.set(2, 2, 7);
  const cameraVector = new THREE.Vector3();
  let fit = 0;
  let frame = 0;
  let disposed = false;
  let ready = false;
  let failed = false;
  let face = '';

  function render() {
    frame = 0;
    if (disposed || failed || !ready || !canvas.clientWidth || !canvas.clientHeight) return;
    renderer.render(scene, camera);
  }
  function schedule() {
    if (!disposed && !frame) frame = requestAnimationFrame(render);
  }
  function onChange() {
    const direction = cameraVector.copy(camera.position).normalize();
    const next = direction.z > 0.35 ? 'Cara superior' : direction.z < -0.35 ? 'Cara posterior' : 'Vista de canto';
    if (next !== face) {
      face = next;
      onFace(face);
    }
    schedule();
  }
  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPerformance ? 1 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const vertical = THREE.MathUtils.degToRad(camera.fov / 2);
    const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
    const distance = 2.32 / Math.sin(Math.min(vertical, horizontal));
    camera.position.setLength(distance * (fit ? camera.position.length() / fit : 1));
    fit = distance;
    controls.minDistance = fit * 0.49;
    controls.maxDistance = fit * 1.65;
    controls.update();
    schedule();
  }
  const presets = { front: [0, 0, 1], rear: [0, 0, -1], initial: [0.34, 0.43, 1] };
  function view(id) {
    camera.position.set(...presets[id]).setLength(fit || 8);
    controls.update();
    schedule();
  }
  function zoom(factor) {
    camera.position.multiplyScalar(factor);
    controls.update();
  }
  function onKey(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (Object.hasOwn(directions, event.key)) {
      const [azimuth, tilt] = directions[event.key];
      const spherical = new THREE.Spherical().setFromVector3(camera.position);
      spherical.theta += azimuth * 0.16;
      spherical.phi += tilt * 0.16;
      camera.position.setFromSpherical(spherical.makeSafe());
      controls.update();
    } else if (event.key === '+' || event.key === '=') zoom(0.85);
    else if (event.key === '-') zoom(1 / 0.85);
    else if (event.key === 'Home') view('initial');
    else return;
    event.preventDefault();
  }
  function onTextureLoad() {
    if (disposed || failed || !frontPhoto.image || !rearPhoto.image) return;
    ready = true;
    onStatus('ready');
    schedule();
  }
  function onTextureError() {
    if (disposed) return;
    failed = true;
    onStatus('error');
  }
  function onContextLost(event) {
    event.preventDefault();
    failed = true;
    onStatus('error');
  }
  function onContextRestored() {
    failed = false;
    if (ready) onStatus('ready');
    else onTextureLoad();
    schedule();
  }

  const loader = new THREE.TextureLoader();
  const frontPhoto = loader.load(frontUrl, onTextureLoad, undefined, onTextureError);
  const rearPhoto = loader.load(rearUrl, onTextureLoad, undefined, onTextureError);
  frontPhoto.colorSpace = rearPhoto.colorSpace = THREE.SRGBColorSpace;
  const board = makeBoard(frontPhoto, rearPhoto);
  scene.add(board);
  controls.addEventListener('change', onChange);
  canvas.addEventListener('keydown', onKey);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  view('initial');
  return {
    view,
    zoom,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('keydown', onKey);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      controls.removeEventListener('change', onChange);
      controls.dispose();
      const materials = new Set();
      for (const mesh of board.children) {
        mesh.geometry.dispose();
        materials.add(mesh.material);
      }
      for (const material of materials) material.dispose();
      frontPhoto.dispose();
      rearPhoto.dispose();
      renderer.dispose();
    },
  };
}

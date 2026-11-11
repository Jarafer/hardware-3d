import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { COLORS, getPixelRatio } from '../config.js';
import { createBook } from './createBook.js';
import { Netbook3D } from './Netbook3D.js';
import { InternalView } from './InternalView.js';
import { Ram3D } from './Ram3D.js';
import { createAuditSampler } from './resourceAudit.js';
import { sampleTransition } from './bookMotion.js';
import { TOTAL_DURATION, sequencePose, sampleSequence, clamp, NETBOOK_LIMITS, netbookCameraLimits, netbookZoomDistance } from './labMotion.js';

export function createScene({ canvas, container, onContextChange, bookContent, components, audit = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(COLORS.paper, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.paper, 12, 27);
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 60);
  scene.add(new THREE.HemisphereLight(0xfff9ea, 0xb6aa91, 1.7));
  const keyLight = new THREE.DirectionalLight(0xfff5dc, 2.1);
  keyLight.position.set(-4, 9, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(512, 512);
  Object.assign(keyLight.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.5, far: 25 });
  keyLight.shadow.normalBias = 0.04;
  scene.add(keyLight);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: COLORS.paper, roughness: 1, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const grid = new THREE.GridHelper(12, 24, COLORS.sand, COLORS.sand);
  grid.position.y = 0.006;
  grid.material.transparent = true;
  grid.material.opacity = 0.23;
  grid.visible = false;
  scene.add(grid);
  const book = createBook(bookContent);
  const netbook = new Netbook3D();
  const internal = new InternalView(components);
  const ram = new Ram3D();
  book.objectMount.add(ram.group);
  book.objectMount.add(netbook.group);
  book.objectMount.add(internal.group);
  scene.add(book.group);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = false;
  controls.enablePan = false;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = 1.15;
  controls.target.set(0, 0.3, 0);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new Set();
  const markerListeners = new Set();
  const ramMarkerListeners = new Set();
  let lowPerformance = false;
  let contextLost = false;
  let disposed = false;
  let manualReducedMotion = false;
  let time = 0;
  let target = 0;
  let mode = 'book';
  let activePopUp = 'netbook';
  let transition = null;
  let lastPhase = '';
  let surfaceVisible = true;
  let updatingControls = false;
  const auditSampler = createAuditSampler({ scene, renderer, canvas, enabled: audit, extraTextures: book.textures });
  const captureAudit = (extra = {}) => auditSampler.capture({ mode, moving: Boolean(transition), lowPerformance, shadows: renderer.shadowMap.enabled, surfaceVisible, ...extra });
  const noMotion = () => reducedMotion.matches || manualReducedMotion;
  const render = () => {
    if (!disposed && !contextLost && !document.hidden && surfaceVisible) {
      const shadowUpdated = renderer.shadowMap.enabled && keyLight.castShadow && (renderer.shadowMap.autoUpdate || renderer.shadowMap.needsUpdate);
      renderer.render(scene, camera);
      captureAudit({ rendered: true, shadowUpdated });
      const markers = internal.markers(camera);
      markerListeners.forEach((callback) => callback(markers));
      const ramMarkers = mode === 'ram' ? ram.markers(camera) : [];
      ramMarkerListeners.forEach(callback => callback(ramMarkers));
    }
  };
  function syncControls() {
    updatingControls = true;
    try { controls.update(); } finally { updatingControls = false; }
  }
  function dirtyShadows() { renderer.shadowMap.needsUpdate = true; }
  function minNetDistance() {
    return netbookCameraLimits(camera.aspect).min;
  }
  function viewDestination(view = mode, open = target) {
    if (view === 'internal') return internal.cameraView(camera.aspect);
    if (view === 'ram') return ram.selectedId ? ram.cameraView(camera.aspect) : viewDestination('book', 1);
    const net = view === 'netbook';
    const focus = net ? new THREE.Vector3(1.35, 1.0, 0) : new THREE.Vector3(0, 0.3, 0);
    const distance = net ? Math.max(4.6, minNetDistance() + 0.3) : Math.max(open ? 10.2 : 8.3, (open ? 6.8 : 3.4) / (2 * Math.tan(THREE.MathUtils.degToRad(18.5)) * camera.aspect));
    return { focus, pose: new THREE.Spherical(Math.min(distance, net ? netbookCameraLimits(camera.aspect).max : 21), net ? 1.0 : open ? 0.57 : 0.74, net ? 0.34 : open ? 0.06 : 0.28) };
  }
  function updateControlLimits() {
    // Durante el reencuadre no aplicar los límites del destino al punto de partida:
    // OrbitControls.update() también limita la distancia cuando está deshabilitado.
    controls.minDistance = transition || mode === 'internal' ? 1.8 : mode === 'ram' ? (ram.selectedId ? ram.cameraView(camera.aspect).pose.radius : 7) : mode === 'netbook' ? minNetDistance() : 7;
    controls.maxDistance = transition || mode === 'book' ? 21 : mode === 'ram' ? Math.max(21, ram.cameraView(camera.aspect).pose.radius + 3) : mode === 'netbook' ? netbookCameraLimits(camera.aspect).max : 7;
    // En exploración se gira el objeto, conservando la cámara en un encuadre seguro.
    controls.enabled = mode === 'book' && !transition && !contextLost;
  }
  function currentState() {
    const pose = sequencePose(time);
    const phase = transition?.kind === 'camera' ? 'camera' : pose.book < 1 ? 'book' : pose.netbook < 1 ? 'netbook' : 'ready';
    const distance = camera.position.distanceTo(controls.target);
    return {
      open: pose.book === 1, target, moving: Boolean(transition), phase, available: !contextLost,
      ready: time === TOTAL_DURATION && !transition, mode, yaw: netbook.yaw, tilt: netbook.tilt,
      selectedId: internal.selectedId,
      ramPart: ram.selectedId, ramYaw: ram.yaw, activePopUp,
      zoom: Math.round(clamp((netbookCameraLimits(camera.aspect).max - distance) / (netbookCameraLimits(camera.aspect).max - minNetDistance()), 0, 1) * 100),
    };
  }
  function notify() { const state = currentState(); lastPhase = state.phase; listeners.forEach((callback) => callback(state)); captureAudit(); }
  function cameraStart() {
    return { focus: controls.target.clone(), pose: new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target)) };
  }
  function placeCamera(from, to, fraction) {
    controls.target.lerpVectors(from.focus, to.focus, fraction);
    const pose = new THREE.Spherical(
      THREE.MathUtils.lerp(from.pose.radius, to.pose.radius, fraction),
      THREE.MathUtils.lerp(from.pose.phi, to.pose.phi, fraction),
      THREE.MathUtils.lerp(from.pose.theta, to.pose.theta, fraction),
    );
    camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(pose));
    syncControls();
  }
  function sample(now) {
    if (!transition) return;
    const active = transition;
    const sampled = active.kind === 'sequence' ? sampleSequence(active, now) : sampleTransition(active, now);
    if (active.kind === 'sequence') {
      time = sampled.time;
      const pose = sequencePose(time);
      book.setProgress(pose.book);
      netbook.setEmergence(pose.netbook);
      if (activePopUp === 'ram') { netbook.group.visible = false; ram.setEmergence(pose.netbook); }
      dirtyShadows();
    }
    if (active.kind === 'camera' && mode === 'ram') { ram.setEmergence(active.emerge ? sampled.fraction : 1); dirtyShadows(); }
    placeCamera(active.camera, viewDestination(), sampled.fraction);
    render();
    if (sampled.done) {
      transition = null;
      renderer.setAnimationLoop(null);
      updateControlLimits();
      if (time === 0) { netbook.resetView(); ram.setEmergence(0); activePopUp = 'netbook'; book.setChapter('overview'); }
      notify();
    } else if (currentState().phase !== lastPhase) notify();
  }
  function startAnimation() {
    updateControlLimits();
    notify();
    sample(performance.now());
    if (transition && !document.hidden && !contextLost && surfaceVisible) renderer.setAnimationLoop(sample);
  }
  function setBookOpen(open) {
    if (disposed || contextLost) return;
    const now = performance.now();
    sample(now);
    const next = open ? 1 : 0;
    const end = next * TOTAL_DURATION;
    if (next === target && (transition?.kind === 'sequence' || time === end)) return;
    const fromCamera = cameraStart();
    target = next;
    mode = 'book';
    internal.select(null);
    internal.group.visible = false;
    netbook.group.visible = activePopUp !== 'ram' && sequencePose(time).netbook > 0;
    transition = { kind: 'sequence', from: time, to: end, start: now, duration: noMotion() ? 0 : Math.abs(end - time), camera: fromCamera };
    startAnimation();
  }
  function frame(view) {
    if (disposed || contextLost || time !== TOTAL_DURATION || transition) return;
    if (view === 'internal' && mode !== 'internal') internal.select(null);
    const emerge = view === 'ram' && mode !== 'ram';
    if (emerge) { ram.reset(); book.selectRamPart(null); }
    mode = view;
    activePopUp = view === 'ram' ? 'ram' : 'netbook';
    book.setChapter(view === 'ram' ? 'ram' : 'overview');
    internal.group.visible = mode === 'internal';
    netbook.group.visible = mode !== 'internal' && mode !== 'ram';
    ram.setEmergence(mode === 'ram' ? (emerge ? 0 : 1) : 0);
    dirtyShadows();
    transition = { kind: 'camera', from: 0, to: 1, start: performance.now(), duration: noMotion() ? 0 : 700, camera: cameraStart(), emerge };
    startAnimation();
  }
  function finishReducedMotion() {
    if (noMotion() && transition) { transition.duration = 0; sample(performance.now()); }
  }
  function onVisibility() {
    if (document.hidden || !surfaceVisible) renderer.setAnimationLoop(null);
    else if (transition && !contextLost) { sample(performance.now()); if (transition) renderer.setAnimationLoop(sample); }
    else render();
  }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) {
      surfaceVisible = false;
      renderer.setAnimationLoop(null);
      captureAudit();
      return;
    }
    const wasVisible = surfaceVisible;
    surfaceVisible = true;
    renderer.setPixelRatio(getPixelRatio(window.devicePixelRatio, lowPerformance));
    renderer.setSize(width, height, false);
    const changed = Math.abs(camera.aspect - width / height) > 0.001;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    updateControlLimits();
    if (!transition && changed) { const to = viewDestination(); placeCamera(to, to, 1); }
    render();
    if (!transition) notify();
    if (!wasVisible) onVisibility();
  }
  function rotateNetbook(yaw, tilt) {
    if (mode !== 'netbook' || transition || contextLost) return;
    netbook.rotate(yaw, tilt);
    dirtyShadows();
    render(); notify();
  }
  function orbit(horizontal, vertical) {
    if (transition || contextLost) return;
    if (mode === 'ram') { ram.rotate(ram.yaw + horizontal * 100); dirtyShadows(); render(); notify(); return; }
    if (mode === 'internal') {
      const ids = [...internal.entries.keys()];
      const index = ids.indexOf(internal.selectedId);
      const direction = horizontal + vertical < 0 ? -1 : 1;
      selectComponent(ids[index < 0 ? (direction > 0 ? 0 : ids.length - 1) : (index + direction + ids.length) % ids.length]);
      return;
    }
    if (mode === 'netbook') { rotateNetbook(netbook.yaw + horizontal * 100, netbook.tilt + vertical * 30); return; }
    const pose = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    pose.theta += horizontal;
    pose.phi = clamp(pose.phi + vertical, controls.minPolarAngle, controls.maxPolarAngle);
    camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(pose));
    syncControls(); render();
  }
  function zoom(factor) {
    if (transition || contextLost) return;
    const offset = camera.position.clone().sub(controls.target);
    offset.setLength(clamp(offset.length() * factor, controls.minDistance, controls.maxDistance));
    camera.position.copy(controls.target).add(offset);
    syncControls(); render();
    if (mode !== 'book') notify();
  }
  function setNetbookZoom(percent) {
    if (mode !== 'netbook' || transition || contextLost) return;
    const distance = netbookZoomDistance(percent, camera.aspect);
    zoom(distance / camera.position.distanceTo(controls.target));
  }
  function reset() {
    if (transition || contextLost) return;
    if (mode === 'ram') { ram.reset(); book.selectRamPart(null); frame('ram'); }
    else if (mode === 'internal') { internal.select(null); frame('internal'); }
    else if (mode === 'netbook') { netbook.resetView(); dirtyShadows(); frame('netbook'); }
    else { const to = viewDestination(); placeCamera(to, to, 1); render(); }
  }
  function selectComponent(id) {
    if (mode !== 'internal' || transition || contextLost || disposed || !internal.select(id)) return false;
    frame('internal');
    return true;
  }
  const keyActions = { ArrowLeft: () => orbit(-0.12, 0), ArrowRight: () => orbit(0.12, 0), ArrowUp: () => orbit(0, -0.1), ArrowDown: () => orbit(0, 0.1), '+': () => zoom(0.88), '=': () => zoom(0.88), '-': () => zoom(1.12), Home: reset, a: () => setBookOpen(true), A: () => setBookOpen(true), c: () => setBookOpen(false), C: () => setBookOpen(false) };
  function onKey(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (mode === 'ram' && /^[1-6]$/.test(event.key)) { event.preventDefault(); selectRamPart([...ram.entries.keys()][Number(event.key) - 1]); }
    else if (mode === 'ram' && event.key === 'Escape') { event.preventDefault(); reset(); }
    else if (mode === 'internal' && /^[1-4]$/.test(event.key)) { event.preventDefault(); selectComponent(components[Number(event.key) - 1].id); }
    else if (mode === 'internal' && event.key === 'Escape') { event.preventDefault(); reset(); }
    else if (keyActions[event.key]) { event.preventDefault(); keyActions[event.key](); }
  }
  let pointerStart = null;
  function onPointerDown(event) { if (event.button === 0 && event.isPrimary) pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId }; }
  function onPointerCancel() { pointerStart = null; }
  function onPointerUp(event) {
    const start = pointerStart;
    pointerStart = null;
    if (!start || start.id !== event.pointerId || !['internal', 'ram'].includes(mode) || transition || contextLost || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) return;
    const rect = canvas.getBoundingClientRect();
    const point = new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    const id = mode === 'ram' ? (ram.pick(camera, point) ?? book.pickRamGuide(camera, point)) : internal.pick(camera, point);
    if (id) { canvas.focus({ preventScroll: true }); if (mode === 'ram') selectRamPart(id); else selectComponent(id); }
  }
  function selectRamPart(id) {
    if (mode !== 'ram' || transition || contextLost || !ram.select(id)) return false;
    book.selectRamPart(id);
    frame('ram'); return true;
  }
  function onWheel(event) { if (mode !== 'book') { event.preventDefault(); zoom(event.deltaY < 0 ? 0.92 : 1.08); } }
  function onControlChange() { if (!transition && !updatingControls) render(); }
  function onLost(event) { event.preventDefault(); contextLost = true; renderer.setAnimationLoop(null); updateControlLimits(); onContextChange(false); notify(); }
  function onRestored() { contextLost = false; resize(); onContextChange(true); notify(); onVisibility(); }
  controls.addEventListener('change', onControlChange);
  canvas.addEventListener('keydown', onKey);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibility);
  reducedMotion.addEventListener('change', finishReducedMotion);
  const initial = viewDestination();
  placeCamera(initial, initial, 1);
  resize();
  return {
    reset, zoom, setBookOpen, rotateNetbook, setNetbookZoom, selectComponent, selectRamPart,
    showRam() { frame('ram'); },
    rotateRam(degrees) { if (mode !== 'ram' || transition || contextLost) return; ram.rotate(degrees); dirtyShadows(); render(); notify(); },
    showInternal() { frame('internal'); },
    showInternalOverview() { if (mode === 'internal') reset(); },
    exploreNetbook() { frame('netbook'); },
    returnToBook() { frame('book'); },
    setReducedMotion(enabled) { manualReducedMotion = enabled; finishReducedMotion(); },
    toggleBook() { setBookOpen(target !== 1); },
    subscribeBook(callback) { listeners.add(callback); callback(currentState()); return () => listeners.delete(callback); },
    subscribeMarkers(callback) { markerListeners.add(callback); callback(internal.markers(camera)); return () => markerListeners.delete(callback); },
    subscribeRamMarkers(callback) { ramMarkerListeners.add(callback); callback(mode === 'ram' ? ram.markers(camera) : []); return () => ramMarkerListeners.delete(callback); },
    setGrid(visible) { grid.visible = visible; render(); },
    setLowPerformance(enabled) {
      lowPerformance = enabled;
      renderer.shadowMap.enabled = !enabled;
      keyLight.castShadow = !enabled;
      if (enabled) {
        keyLight.shadow.map?.dispose(); keyLight.shadow.map = null;
        keyLight.shadow.mapPass?.dispose(); keyLight.shadow.mapPass = null;
      }
      dirtyShadows();
      floor.material.needsUpdate = true;
      resize();
    },
    dispose() {
      disposed = true;
      renderer.setAnimationLoop(null);
      transition = null;
      listeners.clear();
      markerListeners.clear();
      ramMarkerListeners.clear();
      internal.dispose();
      ram.dispose();
      netbook.dispose();
      book.dispose();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener('change', finishReducedMotion);
      canvas.removeEventListener('keydown', onKey);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      const geometries = new Set();
      const materials = new Set();
      scene.traverse((object) => { if (object.geometry) geometries.add(object.geometry); for (const material of [object.material ?? []].flat()) materials.add(material); });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      keyLight.shadow.dispose();
      renderer.dispose();
    },
  };
}

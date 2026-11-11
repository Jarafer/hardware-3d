// Inventario de recursos, no una medición de la memoria total del proceso o de VRAM.
export function measureResources(root, extraTextures = []) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set(extraTextures);
  const buffers = new Set();
  let meshes = 0;
  root.traverse((object) => {
    if (object.isMesh) meshes++;
    if (object.geometry) geometries.add(object.geometry);
    if (object.isInstancedMesh) {
      buffers.add(object.instanceMatrix.array.buffer);
      if (object.instanceColor) buffers.add(object.instanceColor.array.buffer);
    }
    for (const material of [object.material ?? []].flat()) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  for (const geometry of geometries) {
    for (const attribute of [...Object.values(geometry.attributes), geometry.index].filter(Boolean)) {
      const array = attribute.isInterleavedBufferAttribute ? attribute.data.array : attribute.array;
      buffers.add(array.buffer);
    }
  }
  let textureBytesEstimate = 0;
  for (const texture of textures) {
    const { width = 0, height = 0 } = texture.image ?? {};
    textureBytesEstimate += Math.ceil(width * height * 4 * (texture.generateMipmaps ? 4 / 3 : 1));
  }
  return { meshes, geometries: geometries.size, materials: materials.size, textures: textures.size, geometryArrayBytes: [...buffers].reduce((sum, buffer) => sum + buffer.byteLength, 0), textureBytesEstimate };
}

export function createAuditSampler({ scene, renderer, canvas, enabled, extraTextures = [] }) {
  const inventory = enabled ? measureResources(scene, extraTextures) : null;
  let frames = 0;
  let shadowUpdates = 0;
  return {
    capture({ rendered = false, shadowUpdated = false, ...state } = {}) {
      if (!enabled) return;
      if (rendered) frames++;
      if (shadowUpdated) shadowUpdates++;
      const heap = globalThis.performance?.memory;
      canvas.dataset.audit = JSON.stringify({
        inventory, frames, shadowUpdates, ...state,
        buffer: { width: canvas.width, height: canvas.height, pixelRatio: renderer.getPixelRatio() },
        gpuCounters: { ...renderer.info.memory, programs: renderer.info.programs?.length ?? 0 },
        lastRender: { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles },
        jsHeapUsedBytes: Number.isFinite(heap?.usedJSHeapSize) ? heap.usedJSHeapSize : null,
        jsHeapTotalBytes: Number.isFinite(heap?.totalJSHeapSize) ? heap.totalJSHeapSize : null,
      });
    },
  };
}

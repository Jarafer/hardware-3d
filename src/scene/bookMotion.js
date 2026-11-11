// Trayectorias absolutas: reproducibles a cualquier FPS y reversibles sin acumular giros.
export const LEAF_COUNT = 6;
export const clamp01 = (value) => Math.max(0, Math.min(1, value));
export const ease = (value) => { const t = clamp01(value); return t * t * (3 - 2 * t); };
export function bookPose(progress) {
  const p = clamp01(progress);
  const cover = ease(p / 0.42);
  return {
    coverAngle: Math.PI * cover,
    // La bisagra se asienta después de pasar la vertical, lejos del bloque derecho.
    coverHeight: 0.48 - 0.28 * ease((cover - 0.55) / 0.45),
    leafAngles: Array.from({ length: LEAF_COUNT }, (_, index) => Math.PI * ease((p - 0.34 - index * 0.055) / 0.36)),
    offsetX: -1.35 * (1 - ease(p)),
  };
}
export function sampleTransition(transition, now) {
  const elapsed = transition.duration === 0 ? 1 : clamp01((now - transition.start) / transition.duration);
  return { progress: transition.from + (transition.to - transition.from) * ease(elapsed), fraction: ease(elapsed), done: elapsed >= 1 };
}

import { clamp01, ease } from './bookMotion.js';

export const BOOK_DURATION = 2600;
export const POPUP_DURATION = 1100;
export const TOTAL_DURATION = BOOK_DURATION + POPUP_DURATION;
export const NETBOOK_LIMITS = Object.freeze({ yaw: [-35, 35], tilt: [-8, 8], minDistance: 3.6, maxDistance: 7 });
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function netbookCameraLimits(aspect) {
  // Una esfera conservadora incluye la profundidad del modelo y sus giros.
  // El límite fijo anterior recortaba esquinas en pantallas angostas.
  const halfAngle = Math.atan(Math.tan(37 * Math.PI / 360) * Math.min(1, Math.max(0.3, aspect)));
  const min = Math.max(NETBOOK_LIMITS.minDistance, 1.8 / Math.sin(halfAngle));
  return { min, max: Math.max(NETBOOK_LIMITS.maxDistance, min + 0.5) };
}

export function netbookZoomDistance(percent, aspect) {
  const limits = netbookCameraLimits(aspect);
  return limits.max - (limits.max - limits.min) * clamp(percent, 0, 100) / 100;
}

export function sequencePose(time) {
  return {
    book: ease(time / BOOK_DURATION),
    netbook: ease((time - BOOK_DURATION) / POPUP_DURATION),
  };
}

export function emergencePose(progress) {
  const p = clamp01(progress);
  return { visible: p > 0, scale: 0.035 + p * 0.965, height: 0.045 + p * 0.135, tilt: (1 - p) * 0.08, yaw: (1 - p) * -0.28 };
}

export function sampleSequence(transition, now) {
  const elapsed = transition.duration ? clamp01((now - transition.start) / transition.duration) : 1;
  return { time: transition.from + (transition.to - transition.from) * elapsed, fraction: ease(elapsed), done: elapsed === 1 };
}

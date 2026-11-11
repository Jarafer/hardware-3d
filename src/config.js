export const COLORS = Object.freeze({ paper: 0xf0e5ce, sand: 0xc6a477, graphite: 0x303945, blue: 0x437e90, amber: 0xd49b46, green: 0x44846e });
export const MAX_PIXEL_RATIO = 1.5;
export function getPixelRatio(deviceRatio, lowPerformance) {
  return Math.min(Math.max(deviceRatio || 1, 0.5), lowPerformance ? 1 : MAX_PIXEL_RATIO);
}

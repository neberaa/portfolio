export type Point = readonly [number, number, number];

export const getPointCount = (isSmallScreen: boolean): number => (isSmallScreen ? 480 : 1100);

export const canUseWebgl = (getContext: (type: string) => unknown): boolean => {
  try {
    return Boolean(getContext("webgl2") ?? getContext("webgl"));
  } catch {
    return false;
  }
};

export const createPointField = (count: number): Point[] =>
  Array.from({ length: Math.max(0, count) }, (_, index) => {
    const angle = index * 2.399;
    const radius = 2 + (index % 17) * 0.45;
    const y = ((index * 37) % 100) / 12 - 4;
    return [Math.cos(angle) * radius, y, -4 - (index % 23) * 0.55] as const;
  });

export const driftPoint = (origin: Point, time: number, index: number): Point => {
  const [x, y, z] = origin;
  return [
    x + Math.sin(time * 0.15 + index) * 0.18,
    y + Math.cos(time * 0.12 + index * 0.37) * 0.14,
    z + Math.sin(time * 0.05 + index * 0.2) * 0.08,
  ];
};

export const mixHex = (from: number, to: number, amount: number): number => {
  const t = Math.min(1, Math.max(0, amount));
  const channel = (shift: number): number => {
    const start = (from >> shift) & 0xff;
    const end = (to >> shift) & 0xff;
    return Math.round(start + (end - start) * t);
  };
  return (channel(16) << 16) | (channel(8) << 8) | channel(0);
};

export const buildPointColors = (points: readonly Point[]): number[] =>
  points.flatMap(([x]) => {
    const color = mixHex(0x00c9d8, 0x087bff, (x + 12) / 24);
    return [((color >> 16) & 255) / 255, ((color >> 8) & 255) / 255, (color & 255) / 255];
  });

export const heroMotion = {
  outerRadius: 5.4,
  innerRadius: 3.5,
  outerSpeed: 0.22,
  innerSpeed: -0.34,
  tilt: 0.7,
  introSeconds: 2.8,
  lineSegments: 180,
  outerPoints: 260,
  innerPoints: 150,
  smallLineSegments: 110,
  smallOuterPoints: 150,
  smallInnerPoints: 90,
  outerSize: 0.07,
  innerSize: 0.045,
  presenceStep: 0.06,
  depth: 1.6,
} as const;

export const smoothStep = (amount: number): number => {
  const t = Math.min(1, Math.max(0, amount));
  return t * t * (3 - 2 * t);
};

export const introScale = (time: number, duration: number): number => {
  if (duration <= 0) return 1;
  return 0.42 + smoothStep(time / duration) * 0.58;
};

export const introFade = (time: number, duration: number): number => {
  if (duration <= 0) return 1;
  return smoothStep(time / duration);
};

export const damp = (current: number, target: number, amount: number): number =>
  current + (target - current) * Math.min(1, Math.max(0, amount));

export const poseRingPoint = (
  index: number,
  count: number,
  radius: number,
  tilt: number,
  time: number,
  speed: number,
  scale: number,
): Point => {
  const safeCount = Math.max(1, count);
  const angle = (index / safeCount) * Math.PI * 2 + time * speed;
  const scaled = radius * scale;
  return [
    Math.cos(angle) * scaled,
    Math.sin(angle) * Math.sin(tilt) * scaled,
    Math.sin(angle) * Math.cos(tilt) * scaled * 0.55 - heroMotion.depth,
  ];
};

export const ringBrightness = (index: number, count: number, time: number, speed: number): number => {
  const safeCount = Math.max(1, count);
  const phase = (index / safeCount) * Math.PI * 2 + time * speed;
  const wave = Math.cos(phase);
  const highlight = wave > 0 ? wave ** 6 : 0;
  return 0.22 + highlight * 0.78;
};

export const colorChannels = (color: number): readonly [number, number, number] => [
  ((color >> 16) & 255) / 255,
  ((color >> 8) & 255) / 255,
  (color & 255) / 255,
];

export const fillRingPositions = (
  target: Float32Array,
  count: number,
  radius: number,
  tilt: number,
  time: number,
  speed: number,
  scale: number,
): void => {
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = poseRingPoint(index, count, radius, tilt, time, speed, scale);
    const offset = index * 3;
    target[offset] = x;
    target[offset + 1] = y;
    target[offset + 2] = z;
  }
};

export const fillRingColors = (target: Float32Array, count: number, time: number, speed: number): void => {
  for (let index = 0; index < count; index += 1) {
    const [red, green, blue] = colorChannels(mixHex(0x087bff, 0x00c9d8, ringBrightness(index, count, time, speed)));
    const offset = index * 3;
    target[offset] = red;
    target[offset + 1] = green;
    target[offset + 2] = blue;
  }
};

export type HeroRingCounts = {
  readonly lines: number;
  readonly outer: number;
  readonly inner: number;
};

export const getHeroRingCounts = (isSmallScreen: boolean): HeroRingCounts =>
  isSmallScreen
    ? {
        lines: heroMotion.smallLineSegments,
        outer: heroMotion.smallOuterPoints,
        inner: heroMotion.smallInnerPoints,
      }
    : {
        lines: heroMotion.lineSegments,
        outer: heroMotion.outerPoints,
        inner: heroMotion.innerPoints,
      };

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
  introSeconds: 2.8,
  presenceStep: 0.06,
  followStep: 0.08,
  followX: 2.4,
  followY: 1.35,
} as const;

export type HeroShape = {
  readonly sides: number;
  readonly radius: number;
  readonly speed: number;
  readonly tilt: number;
  readonly pointsPerEdge: number;
  readonly depth: number;
  readonly color: number;
  readonly size: number;
  readonly lineOpacity: number;
};

const heroShape = (
  sides: number,
  radius: number,
  speed: number,
  tilt: number,
  pointsPerEdge: number,
  depth: number,
  color: number,
  size: number,
  lineOpacity: number,
): HeroShape => ({ sides, radius, speed, tilt, pointsPerEdge, depth, color, size, lineOpacity });

export const heroShapes: readonly HeroShape[] = [
  heroShape(6, 5.1, 0.16, 0.58, 6, 1.5, 0x00c9d8, 0.08, 0.95),
  heroShape(3, 3.5, -0.3, 1.12, 8, 2.2, 0x087bff, 0.06, 0.75),
  heroShape(4, 4.3, 0.24, 0.22, 5, 1.9, 0x00c9d8, 0.055, 0.6),
];

export const smallHeroShapes: readonly HeroShape[] = [
  heroShape(6, 4.4, 0.16, 0.58, 4, 1.5, 0x00c9d8, 0.08, 0.95),
  heroShape(3, 3.1, -0.3, 1.12, 5, 2.2, 0x087bff, 0.06, 0.75),
  heroShape(4, 3.7, 0.24, 0.22, 4, 1.9, 0x00c9d8, 0.055, 0.6),
];

export const getHeroShapes = (isSmallScreen: boolean): readonly HeroShape[] =>
  isSmallScreen ? smallHeroShapes : heroShapes;

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

export const pointerNormal = (client: number, size: number): number => {
  if (size <= 0) return 0;
  const value = (client / size) * 2 - 1;
  return Math.min(1, Math.max(-1, value));
};

export const followAxis = (current: number, pointer: number, reach: number, step: number): number =>
  damp(current, pointer * reach, step);

export const posePolygonPoint = (
  index: number,
  count: number,
  sides: number,
  radius: number,
  tilt: number,
  depth: number,
  time: number,
  speed: number,
  scale: number,
): Point => {
  const safeCount = Math.max(1, count);
  const safeSides = Math.max(3, Math.floor(sides));
  const progress = (index / safeCount) * safeSides;
  const edge = Math.floor(progress) % safeSides;
  const along = progress - Math.floor(progress);
  const corner = (vertex: number): readonly [number, number] => {
    const angle = ((vertex % safeSides) / safeSides) * Math.PI * 2 + time * speed;
    return [Math.cos(angle) * radius * scale, Math.sin(angle) * radius * scale];
  };
  const start = corner(edge);
  const end = corner(edge + 1);
  const x = start[0] + (end[0] - start[0]) * along;
  const flatY = start[1] + (end[1] - start[1]) * along;
  return [x, flatY * Math.sin(tilt), flatY * Math.cos(tilt) * 0.42 - depth];
};

export const shapeBrightness = (index: number, count: number, time: number, speed: number): number => {
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

export const fillPolygonPositions = (
  target: Float32Array,
  count: number,
  sides: number,
  radius: number,
  tilt: number,
  depth: number,
  time: number,
  speed: number,
  scale: number,
): void => {
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = posePolygonPoint(index, count, sides, radius, tilt, depth, time, speed, scale);
    const offset = index * 3;
    target[offset] = x;
    target[offset + 1] = y;
    target[offset + 2] = z;
  }
};

export const fillShapeColors = (target: Float32Array, count: number, time: number, speed: number): void => {
  for (let index = 0; index < count; index += 1) {
    const [red, green, blue] = colorChannels(mixHex(0x087bff, 0x00c9d8, shapeBrightness(index, count, time, speed)));
    const offset = index * 3;
    target[offset] = red;
    target[offset + 1] = green;
    target[offset + 2] = blue;
  }
};

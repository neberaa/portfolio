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

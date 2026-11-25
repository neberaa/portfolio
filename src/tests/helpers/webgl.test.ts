import { describe, expect, it } from "vitest";
import {
  buildPointColors,
  canUseWebgl,
  colorChannels,
  createPointField,
  damp,
  driftPoint,
  fillRingColors,
  fillRingPositions,
  getHeroRingCounts,
  getPointCount,
  introFade,
  introScale,
  mixHex,
  poseRingPoint,
  ringBrightness,
} from "@/helpers/webgl";

describe("getPointCount", () => {
  it("uses fewer points on a small screen", () => {
    expect(getPointCount(true)).toBe(480);
    expect(getPointCount(false)).toBe(1100);
  });
});

describe("canUseWebgl", () => {
  it("accepts either webgl context", () => {
    expect(canUseWebgl((type) => (type === "webgl2" ? {} : null))).toBe(true);
    expect(canUseWebgl((type) => (type === "webgl" ? {} : null))).toBe(true);
  });

  it("rejects a missing context and a throwing lookup", () => {
    expect(canUseWebgl(() => null)).toBe(false);
    expect(
      canUseWebgl(() => {
        throw new Error("blocked");
      }),
    ).toBe(false);
  });
});

describe("createPointField", () => {
  it("returns one finite point per count", () => {
    const points = createPointField(5);
    expect(points).toHaveLength(5);
    expect(points.every((point) => point.every((value) => Number.isFinite(value)))).toBe(true);
  });

  it("returns an empty field for a negative count", () => {
    expect(createPointField(-3)).toEqual([]);
  });
});

describe("driftPoint", () => {
  it("is stable for the same time and index", () => {
    const origin = [1, 2, 3] as const;
    expect(driftPoint(origin, 2, 4)).toEqual(driftPoint(origin, 2, 4));
  });

  it("moves the point off its origin", () => {
    expect(driftPoint([0, 0, 0], 1, 1)).not.toEqual([0, 0, 0]);
  });
});

describe("mixHex", () => {
  it("returns the endpoints", () => {
    expect(mixHex(0x00c9d8, 0x087bff, 0)).toBe(0x00c9d8);
    expect(mixHex(0x00c9d8, 0x087bff, 1)).toBe(0x087bff);
  });

  it("clamps the amount", () => {
    expect(mixHex(0x000000, 0xffffff, -1)).toBe(0x000000);
    expect(mixHex(0x000000, 0xffffff, 2)).toBe(0xffffff);
  });
});

describe("introScale", () => {
  it("opens from a smaller ring to full size", () => {
    expect(introScale(0, 2)).toBeCloseTo(0.42);
    expect(introScale(2, 2)).toBeCloseTo(1);
    expect(introScale(6, 2)).toBeCloseTo(1);
    expect(introScale(1, 0)).toBe(1);
  });
});

describe("introFade", () => {
  it("fades in and then stays visible", () => {
    expect(introFade(0, 2)).toBe(0);
    expect(introFade(2, 2)).toBe(1);
    expect(introFade(1, 0)).toBe(1);
  });
});

describe("damp", () => {
  it("moves part of the way toward the target", () => {
    expect(damp(0, 1, 0.25)).toBeCloseTo(0.25);
    expect(damp(0, 1, 2)).toBe(1);
  });
});

describe("poseRingPoint", () => {
  it("starts on the right of the ring", () => {
    expect(poseRingPoint(0, 4, 2, 0, 0, 1, 1)[0]).toBeCloseTo(2);
    expect(poseRingPoint(0, 4, 2, 0, 0, 1, 1)[1]).toBeCloseTo(0);
  });

  it("moves as time passes", () => {
    const start = poseRingPoint(0, 8, 4, 0.5, 0, 1, 1);
    const later = poseRingPoint(0, 8, 4, 0.5, 1, 1, 1);
    expect(later[0]).not.toBeCloseTo(start[0]);
  });
});

describe("ringBrightness", () => {
  it("stays inside the visible range", () => {
    expect(ringBrightness(0, 8, 1.2, 0.8)).toBeGreaterThanOrEqual(0.22);
    expect(ringBrightness(0, 8, 1.2, 0.8)).toBeLessThanOrEqual(1);
    expect(ringBrightness(3, 8, 1.2, 0.8)).toBeGreaterThanOrEqual(0.22);
    expect(ringBrightness(3, 8, 1.2, 0.8)).toBeLessThanOrEqual(1);
  });
});

describe("fillRingPositions", () => {
  it("writes a finite position for every point", () => {
    const target = new Float32Array(6);
    fillRingPositions(target, 2, 3, 0.4, 0.5, 0.2, 1);
    expect(Array.from(target).every((value) => Number.isFinite(value))).toBe(true);
  });
});

describe("fillRingColors", () => {
  it("writes channels in the 0 to 1 range", () => {
    const target = new Float32Array(6);
    fillRingColors(target, 2, 0.4, 1);
    expect(Array.from(target).every((value) => value >= 0 && value <= 1)).toBe(true);
  });
});

describe("colorChannels", () => {
  it("splits cyan into unit channels", () => {
    const [red, green, blue] = colorChannels(0x00c9d8);
    expect(red).toBe(0);
    expect(green).toBeCloseTo(0xc9 / 255);
    expect(blue).toBeCloseTo(0xd8 / 255);
  });
});

describe("getHeroRingCounts", () => {
  it("uses fewer points on a small screen", () => {
    expect(getHeroRingCounts(true).outer).toBeLessThan(getHeroRingCounts(false).outer);
    expect(getHeroRingCounts(false).lines).toBeGreaterThan(0);
  });
});

describe("buildPointColors", () => {
  it("returns three channels per point in the 0 to 1 range", () => {
    const colors = buildPointColors([
      [0, 0, 0],
      [12, 0, 0],
    ]);
    expect(colors).toHaveLength(6);
    expect(colors.every((channel) => channel >= 0 && channel <= 1)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import {
  buildPointColors,
  canUseWebgl,
  colorChannels,
  createPointField,
  damp,
  delayedFade,
  driftPoint,
  followAxis,
  fillPolygonPositions,
  fillShapeColors,
  getHeroShapes,
  getPointCount,
  introFade,
  introScale,
  mixHex,
  parallaxOffset,
  pointerNormal,
  posePolygonPoint,
  scrollRatio,
  shapeBrightness,
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

describe("pointerNormal", () => {
  it("maps the edges and the center of the screen", () => {
    expect(pointerNormal(0, 200)).toBe(-1);
    expect(pointerNormal(100, 200)).toBe(0);
    expect(pointerNormal(200, 200)).toBe(1);
  });

  it("clamps a pointer that leaves the screen", () => {
    expect(pointerNormal(-40, 200)).toBe(-1);
    expect(pointerNormal(320, 200)).toBe(1);
    expect(pointerNormal(10, 0)).toBe(0);
  });
});

describe("followAxis", () => {
  it("eases toward the pointer and stops at the reach", () => {
    expect(followAxis(0, 1, 2, 0.5)).toBeCloseTo(1);
    expect(followAxis(0, -1, 2, 1)).toBe(-2);
  });
});

describe("delayedFade", () => {
  it("stays hidden through the delay, then opens", () => {
    expect(delayedFade(0.2, 0.5, 0.4)).toBe(0);
    expect(delayedFade(0.5, 0.5, 0.4)).toBe(0);
    expect(delayedFade(0.7, 0.5, 0.4)).toBeGreaterThan(0);
    expect(delayedFade(0.7, 0.5, 0.4)).toBeLessThan(1);
    expect(delayedFade(0.9, 0.5, 0.4)).toBe(1);
  });
});

describe("parallaxOffset", () => {
  it("shifts while travel has not reached the screen", () => {
    expect(parallaxOffset(1, 2, 3)).toBe(-3);
    expect(parallaxOffset(2, 2, 3)).toBe(0);
  });
});

describe("scrollRatio", () => {
  it("is zero when the panel does not overflow", () => {
    expect(scrollRatio(40, 800, 800)).toBe(0);
  });

  it("tracks progress through the overflow", () => {
    expect(scrollRatio(100, 800, 1000)).toBeCloseTo(0.5);
    expect(scrollRatio(-20, 800, 1000)).toBe(0);
  });
});

describe("posePolygonPoint", () => {
  it("places the first corner on the radius", () => {
    expect(posePolygonPoint(0, 4, 4, 2, 0, 0, 0, 0, 1)[0]).toBeCloseTo(2);
  });

  it("cuts a straight edge instead of an arc", () => {
    const midpoint = posePolygonPoint(1, 8, 4, 2, 0, 0, 0, 0, 1);
    expect(midpoint[0]).toBeCloseTo(1);
  });

  it("moves as time passes", () => {
    const start = posePolygonPoint(0, 6, 6, 4, 0.5, 1, 0, 1, 1);
    const later = posePolygonPoint(0, 6, 6, 4, 0.5, 1, 1, 1, 1);
    expect(later[0]).not.toBeCloseTo(start[0]);
  });
});

describe("shapeBrightness", () => {
  it("stays inside the visible range", () => {
    expect(shapeBrightness(0, 8, 1.2, 0.8)).toBeGreaterThanOrEqual(0.22);
    expect(shapeBrightness(0, 8, 1.2, 0.8)).toBeLessThanOrEqual(1);
    expect(shapeBrightness(3, 8, 1.2, 0.8)).toBeGreaterThanOrEqual(0.22);
    expect(shapeBrightness(3, 8, 1.2, 0.8)).toBeLessThanOrEqual(1);
  });
});

describe("fillPolygonPositions", () => {
  it("writes a finite position for every point", () => {
    const target = new Float32Array(6);
    fillPolygonPositions(target, 2, 4, 3, 0.4, 1, 0.5, 0.2, 1);
    expect(Number.isFinite(target[0])).toBe(true);
    expect(Number.isFinite(target[5])).toBe(true);
  });
});

describe("fillShapeColors", () => {
  it("writes channels in the 0 to 1 range", () => {
    const target = new Float32Array(6);
    fillShapeColors(target, 2, 0.4, 1);
    expect(target[0]).toBeGreaterThanOrEqual(0);
    expect(target[0]).toBeLessThanOrEqual(1);
    expect(target[5]).toBeGreaterThanOrEqual(0);
    expect(target[5]).toBeLessThanOrEqual(1);
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

describe("getHeroShapes", () => {
  it("uses a hexagon, a triangle, and a square", () => {
    const shapes = getHeroShapes(false);
    expect(shapes[0]?.sides).toBe(6);
    expect(shapes[1]?.sides).toBe(3);
    expect(shapes[2]?.sides).toBe(4);
  });

  it("uses fewer edge points on a small screen", () => {
    expect(getHeroShapes(true)[0]?.pointsPerEdge).toBeLessThan(getHeroShapes(false)[0]?.pointsPerEdge ?? 0);
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

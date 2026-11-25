import { describe, expect, it } from "vitest";
import {
  buildPointColors,
  canUseWebgl,
  createPointField,
  driftPoint,
  getPointCount,
  mixHex,
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

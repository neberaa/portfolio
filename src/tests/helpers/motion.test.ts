import { describe, expect, it } from "vitest";
import { durationMs, heroTextSettleMs, isHeroTextSettled, readReducedMotion } from "@/helpers/motion";

describe("readReducedMotion", () => {
  it("is true only when the query matches", () => {
    expect(readReducedMotion(true)).toBe(true);
    expect(readReducedMotion(false)).toBe(false);
    expect(readReducedMotion(null)).toBe(false);
  });
});

describe("heroTextSettleMs", () => {
  it("waits for the delay and the fade", () => {
    expect(durationMs("800ms")).toBe(800);
    expect(durationMs("1.4s")).toBe(1400);
    expect(heroTextSettleMs("800ms", "1400ms")).toBe(2200);
  });
});

describe("isHeroTextSettled", () => {
  it("shows the field once the hero fade has finished", () => {
    expect(isHeroTextSettled("none", null)).toBe(true);
    expect(isHeroTextSettled("hero-fade", "running")).toBe(false);
    expect(isHeroTextSettled("hero-fade", "finished")).toBe(true);
  });
});

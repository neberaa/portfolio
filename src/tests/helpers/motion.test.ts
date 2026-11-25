import { describe, expect, it } from "vitest";
import { readReducedMotion } from "@/helpers/motion";

describe("readReducedMotion", () => {
  it("is true only when the query matches", () => {
    expect(readReducedMotion(true)).toBe(true);
    expect(readReducedMotion(false)).toBe(false);
    expect(readReducedMotion(null)).toBe(false);
  });
});

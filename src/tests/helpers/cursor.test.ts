import { describe, expect, it } from "vitest";
import { cursorRingTransform, showsCursorRing } from "@/helpers/cursor";

describe("showsCursorRing", () => {
  it("follows a mouse or a pen", () => {
    expect(showsCursorRing("mouse")).toBe(true);
    expect(showsCursorRing("pen")).toBe(true);
  });

  it("stays off for touch", () => {
    expect(showsCursorRing("touch")).toBe(false);
  });
});

describe("cursorRingTransform", () => {
  it("centers the ring on the pointer", () => {
    expect(cursorRingTransform(12, 40)).toBe("translate3d(12px, 40px, 0) translate(-50%, -50%)");
  });
});

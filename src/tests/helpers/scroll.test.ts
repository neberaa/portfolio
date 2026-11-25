import { describe, expect, it } from "vitest";
import {
  canScrollPanel,
  consumeWheel,
  findSectionScroller,
  getExplorePercent,
  getNextSectionIndex,
  getScrollStep,
  getSwipeDirection,
  readScreenHash,
  shouldIgnoreScrollKey,
} from "@/helpers/scroll";

describe("getExplorePercent", () => {
  it("returns 0 for a single screen", () => {
    expect(getExplorePercent(0, 1)).toBe(0);
  });

  it("returns 0 at the first screen and 100 at the last", () => {
    expect(getExplorePercent(0, 7)).toBe(0);
    expect(getExplorePercent(6, 7)).toBe(100);
  });

  it("clamps indexes outside the screen list", () => {
    expect(getExplorePercent(-2, 7)).toBe(0);
    expect(getExplorePercent(20, 7)).toBe(100);
  });
});

describe("getScrollStep", () => {
  it("maps paging keys", () => {
    expect(getScrollStep("ArrowDown")).toBe(1);
    expect(getScrollStep("PageDown")).toBe(1);
    expect(getScrollStep("ArrowUp")).toBe(-1);
    expect(getScrollStep("PageUp")).toBe(-1);
    expect(getScrollStep("Home")).toBe("start");
    expect(getScrollStep("End")).toBe("end");
  });

  it("ignores unrelated keys", () => {
    expect(getScrollStep(" ")).toBeNull();
    expect(getScrollStep("Enter")).toBeNull();
  });
});

describe("shouldIgnoreScrollKey", () => {
  it("ignores typing targets", () => {
    expect(shouldIgnoreScrollKey("INPUT", false)).toBe(true);
    expect(shouldIgnoreScrollKey("TEXTAREA", false)).toBe(true);
    expect(shouldIgnoreScrollKey("SELECT", false)).toBe(true);
    expect(shouldIgnoreScrollKey("DIV", true)).toBe(true);
  });

  it("allows keys from the page itself", () => {
    expect(shouldIgnoreScrollKey("BODY", false)).toBe(false);
    expect(shouldIgnoreScrollKey("A", false)).toBe(false);
  });
});

describe("getNextSectionIndex", () => {
  it("steps and clamps", () => {
    expect(getNextSectionIndex(0, 7, 1)).toBe(1);
    expect(getNextSectionIndex(0, 7, -1)).toBe(0);
    expect(getNextSectionIndex(6, 7, 1)).toBe(6);
  });

  it("jumps to the ends", () => {
    expect(getNextSectionIndex(3, 7, "start")).toBe(0);
    expect(getNextSectionIndex(3, 7, "end")).toBe(6);
  });

  it("returns 0 when there are no screens", () => {
    expect(getNextSectionIndex(2, 0, 1)).toBe(0);
  });
});

describe("canScrollPanel", () => {
  it("allows a tall panel to move until its edge", () => {
    expect(canScrollPanel(0, 100, 250, 1)).toBe(true);
    expect(canScrollPanel(150, 100, 250, 1)).toBe(false);
    expect(canScrollPanel(40, 100, 250, -1)).toBe(true);
    expect(canScrollPanel(0, 100, 250, -1)).toBe(false);
  });

  it("treats a panel that fits as already finished", () => {
    expect(canScrollPanel(0, 100, 100, 1)).toBe(false);
  });
});

describe("consumeWheel", () => {
  it("holds small deltas until they cross the threshold", () => {
    expect(consumeWheel(0, 20, 48)).toEqual({ remaining: 20, direction: 0 });
    expect(consumeWheel(20, 30, 48)).toEqual({ remaining: 0, direction: 1 });
    expect(consumeWheel(-20, -30, 48)).toEqual({ remaining: 0, direction: -1 });
  });
});

describe("getSwipeDirection", () => {
  it("maps a vertical swipe to one section step", () => {
    expect(getSwipeDirection(200, 100, 48)).toBe(1);
    expect(getSwipeDirection(100, 200, 48)).toBe(-1);
    expect(getSwipeDirection(100, 120, 48)).toBe(0);
  });
});

describe("readScreenHash", () => {
  it("accepts a known section id", () => {
    expect(readScreenHash("#skills", ["home", "skills"])).toBe("skills");
    expect(readScreenHash("", ["home"])).toBeNull();
    expect(readScreenHash("#missing", ["home"])).toBeNull();
  });
});

describe("findSectionScroller", () => {
  it("returns the scroller inside the requested panel", () => {
    document.body.innerHTML =
      '<div><section class="screen-panel"><div class="section-scroll" id="home"></div></section><section class="screen-panel"><div class="section-scroll" id="about"></div></section></div>';
    expect(findSectionScroller(document.body, 1)?.id).toBe("about");
    expect(findSectionScroller(document.body, 4)).toBeNull();
  });
});

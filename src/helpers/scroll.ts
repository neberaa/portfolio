import type { ScrollStep } from "@/types/scroll";

export const getExplorePercent = (index: number, count: number): number => {
  if (count <= 1) return 0;
  const clamped = Math.min(Math.max(index, 0), count - 1);
  return Math.round((clamped / (count - 1)) * 100);
};

export const getScrollStep = (key: string): ScrollStep | null => {
  if (key === "ArrowDown" || key === "PageDown") return 1;
  if (key === "ArrowUp" || key === "PageUp") return -1;
  if (key === "Home") return "start";
  if (key === "End") return "end";
  return null;
};

export const shouldIgnoreScrollKey = (tagName: string, isContentEditable: boolean): boolean =>
  isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";

export const getNextSectionIndex = (index: number, count: number, step: ScrollStep): number => {
  if (count <= 0) return 0;
  if (step === "start") return 0;
  if (step === "end") return count - 1;
  return Math.min(count - 1, Math.max(0, index + step));
};

export const wheelThreshold = 48;
export const swipeThreshold = 48;

export type ScrollDirection = -1 | 1;

export type WheelConsumption = {
  readonly remaining: number;
  readonly direction: ScrollDirection | 0;
};

export const canScrollPanel = (
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
  direction: ScrollDirection,
): boolean => {
  if (scrollHeight <= clientHeight + 1) return false;
  if (direction > 0) return scrollTop + clientHeight < scrollHeight - 1;
  return scrollTop > 1;
};

export const consumeWheel = (
  accumulated: number,
  deltaY: number,
  threshold: number,
): WheelConsumption => {
  const total = accumulated + deltaY;
  if (total >= threshold) return { remaining: 0, direction: 1 };
  if (total <= -threshold) return { remaining: 0, direction: -1 };
  return { remaining: total, direction: 0 };
};

export const getSwipeDirection = (
  startY: number,
  endY: number,
  threshold: number,
): ScrollDirection | 0 => {
  const delta = startY - endY;
  if (delta >= threshold) return 1;
  if (delta <= -threshold) return -1;
  return 0;
};

export const readScreenHash = (hash: string, ids: readonly string[]): string | null => {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (id.length === 0) return null;
  return ids.includes(id) ? id : null;
};

export const findSectionScroller = (root: ParentNode, sectionIndex: number): HTMLElement | null => {
  const panel = root.querySelectorAll(".screen-panel")[sectionIndex];
  if (!(panel instanceof HTMLElement)) return null;
  const scroller = panel.querySelector(".section-scroll");
  return scroller instanceof HTMLElement ? scroller : null;
};

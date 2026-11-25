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

"use client";

import { useEffect } from "react";
import { getNextSectionIndex, getScrollStep, shouldIgnoreScrollKey } from "@/helpers/scroll";
import { getSectionIndex } from "@/helpers/sections";
import type { ScreenId } from "@/types/section";

export const useSectionKeyboard = (
  ids: readonly ScreenId[],
  activeId: string,
  scrollTo: (id: ScreenId) => void,
): void => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        shouldIgnoreScrollKey(target.tagName, target.isContentEditable)
      ) {
        return;
      }

      const step = getScrollStep(event.key);
      if (step === null) return;

      event.preventDefault();
      const nextIndex = getNextSectionIndex(getSectionIndex(ids, activeId), ids.length, step);
      const nextId = ids[nextIndex];
      if (nextId) scrollTo(nextId);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, ids, scrollTo]);
};

"use client";

import { useEffect, useRef, type ReactElement } from "react";
import { cursorRingTransform, showsCursorRing } from "@/helpers/cursor";

export const CursorRing = (): ReactElement => {
  const ringRef = useRef<HTMLDivElement>(null);

  const watchCursor = (): (() => void) => {
    const onPointerMove = (event: PointerEvent): void => {
      const ring = ringRef.current;
      if (!ring || !showsCursorRing(event.pointerType)) return;
      ring.style.transform = cursorRingTransform(event.clientX, event.clientY);
      ring.dataset.on = "true";
    };
    const stop = (): void => {
      window.removeEventListener("pointermove", onPointerMove);
    };
    window.addEventListener("pointermove", onPointerMove);
    return stop;
  };

  useEffect(watchCursor, []);

  return <div ref={ringRef} className="cursor-ring" aria-hidden />;
};

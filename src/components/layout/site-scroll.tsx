"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { measure } from "@/data/design";
import { screenIds } from "@/data/sections";
import {
  canScrollPanel,
  consumeWheel,
  findSectionScroller,
  getSwipeDirection,
  readScreenHash,
  swipeThreshold,
  wheelThreshold,
} from "@/helpers/scroll";
import { getSectionIndex } from "@/helpers/sections";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useSectionKeyboard } from "@/hooks/use-section-keyboard";
import { SiteScrollContext } from "@/hooks/use-site-scroll";
import type { ScreenId } from "@/types/section";
import type { SiteScrollValue } from "@/types/scroll";

type GoTo = (id: ScreenId) => void;

type DeckBridge = {
  register: (goTo: GoTo | null) => void;
  setActiveId: (id: string) => void;
};

const DeckBridgeContext = createContext<DeckBridge | null>(null);

const wheelIdleMs = 180;
const wheelListenerOptions: AddEventListenerOptions = { passive: false };

type SiteScrollProps = {
  children: ReactNode;
};

export const SiteScroll = ({ children }: SiteScrollProps): ReactElement => {
  const goToRef = useRef<GoTo | null>(null);
  const [activeId, setActiveId] = useState("home");

  const register = (goTo: GoTo | null): void => {
    goToRef.current = goTo;
  };

  const scrollTo = (id: ScreenId): void => {
    goToRef.current?.(id);
  };

  useSectionKeyboard(screenIds, activeId, scrollTo);

  const bridge: DeckBridge = { register, setActiveId };
  const value: SiteScrollValue = { activeId, scrollTo };

  return (
    <DeckBridgeContext.Provider value={bridge}>
      <SiteScrollContext.Provider value={value}>{children}</SiteScrollContext.Provider>
    </DeckBridgeContext.Provider>
  );
};

type ScreenDeckProps = {
  children: ReactNode;
};

export const ScreenDeck = ({ children }: ScreenDeckProps): ReactElement => {
  const bridge = useContext(DeckBridgeContext);
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const rootRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const lockedRef = useRef(false);
  const wheelRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const lockTimerRef = useRef<number | null>(null);
  const wheelTimerRef = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  const releaseLock = (): void => {
    lockedRef.current = false;
  };

  const resetWheel = (): void => {
    wheelRef.current = 0;
  };

  const moveToIndex = (nextIndex: number): void => {
    const clamped = Math.min(screenIds.length - 1, Math.max(0, nextIndex));
    if (clamped === indexRef.current || lockedRef.current) return;

    indexRef.current = clamped;
    setIndex(clamped);
    const id = screenIds[clamped] ?? "home";
    bridge?.setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);

    if (reducedRef.current) return;
    lockedRef.current = true;
    if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(releaseLock, measure.scrollMs);
  };

  const goTo = (id: ScreenId): void => {
    lockedRef.current = false;
    moveToIndex(getSectionIndex(screenIds, id));
  };

  const listen = (): (() => void) => {
    bridge?.register(goTo);

    const hashed = readScreenHash(window.location.hash, screenIds);
    if (hashed) moveToIndex(getSectionIndex(screenIds, hashed));

    const onWheel = (event: WheelEvent): void => {
      if (event.deltaY === 0) return;
      if (lockedRef.current) {
        event.preventDefault();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      const panel = findSectionScroller(rootRef.current ?? document, indexRef.current);
      if (panel && canScrollPanel(panel.scrollTop, panel.clientHeight, panel.scrollHeight, direction)) {
        panel.scrollBy({ top: event.deltaY });
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const consumed = consumeWheel(wheelRef.current, event.deltaY, wheelThreshold);
      wheelRef.current = consumed.remaining;
      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(resetWheel, wheelIdleMs);
      if (consumed.direction === 0) return;
      moveToIndex(indexRef.current + consumed.direction);
    };

    const onTouchStart = (event: TouchEvent): void => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      touchStartRef.current = touch.clientY;
    };

    const onTouchEnd = (event: TouchEvent): void => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (start === null || lockedRef.current) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const direction = getSwipeDirection(start, touch.clientY, swipeThreshold);
      if (direction === 0) return;
      const panel = findSectionScroller(rootRef.current ?? document, indexRef.current);
      if (panel && canScrollPanel(panel.scrollTop, panel.clientHeight, panel.scrollHeight, direction)) return;
      moveToIndex(indexRef.current + direction);
    };

    window.addEventListener("wheel", onWheel, wheelListenerOptions);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);

    const stop = (): void => {
      bridge?.register(null);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current);
    };

    return stop;
  };

  useEffect(listen, []);

  const trackStyle = { "--screen-index": index } as CSSProperties;

  return (
    <div ref={rootRef} className="screen-viewport">
      <div className="screen-track" data-reduced={reduced ? "true" : "false"} style={trackStyle}>
        {children}
      </div>
    </div>
  );
};

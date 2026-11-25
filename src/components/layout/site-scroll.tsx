"use client";

import ReactFullpage from "@fullpage/react-fullpage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { measure } from "@/data/design";
import { screenIds } from "@/data/sections";
import { readFullpageLicenseKey } from "@/helpers/fullpage-license";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { SiteScrollContext } from "@/hooks/use-site-scroll";
import type { ScreenId } from "@/types/section";
import type { SiteScrollValue } from "@/types/scroll";
import "fullpage.js/dist/fullpage.css";

type FullpageApi = {
  moveTo: (section: string | number, slide?: string | number) => void;
};

type ScrollBridge = {
  register: (api: FullpageApi | null) => void;
  setActiveId: (id: string) => void;
};

const ScrollBridgeContext = createContext<ScrollBridge | null>(null);

type SiteScrollProps = {
  children: ReactNode;
};

export const SiteScroll = ({ children }: SiteScrollProps): ReactElement => {
  const apiRef = useRef<FullpageApi | null>(null);
  const [activeId, setActiveId] = useState("home");

  const scrollTo = useCallback((id: ScreenId): void => {
    apiRef.current?.moveTo(id);
  }, []);

  const register = useCallback((api: FullpageApi | null): void => {
    apiRef.current = api;
  }, []);

  const bridge = useMemo<ScrollBridge>(() => ({ register, setActiveId }), [register]);
  const value = useMemo<SiteScrollValue>(() => ({ activeId, scrollTo }), [activeId, scrollTo]);

  return (
    <ScrollBridgeContext.Provider value={bridge}>
      <SiteScrollContext.Provider value={value}>{children}</SiteScrollContext.Provider>
    </ScrollBridgeContext.Provider>
  );
};

type FullpageProps = {
  children: ReactNode;
};

const readAnchor = (value: string | number | undefined): string =>
  typeof value === "string" && value.length > 0 ? value : "home";

const licenseKey = readFullpageLicenseKey(process.env.NEXT_PUBLIC_FULLPAGE_LICENSE_KEY);

const fullpageCredits = { enabled: true, label: "fullPage.js", position: "right" } as const;

type SectionDestination = {
  anchor?: string | number;
};

type FullpageView = {
  fullpageApi: FullpageApi;
};

export const Fullpage = ({ children }: FullpageProps): ReactElement => {
  const bridge = useContext(ScrollBridgeContext);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  const markReady = (): void => {
    setReady(true);
  };

  const syncSection = (_origin: SectionDestination, destination: SectionDestination): void => {
    bridge?.setActiveId(readAnchor(destination.anchor));
  };

  const renderSections = ({ fullpageApi }: FullpageView): ReactElement => {
    bridge?.register(fullpageApi);
    return <ReactFullpage.Wrapper>{children}</ReactFullpage.Wrapper>;
  };

  useEffect(markReady, []);

  if (!ready) {
    return <>{children}</>;
  }

  return (
    <ReactFullpage
      licenseKey={licenseKey}
      credits={fullpageCredits}
      anchors={[...screenIds]}
      scrollingSpeed={reduced ? 0 : measure.scrollMs}
      css3
      easingcss3="cubic-bezier(0.22, 1, 0.36, 1)"
      autoScrolling
      fitToSection
      scrollOverflow
      keyboardScrolling
      animateAnchor
      recordHistory={false}
      navigation={false}
      verticalCentered={false}
      sectionSelector=".section"
      onLeave={syncSection}
      afterLoad={syncSection}
      render={renderSections}
    />
  );
};

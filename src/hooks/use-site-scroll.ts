"use client";

import { createContext, useContext } from "react";
import type { SiteScrollValue } from "@/types/scroll";

const noop = (): void => undefined;

export const SiteScrollContext = createContext<SiteScrollValue>({
  activeId: "home",
  scrollTo: noop,
});

export const useSiteScroll = (): SiteScrollValue => useContext(SiteScrollContext);

import type { ScreenId } from "@/types/section";

export type ScrollStep = -1 | 1 | "start" | "end";

export type SiteScrollValue = {
  readonly activeId: string;
  readonly scrollTo: (id: ScreenId) => void;
};

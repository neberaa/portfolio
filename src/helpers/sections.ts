import type { Screen, ScreenId } from "@/types/section";

const navByScreen = {
  home: "home",
  about: null,
  skills: "skills",
  projects: "projects",
  pipeliner: "projects",
  leadership: null,
  contact: "contact",
} as const satisfies Record<ScreenId, ScreenId | null>;

const isNavScreen = (item: Screen): boolean => item.nav;

export const getNavSections = (items: readonly Screen[]): Screen[] => items.filter(isNavScreen);

export const getScreen = (items: readonly Screen[], id: ScreenId): Screen => {
  const matchesId = (item: Screen): boolean => item.id === id;
  const screen = items.find(matchesId);
  if (!screen) throw new Error(`Missing screen: ${id}`);
  return screen;
};

export const getSectionIndex = (ids: readonly string[], id: string): number => {
  const index = ids.indexOf(id);
  return index < 0 ? 0 : index;
};

export const getActiveNavId = (sectionId: string): ScreenId | null => {
  if (!(sectionId in navByScreen)) return null;
  return navByScreen[sectionId as ScreenId];
};

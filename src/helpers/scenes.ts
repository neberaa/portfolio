import type { CSSProperties } from "react";
import { screenIds } from "@/data/sections";
import { getSectionIndex } from "@/helpers/sections";
import { heroShapes, makePolygon, smallHeroShapes, type HeroShape } from "@/helpers/webgl";
import type { ScreenId } from "@/types/section";

export type ScreenScene = {
  readonly id: ScreenId;
  readonly index: number;
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly delay: number;
  readonly fade: number;
  readonly parallaxX: number;
  readonly parallaxY: number;
  readonly scrollLift: number;
  readonly roll: number;
  readonly spin: number;
  readonly follow: number;
  readonly bob: number;
  readonly veilX: string;
  readonly veilY: string;
  readonly shapes: readonly HeroShape[];
};

const scene = (
  id: ScreenId,
  x: number,
  y: number,
  scale: number,
  delay: number,
  fade: number,
  parallaxX: number,
  parallaxY: number,
  scrollLift: number,
  roll: number,
  spin: number,
  follow: number,
  bob: number,
  veilX: string,
  veilY: string,
  shapes: readonly HeroShape[],
): ScreenScene => ({
  id,
  index: getSectionIndex(screenIds, id),
  x,
  y,
  scale,
  delay,
  fade,
  parallaxX,
  parallaxY,
  scrollLift,
  roll,
  spin,
  follow,
  bob,
  veilX,
  veilY,
  shapes,
});

const aboutShapes = [makePolygon(5, 3.6, 0.11, 0.72, 5, 1.2, 0x00c9d8, 0.07, 0.7)] as const;

const skillShapes = [
  makePolygon(3, 2.8, -0.34, 1.05, 6, 1.6, 0x087bff, 0.055, 0.62),
  makePolygon(4, 1.5, 0.4, 0.3, 4, 2.4, 0x00c9d8, 0.04, 0.4),
] as const;

const projectShapes = [makePolygon(6, 4.4, 0.08, 0.48, 5, 0.8, 0x00c9d8, 0.07, 0.55)] as const;

const pipelinerShapes = [makePolygon(4, 3.2, -0.46, 0.95, 5, 1.8, 0x087bff, 0.06, 0.7)] as const;

const leadershipShapes = [
  makePolygon(4, 2.6, 0.09, 0.4, 4, 1.1, 0x00c9d8, 0.05, 0.5),
  makePolygon(4, 1.7, -0.14, 1.1, 4, 2.3, 0x087bff, 0.045, 0.4),
] as const;

const contactShapes = [makePolygon(6, 2.4, 0.18, 0.62, 5, 1.4, 0x00c9d8, 0.06, 0.8)] as const;

export const screenScenes: readonly ScreenScene[] = [
  scene("home", 0, 0, 1, 0, 0, 0.6, 1.4, 0, 0, 0, 1, 0.18, "50%", "50%", heroShapes),
  scene("about", 4.8, -1.8, 0.78, 0.55, 0.7, 0.35, 2.6, -1.2, 0.35, 0.04, 0.16, 0.06, "104%", "82%", aboutShapes),
  scene("skills", 4.4, 2.6, 0.58, 0.78, 0.6, 2.4, -0.4, -1.8, -0.5, -0.08, 0.12, 0.05, "96%", "6%", skillShapes),
  scene("projects", -5.4, 2.5, 0.92, 0.46, 0.75, -2.1, 1.3, -1.4, 0.2, 0.03, 0.14, 0.05, "-8%", "8%", projectShapes),
  scene("pipeliner", -5.8, -2.4, 0.6, 0.64, 0.55, 1.6, -2.2, 1.1, 0.78, 0.12, 0.1, 0.04, "-4%", "96%", pipelinerShapes),
  scene("leadership", 4.2, -2.5, 0.54, 0.86, 0.7, 2.8, 0.4, -0.8, 0.15, -0.03, 0.1, 0.04, "108%", "108%", leadershipShapes),
  scene("contact", 3.6, 0.8, 0.5, 0.42, 0.65, 0.5, 2.1, -0.6, -0.25, 0.06, 0.2, 0.08, "88%", "46%", contactShapes),
];

const compactScene = (item: ScreenScene): ScreenScene => {
  if (item.id === "home") return { ...item, shapes: smallHeroShapes };
  return { ...item, x: item.x * 0.62, y: item.y * 0.62, scale: item.scale * 0.84 };
};

const buildCompactScenes = (): ScreenScene[] => {
  const next: ScreenScene[] = [];
  for (const item of screenScenes) next.push(compactScene(item));
  return next;
};

export const smallScreenScenes: readonly ScreenScene[] = buildCompactScenes();

export const getScreenScenes = (isSmallScreen: boolean): readonly ScreenScene[] =>
  isSmallScreen ? smallScreenScenes : screenScenes;

export const findScreenScene = (id: string): ScreenScene | null => {
  for (const item of screenScenes) {
    if (item.id === id) return item;
  }
  return null;
};

export const sceneVeilStyle = (id: string): CSSProperties => {
  const item = findScreenScene(id);
  return {
    "--scene-x": item?.veilX ?? "50%",
    "--scene-y": item?.veilY ?? "50%",
  } as CSSProperties;
};

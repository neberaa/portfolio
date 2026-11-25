import { describe, expect, it } from "vitest";
import { findScreenScene, getScreenScenes, sceneVeilStyle } from "@/helpers/scenes";

describe("getScreenScenes", () => {
  it("keeps the hero centered and delays every later screen", () => {
    const scenes = getScreenScenes(false);
    const home = scenes[0];
    expect(home?.id).toBe("home");
    expect(home?.x).toBe(0);
    expect(home?.y).toBe(0);
    expect(home?.delay).toBe(0);
    expect(scenes[1]?.delay).toBeGreaterThan(0);
    expect(scenes[2]?.delay).toBeGreaterThan(scenes[1]?.delay ?? 0);
  });

  it("parks each later screen in a different place", () => {
    const scenes = getScreenScenes(false);
    const about = findScreenScene("about");
    const skills = findScreenScene("skills");
    const projects = findScreenScene("projects");
    const pipeliner = findScreenScene("pipeliner");
    expect(about?.x).toBeGreaterThan(2);
    expect(skills?.y).toBeGreaterThan(1);
    expect(projects?.x).toBeLessThan(-2);
    expect(pipeliner?.x).toBeLessThan(0);
    expect(projects?.parallaxX).not.toBe(pipeliner?.parallaxX);
    expect(scenes).toHaveLength(7);
  });

  it("uses a different polygon on about than on the hero", () => {
    const home = findScreenScene("home");
    const about = findScreenScene("about");
    expect(about?.shapes[0]?.sides).toBe(5);
    expect(about?.shapes[0]?.sides).not.toBe(home?.shapes[0]?.sides);
  });

  it("pulls a secondary scene inward on a small screen", () => {
    const desktop = getScreenScenes(false)[1];
    const small = getScreenScenes(true)[1];
    expect(Math.abs(small?.x ?? 0)).toBeLessThan(Math.abs(desktop?.x ?? 0));
    expect(getScreenScenes(true)[0]?.shapes[0]?.pointsPerEdge).toBeLessThan(
      getScreenScenes(false)[0]?.shapes[0]?.pointsPerEdge ?? 0,
    );
  });
});

describe("sceneVeilStyle", () => {
  it("opens the veil where that screen's polygon rests", () => {
    const about = sceneVeilStyle("about");
    const projects = sceneVeilStyle("projects");
    expect(about["--scene-x" as keyof typeof about]).toBe("104%");
    expect(projects["--scene-x" as keyof typeof projects]).toBe("-8%");
  });
});

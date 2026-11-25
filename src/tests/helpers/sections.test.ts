import { describe, expect, it } from "vitest";
import { screens } from "@/data/sections";
import { getActiveNavId, getNavSections, getScreen, getSectionIndex } from "@/helpers/sections";
import type { Screen } from "@/types/section";

describe("getNavSections", () => {
  it("keeps the header links only", () => {
    expect(getNavSections(screens).map((screen) => screen.id)).toEqual([
      "home",
      "skills",
      "projects",
      "contact",
    ]);
  });
});

describe("getScreen", () => {
  it("returns the matching screen", () => {
    expect(getScreen(screens, "skills").label).toBe("Skills");
  });

  it("throws when the screen is missing", () => {
    const empty: readonly Screen[] = [];
    expect(() => getScreen(empty, "skills")).toThrow("Missing screen: skills");
  });
});

describe("getSectionIndex", () => {
  it("finds a screen and falls back to the first", () => {
    expect(getSectionIndex(["home", "about"], "about")).toBe(1);
    expect(getSectionIndex(["home", "about"], "missing")).toBe(0);
  });
});

describe("getActiveNavId", () => {
  it("maps project screens to Projects", () => {
    expect(getActiveNavId("projects")).toBe("projects");
    expect(getActiveNavId("pipeliner")).toBe("projects");
  });

  it("leaves about and leadership without a nav item", () => {
    expect(getActiveNavId("about")).toBeNull();
    expect(getActiveNavId("leadership")).toBeNull();
  });

  it("ignores an unknown id", () => {
    expect(getActiveNavId("void")).toBeNull();
  });
});

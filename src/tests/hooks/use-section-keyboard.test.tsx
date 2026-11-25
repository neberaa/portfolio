import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSectionKeyboard } from "@/hooks/use-section-keyboard";
import type { ScreenId } from "@/types/section";

const ids = ["home", "about", "skills"] as const satisfies readonly ScreenId[];

const press = (key: string, target: EventTarget = window, extras: KeyboardEventInit = {}): void => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...extras }));
};

describe("useSectionKeyboard", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("scrolls to the next and previous screens", () => {
    const scrollTo = vi.fn();
    renderHook(() => useSectionKeyboard(ids, "about", scrollTo));

    press("ArrowDown");
    press("ArrowUp");
    press("Home");
    press("End");

    expect(scrollTo.mock.calls.map((call) => call[0])).toEqual(["skills", "home", "home", "skills"]);
  });

  it("ignores modified keys and typing targets", () => {
    const scrollTo = vi.fn();
    renderHook(() => useSectionKeyboard(ids, "home", scrollTo));

    const input = document.createElement("input");
    document.body.append(input);

    press("ArrowDown", input);
    press("ArrowDown", window, { metaKey: true });
    press("a");

    expect(scrollTo).not.toHaveBeenCalled();
  });
});

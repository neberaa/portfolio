import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useActiveSection } from "@/hooks/use-active-section";

type ObserverRecord = {
  callback: IntersectionObserverCallback;
  observed: Element[];
};

describe("useActiveSection", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
  });

  it("starts on the first id and follows the strongest intersection", () => {
    const records: ObserverRecord[] = [];

    class MockObserver {
      constructor(callback: IntersectionObserverCallback) {
        records.push({ callback, observed: [] });
      }

      observe = (element: Element): void => {
        records[0]?.observed.push(element);
      };

      disconnect = (): void => undefined;
    }

    vi.stubGlobal("IntersectionObserver", MockObserver);
    document.body.innerHTML = '<section id="home"></section><section id="about"></section>';

    const { result } = renderHook(() => useActiveSection(["home", "about"]));
    expect(result.current).toBe("home");
    expect(records[0]?.observed).toHaveLength(2);

    const about = document.getElementById("about");
    act(() => {
      records[0]?.callback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.8,
            target: about,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe("about");
  });

  it("keeps the first id when the observer is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { result } = renderHook(() => useActiveSection(["home", "skills"]));
    expect(result.current).toBe("home");
  });
});

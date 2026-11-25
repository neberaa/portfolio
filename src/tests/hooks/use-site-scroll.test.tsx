import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSiteScroll } from "@/hooks/use-site-scroll";

describe("useSiteScroll", () => {
  it("starts on home when no provider is mounted", () => {
    const { result } = renderHook(() => useSiteScroll());
    expect(result.current.activeId).toBe("home");
    expect(result.current.scrollTo).toEqual(expect.any(Function));
  });
});

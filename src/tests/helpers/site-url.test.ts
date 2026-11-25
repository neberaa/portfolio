import { describe, expect, it } from "vitest";
import { getSiteUrl } from "@/helpers/site-url";

describe("getSiteUrl", () => {
  it("falls back when the value is missing", () => {
    expect(getSiteUrl(undefined)).toBe("http://localhost:3000");
    expect(getSiteUrl("   ")).toBe("http://localhost:3000");
  });

  it("strips a trailing slash", () => {
    expect(getSiteUrl("https://example.com/")).toBe("https://example.com");
  });
});

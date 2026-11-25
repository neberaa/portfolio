import { describe, expect, it } from "vitest";
import { readFullpageLicenseKey } from "@/helpers/fullpage-license";

describe("readFullpageLicenseKey", () => {
  it("returns an empty string when the value is missing", () => {
    expect(readFullpageLicenseKey(undefined)).toBe("");
  });

  it("trims a provided key", () => {
    expect(readFullpageLicenseKey("  abc-key  ")).toBe("abc-key");
  });
});

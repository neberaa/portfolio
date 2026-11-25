import { describe, expect, it } from "vitest";
import { nextAccordionId } from "@/helpers/accordion";

describe("nextAccordionId", () => {
  it("opens the selected group and closes the one that was open", () => {
    expect(nextAccordionId("Frontend Engineering", "Cloud & Delivery")).toBe("Cloud & Delivery");
  });

  it("closes the group when it is selected again", () => {
    expect(nextAccordionId("Frontend Engineering", "Frontend Engineering")).toBe("");
  });
});

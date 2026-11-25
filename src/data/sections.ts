import type { Screen } from "@/types/section";

export const screens = [
  { id: "home", label: "Home", index: "01", nav: true },
  { id: "about", label: "About", index: "02", nav: false },
  { id: "skills", label: "Skills", index: "03", nav: true },
  { id: "projects", label: "Projects", index: "04", nav: true },
  { id: "pipeliner", label: "Pipeliner", index: "05", nav: false },
  { id: "leadership", label: "Leadership", index: "06", nav: false },
  { id: "contact", label: "Contact", index: "07", nav: true },
] as const satisfies readonly Screen[];

export const screenIds = screens.map((screen) => screen.id);

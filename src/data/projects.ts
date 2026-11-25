import type { Project } from "@/types/project";

export const flagshipProject = {
  id: "projects",
  index: "04",
  eyebrow: "Selected work",
  title: "Large-scale website modernisation",
  summary:
    "Sole technical owner for a public website rebuild. Vue.js and Prismic were replaced with Next.js and Hygraph.",
  meta: ["Sole technical owner", "Five-person team", "Four months", "1,000+ pages"],
  beats: [
    {
      label: "Context",
      text: "Technical lead and sole technical owner for the modernisation of a large public website.",
    },
    {
      label: "Limitations",
      text: "The Vue.js and Prismic platform made a shared content model and reusable page structures hard to sustain.",
    },
    {
      label: "Decisions",
      text: "The rebuild moved to Next.js and Hygraph, using Incremental Static Regeneration for the page volume.",
    },
    {
      label: "Migration",
      text: "More than 1,000 pages moved onto reusable components, flexible page structures, and a redesigned design system.",
    },
    {
      label: "Team",
      text: "A five-person cross-functional team delivered the migration, rebrand, and content model in four months.",
    },
    {
      label: "Outcome",
      text: "Marketing can publish through the content model without engineering every page. Motion on the site uses Framer Motion.",
    },
  ],
  href: null,
  hrefLabel: null,
} as const satisfies Project;

export const pipelinerProject = {
  id: "pipeliner",
  index: "05",
  eyebrow: "Selected work",
  title: "Pipeliner Online",
  summary:
    "Freelance frontend development for a finance product, concurrent with the permanent role, from January 2024 to 2025.",
  meta: ["Freelance", "Finance product", "January 2024 – 2025"],
  beats: [
    {
      label: "Interfaces",
      text: "Data-heavy screens: complex tables, financial calculations, and responsive layouts.",
    },
    {
      label: "Landing page",
      text: "The public marketing site was designed and built from scratch.",
    },
  ],
  href: "https://pipeliner.online",
  hrefLabel: "pipeliner.online",
} as const satisfies Project;

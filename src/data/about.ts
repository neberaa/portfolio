import type { AboutContent } from "@/types/profile";

export const about = {
  index: "02",
  eyebrow: "About",
  title: "Building products. Leading teams. Engineering better experiences.",
  paragraphs: [
    "I am a frontend team lead with more than nine years in software engineering, based in Derbyshire. I lead frontend work across squads and stay hands-on with architecture and implementation.",
    "The products have spanned hospitality, healthcare, warehouse management, education, and finance. The work is production software: clear structure, a design system people can extend, and delivery the team can repeat.",
    "I use AI-assisted engineering workflows, including Claude Code and Cursor, with the same review standard as any other change.",
  ],
  facts: [
    { label: "Experience", value: "9+ years" },
    { label: "Based", value: "Derbyshire, United Kingdom" },
    { label: "Role", value: "Frontend Team Lead, ApexTech Inc., LLC" },
    { label: "Languages", value: "Ukrainian, English, Czech" },
  ],
} as const satisfies AboutContent;

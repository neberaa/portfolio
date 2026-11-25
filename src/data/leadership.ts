import type { LeadershipContent } from "@/types/profile";

export const leadership = {
  index: "06",
  eyebrow: "Approach",
  title: "Strong engineering is built by people, systems and decisions.",
  paragraphs: [
    "I lead frontend squads of four to six developers. The job is the architecture, the standards, and the release, not a separate layer above the code.",
    "That means frontend architecture, code review, and mentoring people as their judgement grows. Hiring and technical interviews are part of the same responsibility, together with sprint and release planning.",
    "The useful decisions happen with design, product, and backend engineers in the room. Technical talks and shared notes keep those decisions visible after the meeting.",
  ],
  topics: [
    "Squads of 4–6",
    "Architecture",
    "Code review",
    "Mentoring",
    "Hiring",
    "Release planning",
  ],
} as const satisfies LeadershipContent;

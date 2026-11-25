import type { SkillGroup } from "@/types/skill";

export const skillGroups = [
  {
    title: "Frontend Engineering",
    note: null,
    items: [
      "JavaScript / TypeScript",
      "React",
      "Next.js",
      "Vue.js / Nuxt.js",
      "React Native",
      "Design systems",
      "Reusable component architecture",
      "Performance optimisation",
    ],
  },
  {
    title: "Architecture & Technical Leadership",
    note: "GraphQL and Apollo Federation work is collaboration with backend engineers.",
    items: [
      "Frontend architecture",
      "State management",
      "API integration",
      "GraphQL",
      "Apollo / Apollo Federation",
      "Code reviews",
      "Technical decision-making",
      "Mentoring and team leadership",
    ],
  },
  {
    title: "AI-assisted Engineering",
    note: null,
    items: [
      "Claude Code",
      "Cursor",
      "Model Context Protocol (MCP)",
      "Parallel agents",
      "Reusable skills",
      "Workflow automation",
    ],
  },
  {
    title: "Cloud & Delivery",
    note: "Kubernetes is an existing deployment environment, not infrastructure I architect.",
    items: [
      "AWS CloudFront",
      "AWS Lambda",
      "AWS S3",
      "Kubernetes-based deployment workflows",
      "Docker",
      "Bitbucket Pipelines",
      "Jenkins",
      "Blue-Green deployments",
    ],
  },
] as const satisfies readonly SkillGroup[];

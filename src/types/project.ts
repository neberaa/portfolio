export type ProjectBeat = {
  readonly label: string;
  readonly text: string;
};

export type Project = {
  readonly id: "projects" | "pipeliner";
  readonly index: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly meta: readonly string[];
  readonly beats: readonly ProjectBeat[];
  readonly href: string | null;
  readonly hrefLabel: string | null;
};

export type Fact = {
  readonly label: string;
  readonly value: string;
};

export type AboutContent = {
  readonly index: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly facts: readonly Fact[];
};

export type LeadershipContent = {
  readonly index: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly topics: readonly string[];
};

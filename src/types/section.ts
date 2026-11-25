export type ScreenId =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "pipeliner"
  | "leadership"
  | "contact";

export type Screen = {
  readonly id: ScreenId;
  readonly label: string;
  readonly index: string;
  readonly nav: boolean;
};

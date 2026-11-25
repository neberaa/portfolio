import type { ReactElement } from "react";
import { typeClass } from "@/data/design";
import { Eyebrow } from "@/components/ui/type";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
};

export const SectionHeading = ({ index, eyebrow, title }: SectionHeadingProps): ReactElement => (
  <header>
    <Eyebrow index={index} label={eyebrow} />
    <h2 className={typeClass.heading}>{title}</h2>
  </header>
);

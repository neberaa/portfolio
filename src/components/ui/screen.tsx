import type { ReactElement, ReactNode } from "react";
import { layoutClass } from "@/data/design";

type ScreenProps = {
  id: string;
  label: string;
  children: ReactNode;
};

export const Screen = ({ id, label, children }: ScreenProps): ReactElement => (
  <section id={`${id}-panel`} aria-label={label} className="section screen-panel relative bg-background/90">
    <div className="section-scroll">
      <div className={layoutClass.section}>{children}</div>
    </div>
  </section>
);

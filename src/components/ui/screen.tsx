import type { ReactElement, ReactNode } from "react";
import { layoutClass } from "@/data/design";
import { sceneVeilStyle } from "@/helpers/scenes";

type ScreenProps = {
  id: string;
  label: string;
  children: ReactNode;
};

export const Screen = ({ id, label, children }: ScreenProps): ReactElement => (
  <section
    id={`${id}-panel`}
    aria-label={label}
    data-scene={id}
    className="section screen-panel scene-veil relative"
    style={sceneVeilStyle(id)}
  >
    <div className="section-scroll">
      <div className={layoutClass.section}>{children}</div>
    </div>
  </section>
);

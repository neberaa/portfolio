"use client";

import type { CSSProperties, ReactElement } from "react";
import { layoutClass, typeClass } from "@/data/design";
import { screenIds } from "@/data/sections";
import { getExplorePercent } from "@/helpers/scroll";
import { getSectionIndex } from "@/helpers/sections";
import { useSiteScroll } from "@/hooks/use-site-scroll";

const minimumFill = 8;

export const ExploreRail = (): ReactElement => {
  const { activeId } = useSiteScroll();
  const percent = getExplorePercent(getSectionIndex(screenIds, activeId), screenIds.length);
  const fill = Math.max(percent, minimumFill);
  const fillStyle = { height: `${fill}%` } as CSSProperties;

  return (
    <div className={`${layoutClass.rail} pointer-events-none hidden lg:block`}>
      <div className="flex items-center gap-4">
        <p className={`explore-label ${typeClass.explore}`}>Explore</p>
        <div className="flex flex-col items-center gap-3">
          <div
            className={layoutClass.track}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="Page progress"
          >
            <span className="absolute inset-x-0 top-0 bg-cyan" style={fillStyle} />
          </div>
          <p className={typeClass.percent}>{percent}%</p>
        </div>
      </div>
    </div>
  );
};

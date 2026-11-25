"use client";

import { ArrowDown } from "lucide-react";
import type { ReactElement } from "react";
import { layoutClass, measure, palette, typeClass } from "@/data/design";
import { useSiteScroll } from "@/hooks/use-site-scroll";

export const Hero = (): ReactElement => {
  const { scrollTo } = useSiteScroll();
  const goAbout = (): void => {
    scrollTo("about");
  };

  return (
    <section id="home-panel" aria-label="Home" className="section screen-panel relative">
      <div className="section-scroll">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#08090B_0%,rgba(8,9,11,0.9)_46%,rgba(8,9,11,0.35)_100%)]" />
      <div className={`rise-in ${layoutClass.heroCopy}`}>
        <h1 className={typeClass.display}>
          <span className="block text-ink">ANTON</span>
          <span className="surname block">NEBERA</span>
        </h1>
        <p className={`mt-8 ${typeClass.role}`}>
          Frontend Tech Lead
          <span className="sep">·</span>
          Engineer
          <span className="sep">·</span>
          Product Builder
        </p>
      </div>
      </div>
      <button type="button" onClick={goAbout} className={`${layoutClass.cue} ${typeClass.explore}`}>
        Scroll to explore
        <ArrowDown className="scroll-cue" color={palette.cyan} size={measure.iconSm} strokeWidth={measure.iconStroke} aria-hidden />
      </button>
    </section>
  );
};

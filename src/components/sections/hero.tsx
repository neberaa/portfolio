"use client";

import { ArrowDown } from "lucide-react";
import type { ReactElement } from "react";
import { layoutClass, measure, typeClass } from "@/data/design";
import { useSiteScroll } from "@/hooks/use-site-scroll";

export const Hero = (): ReactElement => {
  const { scrollTo } = useSiteScroll();
  const goAbout = (): void => {
    scrollTo("about");
  };

  return (
    <section id="home-panel" aria-label="Home" className="section screen-panel relative">
      <div className="section-scroll">
      <div className="hero-veil pointer-events-none absolute inset-0" />
      <div className={layoutClass.heroCopy}>
        <h1 className={typeClass.display}>
          <span className="block text-ink">ANTON</span>
          <span className="surname block">NEBERA</span>
        </h1>
        <p className={`mt-8 ${typeClass.role}`}>
          <span className="role-part">Frontend Tech Lead</span>
          <span className="sep">·</span>
          <span className="role-part">AI Engineer</span>
          <span className="sep">·</span>
          <span className="role-part">Product Builder</span>
        </p>
      </div>
      </div>
      <button type="button" onClick={goAbout} className={`${layoutClass.cue} ${typeClass.explore}`}>
        Scroll to explore
        <ArrowDown className="scroll-cue" size={measure.iconSm} strokeWidth={measure.iconStroke} aria-hidden />
      </button>
    </section>
  );
};

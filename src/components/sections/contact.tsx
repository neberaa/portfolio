import { Mail } from "lucide-react";
import type { ReactElement } from "react";
import { layoutClass, measure, typeClass } from "@/data/design";
import { screens } from "@/data/sections";
import { site } from "@/data/site";
import { getScreen } from "@/helpers/sections";
import { LinkedInIcon } from "@/components/ui/linkedin-icon";
import { Reveal } from "@/components/ui/reveal";
import { Screen } from "@/components/ui/screen";
import { Eyebrow } from "@/components/ui/type";

const contactScreen = getScreen(screens, "contact");

export const Contact = (): ReactElement => (
  <Screen id="contact" label="Contact">
    <Reveal className="flex h-full flex-col justify-between">
      <div>
        <Eyebrow index={contactScreen.index} label="Contact" />
        <h2 className={typeClass.title}>Have a project or a team to build?</h2>
        <div className={`mt-10 ${layoutClass.stack}`}>
          <a href={site.emailHref} className={layoutClass.linkRow}>
            <Mail size={measure.iconSm} strokeWidth={measure.iconStroke} aria-hidden />
            {site.email}
          </a>
          <a href={site.linkedIn} target="_blank" rel="noreferrer" className={layoutClass.linkRow}>
            <LinkedInIcon />
            {site.linkedInLabel}
          </a>
        </div>
      </div>
      <footer className="mt-12 flex items-end justify-between gap-6 border-t border-ink/10 pt-6">
        <p className={typeClass.brand}>AN</p>
        <p className={`text-right ${typeClass.meta}`}>
          {site.name}
          <span className="sep">·</span>
          {site.location}
        </p>
      </footer>
    </Reveal>
  </Screen>
);

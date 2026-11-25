import type { ReactElement } from "react";
import { screens } from "@/data/sections";
import { getScreen } from "@/helpers/sections";
import { SkillAccordion } from "@/components/sections/skill-accordion";
import { Reveal } from "@/components/ui/reveal";
import { Screen } from "@/components/ui/screen";
import { Eyebrow } from "@/components/ui/type";

const skillsScreen = getScreen(screens, "skills");

export const Skills = (): ReactElement => (
  <Screen id="skills" label="Skills">
    <Reveal>
      <Eyebrow index={skillsScreen.index} label="Expertise" />
      <SkillAccordion />
    </Reveal>
  </Screen>
);

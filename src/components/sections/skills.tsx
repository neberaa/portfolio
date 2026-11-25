import type { ReactElement } from "react";
import { screens } from "@/data/sections";
import { skillGroups } from "@/data/skills";
import { typeClass } from "@/data/design";
import { getScreen } from "@/helpers/sections";
import { Reveal } from "@/components/ui/reveal";
import { Screen } from "@/components/ui/screen";
import { Eyebrow } from "@/components/ui/type";
import type { SkillGroup } from "@/types/skill";

const skillsScreen = getScreen(screens, "skills");

const SkillItem = ({ text }: { text: string }): ReactElement => <li className={typeClass.small}>{text}</li>;

const renderSkill = (item: string): ReactElement => <SkillItem key={item} text={item} />;

const SkillGroupBlock = ({ group }: { group: SkillGroup }): ReactElement => (
  <section aria-label={group.title}>
    <h2 className={typeClass.group}>{group.title}</h2>
    {group.note ? <p className={typeClass.quiet}>{group.note}</p> : null}
    <ul className="mt-4 space-y-2">{group.items.map(renderSkill)}</ul>
  </section>
);

const renderGroup = (group: SkillGroup): ReactElement => <SkillGroupBlock key={group.title} group={group} />;

export const Skills = (): ReactElement => (
  <Screen id="skills" label="Skills">
    <Reveal>
      <Eyebrow index={skillsScreen.index} label="Expertise" />
      <div className="mt-8 grid gap-10 sm:grid-cols-2 xl:grid-cols-4">{skillGroups.map(renderGroup)}</div>
    </Reveal>
  </Screen>
);

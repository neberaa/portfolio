"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactElement } from "react";
import { measure, palette, typeClass } from "@/data/design";
import { skillGroups } from "@/data/skills";
import { nextAccordionId } from "@/helpers/accordion";
import type { SkillGroup } from "@/types/skill";

const initialId = skillGroups[0]?.title ?? "";

type SkillAccordionItemProps = {
  group: SkillGroup;
  index: number;
  open: boolean;
  onToggle: (id: string) => void;
};

const SkillItem = ({ text }: { text: string }): ReactElement => <li className={typeClass.small}>{text}</li>;

const renderSkill = (item: string): ReactElement => <SkillItem key={item} text={item} />;

const SkillAccordionItem = ({ group, index, open, onToggle }: SkillAccordionItemProps): ReactElement => {
  const toggle = (): void => {
    onToggle(group.title);
  };
  const headingId = `skill-heading-${index}`;
  const panelId = `skill-panel-${index}`;

  return (
    <div className="accordion-item" data-open={open ? "true" : "false"}>
      <h2 className={typeClass.group} id={headingId}>
        <button
          type="button"
          className="accordion-trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
        >
          <span>{group.title}</span>
          <ChevronDown
            className="accordion-chevron"
            color={palette.cyan}
            size={measure.iconSm}
            strokeWidth={measure.iconStroke}
            aria-hidden
          />
        </button>
      </h2>
      <div id={panelId} className="accordion-panel" role="region" aria-labelledby={headingId} aria-hidden={!open}>
        <div className="accordion-panel-inner">
          <div className="accordion-body">
            {group.note ? <p className={typeClass.quiet}>{group.note}</p> : null}
            <ul className="accordion-list">{group.items.map(renderSkill)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkillAccordion = (): ReactElement => {
  const [openId, setOpenId] = useState<string>(initialId);

  const toggleGroup = (id: string): void => {
    setOpenId(nextAccordionId(openId, id));
  };

  const renderGroup = (group: SkillGroup, index: number): ReactElement => (
    <SkillAccordionItem key={group.title} group={group} index={index} open={openId === group.title} onToggle={toggleGroup} />
  );

  return <div className="accordion">{skillGroups.map(renderGroup)}</div>;
};

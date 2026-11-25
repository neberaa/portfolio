import type { ReactElement } from "react";
import { typeClass } from "@/data/design";
import { HoverCard } from "@/components/ui/hover-card";
import { Reveal } from "@/components/ui/reveal";
import { Screen } from "@/components/ui/screen";
import { Eyebrow, MetaCopy } from "@/components/ui/type";
import type { Project, ProjectBeat } from "@/types/project";

type ProjectScreenProps = {
  project: Project;
};

const renderMeta = (item: string): ReactElement => <MetaCopy key={item} text={item} />;

const Beat = ({ beat }: { beat: ProjectBeat }): ReactElement => (
  <HoverCard>
    <h3 className={typeClass.metaWide}>{beat.label}</h3>
    <p className={typeClass.small}>{beat.text}</p>
  </HoverCard>
);

const renderBeat = (beat: ProjectBeat): ReactElement => <Beat key={beat.label} beat={beat} />;

export const ProjectScreen = ({ project }: ProjectScreenProps): ReactElement => (
  <Screen id={project.id} label={project.title}>
    <Reveal>
      <Eyebrow index={project.index} label={project.eyebrow} />
      <h2 className={typeClass.heading}>{project.title}</h2>
      <p className={`mt-5 ${typeClass.body}`}>{project.summary}</p>
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">{project.meta.map(renderMeta)}</ul>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{project.beats.map(renderBeat)}</div>
      {project.href && project.hrefLabel ? (
        <a href={project.href} target="_blank" rel="noreferrer" className={`mt-8 inline-flex ${typeClass.link}`}>
          {project.hrefLabel}
        </a>
      ) : null}
    </Reveal>
  </Screen>
);

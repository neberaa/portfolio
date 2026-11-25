import type { ReactElement } from "react";
import { leadership } from "@/data/leadership";
import { typeClass } from "@/data/design";
import { Reveal } from "@/components/ui/reveal";
import { Screen } from "@/components/ui/screen";
import { SectionHeading } from "@/components/ui/section-heading";
import { MetaCopy, SmallCopy } from "@/components/ui/type";

const renderParagraph = (paragraph: string): ReactElement => <SmallCopy key={paragraph} text={paragraph} />;

const renderTopic = (topic: string): ReactElement => <MetaCopy key={topic} text={topic} />;

export const Leadership = (): ReactElement => (
  <Screen id="leadership" label="Leadership">
    <Reveal>
      <SectionHeading index={leadership.index} eyebrow={leadership.eyebrow} title={leadership.title} />
      <div className="mt-8 grid max-w-5xl gap-5 md:grid-cols-3">{leadership.paragraphs.map(renderParagraph)}</div>
      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">{leadership.topics.map(renderTopic)}</ul>
    </Reveal>
  </Screen>
);

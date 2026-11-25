import type { ReactElement } from "react";
import { about } from "@/data/about";
import { layoutClass, typeClass } from "@/data/design";
import { Reveal } from "@/components/ui/reveal";
import { Screen } from "@/components/ui/screen";
import { SectionHeading } from "@/components/ui/section-heading";
import { BodyCopy } from "@/components/ui/type";
import type { Fact } from "@/types/profile";

const renderParagraph = (paragraph: string): ReactElement => <BodyCopy key={paragraph} text={paragraph} />;

const FactItem = ({ fact }: { fact: Fact }): ReactElement => (
  <div>
    <dt className={typeClass.metaWide}>{fact.label}</dt>
    <dd className={typeClass.fact}>{fact.value}</dd>
  </div>
);

const renderFact = (fact: Fact): ReactElement => <FactItem key={fact.label} fact={fact} />;

export const About = (): ReactElement => (
  <Screen id="about" label="About">
    <Reveal className="grid items-start gap-12 lg:grid-cols-[1.4fr_0.8fr]">
      <div>
        <SectionHeading index={about.index} eyebrow={about.eyebrow} title={about.title} />
        <div className={`mt-8 max-w-xl ${layoutClass.stack}`}>{about.paragraphs.map(renderParagraph)}</div>
      </div>
      <dl className={`${layoutClass.stack} border-t border-ink/10 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8`}>
        {about.facts.map(renderFact)}
      </dl>
    </Reveal>
  </Screen>
);

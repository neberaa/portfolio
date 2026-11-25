import type { ReactElement } from "react";
import { typeClass } from "@/data/design";

type EyebrowProps = {
  index: string;
  label: string;
};

type CopyProps = {
  text: string;
};

export const Eyebrow = ({ index, label }: EyebrowProps): ReactElement => (
  <p className={typeClass.eyebrow}>
    {index}
    <span className="sep">/</span>
    {label}
  </p>
);

export const BodyCopy = ({ text }: CopyProps): ReactElement => <p className={typeClass.body}>{text}</p>;

export const SmallCopy = ({ text }: CopyProps): ReactElement => <p className={typeClass.small}>{text}</p>;

export const MetaCopy = ({ text }: CopyProps): ReactElement => <li className={typeClass.meta}>{text}</li>;

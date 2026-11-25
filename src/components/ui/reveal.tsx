import type { ReactElement, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

export const Reveal = ({ children, className }: RevealProps): ReactElement => (
  <div className={className ? `rise-in ${className}` : "rise-in"}>{children}</div>
);

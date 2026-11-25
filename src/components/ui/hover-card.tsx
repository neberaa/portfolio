"use client";

import { motion } from "framer-motion";
import type { ReactElement, ReactNode } from "react";
import { measure } from "@/data/design";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const hoverMotion = { y: measure.lift } as const;
const hoverTransition = { duration: measure.hoverMs, ease: "easeOut" } as const;

type HoverCardProps = {
  children: ReactNode;
};

export const HoverCard = ({ children }: HoverCardProps): ReactElement => {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <article>{children}</article>;

  return (
    <motion.article whileHover={hoverMotion} transition={hoverTransition}>
      {children}
    </motion.article>
  );
};

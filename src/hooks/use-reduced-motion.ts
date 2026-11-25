"use client";

import { useEffect, useState } from "react";
import { readReducedMotion } from "@/helpers/motion";

export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (): void => setReduced(readReducedMotion(query.matches));
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
};

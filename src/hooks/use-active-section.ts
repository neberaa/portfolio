"use client";

import { useEffect, useState } from "react";

export const useActiveSection = (ids: readonly string[]): string => {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = ids.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visible) setActiveId(visible.target.id);
      },
      { threshold: [0.55] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
};

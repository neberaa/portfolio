"use client";

import { useEffect, useState, type ReactElement } from "react";
import { SceneField } from "@/components/webgl/scene-field";
import { measure } from "@/data/design";
import { heroTextAnimation, heroTextSettleMs, isHeroTextSettled } from "@/helpers/motion";

const readPlayState = (element: HTMLElement): string | null => {
  const animations = element.getAnimations();
  for (const animation of animations) {
    if (animation.animationName === heroTextAnimation) return animation.playState;
  }
  return null;
};

export const SceneBackground = (): ReactElement | null => {
  const [ready, setReady] = useState(false);

  const watchText = (): (() => void) => {
    const copy = document.querySelector(".hero-copy");
    const reveal = (): void => setReady(true);
    const idle = (): void => undefined;
    if (!(copy instanceof HTMLElement)) {
      reveal();
      return idle;
    }
    if (isHeroTextSettled(getComputedStyle(copy).animationName, readPlayState(copy))) {
      reveal();
      return idle;
    }
    const onEnd = (event: AnimationEvent): void => {
      if (event.animationName !== heroTextAnimation) return;
      reveal();
    };
    copy.addEventListener("animationend", onEnd);
    const timer = window.setTimeout(reveal, heroTextSettleMs(measure.heroFadeDelay, measure.heroFade));
    const stop = (): void => {
      copy.removeEventListener("animationend", onEnd);
      window.clearTimeout(timer);
    };
    return stop;
  };

  useEffect(watchText, []);

  if (!ready) return null;
  return <SceneField />;
};

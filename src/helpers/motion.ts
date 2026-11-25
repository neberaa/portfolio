export const heroTextAnimation = "hero-fade";

export const readReducedMotion = (matches: boolean | null): boolean => matches === true;

export const durationMs = (value: string): number => {
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) return 0;
  if (value.endsWith("ms")) return amount;
  return amount * 1000;
};

export const heroTextSettleMs = (delay: string, duration: string): number =>
  durationMs(delay) + durationMs(duration);

export const isHeroTextSettled = (animationName: string, playState: string | null): boolean => {
  const names = animationName.split(",");
  let fades = false;
  for (const name of names) {
    if (name.trim() === heroTextAnimation) fades = true;
  }
  if (!fades) return true;
  return playState === "finished";
};

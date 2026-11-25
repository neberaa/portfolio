export const getSiteUrl = (value: string | undefined): string => {
  const url = value?.trim();
  if (!url) return "http://localhost:3000";
  return url.replace(/\/$/, "");
};

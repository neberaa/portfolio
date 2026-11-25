import localFont from "next/font/local";

export const spaceGrotesk = localFont({
  src: [
    { path: "./SpaceGrotesk-Regular.ttf", weight: "400", style: "normal" },
    { path: "./SpaceGrotesk-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-display-face",
  display: "swap",
});

export const plexSans = localFont({
  src: [
    { path: "./IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "./IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-body-face",
  display: "swap",
});

export const plexMono = localFont({
  src: [
    { path: "./IBMPlexMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "./IBMPlexMono-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-code-face",
  display: "swap",
});

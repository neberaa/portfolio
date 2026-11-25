import type { Metadata, Viewport } from "next";
import type { ReactElement, ReactNode } from "react";
import { designStyle, palette } from "@/data/design";
import { personJsonLd, site } from "@/data/site";
import { plexMono, plexSans, spaceGrotesk } from "@/fonts";
import { getSiteUrl } from "@/helpers/site-url";
import { SiteScroll } from "@/components/layout/site-scroll";
import { CursorRing } from "@/components/ui/cursor-ring";
import { SceneBackground } from "@/components/webgl/scene-background";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)),
  title: site.title,
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "en_GB",
    siteName: site.name,
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: palette.background,
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps): ReactElement => (
  <html
    lang="en"
    className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    style={designStyle}
  >
    <body>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <SiteScroll>
        <SceneBackground />
        {children}
      </SiteScroll>
      <CursorRing />
    </body>
  </html>
);

export default RootLayout;

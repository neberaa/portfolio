import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/helpers/site-url";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: `${getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)}/sitemap.xml`,
});

export default robots;

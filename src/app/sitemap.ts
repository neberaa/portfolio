import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/helpers/site-url";

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  },
];

export default sitemap;

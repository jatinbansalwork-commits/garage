import type { Metadata } from "next";
import { BrandPage } from "@/components/garage/docs/brand-page";
import { ROUTES } from "@/lib/constants";
import { buildPageMetadata, GARAGE_SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pair with brand · Garage",
  description: "Drop a brand hex and see Garage buttons and inputs wear it.",
  path: `${ROUTES.garage}/brand`,
  keywords: [...GARAGE_SEO_KEYWORDS, "brand", "color"],
});

export default function GarageBrandRoute() {
  return <BrandPage />;
}

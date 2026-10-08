import type { Metadata } from "next";
import { GarageShell } from "@/components/garage/garage-shell";
import { ROUTES, SITE_NAME } from "@/lib/constants";
import { buildPageMetadata, GARAGE_SEO_DESCRIPTION, GARAGE_SEO_KEYWORDS } from "@/lib/seo";
import "./garage.css";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Garage — Interface Component Workbench",
    description: GARAGE_SEO_DESCRIPTION,
    path: ROUTES.garage,
    keywords: [...GARAGE_SEO_KEYWORDS],
  }),
  title: { default: "Garage — Interface Component Workbench", template: `%s · ${SITE_NAME}` },
};

export default function GarageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <GarageShell>{children}</GarageShell>;
}

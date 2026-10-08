import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ibmPlexSans, justAnotherHand } from "@/lib/fonts";
import { ROOT_METADATA } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = ROOT_METADATA;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${justAnotherHand.variable} bg-background`}>
      <body className={`${ibmPlexSans.className} relative min-h-screen bg-background text-white antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

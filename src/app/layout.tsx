import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AppTabBar } from "@/components/app-tab-bar";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"] });

export const metadata: Metadata = {
  title: { default: "Supple-MEANT — supplements poured into your coffee", template: "%s · Supple-MEANT" },
  description:
    "Take a 2-minute quiz and get a supplement blend made for you, in a coffee creamer or liposomal drops. Demo store.",
  applicationName: "Supple-MEANT",
  appleWebApp: { capable: true, title: "Supple-MEANT", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f6efe6",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <div className="bg-espresso px-4 py-2 text-center text-xs text-cream">
          Demo store for a class project — no real orders or payments.
        </div>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <AppTabBar />
        <Analytics />
      </body>
    </html>
  );
}

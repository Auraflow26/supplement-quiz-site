import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Supple-MEANT",
    short_name: "Supple-MEANT",
    description: "Your supplements, poured into your coffee. Take the quiz and get a blend made for you.",
    id: "/",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6efe6",
    theme_color: "#f6efe6",
    categories: ["health", "lifestyle", "shopping"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Take the quiz", url: "/quiz", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "My blend", url: "/blend", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}

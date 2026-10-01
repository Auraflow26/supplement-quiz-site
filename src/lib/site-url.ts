import "server-only";
import { headers } from "next/headers";

/**
 * Absolute origin for links in emails. Prefers configured/Vercel-provided URLs over
 * the request's Host header, so a spoofed Host can't redirect password-reset links.
 */
export async function siteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const host = (await headers()).get("host") ?? "localhost:3000";
  return `http://${host}`;
}

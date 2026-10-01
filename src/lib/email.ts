import "server-only";
import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "Supple-MEANT <onboarding@resend.dev>";

/**
 * Sends an email through Resend. Returns false instead of throwing so a failed
 * email never blocks sign-up or an order. Without a verified domain, Resend only
 * delivers to the account owner's address.
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("RESEND_API_KEY not set; skipping email:", subject);
    return false;
  }
  try {
    const { error } = await new Resend(key).emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error("Resend error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend request failed:", err);
    return false;
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function layout(title: string, body: string): string {
  return `<div style="font-family:Georgia,serif;background:#f6efe6;padding:32px;color:#3b2a20">
  <div style="max-width:520px;margin:0 auto;background:#fbf7f2;border-radius:20px;padding:32px">
    <p style="font-size:22px;margin:0 0 16px">supple<span style="color:#c2562f">·</span><b>MEANT</b></p>
    <h1 style="font-size:24px;font-weight:normal;margin:0 0 16px">${title}</h1>
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">${body}</div>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#6b4f3f;margin-top:24px">Demo store for a class project. Nothing is charged or shipped.</p>
  </div>
</div>`;
}

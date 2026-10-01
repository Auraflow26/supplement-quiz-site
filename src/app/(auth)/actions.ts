"use server";

import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { escapeHtml, layout, sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/site-url";
import { passwordProblem, safeNext, validateLogin, validateSignup, type FieldErrors } from "@/lib/validation";

export type FormState = { errors?: FieldErrors; message?: string; values?: Record<string, string> };

export async function signup(_prev: FormState, form: FormData): Promise<FormState> {
  const name = String(form.get("name") ?? "");
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = safeNext(form.get("next"));
  const values = { name, email };

  const errors = validateSignup({ name, email, password });
  if (Object.keys(errors).length) return { errors, values };

  // Create the user already confirmed; we send our own welcome email via Resend.
  const admin = createAdminClient();
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: name.trim() },
  });
  if (createError) {
    const taken = /already|registered|exists/i.test(createError.message);
    return taken
      ? { errors: { email: "An account with this email already exists. Log in instead." }, values }
      : { message: "Couldn't create your account. Please try again.", values };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) return { message: "Account created. Please log in.", values };

  await sendEmail(
    email,
    "Welcome to Supple-MEANT",
    layout(
      `Welcome, ${escapeHtml(name.trim())}!`,
      `<p>Your account is ready. Next up: a 2-minute quiz so we can build a blend that's meant for you.</p>
       <p><a href="${await siteUrl()}/quiz" style="color:#c2562f">Take the quiz →</a></p>`,
    ),
  );

  redirect(next);
}

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = safeNext(form.get("next"));
  const values = { email };

  const errors = validateLogin({ email, password });
  if (Object.keys(errors).length) return { errors, values };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { message: "Email or password is incorrect.", values };

  redirect(next);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!email) return { errors: { email: "Enter your email." } };

  const sent = { message: "If an account exists for that email, we've sent a reset link. Check your inbox." };
  const { data, error } = await createAdminClient().auth.admin.generateLink({ type: "recovery", email });
  if (error || !data.properties?.hashed_token) return sent; // Same response either way: don't reveal accounts.

  const link = `${await siteUrl()}/auth/confirm?type=recovery&token_hash=${encodeURIComponent(
    data.properties.hashed_token,
  )}&next=/update-password`;
  await sendEmail(
    email,
    "Reset your Supple-MEANT password",
    layout(
      "Reset your password",
      `<p>Tap the link below to choose a new password. It expires in 1 hour.</p>
       <p><a href="${link}" style="color:#c2562f">Choose a new password →</a></p>
       <p>If you didn't ask for this, ignore this email.</p>`,
    ),
  );
  return sent;
}

export async function updatePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get("password") ?? "");
  const problem = passwordProblem(password);
  if (problem) return { errors: { password: problem } };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { message: "Your reset link has expired. Request a new one." };

  redirect("/account?password=updated");
}

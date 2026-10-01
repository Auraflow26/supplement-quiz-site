import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { AuthCard } from "../auth-card";
import { UpdatePasswordForm } from "../auth-forms";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function UpdatePasswordPage() {
  if (!(await getUser())) redirect("/reset-password?expired=1");
  return (
    <AuthCard title="Choose a new password">
      <UpdatePasswordForm />
    </AuthCard>
  );
}

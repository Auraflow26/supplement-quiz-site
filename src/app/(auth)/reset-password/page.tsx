import type { Metadata } from "next";
import { AuthCard } from "../auth-card";
import { ResetRequestForm } from "../auth-forms";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { expired } = await searchParams;
  return (
    <AuthCard
      title="Forgot your password?"
      subtitle={expired ? "That link expired or was already used. Request a new one." : "We'll email you a link to choose a new one."}
    >
      <ResetRequestForm />
    </AuthCard>
  );
}

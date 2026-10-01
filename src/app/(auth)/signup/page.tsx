import type { Metadata } from "next";
import { safeNext } from "@/lib/validation";
import { AuthCard } from "../auth-card";
import { SignupForm } from "../auth-forms";

export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const { next } = await searchParams;
  return (
    <AuthCard eyebrow="Step 1 of 3" title="Create your account" subtitle="So we can save your quiz answers and your blend.">
      <SignupForm next={safeNext(next)} />
    </AuthCard>
  );
}

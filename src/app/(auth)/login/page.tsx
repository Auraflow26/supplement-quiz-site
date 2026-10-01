import type { Metadata } from "next";
import { safeNext } from "@/lib/validation";
import { AuthCard } from "../auth-card";
import { LoginForm } from "../auth-forms";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  return (
    <AuthCard title="Welcome back" subtitle="Log in to see your blend and orders.">
      <LoginForm next={safeNext(next, "/account")} />
    </AuthCard>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage } from "@/components/field";
import { login, requestPasswordReset, signup, updatePassword, type FormState } from "./actions";

const initial: FormState = {};

export function SignupForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signup, initial);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <FormMessage message={state.message} />
      <Field label="Name" name="name" autoComplete="given-name" defaultValue={state.values?.name} error={state.errors?.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} error={state.errors?.email} />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 10 characters, with one uppercase letter."
        error={state.errors?.password}
      />
      <button className="btn-primary w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account & start quiz"}
      </button>
      <p className="text-center text-sm text-mocha">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-terracotta underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <FormMessage message={state.message} />
      <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} error={state.errors?.email} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" error={state.errors?.password} />
      <div className="text-right text-sm">
        <Link href="/reset-password" className="text-terracotta underline">
          Forgot password?
        </Link>
      </div>
      <button className="btn-primary w-full" disabled={pending}>
        {pending ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-mocha">
        New here?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-terracotta underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);
  return (
    <form action={action} className="space-y-4" noValidate>
      <FormMessage message={state.message} />
      <Field label="Email" name="email" type="email" autoComplete="email" error={state.errors?.email} />
      <button className="btn-primary w-full" disabled={pending}>
        {pending ? "Sending…" : "Email me a reset link"}
      </button>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initial);
  return (
    <form action={action} className="space-y-4" noValidate>
      <FormMessage message={state.message} />
      <Field
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 10 characters, with one uppercase letter."
        error={state.errors?.password}
      />
      <button className="btn-primary w-full" disabled={pending}>
        {pending ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}

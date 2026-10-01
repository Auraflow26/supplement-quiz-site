import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string; hint?: string };

export function Field({ label, name, error, hint, className, ...input }: Props) {
  const id = input.id ?? name;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input id={id} name={name} className="input" aria-invalid={!!error} aria-describedby={describedBy} {...input} />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-mocha/80">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function FormMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="status" className="rounded-xl bg-latte px-4 py-3 text-sm text-espresso">
      {message}
    </p>
  );
}

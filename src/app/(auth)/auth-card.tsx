import type { ReactNode } from "react";

export function AuthCard({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="card p-8">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 font-serif text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-mocha">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

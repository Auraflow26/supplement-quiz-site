"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, type Plan } from "@/lib/pricing";

export function PlanPicker({ subscription, oneTime }: { subscription: number; oneTime: number }) {
  const [plan, setPlan] = useState<Plan>("subscription");
  const options: { value: Plan; title: string; price: number; note: string }[] = [
    { value: "subscription", title: "Monthly refill", price: subscription, note: "Save 15% · skip or cancel anytime" },
    { value: "one-time", title: "One-time", price: oneTime, note: "Single bottle" },
  ];
  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="Purchase option" className="space-y-3">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={plan === o.value}
            onClick={() => setPlan(o.value)}
            className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left ${
              plan === o.value ? "border-terracotta bg-terracotta/10" : "border-espresso/10"
            }`}
          >
            <span>
              <span className="block font-semibold">{o.title}</span>
              <span className="text-sm text-mocha">{o.note}</span>
            </span>
            <span className="font-semibold">
              {formatPrice(o.price)}
              {o.value === "subscription" && <span className="text-sm font-normal text-mocha">/mo</span>}
            </span>
          </button>
        ))}
      </div>
      <Link href={`/checkout?plan=${plan}`} className="btn-primary w-full">
        Continue to checkout
      </Link>
    </div>
  );
}

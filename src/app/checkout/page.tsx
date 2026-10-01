import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { recipeLine } from "@/components/blend-recipe";
import { getLatestBlend } from "@/lib/data";
import { PRODUCT_INFO, formatPrice, priceCents, type Plan } from "@/lib/pricing";
import { getUser } from "@/lib/supabase/server";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const { plan: planParam } = await searchParams;
  const plan: Plan = planParam === "one-time" ? "one-time" : "subscription";
  const [blend, user] = await Promise.all([getLatestBlend(), getUser()]);
  if (!blend) redirect("/quiz");
  const price = priceCents(blend.product, plan);

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <p className="eyebrow">Step 3 of 3</p>
        <h1 className="mt-2 font-serif text-4xl">Checkout</h1>
        <div className="mt-8">
          <CheckoutForm plan={plan} defaultName={user?.user_metadata?.name} />
        </div>
      </div>
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="card space-y-4">
          <p className="font-serif text-xl">Order summary</p>
          <div>
            <p className="font-semibold">{PRODUCT_INFO[blend.product].name}</p>
            <p className="text-sm text-mocha">{recipeLine(blend.detail)}</p>
          </div>
          <div className="flex justify-between border-t border-espresso/10 pt-4 text-sm">
            <span>{plan === "subscription" ? "Monthly refill (15% off)" : "One-time"}</span>
            <span>{formatPrice(price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between border-t border-espresso/10 pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(price)}</span>
          </div>
          <p className="text-xs text-mocha">Demo: nothing will be charged or shipped.</p>
        </div>
      </aside>
    </section>
  );
}

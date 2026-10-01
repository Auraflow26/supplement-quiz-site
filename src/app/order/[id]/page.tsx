import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { recipeLine } from "@/components/blend-recipe";
import { getOrder } from "@/lib/data";
import { PRODUCT_INFO, formatPrice } from "@/lib/pricing";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function OrderPage({ params }: PageProps<"/order/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const order = await getOrder(id);
  if (!order) notFound();
  const s = order.shipping;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-terracotta text-3xl text-foam" aria-hidden>
        ✓
      </div>
      <h1 className="mt-6 font-serif text-5xl">Order confirmed</h1>
      <p className="mt-3 text-lg text-mocha">Your blend is next in line to be mixed by our team.</p>
      <p className="mt-2 text-sm text-mocha">
        {order.email_sent
          ? "We've emailed you a confirmation."
          : "We couldn't send a confirmation email (demo email only reaches the site owner), but your order is saved."}
      </p>

      <div className="card mt-10 space-y-3 text-left">
        <div className="flex justify-between text-sm text-mocha">
          <span>Order #{order.id.slice(0, 8).toUpperCase()}</span>
          <span>{new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
        </div>
        <p className="font-semibold">{PRODUCT_INFO[order.blend.product].name}</p>
        <p className="text-sm text-mocha">{recipeLine(order.blend.detail)}</p>
        <div className="flex justify-between border-t border-espresso/10 pt-3">
          <span>{order.plan === "subscription" ? "Monthly refill" : "One-time"}</span>
          <span className="font-semibold">{formatPrice(order.price_cents)}</span>
        </div>
        <p className="text-sm text-mocha">
          Shipping to {s.name}, {s.line1}
          {s.line2 ? `, ${s.line2}` : ""}, {s.city}, {s.state} {s.zip}
        </p>
        <p className="text-xs text-mocha">Demo order: nothing was charged and nothing will ship.</p>
      </div>

      <Link href="/account" className="btn-secondary mt-8">
        Go to my account
      </Link>
    </section>
  );
}

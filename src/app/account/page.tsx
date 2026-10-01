import type { Metadata } from "next";
import Link from "next/link";
import { recipeLine } from "@/components/blend-recipe";
import { getLatestBlend, getOrders } from "@/lib/data";
import { PRODUCT_INFO, formatPrice } from "@/lib/pricing";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const { password } = await searchParams;
  const [user, blend, orders] = await Promise.all([getUser(), getLatestBlend(), getOrders()]);
  const name = user?.user_metadata?.name as string | undefined;

  return (
    <section className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6">
      <div>
        <p className="eyebrow">My account</p>
        <h1 className="mt-2 font-serif text-4xl">Hi{name ? `, ${name}` : ""}.</h1>
        <p className="text-mocha">{user?.email}</p>
        {password === "updated" && (
          <p role="status" className="mt-4 rounded-xl bg-sage/15 px-4 py-3 text-sm">
            Your password was updated.
          </p>
        )}
      </div>

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">My blend</h2>
            {blend ? (
              <>
                <p className="mt-2 font-semibold">{PRODUCT_INFO[blend.product].name}</p>
                <p className="text-sm text-mocha">{recipeLine(blend.detail)}</p>
              </>
            ) : (
              <p className="mt-2 text-mocha">You haven&apos;t finished the quiz yet.</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {blend && (
              <Link href="/blend" className="btn-primary">
                View blend
              </Link>
            )}
            <Link href={blend ? "/quiz?retake=1" : "/quiz"} className="btn-secondary">
              {blend ? "Retake quiz" : "Take the quiz"}
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-2xl">Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-mocha">No orders yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-espresso/10 rounded-3xl border border-espresso/10 bg-foam">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/order/${o.id}`} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 hover:bg-latte/40">
                  <span className="font-medium">#{o.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-sm text-mocha">{new Date(o.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                  <span className="text-sm">{o.plan === "subscription" ? "Monthly refill" : "One-time"}</span>
                  <span className="rounded-full bg-latte px-3 py-1 text-xs font-semibold">{o.status === "mixed" ? "Mixed" : "Placed"}</span>
                  <span className="font-semibold">{formatPrice(o.price_cents)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

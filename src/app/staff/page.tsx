import type { Metadata } from "next";
import { IngredientTable, recipeLine } from "@/components/blend-recipe";
import type { BlendRow, OrderRow } from "@/lib/data";
import { PRODUCT_INFO } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/server";
import { setOrderStatus } from "./actions";

export const metadata: Metadata = { title: "Staff · Mixing queue" };

export default async function StaffPage() {
  // Demo: any signed-in user can view the mixing queue (proxy.ts requires sign-in).
  const { data } = await createAdminClient()
    .from("orders")
    .select("*, blend:blends(*)")
    .order("created_at", { ascending: true })
    .limit(50);
  const orders = (data ?? []) as (OrderRow & { blend: BlendRow })[];
  const queue = orders.filter((o) => o.status === "placed");
  const done = orders.filter((o) => o.status === "mixed");

  return (
    <section className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6">
      <div>
        <p className="eyebrow">Staff view (demo)</p>
        <h1 className="mt-2 font-serif text-4xl">Mixing queue</h1>
        <p className="text-mocha">
          {queue.length} to mix · {done.length} mixed. Each card is the recipe for one bottle.
        </p>
      </div>

      {queue.length === 0 && <p className="card text-mocha">Nothing to mix right now.</p>}

      <div className="grid gap-6 md:grid-cols-2">
        {queue.map((o) => (
          <article key={o.id} className="card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-mocha">#{o.id.slice(0, 8).toUpperCase()} · {o.shipping.name}</p>
                <p className="font-serif text-xl">{PRODUCT_INFO[o.blend.product].name}</p>
                <p className="text-sm text-mocha">{recipeLine(o.blend.detail)}</p>
              </div>
              <form action={setOrderStatus}>
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="status" value="mixed" />
                <button className="btn-primary px-4 py-2 text-sm">Mark mixed</button>
              </form>
            </div>
            <IngredientTable blend={o.blend.detail} />
          </article>
        ))}
      </div>

      {done.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl">Mixed</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {done.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-foam px-4 py-3">
                <span>
                  #{o.id.slice(0, 8).toUpperCase()} · {recipeLine(o.blend.detail)}
                </span>
                <form action={setOrderStatus}>
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="status" value="placed" />
                  <button className="text-terracotta underline">Undo</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

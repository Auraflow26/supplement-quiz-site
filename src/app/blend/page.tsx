import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IngredientTable, flavorLabel } from "@/components/blend-recipe";
import { getLatestBlend } from "@/lib/data";
import { PRODUCT_INFO, priceCents } from "@/lib/pricing";
import { PlanPicker } from "./plan-picker";

export const metadata: Metadata = { title: "Your blend" };

export default async function BlendPage() {
  const row = await getLatestBlend();
  if (!row) redirect("/quiz");
  const blend = row.detail;
  const info = PRODUCT_INFO[blend.product];

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <p className="eyebrow">Your blend is ready</p>
        <h1 className="mt-2 font-serif text-5xl leading-tight">
          {info.name}, {flavorLabel(blend).toLowerCase()}
        </h1>
        <p className="mt-3 text-lg text-mocha">{blend.productReason}</p>

        {blend.notes.length > 0 && (
          <div className="mt-6 rounded-2xl border border-sage/40 bg-sage/10 p-5 text-sm">
            <p className="font-semibold">Good to know</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {blend.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="mt-10 font-serif text-2xl">What&apos;s inside, and why</h2>
        <div className="mt-4">
          <IngredientTable blend={blend} showReasons />
        </div>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="card space-y-5">
          <div>
            <p className="font-serif text-2xl">{info.name}</p>
            <p className="text-sm text-mocha">{info.size}</p>
          </div>
          <PlanPicker
            subscription={priceCents(blend.product, "subscription")}
            oneTime={priceCents(blend.product, "one-time")}
          />
          <Link href="/quiz?retake=1" className="block text-center text-sm text-terracotta underline">
            Not quite right? Retake the quiz
          </Link>
        </div>
      </aside>
    </section>
  );
}

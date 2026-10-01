import { PACKS, type PackId } from "@/lib/packs";
import { labelFor } from "@/lib/quiz";
import { PRODUCT_INFO } from "@/lib/pricing";
import type { Blend } from "@/lib/recommend";

export function flavorLabel(blend: Blend): string {
  return blend.flavor === "citrus" ? "Citrus" : labelFor("flavor", blend.flavor);
}

/** Compact one-line recipe, e.g. "Creamer · Vanilla bean · Base + Gut-friendly + Recovery". */
export function recipeLine(blend: Blend): string {
  const product = blend.product === "creamer" ? "Creamer" : "Drops";
  return `${product} · ${flavorLabel(blend)} · Base + ${blend.packs.map((p) => PACKS[p.id as PackId].name).join(" + ")}`;
}

/** Full ingredient list, used on the blend page and the staff mixing sheet. */
export function IngredientTable({ blend, showReasons = false }: { blend: Blend; showReasons?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-espresso/10 p-5">
        <p className="font-semibold">Base</p>
        <ul className="mt-2 space-y-1 text-sm">
          {blend.base.map((i) => (
            <li key={i.name} className="flex justify-between gap-4">
              <span>{i.name}</span>
              <span className="text-mocha">{i.amount}</span>
            </li>
          ))}
        </ul>
      </div>
      {blend.packs.map((p) => {
        const pack = PACKS[p.id as PackId];
        return (
          <div key={p.id} className="rounded-2xl border border-espresso/10 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">{pack.name} pack</p>
              <p className="text-sm text-mocha">{pack.tagline}</p>
            </div>
            {showReasons && p.reasons.length > 0 && (
              <ul className="mt-3 space-y-1 rounded-xl bg-latte/60 p-3 text-sm">
                {p.reasons.map((r) => (
                  <li key={r}>
                    <span className="text-terracotta" aria-hidden>
                      ✓{" "}
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            )}
            <ul className="mt-3 space-y-1 text-sm">
              {p.ingredients.map((i) => (
                <li key={i.name} className="flex justify-between gap-4">
                  <span>{i.name}</span>
                  <span className="text-mocha">{i.amount}</span>
                </li>
              ))}
            </ul>
            {p.skipped.length > 0 && (
              <p className="mt-2 text-xs text-sage">Skipped because you already take it: {p.skipped.join(", ")}</p>
            )}
          </div>
        );
      })}
      <p className="text-xs text-mocha/80">
        {PRODUCT_INFO[blend.product].serving}. Amounts are illustrative for this demo.
      </p>
    </div>
  );
}

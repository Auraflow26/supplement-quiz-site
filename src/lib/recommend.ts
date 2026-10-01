import { BASE, PACKS, PACK_ORDER, type Ingredient, type PackId } from "./packs";
import type { Answers } from "./quiz";

export type Product = "creamer" | "drops";

export type BlendPack = {
  id: PackId;
  reasons: string[];
  ingredients: Ingredient[];
  /** Ingredients left out because the user already takes them. */
  skipped: string[];
};

export type Blend = {
  product: Product;
  flavor: string;
  productReason: string;
  base: Ingredient[];
  packs: BlendPack[];
  /** Safety notes shown to the user. */
  notes: string[];
};

const MAX_PACKS = 3;
const MIN_SCORE = 2;

/** Turns quiz answers into a blend. Pure and deterministic. */
export function recommend(a: Answers): Blend {
  const scores = new Map<PackId, number>();
  const reasons = new Map<PackId, string[]>();
  const forced = new Set<PackId>();
  const notes: string[] = [];

  const add = (id: PackId, points: number, reason: string) => {
    scores.set(id, (scores.get(id) ?? 0) + points);
    reasons.set(id, [...(reasons.get(id) ?? []), reason]);
  };

  for (const goal of a.goals) {
    if (goal in PACKS) add(goal as PackId, 3, `You want more ${PACKS[goal as PackId].name.toLowerCase()}.`);
  }
  if (a.energy === "crash") add("energy", 2, "Your energy crashes most afternoons.");
  if (a.energy === "sometimes") add("energy", 1, "Your energy dips some afternoons.");
  if (a.stress === "high") add("calm", 2, "You feel very stressed most weeks.");
  if (a.stress === "medium") add("calm", 1, "You deal with some stress most weeks.");
  if (a.sleep === "<6") add("sleep", 2, "You sleep less than 6 hours.");
  if (a.sleep === "6-7") add("sleep", 1, "You sleep 6–7 hours.");
  if (a.workouts === "5+") add("recovery", 2, "You train 5+ times a week.");
  if (a.workouts === "3-4") add("recovery", 1, "You train 3–4 times a week.");
  if (a.stomach === "sometimes") add("gut", 1, "Supplements sometimes upset your stomach.");
  if (a.stomach === "often") {
    add("gut", 0, "Supplements often upset your stomach, so we always include this.");
    forced.add("gut");
  }
  if (a.lifeStage !== "none") {
    add("postnatal", 0, "You're pregnant, breastfeeding, or postpartum.");
    forced.add("postnatal");
  }

  const product = pickProduct(a);

  // Sleep is evening-only; in a morning creamer its points go to Calm instead.
  if (product.product === "creamer" && scores.has("sleep")) {
    add("calm", scores.get("sleep")!, "Your sleep could be better — Calm helps you wind down.");
    scores.delete("sleep");
  }

  const pregnantOrNursing = a.lifeStage === "pregnant" || a.lifeStage === "breastfeeding";
  if (pregnantOrNursing) {
    for (const id of PACK_ORDER) {
      if (!PACKS[id].pregnancySafe && scores.has(id)) {
        scores.delete(id);
        notes.push(`We left out ${PACKS[id].name} because it isn't recommended while pregnant or breastfeeding.`);
      }
    }
    notes.push("Check with your doctor before starting any supplement while pregnant or breastfeeding.");
  }

  const ranked = PACK_ORDER.filter((id) => scores.has(id))
    .filter((id) => forced.has(id) || scores.get(id)! >= MIN_SCORE)
    .sort((x, y) => {
      if (forced.has(x) !== forced.has(y)) return forced.has(x) ? -1 : 1;
      return scores.get(y)! - scores.get(x)!;
    })
    .slice(0, MAX_PACKS);

  if (ranked.length === 0) {
    ranked.push("energy");
    reasons.set("energy", ["A gentle daily boost to start with."]);
  }

  const sensitive = a.stomach !== "never";
  const packs = ranked.map((id) => buildPack(id, reasons.get(id) ?? [], a.currentSupplements, sensitive));

  return {
    product: product.product,
    flavor: product.product === "drops" ? (a.flavor === "unflavored" ? "unflavored" : "citrus") : a.flavor,
    productReason: product.reason,
    base: BASE,
    packs,
    notes,
  };
}

function pickProduct(a: Answers): { product: Product; reason: string } {
  if (a.form === "creamer") return { product: "creamer", reason: "You chose the coffee creamer." };
  if (a.form === "drops") return { product: "drops", reason: "You chose liposomal drops." };
  if (a.routine === "neither") {
    return { product: "drops", reason: "You don't drink coffee or tea, so drops fit your day better." };
  }
  return { product: "creamer", reason: "It goes straight into the coffee or tea you already drink." };
}

function buildPack(id: PackId, reasons: string[], current: string[], sensitive: boolean): BlendPack {
  const ingredients: Ingredient[] = [];
  const skipped: string[] = [];
  for (const ing of PACKS[id].ingredients) {
    if (ing.duplicateOf && current.includes(ing.duplicateOf)) {
      skipped.push(ing.name);
      continue;
    }
    ingredients.push(sensitive && ing.gentle ? { name: ing.gentle.name, amount: ing.gentle.amount } : ing);
  }
  return { id, reasons, ingredients, skipped };
}

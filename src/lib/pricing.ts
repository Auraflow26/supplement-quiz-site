import type { Product } from "./recommend";

export type Plan = "subscription" | "one-time";

const ONE_TIME_CENTS: Record<Product, number> = { creamer: 5900, drops: 4500 };
const SUBSCRIPTION_DISCOUNT = 0.15;

export function priceCents(product: Product, plan: Plan): number {
  const base = ONE_TIME_CENTS[product];
  return plan === "subscription" ? Math.round(base * (1 - SUBSCRIPTION_DISCOUNT)) : base;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export const PRODUCT_INFO: Record<Product, { name: string; size: string; serving: string }> = {
  creamer: {
    name: "Custom Coffee Creamer",
    size: "30 servings · 16 fl oz",
    serving: "1 tbsp in your morning coffee or tea",
  },
  drops: {
    name: "Custom Liposomal Drops",
    size: "30 servings · 1 fl oz",
    serving: "1 dropper under the tongue or in water",
  },
};

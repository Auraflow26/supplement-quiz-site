export type PackId = "energy" | "calm" | "recovery" | "sleep" | "gut" | "postnatal";

export type Ingredient = {
  name: string;
  /** Illustrative amount for the demo — not a dosing recommendation. */
  amount: string;
  /** Matches a value of the `currentSupplements` answer; skipped if the user already takes it. */
  duplicateOf?: string;
  /** Gentler form used for users with a sensitive stomach. */
  gentle?: { name: string; amount: string };
};

export type Pack = {
  id: PackId;
  name: string;
  tagline: string;
  /** Safe while pregnant or breastfeeding. */
  pregnancySafe: boolean;
  /** Only available as evening drops, not in the morning creamer. */
  dropsOnly?: boolean;
  ingredients: Ingredient[];
};

export const BASE: Ingredient[] = [
  { name: "Liposomal base (sunflower lecithin)", amount: "1 serving" },
  { name: "Vitamin D3", amount: "1,000 IU" },
];

export const PACKS: Record<PackId, Pack> = {
  energy: {
    id: "energy",
    name: "Energy",
    tagline: "Steady energy without the crash",
    pregnancySafe: true,
    ingredients: [
      { name: "Vitamin B12 (methylcobalamin)", amount: "500 mcg" },
      { name: "Vitamin B6", amount: "2 mg" },
      { name: "Vitamin C", amount: "100 mg" },
    ],
  },
  calm: {
    id: "calm",
    name: "Calm",
    tagline: "Takes the edge off stressful days",
    pregnancySafe: false,
    ingredients: [
      { name: "Magnesium glycinate", amount: "150 mg", duplicateOf: "magnesium" },
      { name: "L-theanine", amount: "100 mg" },
      { name: "Ashwagandha", amount: "300 mg" },
    ],
  },
  recovery: {
    id: "recovery",
    name: "Recovery",
    tagline: "Bounce back between training days",
    pregnancySafe: false,
    ingredients: [
      { name: "Creatine monohydrate", amount: "3 g", duplicateOf: "creatine" },
      { name: "Tart cherry extract", amount: "250 mg" },
      { name: "Omega-3 (EPA/DHA)", amount: "500 mg", duplicateOf: "omega3" },
    ],
  },
  sleep: {
    id: "sleep",
    name: "Sleep",
    tagline: "Wind down and sleep deeper",
    pregnancySafe: false,
    dropsOnly: true,
    ingredients: [
      { name: "Magnesium glycinate", amount: "200 mg", duplicateOf: "magnesium" },
      { name: "Glycine", amount: "1 g" },
      { name: "Tart cherry extract", amount: "250 mg" },
    ],
  },
  gut: {
    id: "gut",
    name: "Gut-friendly",
    tagline: "Easy on the stomach",
    pregnancySafe: true,
    ingredients: [
      { name: "Ginger root extract", amount: "100 mg" },
      { name: "Probiotic (B. coagulans)", amount: "1 billion CFU" },
      { name: "Digestive enzyme blend", amount: "50 mg" },
    ],
  },
  postnatal: {
    id: "postnatal",
    name: "Postnatal",
    tagline: "Rebuild and recover after baby",
    pregnancySafe: true,
    ingredients: [
      {
        name: "Iron (ferrous sulfate)",
        amount: "18 mg",
        gentle: { name: "Iron (bisglycinate, gentle)", amount: "18 mg" },
      },
      { name: "Folate (methylfolate)", amount: "400 mcg" },
      { name: "DHA", amount: "200 mg", duplicateOf: "omega3" },
      { name: "Choline", amount: "100 mg" },
    ],
  },
};

export const PACK_ORDER: PackId[] = ["postnatal", "gut", "energy", "calm", "recovery", "sleep"];

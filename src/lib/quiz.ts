export type Option = { value: string; label: string; hint?: string };

export type Question = {
  id: keyof Answers;
  title: string;
  subtitle?: string;
  kind: "single" | "multi";
  /** Max selections for multi questions. */
  max?: number;
  options: Option[];
};

export type Answers = {
  goals: string[];
  lifeStage: string;
  ageRange: string;
  workouts: string;
  energy: string;
  stress: string;
  sleep: string;
  stomach: string;
  routine: string;
  currentSupplements: string[];
  form: string;
  flavor: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "goals",
    title: "What do you want to feel more of?",
    subtitle: "Pick up to 3.",
    kind: "multi",
    max: 3,
    options: [
      { value: "energy", label: "Energy", hint: "No more 3pm crash" },
      { value: "calm", label: "Calm & focus", hint: "Handle stress better" },
      { value: "recovery", label: "Workout recovery", hint: "Train hard, bounce back" },
      { value: "sleep", label: "Better sleep", hint: "Fall asleep, stay asleep" },
      { value: "gut", label: "Gut comfort", hint: "Fewer stomach issues" },
      { value: "postnatal", label: "Postpartum recovery", hint: "Rebuild after baby" },
    ],
  },
  {
    id: "lifeStage",
    title: "Are any of these true for you right now?",
    subtitle: "This keeps your blend safe.",
    kind: "single",
    options: [
      { value: "none", label: "None of these" },
      { value: "pregnant", label: "Pregnant" },
      { value: "breastfeeding", label: "Breastfeeding" },
      { value: "postpartum", label: "Postpartum, not breastfeeding" },
    ],
  },
  {
    id: "ageRange",
    title: "How old are you?",
    kind: "single",
    options: [
      { value: "18-24", label: "18–24" },
      { value: "25-34", label: "25–34" },
      { value: "35-44", label: "35–44" },
      { value: "45+", label: "45+" },
    ],
  },
  {
    id: "workouts",
    title: "How often do you work out?",
    kind: "single",
    options: [
      { value: "0", label: "Rarely" },
      { value: "1-2", label: "1–2× a week" },
      { value: "3-4", label: "3–4× a week" },
      { value: "5+", label: "5+ a week", hint: "Hyrox, anyone?" },
    ],
  },
  {
    id: "energy",
    title: "How's your energy in the afternoon?",
    kind: "single",
    options: [
      { value: "crash", label: "I crash almost every day" },
      { value: "sometimes", label: "I dip sometimes" },
      { value: "steady", label: "Steady all day" },
    ],
  },
  {
    id: "stress",
    title: "How stressed do you feel most weeks?",
    kind: "single",
    options: [
      { value: "low", label: "Pretty relaxed" },
      { value: "medium", label: "Some stress" },
      { value: "high", label: "Very stressed" },
    ],
  },
  {
    id: "sleep",
    title: "How much do you usually sleep?",
    kind: "single",
    options: [
      { value: "<6", label: "Less than 6 hours" },
      { value: "6-7", label: "6–7 hours" },
      { value: "7-8", label: "7–8 hours" },
      { value: "8+", label: "8+ hours" },
    ],
  },
  {
    id: "stomach",
    title: "Do supplements ever upset your stomach?",
    kind: "single",
    options: [
      { value: "often", label: "Yes, often" },
      { value: "sometimes", label: "Sometimes" },
      { value: "never", label: "Never" },
    ],
  },
  {
    id: "routine",
    title: "What's in your mug every morning?",
    kind: "single",
    options: [
      { value: "coffee", label: "Coffee" },
      { value: "tea", label: "Tea" },
      { value: "both", label: "Both" },
      { value: "neither", label: "Neither" },
    ],
  },
  {
    id: "currentSupplements",
    title: "Already taking any of these?",
    subtitle: "We'll skip what you already have.",
    kind: "multi",
    options: [
      { value: "none", label: "None" },
      { value: "multivitamin", label: "Multivitamin" },
      { value: "protein", label: "Protein powder" },
      { value: "creatine", label: "Creatine" },
      { value: "magnesium", label: "Magnesium" },
      { value: "omega3", label: "Omega-3 / fish oil" },
    ],
  },
  {
    id: "form",
    title: "How do you want to take it?",
    kind: "single",
    options: [
      { value: "creamer", label: "Coffee creamer", hint: "Pour into coffee or tea" },
      { value: "drops", label: "Liposomal drops", hint: "A few drops, anytime" },
      { value: "recommend", label: "Pick for me" },
    ],
  },
  {
    id: "flavor",
    title: "Pick a flavor",
    subtitle: "Drops come in citrus or unflavored.",
    kind: "single",
    options: [
      { value: "vanilla", label: "Vanilla bean" },
      { value: "hazelnut", label: "Toasted hazelnut" },
      { value: "caramel", label: "Oat caramel" },
      { value: "unflavored", label: "Unflavored" },
    ],
  },
];

export function labelFor(questionId: keyof Answers, value: string): string {
  const q = QUESTIONS.find((q) => q.id === questionId);
  return q?.options.find((o) => o.value === value)?.label ?? value;
}

/** True once every question has a valid answer. */
export function isComplete(answers: Partial<Answers>): answers is Answers {
  return QUESTIONS.every((q) => isAnswered(q, answers[q.id]));
}

export function isAnswered(q: Question, value: unknown): boolean {
  const valid = new Set(q.options.map((o) => o.value));
  if (q.kind === "multi") {
    return (
      Array.isArray(value) &&
      value.length > 0 &&
      (!q.max || value.length <= q.max) &&
      value.every((v) => valid.has(v))
    );
  }
  return typeof value === "string" && valid.has(value);
}

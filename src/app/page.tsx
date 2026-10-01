import Link from "next/link";
import { MugIllustration } from "@/components/mug-illustration";
import { PACKS, PACK_ORDER } from "@/lib/packs";
import { PRODUCT_INFO, formatPrice, priceCents } from "@/lib/pricing";

const STEPS = [
  { n: "1", title: "Take the 2-minute quiz", body: "Tell us your goals, routine, sleep, training, and what your stomach can handle." },
  { n: "2", title: "We build your blend", body: "A base plus up to three packs, picked for you, with the reason behind every ingredient." },
  { n: "3", title: "Pour it in", body: "One spoon of creamer in the coffee you already drink. No more handfuls of pills." },
];

const PERSONAS = [
  {
    label: "For the lifter",
    title: "Train hard. Recover harder.",
    body: "Six days at the gym and still tired? Recovery and energy packs, a gentle formula if supplements upset your stomach, and nothing you already take twice.",
  },
  {
    label: "For the 80-hour week",
    title: "Personalized, without the research.",
    body: "Two minutes, one quiz, one bottle. We pick the right supplements the first time so you don't have to test ten of them.",
  },
  {
    label: "For new moms",
    title: "Get your energy back, safely.",
    body: "A postnatal pack built for recovery, only ingredients considered safe while breastfeeding, and plain-language reasons for each one.",
  },
];

const FAQ = [
  {
    q: "What does “liposomal” mean?",
    a: "The nutrients are wrapped in tiny fat bubbles, which is designed to help your body absorb them. The creamer’s fats make a natural carrier.",
  },
  {
    q: "Will it change the taste of my coffee?",
    a: "Pick vanilla bean, toasted hazelnut, oat caramel, or unflavored. It tastes like creamer.",
  },
  {
    q: "Is it safe while pregnant or breastfeeding?",
    a: "The quiz asks, and leaves out any pack that isn’t recommended during pregnancy or breastfeeding. Always check with your doctor first.",
  },
  {
    q: "Can I change my blend later?",
    a: "Yes. Retake the quiz any time from your account and your next bottle follows your new answers.",
  },
  {
    q: "Is this a real store?",
    a: "No. It’s a class demo. Checkout uses a test card, nothing is charged, and nothing ships.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 md:grid-cols-2 md:pt-20">
        <div className="space-y-6">
          <p className="eyebrow">Supple-MEANT for you</p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Your supplements, poured into your coffee.
          </h1>
          <p className="max-w-md text-lg text-mocha">
            A creamer blended for your body, your goals, and your morning routine. Take a 2-minute quiz and we&apos;ll
            tell you exactly what&apos;s in it, and why.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/quiz" className="btn-primary">
              Take the 2-min quiz <span aria-hidden>→</span>
            </Link>
            <Link href="/#how" className="btn-secondary">
              How it works
            </Link>
          </div>
        </div>
        <MugIllustration className="mx-auto w-full max-w-md" />
      </section>

      {/* Problem */}
      <section className="bg-espresso text-cream">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
          {[
            ["Hundreds of supplements", "online, and no idea which ones you actually need."],
            ["Too many pills", "to remember every single day."],
            ["Health goals", "that should fit your routine, not overwhelm it."],
          ].map(([strong, rest]) => (
            <p key={strong} className="text-lg leading-snug">
              <span className="font-serif text-2xl text-latte">{strong}</span> {rest}
            </p>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-20 sm:px-6">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-2 font-serif text-4xl">Three steps. Two minutes.</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="card">
              <span className="flex size-10 items-center justify-center rounded-full bg-terracotta font-serif text-lg text-foam">
                {s.n}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-mocha">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Products */}
      <section id="products" className="scroll-mt-8 bg-latte/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="eyebrow">Two ways to take it</p>
          <h2 className="mt-2 font-serif text-4xl">Pick the one that fits your day.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {(["creamer", "drops"] as const).map((p) => (
              <article key={p} className="card flex flex-col gap-4">
                <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-cream font-serif text-3xl text-mocha">
                  {p === "creamer" ? "☕ Creamer" : "💧 Drops"}
                </div>
                <h3 className="font-serif text-2xl">{PRODUCT_INFO[p].name}</h3>
                <p className="text-mocha">
                  {p === "creamer"
                    ? "Our hero. A liposomal creamer you pour into coffee or tea. Vanilla bean, toasted hazelnut, oat caramel, or unflavored."
                    : "For non-coffee days or evenings. A dropper under the tongue or in water. Citrus or unflavored."}
                </p>
                <p className="text-sm text-mocha">{PRODUCT_INFO[p].size}</p>
                <p className="mt-auto text-lg">
                  From <strong>{formatPrice(priceCents(p, "subscription"))}</strong>
                  <span className="text-mocha">/month with subscription</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="eyebrow">Made for real routines</p>
        <h2 className="mt-2 font-serif text-4xl">Whoever you are at 7am.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PERSONAS.map((p) => (
            <article key={p.label} className="card">
              <p className="text-sm font-semibold text-sage">{p.label}</p>
              <h3 className="mt-2 font-serif text-2xl leading-tight">{p.title}</h3>
              <p className="mt-3 text-mocha">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Packs */}
      <section className="bg-foam">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="eyebrow">What goes in</p>
          <h2 className="mt-2 font-serif text-4xl">A base, plus up to three packs.</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PACK_ORDER.map((id) => (
              <li key={id} className="rounded-2xl border border-espresso/10 p-5">
                <p className="font-semibold">{PACKS[id].name}</p>
                <p className="text-sm text-mocha">{PACKS[id].tagline}</p>
                <p className="mt-2 text-xs text-mocha/80">{PACKS[id].ingredients.map((i) => i.name.split(" (")[0]).join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-8 px-4 py-20 sm:px-6">
        <h2 className="font-serif text-4xl">Questions</h2>
        <div className="mt-8 divide-y divide-espresso/10 border-y border-espresso/10">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium">
                {f.q}
                <span className="text-terracotta transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 text-mocha">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-[2rem] bg-terracotta px-8 py-14 text-center text-foam">
          <h2 className="font-serif text-4xl">Ready for a blend that&apos;s meant for you?</h2>
          <Link href="/quiz" className="btn mt-6 bg-foam text-espresso hover:bg-cream">
            Take the 2-min quiz <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

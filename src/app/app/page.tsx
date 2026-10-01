import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Get the app" };

const IPHONE = [
  "Open supplemeant.vercel.app in Safari.",
  "Tap the Share button (the square with an arrow).",
  "Scroll down and tap “Add to Home Screen”, then “Add”.",
];

const ANDROID = [
  "Open supplemeant.vercel.app in Chrome.",
  "Tap the ⋮ menu in the top-right corner.",
  "Tap “Install app” (or “Add to Home screen”), then “Install”.",
];

function Steps({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="card">
      <h2 className="font-serif text-2xl">{title}</h2>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm text-foam">{i + 1}</span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function GetTheAppPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <Image src="/icon-192.png" alt="" width={96} height={96} className="rounded-[22px] shadow-md" />
        <p className="eyebrow mt-6">Supple-MEANT on your phone</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Get the app</h1>
        <p className="mt-3 max-w-lg text-lg text-mocha">
          Add Supple-MEANT to your home screen. It opens full-screen like any app, with your blend and orders one tap away.
          No app store needed.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Steps title="iPhone" steps={IPHONE} />
        <Steps title="Android" steps={ANDROID} />
      </div>
      <div className="mt-10 text-center">
        <Link href="/quiz" className="btn-primary">
          Take the quiz first <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

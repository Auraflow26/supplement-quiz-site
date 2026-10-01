"use client";

import { useState, useTransition } from "react";
import { QUESTIONS, isAnswered, type Answers } from "@/lib/quiz";
import { finishQuiz, saveProgress } from "./actions";

type Props = { initialAnswers: Partial<Answers>; initialStep: number };

export function QuizFlow({ initialAnswers, initialStep }: Props) {
  const [answers, setAnswers] = useState<Partial<Answers>>(initialAnswers);
  const [step, setStep] = useState(initialStep);
  const [saveFailed, setSaveFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finishing, startFinish] = useTransition();

  const q = QUESTIONS[step];
  const value = answers[q.id];
  const last = step === QUESTIONS.length - 1;
  const answered = isAnswered(q, value);

  function go(nextStep: number, nextAnswers: Partial<Answers>) {
    setStep(nextStep);
    setError(null);
    saveProgress(nextAnswers, nextStep)
      .then((ok) => setSaveFailed(!ok))
      .catch(() => setSaveFailed(true));
  }

  function choose(optionValue: string) {
    let next: Partial<Answers>;
    if (q.kind === "single") {
      next = { ...answers, [q.id]: optionValue };
      setAnswers(next);
      if (!last) go(step + 1, next); // single choice auto-advances
      return;
    }
    const current = (Array.isArray(value) ? value : []) as string[];
    let selected: string[];
    if (current.includes(optionValue)) selected = current.filter((v) => v !== optionValue);
    else if (optionValue === "none") selected = ["none"];
    else selected = [...current.filter((v) => v !== "none"), optionValue];
    if (q.max && selected.length > q.max) return;
    next = { ...answers, [q.id]: selected };
    setAnswers(next);
  }

  function finish() {
    startFinish(async () => {
      const result = await finishQuiz(answers);
      if (result?.error) setError(result.error);
    });
  }

  const selected = (opt: string) => (Array.isArray(value) ? value.includes(opt) : value === opt);
  const progress = Math.round(((step + (answered ? 1 : 0)) / QUESTIONS.length) * 100);

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between text-sm text-mocha">
        <span>
          Question {step + 1} of {QUESTIONS.length}
        </span>
        {saveFailed ? <span className="text-red-700">Couldn&apos;t save. We&apos;ll retry on the next step.</span> : <span>Progress saves automatically</span>}
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-latte" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-terracotta transition-all" style={{ width: `${progress}%` }} />
      </div>

      <h1 className="mt-10 font-serif text-4xl leading-tight">{q.title}</h1>
      {q.subtitle && <p className="mt-2 text-mocha">{q.subtitle}</p>}

      <div className="mt-8 grid gap-3 sm:grid-cols-2" role={q.kind === "single" ? "radiogroup" : "group"} aria-label={q.title}>
        {q.options.map((o) => {
          const on = selected(o.value);
          return (
            <button
              key={o.value}
              type="button"
              role={q.kind === "single" ? "radio" : "checkbox"}
              aria-checked={on}
              onClick={() => choose(o.value)}
              className={`rounded-2xl border-2 px-5 py-4 text-left transition-colors ${
                on ? "border-terracotta bg-terracotta/10" : "border-espresso/10 bg-foam hover:border-espresso/30"
              }`}
            >
              <span className="block font-semibold">{o.label}</span>
              {o.hint && <span className="mt-0.5 block text-sm text-mocha">{o.hint}</span>}
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <button type="button" className="btn-secondary" onClick={() => go(step - 1, answers)} disabled={step === 0 || finishing}>
          ← Back
        </button>
        {last ? (
          <button type="button" className="btn-primary" onClick={finish} disabled={!answered || finishing}>
            {finishing ? "Building your blend…" : "See my blend →"}
          </button>
        ) : (
          (q.kind === "multi" || answered) && (
            <button type="button" className="btn-primary" onClick={() => go(step + 1, answers)} disabled={!answered}>
              Next →
            </button>
          )
        )}
      </div>
    </section>
  );
}

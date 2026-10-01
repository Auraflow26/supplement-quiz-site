"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QUESTIONS, isAnswered, isComplete, type Answers } from "@/lib/quiz";
import { recommend } from "@/lib/recommend";

/** Keeps only valid answers to known questions. */
function clean(answers: Partial<Answers>): Partial<Answers> {
  const out: Record<string, unknown> = {};
  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (v !== undefined && isAnswered(q, v)) out[q.id] = v;
  }
  return out as Partial<Answers>;
}

/** Autosaves quiz progress after each step. Returns false if the save failed. */
export async function saveProgress(answers: Partial<Answers>, step: number): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await supabase.from("quiz_responses").upsert({
    user_id: user.id,
    answers: clean(answers),
    step: Math.max(0, Math.min(step, QUESTIONS.length - 1)),
    completed_at: null,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

export async function finishQuiz(answers: Partial<Answers>): Promise<{ error: string } | void> {
  const cleaned = clean(answers);
  if (!isComplete(cleaned)) return { error: "Some answers are missing. Please go back and finish every question." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup?next=/quiz");

  const blend = recommend(cleaned);
  const { error } = await supabase.from("blends").insert({
    user_id: user.id,
    product: blend.product,
    flavor: blend.flavor,
    packs: blend.packs.map((p) => p.id),
    detail: blend,
  });
  if (error) return { error: "We couldn't save your blend. Please try again." };

  await supabase.from("quiz_responses").upsert({
    user_id: user.id,
    answers: cleaned,
    step: QUESTIONS.length - 1,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  redirect("/blend");
}

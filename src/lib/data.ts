import "server-only";
import { createClient } from "./supabase/server";
import type { Answers } from "./quiz";
import type { Blend } from "./recommend";
import type { Plan } from "./pricing";
import type { Address } from "./validation";

export type QuizProgress = { answers: Partial<Answers>; step: number; completed_at: string | null };

export type BlendRow = {
  id: string;
  user_id: string;
  product: Blend["product"];
  flavor: string;
  packs: string[];
  detail: Blend;
  created_at: string;
};

export type OrderRow = {
  id: string;
  user_id: string;
  blend_id: string;
  plan: Plan;
  price_cents: number;
  shipping: Address;
  billing: Address;
  status: "placed" | "mixed";
  email_sent: boolean;
  created_at: string;
};

export async function getQuizProgress(): Promise<QuizProgress | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("quiz_responses").select("answers, step, completed_at").maybeSingle();
  return data;
}

export async function getLatestBlend(): Promise<BlendRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blends")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getOrders(): Promise<OrderRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getOrder(id: string): Promise<(OrderRow & { blend: BlendRow }) | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*, blend:blends(*)").eq("id", id).maybeSingle();
  return data;
}

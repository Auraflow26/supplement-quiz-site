"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, getUser } from "@/lib/supabase/server";

export async function setOrderStatus(form: FormData) {
  if (!(await getUser())) return;
  const id = String(form.get("id") ?? "");
  const status = form.get("status") === "mixed" ? "mixed" : "placed";
  await createAdminClient().from("orders").update({ status }).eq("id", id);
  revalidatePath("/staff");
}

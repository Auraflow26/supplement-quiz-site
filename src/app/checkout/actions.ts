"use server";

import { redirect } from "next/navigation";
import { recipeLine } from "@/components/blend-recipe";
import { escapeHtml, layout, sendEmail } from "@/lib/email";
import { PRODUCT_INFO, formatPrice, priceCents, type Plan } from "@/lib/pricing";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site-url";
import { readAddress, validateAddress, type FieldErrors } from "@/lib/validation";
import type { BlendRow } from "@/lib/data";

export type CheckoutState = { errors?: FieldErrors; message?: string };

export async function placeOrder(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const plan: Plan = form.get("plan") === "one-time" ? "one-time" : "subscription";
  const shipping = readAddress(form, "shipping");
  const sameAsShipping = form.get("sameAsShipping") === "on";
  const billing = sameAsShipping ? shipping : readAddress(form, "billing");

  const errors = { ...validateAddress(shipping, "shipping"), ...(sameAsShipping ? {} : validateAddress(billing, "billing")) };
  if (Object.keys(errors).length) return { errors, message: "Please fix the highlighted fields." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup?next=/checkout");

  const { data: blend } = await supabase
    .from("blends")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<BlendRow>();
  if (!blend) redirect("/quiz");

  // Price is always computed on the server, never taken from the form.
  const price = priceCents(blend.product, plan);
  const { data: order, error } = await supabase
    .from("orders")
    .insert({ user_id: user.id, blend_id: blend.id, plan, price_cents: price, shipping, billing })
    .select("id")
    .single();
  if (error || !order) return { message: "We couldn't place your order. Please try again." };

  const emailed = await sendEmail(
    user.email!,
    "Your Supple-MEANT order is confirmed",
    layout(
      "Order confirmed",
      `<p>Thanks, ${escapeHtml(shipping.name)}! Your blend is next in line to be mixed.</p>
       <p><b>${escapeHtml(PRODUCT_INFO[blend.product].name)}</b><br>${escapeHtml(recipeLine(blend.detail))}</p>
       <p>${plan === "subscription" ? "Monthly refill" : "One-time"}: <b>${formatPrice(price)}</b> (demo, not charged)</p>
       <p>Shipping to: ${escapeHtml(`${shipping.line1}${shipping.line2 ? `, ${shipping.line2}` : ""}, ${shipping.city}, ${shipping.state} ${shipping.zip}`)}</p>
       <p><a href="${await siteUrl()}/order/${order.id}" style="color:#c2562f">View your order →</a></p>`,
    ),
  );
  // Users can't update orders (no RLS update policy), so record the email status with the admin client.
  if (emailed) await createAdminClient().from("orders").update({ email_sent: true }).eq("id", order.id);

  redirect(`/order/${order.id}`);
}

"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage } from "@/components/field";
import type { Plan } from "@/lib/pricing";
import { placeOrder, type CheckoutState } from "./actions";

function AddressFields({ prefix, errors, defaultName }: { prefix: string; errors?: Record<string, string>; defaultName?: string }) {
  const e = (k: string) => errors?.[`${prefix}.${k}`];
  return (
    <div className="grid gap-4 sm:grid-cols-6">
      <Field className="sm:col-span-6" label="Full name" name={`${prefix}.name`} id={`${prefix}-name`} autoComplete={`${prefix} name`} defaultValue={defaultName} error={e("name")} />
      <Field className="sm:col-span-4" label="Street address" name={`${prefix}.line1`} id={`${prefix}-line1`} autoComplete={`${prefix} address-line1`} error={e("line1")} />
      <Field className="sm:col-span-2" label="Apt (optional)" name={`${prefix}.line2`} id={`${prefix}-line2`} autoComplete={`${prefix} address-line2`} error={e("line2")} />
      <Field className="sm:col-span-3" label="City" name={`${prefix}.city`} id={`${prefix}-city`} autoComplete={`${prefix} address-level2`} error={e("city")} />
      <Field className="sm:col-span-1" label="State" name={`${prefix}.state`} id={`${prefix}-state`} autoComplete={`${prefix} address-level1`} maxLength={2} placeholder="NY" error={e("state")} />
      <Field className="sm:col-span-2" label="ZIP" name={`${prefix}.zip`} id={`${prefix}-zip`} autoComplete={`${prefix} postal-code`} inputMode="numeric" error={e("zip")} />
    </div>
  );
}

export function CheckoutForm({ plan, defaultName }: { plan: Plan; defaultName?: string }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const [same, setSame] = useState(true);

  return (
    <form action={action} className="space-y-10" noValidate>
      <input type="hidden" name="plan" value={plan} />
      <FormMessage message={state.message} />

      <fieldset>
        <legend className="font-serif text-2xl">Shipping</legend>
        <div className="mt-4">
          <AddressFields prefix="shipping" errors={state.errors} defaultName={defaultName} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-serif text-2xl">Billing</legend>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" name="sameAsShipping" checked={same} onChange={(e) => setSame(e.target.checked)} className="size-4 accent-terracotta" />
          Same as shipping address
        </label>
        {!same && (
          <div className="mt-4">
            <AddressFields prefix="billing" errors={state.errors} />
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="font-serif text-2xl">Payment</legend>
        <div className="mt-4 rounded-2xl border-2 border-dashed border-terracotta/50 bg-terracotta/5 p-5">
          <p className="font-semibold text-terracotta-dark">Demo store: no payment is taken.</p>
          <p className="mt-1 text-sm text-mocha">This test card is filled in for you. Never enter a real card here.</p>
          {/* Display only: these values are not form fields and are never submitted. */}
          <dl className="mt-4 grid gap-3 sm:grid-cols-3" aria-label="Test card">
            <div className="sm:col-span-3">
              <dt className="label">Card number</dt>
              <dd className="input bg-latte/50 font-mono">4242 4242 4242 4242</dd>
            </div>
            <div>
              <dt className="label">Expiry</dt>
              <dd className="input bg-latte/50 font-mono">12 / 30</dd>
            </div>
            <div>
              <dt className="label">CVC</dt>
              <dd className="input bg-latte/50 font-mono">123</dd>
            </div>
          </dl>
        </div>
      </fieldset>

      <button className="btn-primary w-full text-lg" disabled={pending}>
        {pending ? "Placing order…" : "Place demo order"}
      </button>
    </form>
  );
}

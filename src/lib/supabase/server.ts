import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/** Supabase client acting as the signed-in user (RLS applies). */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = supabaseEnv();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component: cookies are read-only there; proxy.ts refreshes the session.
        }
      },
    },
  });
}

/** Service-role client that bypasses RLS. Server-only; use for admin auth calls and the staff view. */
export function createAdminClient() {
  const { url, serviceRoleKey } = supabaseEnv();
  return createSupabaseClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing environment variable ${name}. Run \`vercel env pull\`.`);
  return value;
}

export function supabaseEnv() {
  return {
    url: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
    get serviceRoleKey() {
      return required(
        "SUPABASE_SERVICE_ROLE_KEY",
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY,
      );
    },
  };
}

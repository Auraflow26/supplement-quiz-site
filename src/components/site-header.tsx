import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import { getUser } from "@/lib/supabase/server";
import { Logo } from "./logo";

export async function SiteHeader() {
  const user = await getUser();
  return (
    <header className="border-b border-espresso/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-4" aria-label="Main">
          <Link href="/#how" className="hidden rounded-full px-3 py-2 hover:bg-latte sm:inline">
            How it works
          </Link>
          <Link href="/#products" className="hidden rounded-full px-3 py-2 hover:bg-latte sm:inline">
            Products
          </Link>
          {user ? (
            <>
              <Link href="/account" className="rounded-full px-3 py-2 hover:bg-latte">
                Account
              </Link>
              <form action={logout}>
                <button className="rounded-full px-3 py-2 hover:bg-latte">Log out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-full px-3 py-2 hover:bg-latte">
              Log in
            </Link>
          )}
          <Link href="/quiz" className="btn-primary px-4 py-2 text-sm">
            Take the quiz
          </Link>
        </nav>
      </div>
    </header>
  );
}

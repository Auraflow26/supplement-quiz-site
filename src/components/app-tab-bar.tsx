"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" },
  { href: "/quiz", label: "Quiz", icon: "M9 5h10M9 12h10M9 19h10M4.5 5h.01M4.5 12h.01M4.5 19h.01" },
  { href: "/blend", label: "My blend", icon: "M5 8h12v7a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M9 3c-1 1.2 1 2 0 3.2M13 3c-1 1.2 1 2 0 3.2" },
  { href: "/account", label: "Account", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
];

/** Bottom tab bar, shown only when the site runs as an installed home-screen app. */
export function AppTabBar() {
  const path = usePathname();
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-50 hidden border-t border-espresso/10 bg-foam/95 pb-[env(safe-area-inset-bottom)] backdrop-blur standalone:block"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {TABS.map((t) => {
          const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${active ? "text-terracotta" : "text-mocha"}`}
              >
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={t.icon} />
                </svg>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

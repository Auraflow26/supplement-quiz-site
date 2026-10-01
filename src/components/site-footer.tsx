import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-espresso/10 bg-latte/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-mocha">Supple-MEANT for you. Personalized supplements, poured into your coffee.</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
          <Link href="/quiz" className="hover:text-terracotta">Take the quiz</Link>
          <Link href="/#products" className="hover:text-terracotta">Products</Link>
          <Link href="/#faq" className="hover:text-terracotta">FAQ</Link>
          <Link href="/account" className="hover:text-terracotta">My account</Link>
        </nav>
        <p className="text-xs leading-relaxed text-mocha">
          These statements have not been evaluated by the Food and Drug Administration. This product is not intended to
          diagnose, treat, cure, or prevent any disease. Ingredient amounts shown are illustrative. This is a demo
          store: nothing is sold, charged, or shipped.
        </p>
      </div>
    </footer>
  );
}

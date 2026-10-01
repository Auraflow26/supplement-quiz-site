import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="font-serif text-2xl tracking-tight text-espresso" aria-label="Supple-MEANT home">
      supple<span className="text-terracotta">·</span>
      <span className="font-semibold">MEANT</span>
    </Link>
  );
}

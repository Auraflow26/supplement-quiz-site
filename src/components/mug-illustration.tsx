/** Decorative hero illustration: a creamer bottle pouring into a mug. */
export function MugIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 360" className={className} role="img" aria-label="A bottle of custom creamer pouring into a coffee mug">
      <ellipse cx="190" cy="330" rx="150" ry="16" fill="#3b2a20" opacity="0.08" />
      {/* steam */}
      <g fill="none" stroke="#6b4f3f" strokeWidth="5" strokeLinecap="round" opacity="0.35">
        <path d="M150 120c-14-18 14-30 0-50" />
        <path d="M190 110c-14-18 14-30 0-50" />
      </g>
      {/* mug */}
      <path d="M90 150h190v110a60 60 0 0 1-60 60h-70a60 60 0 0 1-60-60z" fill="#c2562f" />
      <path d="M280 175h18a36 36 0 0 1 0 72h-18" fill="none" stroke="#c2562f" strokeWidth="18" />
      <ellipse cx="185" cy="150" rx="95" ry="16" fill="#3b2a20" />
      <path d="M140 152c20-12 70-12 92 0" stroke="#eadbc8" strokeWidth="6" fill="none" strokeLinecap="round" />
      <text x="185" y="245" textAnchor="middle" fontFamily="Georgia, serif" fontSize="26" fill="#fbf7f2">
        made for you
      </text>
      {/* pour stream */}
      <path d="M262 64c-18 22-36 48-56 84" stroke="#fbf7f2" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* bottle */}
      <g transform="rotate(-38 300 60)">
        <rect x="270" y="10" width="64" height="104" rx="18" fill="#fbf7f2" stroke="#3b2a20" strokeWidth="4" />
        <rect x="288" y="-8" width="28" height="22" rx="6" fill="#3b2a20" />
        <rect x="270" y="48" width="64" height="34" fill="#eadbc8" />
        <text x="302" y="70" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fill="#3b2a20">
          YOU
        </text>
      </g>
    </svg>
  );
}

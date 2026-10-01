export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function passwordProblem(password: string): string | null {
  if (!password) return "Enter a password.";
  if (password.length < 10) return "Use at least 10 characters.";
  if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter.";
  return null;
}

export function validateSignup(input: { name: string; email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.name.trim()) errors.name = "Enter your name.";
  if (!input.email.trim()) errors.email = "Enter your email.";
  else if (!EMAIL_RE.test(input.email.trim())) errors.email = "That email doesn't look right.";
  const pw = passwordProblem(input.password);
  if (pw) errors.password = pw;
  return errors;
}

export function validateLogin(input: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.email.trim()) errors.email = "Enter your email.";
  if (!input.password) errors.password = "Enter your password.";
  return errors;
}

export type Address = { name: string; line1: string; line2: string; city: string; state: string; zip: string };

const ADDRESS_FIELDS: { key: keyof Address; label: string; optional?: boolean }[] = [
  { key: "name", label: "full name" },
  { key: "line1", label: "street address" },
  { key: "line2", label: "apartment", optional: true },
  { key: "city", label: "city" },
  { key: "state", label: "state" },
  { key: "zip", label: "ZIP code" },
];

export function readAddress(form: FormData, prefix: string): Address {
  const get = (k: string) => String(form.get(`${prefix}.${k}`) ?? "").trim();
  return { name: get("name"), line1: get("line1"), line2: get("line2"), city: get("city"), state: get("state"), zip: get("zip") };
}

export function validateAddress(addr: Address, prefix: string): FieldErrors {
  const errors: FieldErrors = {};
  for (const f of ADDRESS_FIELDS) {
    if (!f.optional && !addr[f.key]) errors[`${prefix}.${f.key}`] = `Enter your ${f.label}.`;
  }
  if (addr.zip && !/^\d{5}(-\d{4})?$/.test(addr.zip)) errors[`${prefix}.zip`] = "Use a 5-digit ZIP code.";
  if (addr.state && !/^[A-Za-z]{2}$/.test(addr.state)) errors[`${prefix}.state`] = "Use the 2-letter state code.";
  return errors;
}

/** Only allow same-site relative redirects. */
export function safeNext(next: unknown, fallback = "/quiz"): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

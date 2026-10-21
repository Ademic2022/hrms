/** Locale-aware formatting (PRD §7.5). Dates from the API are ISO strings ("2026-10-21"). */

const LOCALE = typeof navigator !== "undefined" ? navigator.language : "en";

export function formatDate(iso: string | null | undefined, locale = LOCALE): string {
  if (!iso) return "—";
  // Plain dates are calendar days, not instants: format them in UTC so no time zone shifts the day.
  const date = iso.length === 10 ? new Date(`${iso}T00:00:00Z`) : new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric", month: "short", year: "numeric", timeZone: iso.length === 10 ? "UTC" : undefined,
  }).format(date);
}

/** Money arrives as a decimal string ("450000.00") so no precision is lost on the way. */
export function formatMoney(amount: string, currency: string, locale = LOCALE): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return amount;
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

const FREQUENCY: Record<string, string> = { ANNUAL: "per year", MONTHLY: "per month", HOURLY: "per hour" };

export function formatFrequency(frequency: string): string {
  return FREQUENCY[frequency] ?? frequency.toLowerCase();
}

/** "ON_LEAVE" → "On leave" */
export function humanize(value: string | null | undefined): string {
  if (!value) return "—";
  const words = value.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}

/** "1 day", "0.5 day", "3 days". Days arrive as decimal strings ("3.0"). */
export function formatDays(days: string | number): string {
  const n = Number(days);
  if (!Number.isFinite(n)) return String(days);
  const text = Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "");
  return `${text} ${Math.abs(n) === 1 || Math.abs(n) === 0.5 ? "day" : "days"}`;
}

/** "3 – 7 Nov 2026", or one date when start and end match. */
export function formatRange(start: string, end: string, locale = LOCALE): string {
  if (start === end) return formatDate(start, locale);
  const a = new Date(`${start}T00:00:00Z`);
  const b = new Date(`${end}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .formatRange(a, b);
}

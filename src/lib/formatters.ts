const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatExpenseDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${dateFormatter.format(date)} · ${timeFormatter.format(date)}`;
}

export function getMonthRange(): { start: string; end: string } {
  const now = new Date();
  return getMonthRangeFor(now.getFullYear(), now.getMonth());
}

export function getMonthRangeFor(
  year: number,
  month: number,
): { start: string; end: string } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return toMonthKey(now.getFullYear(), now.getMonth() + 1);
}

export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function getExpenseMonthKey(isoDate: string): string {
  const date = new Date(isoDate);
  return toMonthKey(date.getFullYear(), date.getMonth() + 1);
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const label = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function buildMonthOptions(expenses: { created_at: string }[]): string[] {
  const months = new Set<string>([getCurrentMonthKey()]);

  for (const expense of expenses) {
    months.add(getExpenseMonthKey(expense.created_at));
  }

  return [...months].sort((a, b) => b.localeCompare(a));
}

export function isDateInMonth(isoDate: string, monthKey: string): boolean {
  return getExpenseMonthKey(isoDate) === monthKey;
}

export function parseAmount(rawValue: string): number | null {
  const trimmed = rawValue.trim();
  if (!trimmed) return null;

  const normalizedValue = trimmed.replace(",", ".");
  const amount = Number(normalizedValue);

  if (!Number.isFinite(amount) || amount <= 0) return null;

  return Math.round(amount * 100) / 100;
}

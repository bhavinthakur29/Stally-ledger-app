const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** Display whole rupees (e.g. 220000 → ₹2,20,000). */
export function formatInrRupees(rupees: number): string {
  return inrFormatter.format(rupees);
}

/** Parse user text to integer rupees; returns NaN if invalid. */
export function parseRupeesInput(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (digits === '') return NaN;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : NaN;
}

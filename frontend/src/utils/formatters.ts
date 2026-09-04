/**
 * Safe numeric formatter preventing runtime TypeError crashes on undefined/null values.
 */
export const safeToFixed = (value: unknown, digits = 2, fallback = 'N/A'): string => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(digits) : fallback;
};

export const safeNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// src/utils/formatValue.js
export function formatValue(value, decimals = 2) {
  if (value === undefined || value === null || value === "--") return "--";
  const num = parseFloat(value);
  if (isNaN(num)) return "--";
  return Number(num.toFixed(decimals));
}

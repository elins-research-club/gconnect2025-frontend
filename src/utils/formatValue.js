// src/utils/formatValue.js
export function formatValue(value, decimals = 2) {
  // ✅ Handle undefined, null, or "--"
  if (value === undefined || value === null || value === "--") return "--";

  // ✅ Handle boolean values (for rain detection, etc.)
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // ✅ Handle numbers
  const num = parseFloat(value);
  if (isNaN(num)) return "--";

  return Number(num.toFixed(decimals));
}

/** Sort object keys recursively while preserving array order and JSON values. */
export function canonicalJson(value: unknown): string {
  function normalize(item: unknown): unknown {
    if (Array.isArray(item)) return item.map(normalize);
    if (item !== null && typeof item === "object") {
      const sorted = Object.create(null) as Record<string, unknown>;
      for (const key of Object.keys(item).sort())
        sorted[key] = normalize((item as Record<string, unknown>)[key]);
      return sorted;
    }
    return item;
  }
  return JSON.stringify(normalize(value), null, 2);
}

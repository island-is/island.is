export const coerceArray = (val: unknown) => {
  if (!val) return []

  return Array.isArray(val) ? val : [val]
}

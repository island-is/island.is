export const getIntParam = (
  s: string | string[] | undefined,
  range?: { minValue?: number; maxValue?: number },
) => {
  if (s === undefined) {
    return undefined
  }
  const i = parseInt(Array.isArray(s) ? s[0] : s, 10)

  if (Number.isNaN(i)) {
    return undefined
  }
  if (range?.minValue !== undefined && i < range.minValue) {
    return undefined
  }
  if (range?.maxValue !== undefined && i > range.maxValue) {
    return undefined
  }

  return i
}

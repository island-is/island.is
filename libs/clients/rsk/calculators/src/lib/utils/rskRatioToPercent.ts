/* The inverse of `percentToRskRatio`. Rounded because the multiplication is not
 * exact in binary -- `0.07 * 100` is `7.000000000000001`. */
export const rskRatioToPercent = (
  value: number | null | undefined,
): number | undefined =>
  value === null || value === undefined
    ? undefined
    : Number((value * 100).toFixed(6))

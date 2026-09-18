/* RSK takes ratios as 0-1; the boundary above carries whole percent. An unset
 * input must stay unset -- `undefined / 100` is `NaN`. */
export const percentToRskRatio = (
  value: number | undefined,
): number | undefined => (value === undefined ? undefined : value / 100)

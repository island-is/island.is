/**
 * Calculates 90% of a given numeric string's value and then floors the result.
 *
 * @param v A string representing a numeric value.
 * @returns The floored result of 90% of the given number.
 * @example
 *
 * getMaxOldSpaceSizeRatio("100");  // Returns 90
 * getMaxOldSpaceSizeRatio("2048"); // Returns 1843
 */
export const getMaxOldSpaceSizeRatio = (v: string) => {
  return Math.floor(parseInt(v, 10) * (9 / 10))
}

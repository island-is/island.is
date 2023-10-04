/**
 * Calculates a given ratio of a numeric string's value and then floors the result.
 *
 * @param value A string representing a numeric value.
 * @param ratio The ratio out of 10 to scale the value by. Default is 9 (i.e., 90%).
 * @returns The floored result of the scaled value.
 * @example
 *
 * getScaledValue("100");        // Returns 90 (default ratio is 9, i.e., 90%)
 * getScaledValue("100", 8);     // Returns 80 (80% of 100)
 * getScaledValue("2048", 7);    // Returns 1433 (70% of 2048)
 */
export const getScaledValue = (
  value: string,
  percentage: number = 90,
): number => {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Ratio should be between 0 and 100 inclusive.')
  }
  return Math.floor(parseInt(value, 10) * (percentage / 100))
}

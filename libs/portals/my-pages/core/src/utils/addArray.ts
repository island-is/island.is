/**
 * Send in array of numbers as type string or number
 * @param arr of numbers as string, example: ['1', '2', 3]
 * @returns sum of array example: 6
 */
export const addArray = (arr: Array<string | number>) => {
  return arr
    .map((item) => (typeof item === 'number' ? item : parseInt(item)))
    .reduce((sum, it) => {
      if (isNaN(it)) {
        return sum
      }
      return sum + it
    }, 0)
}

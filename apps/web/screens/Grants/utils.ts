/**
 * Converts a single item or an array of items into an array.
 * @param data - The input data to convert
 * @returns An array containing the input data, or undefined if input is null/undefined
 */
export const convertToArray = <T>(
  data?: Array<T> | T | null,
): Array<T> | undefined => {
  if (!data) {
    return
  }

  return Array.isArray(data) ? data : [data]
}

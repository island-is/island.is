export const hasDuplicates = (arr: string[]): boolean => {
  const unique = new Set(arr)
  return unique.size !== arr.length
}

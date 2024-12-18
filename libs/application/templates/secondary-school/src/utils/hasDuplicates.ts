export const hasDuplicates = (arr: string[]): boolean => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        return true // Duplicate found
      }
    }
  }
  return false // No duplicates
}

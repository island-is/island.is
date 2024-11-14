export const addArray = (arr: Array<string>) => {
  return arr
    .map((item) => parseInt(item))
    .reduce((sum, it) => {
      if (isNaN(it)) {
        return sum
      }
      return sum + it
    }, 0)
}

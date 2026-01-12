export const getItemAtIndex = <T>(
  itemList: T[],
  index: string,
): T | undefined => {
  const parsedIndex = parseInt(index, 10)
  if (isNaN(parsedIndex) || parsedIndex < 0) {
    return undefined
  }
  return itemList[parsedIndex]
}

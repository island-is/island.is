export const partitionWithIndex = <T>(
  items: T[],
  predicate: (item: T, index: number) => boolean,
): T[][] => {
  const results: T[][] = [[], []]

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (predicate(item, i)) {
      results[0].push(item)
    } else {
      results[1].push(item)
    }
  }

  return results
}

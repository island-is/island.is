// adds or removes selected category in hash array
export const updateHashArray = (
  hashArray: string[],
  categoryId: string,
): string[] => {
  let tempArr = hashArray ?? []
  if (!!categoryId && categoryId.length > 0) {
    if (tempArr.includes(categoryId)) {
      tempArr = hashArray.filter((x) => x !== categoryId)
    } else {
      tempArr = tempArr.concat([categoryId])
    }
  }
  return tempArr
}
// gets "active" category that we use to scroll to on inital render
export const getActiveCategory = (hashArr: string[]): string | null => {
  if (!!hashArr && hashArr.length > 0) {
    const activeCategory = hashArr[hashArr.length - 1].replace('#', '')
    return activeCategory.length > 0 ? activeCategory : null
  }
  return null
}
// creates hash string from array
export const getHashString = (hashArray: string[]): string => {
  if (!!hashArray && hashArray.length > 0) {
    return hashArray.length > 1 ? hashArray.join(',') : hashArray[0]
  }
  return ''
}
// creates hash array from string
export const getHashArr = (hashString: string): string[] => {
  if (!!hashString && hashString.length > 0) {
    hashString = hashString.replace('#', '')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    return hashString.length > 0 ? hashString.split(',') : null
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  return null
}

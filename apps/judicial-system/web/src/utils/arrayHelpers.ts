export const isPresentArray = <T>(arr: T[] | undefined | null): arr is T[] =>
  arr !== undefined && arr !== null && Array.isArray(arr)

export const isEmptyArray = <T>(arr: T[] | undefined | null): arr is T[] =>
  isPresentArray(arr) && arr?.length === 0

export const isNonEmptyArray = <T>(arr: T[] | undefined | null): arr is T[] =>
  isPresentArray(arr) && arr.length > 0

export const compareArrays = <T>(
  arr1?: T[] | null,
  arr2?: T[] | null,
): boolean => {
  if (arr1 === arr2) {
    return true
  }

  if (!arr1 || !arr2 || arr1.length !== arr2.length) {
    return false
  }

  return arr1.every((item) => arr2.includes(item))
}

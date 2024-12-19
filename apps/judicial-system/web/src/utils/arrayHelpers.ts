export const isPresentArray = <T>(arr: T[] | undefined | null): arr is T[] =>
  arr !== undefined && arr !== null && Array.isArray(arr)

export const isEmptyArray = <T>(arr: T[] | undefined | null): arr is T[] =>
  isPresentArray(arr) && arr?.length === 0

export const isNonEmptyArray = <T>(arr: T[] | undefined | null): arr is T[] =>
  isPresentArray(arr) && arr.length > 0

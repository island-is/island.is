export type SkeletonItem = {
  id: number
  __typename: 'Skeleton'
}

export const createSkeletonArr = (length: number): SkeletonItem[] =>
  Array.from({ length }).map((_, id) => ({
    id,
    __typename: 'Skeleton',
  }))

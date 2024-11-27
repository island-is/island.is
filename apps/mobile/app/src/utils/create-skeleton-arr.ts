export type SkeletonItem = {
  id: number
  __typename: 'Skeleton'
}

export const createSkeletonArr = (size: number): SkeletonItem[] =>
  Array.from({ length: size }, (_, id) => ({
    id,
    __typename: 'Skeleton',
  }))

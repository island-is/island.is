import { SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={5}>
      <SkeletonLoader height={60} borderRadius="large" />
      <SkeletonLoader height={60} borderRadius="large" />
      <SkeletonLoader height={60} borderRadius="large" />
      <SkeletonLoader height={300} borderRadius="large" />
      <SkeletonLoader height={200} borderRadius="large" />
      <SkeletonLoader height={200} borderRadius="large" />
    </Stack>
  )
}

export default Skeleton

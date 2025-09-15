import { Box, SkeletonLoader } from '@island.is/island-ui/core'

export const Skeleton = () => {
  return (
    <Box marginTop={[5, 10]}>
      <SkeletonLoader height={130} borderRadius="large" repeat={4} space={2} />
    </Box>
  )
}

export const SkeletonTable = () => {
  return (
    <Box marginTop={5}>
      <SkeletonLoader height={700} borderRadius="large" />
    </Box>
  )
}

export const CollectorSkeleton = () => {
  return <SkeletonLoader height={50} borderRadius="large" />
}

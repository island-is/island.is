import { Box, SkeletonLoader } from '@island.is/island-ui/core'

export const Skeleton = () => {
  return (
    <Box marginTop={10}>
      <SkeletonLoader height={200} borderRadius="large" repeat={4} space={3} />
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

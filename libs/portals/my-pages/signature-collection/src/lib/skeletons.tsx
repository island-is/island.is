import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

export const Skeleton = () => {
  return (
    <Stack space={2}>
      <SkeletonLoader
        height={110}
        borderRadius="large"
        width="70%"
        repeat={2}
        space={2}
      />
      <SkeletonLoader height={110} borderRadius="large" repeat={5} space={2} />
    </Stack>
  )
}

export const SkeletonTable = () => {
  return (
    <Box marginTop={5}>
      <SkeletonLoader height={90} borderRadius="large" repeat={5} space={2} />
    </Box>
  )
}

export const CollectorSkeleton = () => {
  return <SkeletonLoader height={50} borderRadius="large" />
}

import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={3}>
      <SkeletonLoader height={50} width="80%" borderRadius="large" />
      <SkeletonLoader height={200} />
      <SkeletonLoader height={60} repeat={2} width="60%" borderRadius="large" />
      <Box marginTop={10}>
        <SkeletonLoader height={100} borderRadius="large" />
      </Box>
    </Stack>
  )
}

export default Skeleton

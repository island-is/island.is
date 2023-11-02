import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={3}>
      <SkeletonLoader height={70} width="100%" borderRadius="large" />
      <SkeletonLoader height={350} borderRadius="large" />
      <Box display="flex" justifyContent="spaceBetween">
        <SkeletonLoader height={70} width="30%" borderRadius="large" />
        <SkeletonLoader height={70} width="30%" borderRadius="large" />
        <SkeletonLoader height={70} width="30%" borderRadius="large" />
      </Box>
      <Box marginY={3}>
        <SkeletonLoader height={70} width="45%" borderRadius="large" />
      </Box>
      <SkeletonLoader height={250} borderRadius="large" />
    </Stack>
  )
}

export default Skeleton

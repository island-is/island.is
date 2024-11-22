import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={3}>
      <SkeletonLoader height={70} width="100%" borderRadius="default" />
      <SkeletonLoader height={250} borderRadius="default" />
      <Box display="flex" justifyContent="spaceBetween">
        <SkeletonLoader height={70} width="30%" borderRadius="default" />
        <SkeletonLoader height={70} width="30%" borderRadius="default" />
        <SkeletonLoader height={70} width="30%" borderRadius="default" />
      </Box>
      <Box marginY={3}>
        <SkeletonLoader height={70} width="45%" borderRadius="default" />
      </Box>
      <SkeletonLoader height={350} borderRadius="default" />
    </Stack>
  )
}

export default Skeleton

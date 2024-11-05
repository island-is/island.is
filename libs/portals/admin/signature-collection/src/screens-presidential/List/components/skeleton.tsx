import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={2}>
      <SkeletonLoader height={70} width="100%" borderRadius="large" />
      <SkeletonLoader height={350} borderRadius="large" />
      <Box display="flex" justifyContent="spaceBetween">
        <SkeletonLoader height={70} width="48%" borderRadius="large" />
        <SkeletonLoader height={70} width="48%" borderRadius="large" />
      </Box>
      <SkeletonLoader height={70} width="100%" borderRadius="large" />
      <Box display="flex" justifyContent="spaceBetween">
        <SkeletonLoader height={70} width="25%" borderRadius="large" />
        <SkeletonLoader height={70} width="25%" borderRadius="large" />
      </Box>
      <Box marginTop={8}>
        <SkeletonLoader height={250} borderRadius="large" />
      </Box>
    </Stack>
  )
}

export default Skeleton

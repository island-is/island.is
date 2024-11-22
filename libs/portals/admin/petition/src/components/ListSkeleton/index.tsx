import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={2}>
      <SkeletonLoader height={70} width="100%" borderRadius="default" />
      <SkeletonLoader height={350} borderRadius="default" />
      <Box display="flex" justifyContent="spaceBetween">
        <SkeletonLoader height={70} width="48%" borderRadius="default" />
        <SkeletonLoader height={70} width="48%" borderRadius="default" />
      </Box>
      <SkeletonLoader height={70} width="100%" borderRadius="default" />
      <Box display="flex" justifyContent="spaceBetween">
        <SkeletonLoader height={70} width="25%" borderRadius="default" />
        <SkeletonLoader height={70} width="25%" borderRadius="default" />
      </Box>
      <Box marginTop={8}>
        <SkeletonLoader height={250} borderRadius="default" />
      </Box>
    </Stack>
  )
}

export default Skeleton

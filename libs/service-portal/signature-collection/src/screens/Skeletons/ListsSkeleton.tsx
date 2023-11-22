import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const ListsSkeleton = () => {
  return (
    <>
      <SkeletonLoader height={150} width="60%" borderRadius="large" />
      <Box marginTop={8}>
        <Stack space={3}>
          <SkeletonLoader height={200} borderRadius="large" />
          <SkeletonLoader height={200} borderRadius="large" />
          <SkeletonLoader height={200} borderRadius="large" />
          <SkeletonLoader height={200} borderRadius="large" />
        </Stack>
      </Box>
    </>
  )
}

export default ListsSkeleton

import React from 'react'
import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={3}>
      <>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={70} width="30%" borderRadius="large" />
          <SkeletonLoader height={70} width="30%" borderRadius="large" />
          <SkeletonLoader height={70} width="30%" borderRadius="large" />
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={70} width="50%" borderRadius="large" />
        </Box>
      </>
      <SkeletonLoader height={90} width="50%" borderRadius="large" />
      <SkeletonLoader height={90} width="100%" borderRadius="large" />
    </Stack>
  )
}

export default Skeleton

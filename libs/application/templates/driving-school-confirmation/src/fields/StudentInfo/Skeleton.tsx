import React from 'react'
import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={3}>
      <>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={70} width="30%" borderRadius="default" />
          <SkeletonLoader height={70} width="30%" borderRadius="default" />
          <SkeletonLoader height={70} width="30%" borderRadius="default" />
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={70} width="50%" borderRadius="default" />
        </Box>
      </>
      <SkeletonLoader height={90} width="50%" borderRadius="default" />
      <SkeletonLoader height={90} width="100%" borderRadius="default" />
    </Stack>
  )
}

export default Skeleton

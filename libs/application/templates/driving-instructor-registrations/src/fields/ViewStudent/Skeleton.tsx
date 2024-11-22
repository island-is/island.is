import React from 'react'
import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={5}>
      <>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={50} width="47%" borderRadius="default" />
          <SkeletonLoader height={50} width="47%" borderRadius="default" />
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={50} width="47%" borderRadius="default" />
          <SkeletonLoader height={50} width="47%" borderRadius="default" />
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={50} width="47%" borderRadius="default" />
          <SkeletonLoader height={50} width="47%" borderRadius="default" />
        </Box>
      </>
      <SkeletonLoader height={80} width="100%" borderRadius="default" />
      <SkeletonLoader height={60} width="60%" borderRadius="default" />
      <SkeletonLoader height={300} width="100%" borderRadius="default" />
    </Stack>
  )
}

export default Skeleton

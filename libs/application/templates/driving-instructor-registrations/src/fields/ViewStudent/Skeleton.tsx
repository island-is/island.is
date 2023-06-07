import React from 'react'
import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Stack space={5}>
      <>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={50} width="47%" borderRadius="large" />
          <SkeletonLoader height={50} width="47%" borderRadius="large" />
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={50} width="47%" borderRadius="large" />
          <SkeletonLoader height={50} width="47%" borderRadius="large" />
        </Box>
        <Box display="flex" justifyContent="spaceBetween">
          <SkeletonLoader height={50} width="47%" borderRadius="large" />
          <SkeletonLoader height={50} width="47%" borderRadius="large" />
        </Box>
      </>
      <SkeletonLoader height={80} width="100%" borderRadius="large" />
      <SkeletonLoader height={60} width="60%" borderRadius="large" />
      <SkeletonLoader height={300} width="100%" borderRadius="large" />
    </Stack>
  )
}

export default Skeleton

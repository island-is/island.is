import React from 'react'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Box>
      <SkeletonLoader height={50} width="80%" borderRadius="large" />
      <SkeletonLoader height={200} />
      <SkeletonLoader height={70} repeat={2} width="60%" borderRadius="large" />
      <SkeletonLoader height={70} width="90%" borderRadius="large" />
      <Box marginTop={10}>
        <SkeletonLoader height={100} borderRadius="large" />
      </Box>
    </Box>
  )
}

export default Skeleton

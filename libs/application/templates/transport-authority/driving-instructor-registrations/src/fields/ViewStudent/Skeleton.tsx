import React from 'react'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <Box>
      <Box marginBottom={3}>
        <SkeletonLoader height={60} borderRadius="large" repeat={3} space={3} />
      </Box>
      <SkeletonLoader height={300} borderRadius="large" repeat={3} space={3} />
    </Box>
  )
}

export default Skeleton

import React from 'react'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <>
      <Box marginBottom={2}>
        <SkeletonLoader width="50%" height={30} />
      </Box>
      <SkeletonLoader repeat={2} space={1} />
    </>
  )
}

export default Skeleton

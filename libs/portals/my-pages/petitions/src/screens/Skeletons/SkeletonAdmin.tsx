import React from 'react'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <>
      <SkeletonLoader height={70} borderRadius="default" />
      <Box marginY={2}>
        <SkeletonLoader height={250} borderRadius="default" />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
        <SkeletonLoader height={70} width="45%" borderRadius="default" />
        <SkeletonLoader height={70} width="45%" borderRadius="default" />
      </Box>
      <Box marginTop={2}>
        <SkeletonLoader height={70} borderRadius="default" />
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        marginTop={5}
        marginBottom={7}
      >
        <SkeletonLoader height={70} width="20%" borderRadius="default" />
        <SkeletonLoader height={70} width="20%" borderRadius="default" />
      </Box>
      <SkeletonLoader height={250} borderRadius="default" />
    </>
  )
}

export default Skeleton

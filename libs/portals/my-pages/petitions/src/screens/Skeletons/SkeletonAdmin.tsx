import React from 'react'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <>
      <SkeletonLoader height={70} borderRadius="large" />
      <Box marginY={2}>
        <SkeletonLoader height={250} borderRadius="large" />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
        <SkeletonLoader height={70} width="45%" borderRadius="large" />
        <SkeletonLoader height={70} width="45%" borderRadius="large" />
      </Box>
      <Box marginTop={2}>
        <SkeletonLoader height={70} borderRadius="large" />
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        marginTop={5}
        marginBottom={7}
      >
        <SkeletonLoader height={70} width="20%" borderRadius="large" />
        <SkeletonLoader height={70} width="20%" borderRadius="large" />
      </Box>
      <SkeletonLoader height={250} borderRadius="large" />
    </>
  )
}

export default Skeleton

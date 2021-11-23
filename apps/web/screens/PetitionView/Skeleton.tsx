import React from 'react'
import { Box, SkeletonLoader, Columns, Column } from '@island.is/island-ui/core'

const Skeleton = () => {
  return (
    <>
      <SkeletonLoader height={50} width="80%" borderRadius="large" />
      <Box marginY={2}>
        <SkeletonLoader height={200} borderRadius="large" />
      </Box>
      <Columns>
        <Column>
          <SkeletonLoader height={70} width="80%" borderRadius="large" />
        </Column>
        <Column>
          <SkeletonLoader height={70} width="80%" borderRadius="large" />
        </Column>
        <Column>
          <SkeletonLoader height={70} width="80%" borderRadius="large" />
        </Column>
      </Columns>
      <Box marginTop={2}>
        <SkeletonLoader height={70} width="40%" borderRadius="large" />
      </Box>
      <Box marginTop={2}>
        <SkeletonLoader height={200} borderRadius="large" />
      </Box>
    </>
  )
}

export default Skeleton

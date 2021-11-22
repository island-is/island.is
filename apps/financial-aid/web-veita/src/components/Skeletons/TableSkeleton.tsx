import React from 'react'
import { SkeletonLoader, Box } from '@island.is/island-ui/core'

const TableSkeleton = () => {
  return (
    <>
      <Box>
        <SkeletonLoader height={64} />
        <SkeletonLoader height={600} />
      </Box>
    </>
  )
}

export default TableSkeleton

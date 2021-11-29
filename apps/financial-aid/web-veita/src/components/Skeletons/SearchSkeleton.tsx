import React from 'react'
import { SkeletonLoader, Box } from '@island.is/island-ui/core'

const SearchSkeleton = () => {
  return (
    <Box>
      <SkeletonLoader repeat={3} space={3} height={32} />
    </Box>
  )
}

export default SearchSkeleton

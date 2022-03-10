import React from 'react'
import { SkeletonLoader, Box } from '@island.is/island-ui/core'

const ApplicationOverviewSkeleton = () => {
  return (
    <>
      <Box marginTop={15} marginBottom={3}>
        <h1>
          <SkeletonLoader />
        </h1>
      </Box>
      <Box>
        <SkeletonLoader height={64} />
        <SkeletonLoader height={600} />
      </Box>
    </>
  )
}

export default ApplicationOverviewSkeleton

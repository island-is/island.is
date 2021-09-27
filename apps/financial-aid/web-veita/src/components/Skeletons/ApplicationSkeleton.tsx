import React from 'react'
import { SkeletonLoader, Box } from '@island.is/island-ui/core'

const ApplicationSkeleton = () => {
  return (
    <Box marginTop={10} marginBottom={15}>
      <Box marginBottom={3}>
        <SkeletonLoader />
      </Box>

      <SkeletonLoader height={52} />

      <Box marginY={3}>
        <SkeletonLoader width={200} />
      </Box>

      {[...Array(4)].map((_, i) => {
        return (
          <>
            <Box marginY={3}>
              <h2>
                <SkeletonLoader width={150} />
              </h2>
            </Box>

            <SkeletonLoader repeat={i === 0 ? 2 : 4} space={2} />
          </>
        )
      })}
    </Box>
  )
}

export default ApplicationSkeleton

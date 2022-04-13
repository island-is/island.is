import React, { FC } from 'react'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'

export const LicenseLoader: FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      paddingY={[2, 3]}
      paddingX={[2, 4]}
      marginBottom={2}
      border="standard"
      borderRadius="large"
    >
      <Box marginRight={[2, 4]}>
        <SkeletonLoader width={76} height={76} borderRadius="circle" />
      </Box>
      <div>
        <SkeletonLoader width={150} height={32} />
        <SkeletonLoader width={200} height={24} />
      </div>
    </Box>
  )
}

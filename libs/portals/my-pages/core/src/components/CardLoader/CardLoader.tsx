import React, { FC } from 'react'
import { Box, Hidden, SkeletonLoader } from '@island.is/island-ui/core'

export const CardLoader: FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      paddingY={[4, 3, 4]}
      paddingX={[2, 3, 4]}
      border="standard"
      borderRadius="large"
    >
      <Hidden below="sm">
        <Box marginRight={[2, 3]}>
          <SkeletonLoader width={66} height={66} borderRadius="circle" />
        </Box>
      </Hidden>
      <div>
        <SkeletonLoader display="block" width={150} height={28} />
        <Box marginTop={2}>
          <SkeletonLoader display="block" width={200} height={24} />
        </Box>
      </div>
    </Box>
  )
}

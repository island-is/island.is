import React from 'react'
import { Box, Columns, Column, SkeletonLoader } from '@island.is/island-ui/core'

const AssetLoader = () => {
  return (
    <Box>
      <Columns space={6}>
        <Column>
          <h1>
            <SkeletonLoader space={2} />
          </h1>
          <div>
            <SkeletonLoader repeat={2} space={2} />
          </div>
        </Column>
        <Column width="content">
          <SkeletonLoader display="block" height={120} width={120} />
        </Column>
      </Columns>
    </Box>
  )
}

export default AssetLoader

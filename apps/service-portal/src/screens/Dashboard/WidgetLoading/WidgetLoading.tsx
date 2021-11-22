import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import * as styles from './WidgetLoading.css'

const WidgetLoading: FC<{}> = () => {
  return (
    <Box paddingY={2} paddingX={3} border="standard">
      <Box marginBottom={2}>
        <SkeletonLoader width="40%" height={32} />
      </Box>
      <Stack space={1}>
        <SkeletonLoader width="60%" height={24} />
        <SkeletonLoader width="70%" height={24} />
        <SkeletonLoader width="80%" height={24} />
      </Stack>
    </Box>
  )
}

export default WidgetLoading

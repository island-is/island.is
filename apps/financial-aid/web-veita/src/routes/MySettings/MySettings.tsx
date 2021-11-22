import React from 'react'

import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Input } from '@island.is/island-ui/core'

export const MySettings = () => {
  return (
    <LoadingContainer
      isLoading={false}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box marginTop={15} marginBottom={2} className={``}>
        <Text as="h1" variant="h1">
          Mínar stillingar
        </Text>
      </Box>
    </LoadingContainer>
  )
}

export default MySettings

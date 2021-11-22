import React, { useState } from 'react'

import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  TableHeaders,
  SearchSkeleton,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, AsyncSearch, Input } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import * as headerStyles from '../../sharedStyles/Header.css'
import cn from 'classnames'

export const MySettings = () => {
  const [searchNationalId, setSearchNationalId] = useState<string>('')

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
